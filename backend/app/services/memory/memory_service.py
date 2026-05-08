"""
memory_service.py — RAG 记忆层

存入 ChromaDB 的内容（浓缩关键记忆，不是原始全量数据）：
  - focal_interaction : 与主人的焦点化互动（第一次进化时主人在场、某天主人久违回来等）
  - diary_core        : 日记里提炼的核心情感/事件（一两句精华，不是全文）
  - friend_trait      : 好朋友的性格特点摘要（全量在 MySQL，这里是检索用的浓缩版）
  - milestone         : 里程碑事件（进化、第一次朋友来访、解锁新技能）

检索时机：
  - 生成日记前 → 检索宠物近期焦点互动 + 里程碑
  - 宠物对话前 → 检索和当前话题相关的历史记忆
  - 训练师对话前 → 检索宠物整体成长轨迹
"""
from typing import Optional
from dataclasses import dataclass, field
from enum import Enum

from app.db.chroma import get_memory_collection
from app.services.llm.embedding import embed_text
from app.core.config import get_settings

settings = get_settings()


class MemoryType(str, Enum):
    FOCAL_INTERACTION = "focal_interaction"
    DIARY_CORE        = "diary_core"
    FRIEND_TRAIT      = "friend_trait"
    MILESTONE         = "milestone"


@dataclass
class MemoryRecord:
    """一条记忆单元"""
    memory_id: str                          # 唯一 ID，格式：{pet_id}_{type}_{timestamp}
    pet_id: str
    memory_type: MemoryType
    content: str                            # 自然语言描述，供 embedding 和 prompt 注入
    metadata: dict = field(default_factory=dict)
    # metadata 建议字段：date, importance(1-5), mood, related_entity_id


@dataclass
class MemorySearchResult:
    record: MemoryRecord
    score: float                            # 余弦相似度，越高越相关


class MemoryService:
    """
    RAG 记忆服务。

    所有方法均为 async，ChromaDB 操作在线程池中执行（chroma 目前是同步库）。
    """

    # ── 写入 ──────────────────────────────────────────────────────────────────

    async def store(self, record: MemoryRecord) -> None:
        """
        将一条记忆向量化并存入 ChromaDB。

        content 示例：
          focal_interaction: "2025-05-08，主人守着小草看它第一次进化成妙蛙草，
                              两人都沉默，但心情值飙到了满值"
          diary_core:        "小草在日记里写：那天的眼神，我记住了"
          friend_trait:      "乌波（Wooper）：憨厚迟钝，总是歪着头，来访时会带泥巴礼物"
          milestone:         "2025-05-08 小草进化为妙蛙草（进化阶段1→2，经验值110）"
        """
        import asyncio
        embedding = await embed_text(record.content)

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            self._chroma_upsert,
            record,
            embedding,
        )

    async def store_batch(self, records: list[MemoryRecord]) -> None:
        """批量写入，减少 embedding API 调用次数"""
        import asyncio
        from app.services.llm.embedding import embed_texts

        if not records:
            return

        texts = [r.content for r in records]
        embeddings = await embed_texts(texts)

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            self._chroma_upsert_batch,
            records,
            embeddings,
        )

    # ── 检索 ──────────────────────────────────────────────────────────────────

    async def search(
        self,
        pet_id: str,
        query: str,
        top_k: int = None,
        memory_types: Optional[list[MemoryType]] = None,
        min_score: float = None,
    ) -> list[MemorySearchResult]:
        """
        语义检索宠物的相关记忆。

        pet_id 作为 where filter，保证跨宠物数据隔离。
        memory_types 可进一步过滤记忆类型。

        返回按相似度降序排列的结果列表。
        """
        import asyncio

        top_k = top_k or settings.RAG_TOP_K
        min_score = min_score or settings.RAG_SCORE_THRESHOLD

        query_embedding = await embed_text(query)

        where: dict = {"pet_id": {"$eq": pet_id}}
        if memory_types:
            where["memory_type"] = {"$in": [t.value for t in memory_types]}

        loop = asyncio.get_event_loop()
        raw = await loop.run_in_executor(
            None,
            self._chroma_query,
            query_embedding,
            top_k,
            where,
        )

        results = []
        if not raw or not raw.get("ids") or not raw["ids"][0]:
            return results

        for i, doc_id in enumerate(raw["ids"][0]):
            score = 1 - raw["distances"][0][i]   # ChromaDB cosine 返回的是距离，转为相似度
            if score < min_score:
                continue
            meta = raw["metadatas"][0][i] or {}
            doc  = raw["documents"][0][i] or ""
            results.append(MemorySearchResult(
                record=MemoryRecord(
                    memory_id=doc_id,
                    pet_id=meta.get("pet_id", pet_id),
                    memory_type=MemoryType(meta.get("memory_type", "focal_interaction")),
                    content=doc,
                    metadata=meta,
                ),
                score=score,
            ))

        return sorted(results, key=lambda x: x.score, reverse=True)

    async def delete_by_pet(self, pet_id: str) -> None:
        """删除某只宠物的全部记忆（宠物重置时使用）"""
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self._chroma_delete_by_pet, pet_id)

    # ── ChromaDB 同步操作（在线程池中执行）────────────────────────────────────

    def _chroma_upsert(self, record: MemoryRecord, embedding: list[float]) -> None:
        col = get_memory_collection()
        meta = {
            "pet_id":      record.pet_id,
            "memory_type": record.memory_type.value,
            **record.metadata,
        }
        col.upsert(
            ids=[record.memory_id],
            embeddings=[embedding],
            documents=[record.content],
            metadatas=[meta],
        )

    def _chroma_upsert_batch(self, records: list[MemoryRecord], embeddings: list[list[float]]) -> None:
        col = get_memory_collection()
        ids, docs, metas = [], [], []
        for record, _ in zip(records, embeddings):
            ids.append(record.memory_id)
            docs.append(record.content)
            metas.append({
                "pet_id":      record.pet_id,
                "memory_type": record.memory_type.value,
                **record.metadata,
            })
        col.upsert(ids=ids, embeddings=embeddings, documents=docs, metadatas=metas)

    def _chroma_query(self, embedding: list[float], top_k: int, where: dict) -> dict:
        col = get_memory_collection()
        return col.query(
            query_embeddings=[embedding],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"],
        )

    def _chroma_delete_by_pet(self, pet_id: str) -> None:
        col = get_memory_collection()
        col.delete(where={"pet_id": {"$eq": pet_id}})


# 全局单例
memory_service = MemoryService()
