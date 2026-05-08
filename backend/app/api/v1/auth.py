"""
auth.py — 认证接口骨架（Phase 5 填充业务逻辑）

接口：
  POST /api/v1/auth/register
  POST /api/v1/auth/login
  POST /api/v1/auth/refresh
  POST /api/v1/auth/logout
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest):
    # TODO Phase 5: 创建用户，密码 bcrypt hash，返回 JWT
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


@router.post("/login")
async def login(req: LoginRequest):
    # TODO Phase 5: 验证用户名密码，返回 access_token + refresh_token
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


@router.post("/refresh")
async def refresh():
    # TODO Phase 5: 用 refresh_token 换新 access_token
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")


@router.post("/logout")
async def logout():
    # TODO Phase 5: 将 token 加入 Redis 黑名单
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Phase 5 实现")
