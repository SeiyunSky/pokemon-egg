"""
ai.py — AI 功能接口（日记生成、宠物对话、训练师对话、事件生成）

接口：
  POST /api/v1/ai/diary          生成今日日记（流式 SSE）
  POST /api/v1/ai/pet/chat       宠物对话（流式 SSE）
  POST /api/v1/ai/trainer/chat   训练师对话（流式 SSE）
  POST /api/v1/ai/event/generate 动态事件生成（非流式，返回 JSON）
"""
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Any

from app.core.dependencies import get_current_user, get_redis
from app.services.context.context_service import ContextService
from app.services.memory.memory_service import memory_service

router = APIRouter(prefix="/ai", tags=["ai"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class DiaryRequest(BaseModel):
    pet_id: str
    pet_context: dict          # 前端传来的宠物快照（Phase 4 细化字段）
    daily_summary: dict


class ChatRequest(BaseModel):
    pet_id: str
    pet_context: dict
    message: str


class TrainerChatRequest(BaseModel):
    pet_id: str
    pet_context: dict
    message: str


class EventGenRequest(BaseModel):
    pet_id: str
    pet_context: dict


# ── 日记生成（SSE 流式）──────────────────────────────────────────────────────

@router.post("/diary")
async def generate_diary(
    req: DiaryRequest,
    current_user: dict = Depends(get_current_user),
    redis=Depends(get_redis),
):
    """
    生成今日宠物日记。
    1. 从 ChromaDB 检索相关记忆片段（焦点互动 + 里程碑）
    2. 拼装 prompt（Phase 4 填入具体模板）
    3. 流式返回日记正文
    4. 生成完毕后异步将日记核心存入 RAG
    """
    async def _stream():
        # 1. RAG 检索
        memories = await memory_service.search(
            pet_id=req.pet_id,
            query=f"{req.pet_context.get('species','')} 今天的互动和感受",
            top_k=3,
        )
        memory_ctx = "\n".join(f"- {m.record.content}" for m in memories)

        # 2. TODO Phase 4: 使用 llm_client.chat_completion_stream + 完整 prompt 模板
        # 占位流式输出，结构已完整，Phase 4 替换这里
        yield "data: [Phase 4 实现日记生成]\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(_stream(), media_type="text/event-stream")


# ── 宠物对话（SSE 流式）──────────────────────────────────────────────────────

@router.post("/pet/chat")
async def pet_chat(
    req: ChatRequest,
    current_user: dict = Depends(get_current_user),
    redis=Depends(get_redis),
):
    """
    宠物对话。
    1. 从 Redis 读取最近 20 条历史（ContextService）
    2. 从 ChromaDB 检索和当前消息相关的记忆
    3. 流式生成宠物回复
    4. 将本轮对话追加到 Redis
    """
    ctx_svc = ContextService(redis)

    async def _stream():
        history  = await ctx_svc.get_history("pet_chat", req.pet_id)
        memories = await memory_service.search(
            pet_id=req.pet_id,
            query=req.message,
            top_k=3,
        )
        memory_ctx = "\n".join(f"- {m.record.content}" for m in memories)

        # TODO Phase 4: 完整 prompt + llm_client.chat_completion_stream
        reply = "[Phase 4 实现宠物对话]"
        yield f"data: {reply}\n\n"
        yield "data: [DONE]\n\n"

        # 写回上下文
        await ctx_svc.append_turn("pet_chat", req.pet_id, req.message, reply)

    return StreamingResponse(_stream(), media_type="text/event-stream")


# ── 训练师对话（SSE 流式）────────────────────────────────────────────────────

@router.post("/trainer/chat")
async def trainer_chat(
    req: TrainerChatRequest,
    current_user: dict = Depends(get_current_user),
    redis=Depends(get_redis),
):
    ctx_svc = ContextService(redis)

    async def _stream():
        history  = await ctx_svc.get_history("trainer_chat", req.pet_id)
        memories = await memory_service.search(
            pet_id=req.pet_id,
            query=req.message,
            top_k=2,
        )

        # TODO Phase 4: 完整 prompt + llm_client.chat_completion_stream
        reply = "[Phase 4 实现训练师对话]"
        yield f"data: {reply}\n\n"
        yield "data: [DONE]\n\n"

        await ctx_svc.append_turn("trainer_chat", req.pet_id, req.message, reply)

    return StreamingResponse(_stream(), media_type="text/event-stream")


# ── 动态事件生成（非流式）────────────────────────────────────────────────────

@router.post("/event/generate")
async def generate_event(
    req: EventGenRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    AI 生成一条游戏事件（title + body + choices[]），返回 JSON。
    失败时返回 fallback 标记，由前端切换静态事件。
    """
    # TODO Phase 4: 调用 llm_client.chat_completion + JSON 格式校验
    return {
        "ok": False,
        "fallback": True,
        "reason": "Phase 4 实现",
    }
