"""
dependencies.py — FastAPI 依赖注入（DB session、Redis、当前用户）
"""
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_factory
from app.db.redis import get_redis_client
from app.core.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)


# ── DB Session ──────────────────────────────────────────────────────────────

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ── Redis ───────────────────────────────────────────────────────────────────

async def get_redis():
    return await get_redis_client()


# ── 当前用户（JWT 鉴权）────────────────────────────────────────────────────

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="未登录")
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 无效或已过期")
    return payload  # {"sub": user_id, "exp": ...}


# ── 可选鉴权（未登录时返回 None）──────────────────────────────────────────

async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    if not credentials:
        return None
    return decode_access_token(credentials.credentials)
