"""
config.py — 全局配置，全走环境变量，无硬编码业务参数
"""
import os
from functools import lru_cache


class Settings:
    # ── 应用 ──
    APP_NAME: str = "Pokemon Egg Game API"
    DEBUG: bool = os.environ.get("DEBUG", "false").lower() == "true"
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")

    # ── MySQL ──
    MYSQL_HOST: str     = os.environ.get("MYSQL_HOST", "db")
    MYSQL_PORT: int     = int(os.environ.get("MYSQL_PORT", 3306))
    MYSQL_USER: str     = os.environ.get("MYSQL_USER", "peg")
    MYSQL_PASSWORD: str = os.environ.get("MYSQL_PASSWORD", "peg_dev_password")
    MYSQL_DB: str       = os.environ.get("MYSQL_DB", "peg")

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
            "?charset=utf8mb4"
        )

    @property
    def DATABASE_URL_SYNC(self) -> str:
        """SQLAlchemy 同步 URL（Alembic 迁移用）"""
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
            "?charset=utf8mb4"
        )

    # ── Redis ──
    REDIS_HOST: str     = os.environ.get("REDIS_HOST", "redis")
    REDIS_PORT: int     = int(os.environ.get("REDIS_PORT", 6379))
    REDIS_PASSWORD: str = os.environ.get("REDIS_PASSWORD", "")
    REDIS_DB: int       = int(os.environ.get("REDIS_DB", 0))

    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # ── ChromaDB ──
    CHROMA_PATH: str        = os.environ.get("CHROMA_PATH", "/data/chroma")
    CHROMA_COLLECTION: str  = os.environ.get("CHROMA_COLLECTION", "peg_memories")

    # ── LLM（OpenAI 兼容接口）──
    LLM_API_KEY: str      = os.environ.get("LLM_API_KEY", "")
    LLM_API_BASE: str     = os.environ.get("LLM_API_BASE", "https://api.deepseek.com/v1")
    LLM_MODEL: str        = os.environ.get("LLM_MODEL", "deepseek-chat")
    LLM_TIMEOUT: int      = int(os.environ.get("LLM_TIMEOUT", 30))

    # ── Embedding ──
    EMBED_API_KEY: str    = os.environ.get("EMBED_API_KEY", "")   # 可复用 LLM_API_KEY
    EMBED_API_BASE: str   = os.environ.get("EMBED_API_BASE", "https://api.deepseek.com/v1")
    EMBED_MODEL: str      = os.environ.get("EMBED_MODEL", "deepseek-embedding")
    EMBED_DIMENSION: int  = int(os.environ.get("EMBED_DIMENSION", 1024))

    # ── JWT ──
    JWT_SECRET: str           = os.environ.get("JWT_SECRET", "jwt-dev-secret")
    JWT_EXPIRE_MINUTES: int   = int(os.environ.get("JWT_EXPIRE_MINUTES", 60 * 24 * 7))  # 7天

    # ── 上下文窗口 ──
    CHAT_HISTORY_MAX: int     = int(os.environ.get("CHAT_HISTORY_MAX", 20))
    TRAINER_HISTORY_MAX: int  = int(os.environ.get("TRAINER_HISTORY_MAX", 10))
    CONTEXT_TTL_SECONDS: int  = int(os.environ.get("CONTEXT_TTL_SECONDS", 60 * 60 * 24 * 7))  # 7天

    # ── RAG ──
    RAG_TOP_K: int            = int(os.environ.get("RAG_TOP_K", 3))
    RAG_SCORE_THRESHOLD: float = float(os.environ.get("RAG_SCORE_THRESHOLD", 0.6))

    # ── 限流 ──
    RATE_LIMIT_CHAT: int      = int(os.environ.get("RATE_LIMIT_CHAT", 60))     # 次/小时/用户
    RATE_LIMIT_DIARY: int     = int(os.environ.get("RATE_LIMIT_DIARY", 5))     # 次/天/宠物
    RATE_LIMIT_WIN: int       = int(os.environ.get("RATE_LIMIT_WIN", 3600))


@lru_cache
def get_settings() -> Settings:
    return Settings()
