"""
save.py — 存档同步接口（对应前端 RemoteStorageAdapter）

接口：
  GET    /api/v1/save/{player_id}          拉取全量存档
  PUT    /api/v1/save/{player_id}          覆盖写入全量存档
  PATCH  /api/v1/save/{player_id}/{key}    单键更新
  DELETE /api/v1/save/{player_id}          重置存档
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Any

from app.core.dependencies import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/save", tags=["save"])


class SavePayload(BaseModel):
    data: dict[str, Any]


class PatchPayload(BaseModel):
    value: Any


# ── 拉取全量存档 ─────────────────────────────────────────────────────────────

@router.get("/{player_id}")
async def get_save(
    player_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _assert_owner(current_user, player_id)
    # TODO Phase 5: 从 DB 查询玩家全量存档并返回
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


# ── 覆盖写入全量存档 ─────────────────────────────────────────────────────────

@router.put("/{player_id}")
async def put_save(
    player_id: str,
    payload: SavePayload,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _assert_owner(current_user, player_id)
    # TODO Phase 5: 将 payload.data 序列化写入 DB
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


# ── 单键更新 ─────────────────────────────────────────────────────────────────

@router.patch("/{player_id}/{key}")
async def patch_save(
    player_id: str,
    key: str,
    payload: PatchPayload,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _assert_owner(current_user, player_id)
    # TODO Phase 5: 更新单个 key
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


# ── 重置存档 ─────────────────────────────────────────────────────────────────

@router.delete("/{player_id}")
async def delete_save(
    player_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _assert_owner(current_user, player_id)
    # TODO Phase 5: 删除玩家全部存档数据
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


def _assert_owner(current_user: dict, player_id: str):
    if str(current_user.get("sub")) != player_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权操作他人存档")
