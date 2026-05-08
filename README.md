# 破壳 — 宝可梦蛋养成游戏

一个可部署的宝可梦主题养成小游戏。通过孵化问答得到你的宠物，然后每天喂食、玩耍、陪伴它成长。宠物有记忆，会写日记，会说话。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | 纯 HTML / CSS / ES Modules（无框架） |
| 后端 | Python FastAPI |
| 主数据库 | MySQL 8 |
| 缓存 / 会话 | Redis 7 |
| 向量数据库 | ChromaDB（嵌入后端容器） |
| AI | DeepSeek（或任意 OpenAI 兼容接口） |
| 部署 | Docker Compose |

---

## 项目结构

```
pokemon-egg-game/
├── index.html                  # 前端入口
├── style.css
├── src/
│   ├── app.js                  # 启动入口
│   ├── core/                   # EventBus / Config / Logger / nanoid
│   ├── storage/                # StorageAdapter 抽象 + Local/Remote 实现
│   ├── models/                 # Pet / PlayerProfile / Inventory / EventLog / DiaryEntry / Friend
│   ├── data/                   # 属性 / 宝可梦结局(18种) / 场景问答树 / 道具 / 好友模板
│   ├── services/               # GameState / Pet / Event / Inventory / Friend / Time / LLM
│   └── ui/                     # UIManager / Screens / Components / Styles
├── assets/
│   └── sprites/                # 宝可梦 GIF/PNG（从 pokemondb 获取）
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── main.py                 # FastAPI 入口
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── db/init.sql
│   └── app/
│       ├── core/               # config / security / dependencies
│       ├── db/                 # MySQL session / Redis / ChromaDB client
│       ├── services/
│       │   ├── llm/            # LLM 调用层（流式/非流式）+ Embedding
│       │   ├── memory/         # RAG 记忆服务（ChromaDB）
│       │   └── context/        # 对话上下文管理（Redis 滚动窗口）
│       └── api/v1/             # auth / save / ai 路由
├── legacy/                     # 原始原型文件，仅供参考
├── docker-compose.yml
└── .env.example
```

---

## 快速启动

**前提：** 已安装 Docker 和 Docker Compose。

```bash
# 1. 复制环境变量文件
cp .env.example .env

# 2. 填入 DeepSeek API Key（或其他 OpenAI 兼容接口）
#    编辑 .env，修改 LLM_API_KEY

# 3. 启动所有服务
docker compose up --build

# 前端：http://localhost
# API 文档：http://localhost/api/docs（DEBUG=true 时可见）
# 健康检查：http://localhost/api/health
```

**本地前端开发（不启动 Docker）：**

```bash
# 需要本地 HTTP 服务器（不能直接双击 index.html，ES Modules 需要 HTTP 协议）
python -m http.server 8080
# 访问 http://localhost:8080
```

验证存储层（浏览器 DevTools 控制台）：

```js
await window.__peg.storage.set('peg:test:1', { hello: 'world' })
await window.__peg.storage.get('peg:test:1')   // → { hello: 'world' }

const json = await window.__peg.storage.exportAll()
await window.__peg.storage.importAll(json)      // → { imported: 1, failed: 0 }
```

---

## 游戏内容

### 宝可梦（18种）

| 稀有度 | 宝可梦 |
|--------|--------|
| 传说 | 超梦 |
| 隐藏 | 伊布 |
| 稀有 | 喷火龙、迷你龙、谜拟Q |
| 罕见 | 雷伊布、梦妖、口呆花、拟宝珠、乌波 |
| 普通 | 小火龙、皮卡丘、耿鬼、妙蛙种子、杰尼龟、皮皮、沙瓦朗、差不多娃娃 |

所有宝可梦均有完整进化链（1-3阶段）。

### 状态系统

宠物有四个实时状态值（0-100），随真实时间缓慢衰减：

| 状态 | 衰减速率 | 恢复方式 |
|------|---------|---------|
| 饱腹度 | -2/小时 | 喂食 |
| 心情 | -1.5/小时 | 玩耍、抚摸 |
| 精力 | -1/小时 | 休息 |
| 亲密度 | -0.1/小时 | 所有互动（缓慢积累） |

离线时间自动补算（上限 72 小时）。

### AI 功能

| 功能 | 说明 |
|------|------|
| 宠物日记 | 每日以宠物第一视角生成，基于当天互动数据 |
| 宠物对话 | AI 扮演宠物，亲密度影响说话方式 |
| 动态事件 | AI 生成个性化随机事件文本 |
| 训练师对话 | AI 扮演训练师 NPC，给出养成建议 |

所有 AI 功能均有 fallback，无 API Key 时自动使用预置内容。

### RAG 记忆系统

宠物有长期记忆，存储在 ChromaDB：

| 记忆类型 | 内容 |
|---------|------|
| `focal_interaction` | 与主人的焦点化互动（进化时主人在场、久违回来等） |
| `diary_core` | 日记提炼的核心情感（1-2句精华） |
| `friend_trait` | 好友性格特点摘要 |
| `milestone` | 进化、第一次好友来访等里程碑 |

全量原始数据存 MySQL，RAG 只存浓缩摘要，生成日记/对话时自动检索注入。

---

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `LLM_API_KEY` | LLM API Key（必填） | — |
| `LLM_API_BASE` | LLM 接口地址 | `https://api.deepseek.com/v1` |
| `LLM_MODEL` | 模型名称 | `deepseek-chat` |
| `EMBED_MODEL` | Embedding 模型 | `deepseek-embedding` |
| `MYSQL_PASSWORD` | MySQL 密码 | `peg_dev_password` |
| `REDIS_PASSWORD` | Redis 密码（可空） | — |
| `SECRET_KEY` | 应用密钥 | 生产环境必须修改 |
| `JWT_SECRET` | JWT 签名密钥 | 生产环境必须修改 |
| `DEBUG` | 调试模式 | `true` |

切换任意 OpenAI 兼容接口（如 OpenAI、Kimi）只需修改 `LLM_API_BASE` 和 `LLM_MODEL`。

---

## 开发进度

- [x] Phase 1：架构 + 存储层（EventBus、StorageAdapter、数据模型、数据静态数据）
- [x] 后端框架（FastAPI + MySQL + Redis + ChromaDB + RAG + 上下文管理）
- [ ] Phase 2：游戏逻辑核心（状态衰减、互动、进化）
- [ ] Phase 3：UI 重建（奶油像素风、宠物动画）
- [ ] Phase 4：AI 功能（完整 Prompt、日记、对话、事件）
- [ ] Phase 5：伙伴系统 + 认证 + 存档同步

---

## 部署到生产环境

1. 修改 `.env`：`DEBUG=false`，替换所有 `*_dev_password` 和密钥
2. 修改 `backend/main.py` 中的 `allow_origins` 为实际域名
3. 配置 HTTPS（建议在 Nginx 前加 Certbot 或云端负载均衡）
4. `docker compose up -d`
