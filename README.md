# 🔥 Hotspot Hub - 热点订阅推送平台

> 聚合微博/知乎/B站/GitHub/Hacker News 等多平台热榜，实时推送到 Telegram/微信

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## ✨ 特性

- 🌐 **多平台聚合**: 微博、知乎、B站、GitHub Trending、Hacker News、36氪等
- 🚀 **实时推送**: 支持 Telegram、微信(Server酱)、Discord 多渠道推送
- 🎯 **智能过滤**: 基于关键词、热度阈值的智能过滤系统
- 🔄 **自动去重**: Redis 缓存 + Hash 算法防止重复推送
- 📊 **数据归档**: SQLite 存储历史热点数据
- ⚙️ **灵活配置**: JSON 配置文件,支持自定义 RSS 源

## 📦 技术栈

- **Runtime**: Node.js 18+
- **数据源**: RSSHub, GitHub API, Hacker News API
- **存储**: Redis (缓存), SQLite (归档)
- **推送**: Telegram Bot API, Server酱, Discord Webhook

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp config/notifications.example.json config/notifications.json
# 编辑 config/notifications.json 填入你的推送配置
```

### 3. 部署 RSSHub (可选)

```bash
docker run -d --name rsshub -p 1200:1200 diygod/rsshub
```

或使用官方实例: https://rsshub.app

### 4. 启动服务

```bash
# 开发模式 (热重载)
npm run dev

# 生产模式
npm start
```

## 📁 项目结构

```
hotspot-hub/
├── src/
│   ├── collectors/       # 数据采集器
│   │   ├── github.js    # GitHub Trending
│   │   ├── hackernews.js # Hacker News
│   │   └── rsshub.js    # RSSHub (微博/知乎/B站等)
│   ├── processor/       # 数据处理
│   │   ├── deduplicator.js  # 去重引擎
│   │   └── filter.js        # 过滤规则
│   ├── notifier/        # 推送通知
│   │   ├── telegram.js  # Telegram 推送
│   │   └── wechat.js    # 微信推送
│   ├── storage/         # 数据存储
│   │   ├── redis.js     # Redis 客户端
│   │   └── sqlite.js    # SQLite 客户端
│   └── main.js          # 主程序入口
├── config/              # 配置文件
│   ├── sources.json     # 数据源配置
│   ├── filters.json     # 过滤规则
│   └── notifications.json # 推送配置
└── package.json
```

## ⚙️ 配置说明

### 数据源配置 (config/sources.json)

```json
{
  "rsshub": {
    "url": "http://localhost:1200",
    "routes": [
      { "name": "微博热搜", "path": "/weibo/search/hot", "interval": 300 },
      { "name": "知乎热榜", "path": "/zhihu/hotlist", "interval": 600 }
    ]
  },
  "github": {
    "languages": ["javascript", "python", "go"],
    "interval": 3600
  }
}
```

### 过滤规则 (config/filters.json)

```json
{
  "minHeat": 1000,
  "keywords": {
    "tech": ["AI", "GPT", "开源"],
    "ai": ["ChatGPT", "Claude"]
  },
  "blacklist": ["广告", "营销号"]
}
```

## 📸 推送示例

**Telegram 推送格式:**
```
🔥 微博热搜

📌 ChatGPT发布重大更新
🔗 https://weibo.com/xxxxx
🔥 热度: 1,234,567
📅 2026-02-13 14:30

#AI #科技 #热点
```

## 🛠️ 开发计划

- [x] 基础架构搭建
- [x] GitHub Trending 采集器
- [x] Hacker News 采集器
- [x] RSSHub 集成
- [ ] Telegram 推送模块
- [ ] 微信推送模块
- [ ] Redis 去重引擎
- [ ] Web 管理界面

## 📄 License

MIT © [zhujun-123](https://github.com/zhujun-123)

## 🙏 致谢

- [RSSHub](https://github.com/DIYgod/RSSHub) - 万物皆可 RSS
- [NewsNow](https://github.com/ourongxing/newsnow) - 优雅的热榜界面
- [Hacker News API](https://github.com/HackerNews/API) - 官方 API

---

**⭐ 如果这个项目对你有帮助,请给个 Star!**

## 🧪 快速测试

### 1. 获取 Telegram Chat ID

查看  获取详细步骤，推荐使用 @userinfobot。

### 2. 运行演示程序

```bash
# 设置 Chat ID
export TELEGRAM_CHAT_ID="你的ChatID"

# 运行演示(会推送6条热点)
node demo.js
```

演示程序会:
- 获取 GitHub Trending (JavaScript, 2条)
- 获取 Hacker News Top Stories (2条)
- 获取微博热搜 (2条)
- 依次推送到你的 Telegram

### 3. 单独测试 Telegram 推送

```bash
TELEGRAM_CHAT_ID="你的ChatID" node test-telegram.js
```

## 📂 新增文件

- `src/notifier/telegram.js` - Telegram 推送模块
- `demo.js` - 完整推送演示
- `test-telegram.js` - Telegram 推送测试
- `get-chat-id.md` - Chat ID 获取指南

## 📱 微信推送

### 配置 Server酱

1. 访问 https://sct.ftqq.com/ 并登录
2. 获取你的 SendKey
3. 设置环境变量:
   ```bash
   export SERVERCHAN_SENDKEY="你的SendKey"
   ```

### 测试微信推送

```bash
node test-wechat.js
```

### 双通道推送

同时推送到 Telegram 和 微信:

```bash
# 配置两个通道
export TELEGRAM_CHAT_ID="你的ChatID"
export SERVERCHAN_SENDKEY="你的SendKey"

# 运行双通道推送
node demo-dual-push.js
```

详细配置请查看 `serverchan-setup.md`

