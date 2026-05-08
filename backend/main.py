"""
main.py — FastAPI 应用入口
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.session import create_tables
from app.db.redis import close_redis
from app.api.v1 import auth, save, ai

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时
    if settings.DEBUG:
        await create_tables()
    yield
    # 关闭时
    await close_redis()


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else [
        "https://yourdomain.com",     # 部署时替换为实际域名
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 路由注册 ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,  prefix="/api/v1")
app.include_router(save.router,  prefix="/api/v1")
app.include_router(ai.router,    prefix="/api/v1")


# ── 健康检查 ──────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}
