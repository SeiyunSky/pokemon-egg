"""
context_service.py — 短期对话上下文管理（Redis 滚动窗口）

管理两种上下文：
  - pet_chat    : 宠物对话历史（最多 20 条）
  - trainer_chat: 训练师对话历史（最多 10 条）

Redis Key 格式：
  peg:ctx:pet_chat:{pet_id}
  peg:ctx:trainer_chat:{pet_id}

每条消息格式：{"role": "user"|"assistant", "content": "...", "ts": 1746787200000}
"""
import json
from typing import Literal

import redis.asyncio as aioredis

from app.core.config import get_settings

settings = get_settings()

ChatType = Literal["pet_chat", "trainer_chat"]

_MAX_TURNS: dict[ChatType, int] = {
    "pet_chat":     settings.CHAT_HISTORY_MAX,
    "trainer_chat": settings.TRAINER_HISTORY_MAX,
}


class ContextService:

    def __init__(self, redis: aioredis.Redis):
        self._r = redis

    def _key(self, chat_type: ChatType, pet_id: str) -> str:
        return f"peg:ctx:{chat_type}:{pet_id}"

    # ── 读取 ──────────────────────────────────────────────────────────────────

    async def get_history(
        self,
        chat_type: ChatType,
        pet_id: str,
    ) -> list[dict]:
        """
        获取对话历史，返回 OpenAI messages 格式列表（不含 ts 字段）。
        最新的在列表末尾。
        """
        key = self._key(chat_type, pet_id)
        raw_list = await self._r.lrange(key, 0, -1)
        messages = []
        for raw in raw_list:
            try:
                msg = json.loads(raw)
                messages.append({"role": msg["role"], "content": msg["content"]})
            except (json.JSONDecodeError, KeyError):
                continue
        return messages

    # ── 写入 ──────────────────────────────────────────────────────────────────

    async def append_message(
        self,
        chat_type: ChatType,
        pet_id: str,
        role: Literal["user", "assistant"],
        content: str,
    ) -> None:
        """
        追加一条消息，超出上限时自动丢弃最旧的。
        同时刷新 TTL。
        """
        import time
        key  = self._key(chat_type, pet_id)
        max_turns = _MAX_TURNS[chat_type]

        msg = json.dumps({"role": role, "content": content, "ts": int(time.time() * 1000)}, ensure_ascii=False)

        pipe = self._r.pipeline()
        pipe.rpush(key, msg)
        # 保持列表长度不超过 max_turns（每条消息算一条，user+assistant 各一条）
        pipe.ltrim(key, -max_turns, -1)
        pipe.expire(key, settings.CONTEXT_TTL_SECONDS)
        await pipe.execute()

    async def append_turn(
        self,
        chat_type: ChatType,
        pet_id: str,
        user_content: str,
        assistant_content: str,
    ) -> None:
        """
        追加一轮对话（user + assistant），原子操作。
        """
        import time
        key = self._key(chat_type, pet_id)
        max_turns = _MAX_TURNS[chat_type]
        ts = int(time.time() * 1000)

        user_msg = json.dumps({"role": "user",      "content": user_content,      "ts": ts}, ensure_ascii=False)
        asst_msg = json.dumps({"role": "assistant", "content": assistant_content, "ts": ts}, ensure_ascii=False)

        pipe = self._r.pipeline()
        pipe.rpush(key, user_msg, asst_msg)
        # 一轮占两条，上限乘2
        pipe.ltrim(key, -(max_turns * 2), -1)
        pipe.expire(key, settings.CONTEXT_TTL_SECONDS)
        await pipe.execute()

    # ── 清除 ──────────────────────────────────────────────────────────────────

    async def clear(self, chat_type: ChatType, pet_id: str) -> None:
        await self._r.delete(self._key(chat_type, pet_id))

    async def clear_all(self, pet_id: str) -> None:
        for chat_type in ("pet_chat", "trainer_chat"):
            await self.clear(chat_type, pet_id)  # type: ignore
