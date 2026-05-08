"""
chroma.py — ChromaDB 客户端（持久化到本地路径）
嵌入 backend 容器，不需要额外服务
"""
from functools import lru_cache
from typing import Optional

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import get_settings

settings = get_settings()


@lru_cache
def get_chroma_client() -> chromadb.ClientAPI:
    return chromadb.PersistentClient(
        path=settings.CHROMA_PATH,
        settings=ChromaSettings(anonymized_telemetry=False),
    )


def get_memory_collection() -> chromadb.Collection:
    """获取宠物记忆集合，不存在时自动创建"""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=settings.CHROMA_COLLECTION,
        metadata={"hnsw:space": "cosine"},   # 余弦相似度
    )
