"""
llm_client.py — LLM 调用基础层（OpenAI 兼容，支持流式）
所有 AI 功能都通过这一层调用，不直接在 service 里 import openai
"""
from typing import AsyncGenerator, Optional
import httpx

from app.core.config import get_settings

settings = get_settings()


async def chat_completion(
    messages: list[dict],
    system: Optional[str] = None,
    temperature: float = 0.8,
    max_tokens: int = 1024,
) -> str:
    """非流式调用，返回完整文字"""
    payload = _build_payload(messages, system, temperature, max_tokens, stream=False)
    async with httpx.AsyncClient(timeout=settings.LLM_TIMEOUT) as client:
        resp = await client.post(
            f"{settings.LLM_API_BASE}/chat/completions",
            headers=_headers(),
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


async def chat_completion_stream(
    messages: list[dict],
    system: Optional[str] = None,
    temperature: float = 0.8,
    max_tokens: int = 1024,
) -> AsyncGenerator[str, None]:
    """
    流式调用，yield 文字片段（delta content）。
    调用方：async for chunk in chat_completion_stream(...): ...
    """
    payload = _build_payload(messages, system, temperature, max_tokens, stream=True)
    async with httpx.AsyncClient(timeout=settings.LLM_TIMEOUT) as client:
        async with client.stream(
            "POST",
            f"{settings.LLM_API_BASE}/chat/completions",
            headers=_headers(),
            json=payload,
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str == "[DONE]":
                    break
                import json
                try:
                    data = json.loads(data_str)
                    delta = data["choices"][0]["delta"].get("content", "")
                    if delta:
                        yield delta
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.LLM_API_KEY}",
        "Content-Type": "application/json",
    }


def _build_payload(
    messages: list[dict],
    system: Optional[str],
    temperature: float,
    max_tokens: int,
    stream: bool,
) -> dict:
    full_messages = []
    if system:
        full_messages.append({"role": "system", "content": system})
    full_messages.extend(messages)
    return {
        "model": settings.LLM_MODEL,
        "messages": full_messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": stream,
    }
