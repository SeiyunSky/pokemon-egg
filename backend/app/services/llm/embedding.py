"""
embedding.py — Embedding 服务（OpenAI 兼容接口，支持 DeepSeek）
"""
from typing import Optional
import httpx

from app.core.config import get_settings

settings = get_settings()


async def embed_text(text: str) -> list[float]:
    """
    将文本转换为向量。
    使用 DeepSeek / OpenAI 兼容的 /embeddings 接口。
    """
    api_key = settings.EMBED_API_KEY or settings.LLM_API_KEY
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{settings.EMBED_API_BASE}/embeddings",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.EMBED_MODEL,
                "input": text,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return data["data"][0]["embedding"]


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """批量 embedding（减少 API 调用次数）"""
    api_key = settings.EMBED_API_KEY or settings.LLM_API_KEY
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{settings.EMBED_API_BASE}/embeddings",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.EMBED_MODEL,
                "input": texts,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        # 按 index 排序保证顺序一致
        items = sorted(data["data"], key=lambda x: x["index"])
        return [item["embedding"] for item in items]
