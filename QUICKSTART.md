# 🚀 快速开始指南

## 前置条件

- ✅ 服务器已部署 RSSHub (端口 1200)
- ✅ 服务器已安装 Clawdbot Gateway
- ✅ Clawdbot 已配置 Telegram Bot
- ✅ Node.js 18+ 环境

## 第一步: 获取 Telegram Chat ID

### 方法 A: 使用 @userinfobot (推荐)

1. 打开 Telegram，搜索 `@userinfobot`
2. 点击 Start 或发送任意消息
3. 机器人会回复你的信息，其中包含 `Id: 123456789`
4. 这个数字就是你的 Chat ID

### 方法 B: 使用 @getidsbot

1. 搜索 `@getidsbot`
2. 点击 Start
3. 获取显示的 User ID

## 第二步: 配置环境变量

在服务器上执行:

```bash
# 临时配置(当前 session)
export TELEGRAM_CHAT_ID="你的ChatID"

# 永久配置(推荐)
echo 'export TELEGRAM_CHAT_ID="你的ChatID"' >> ~/.bashrc
source ~/.bashrc
```

## 第三步: 测试 Telegram 推送

```bash
cd ~/clawd/hotspot-hub

# 测试单条推送
node test-telegram.js
```

你应该会在 Telegram 收到两条测试消息:
1. GitHub Trending 仓库信息
2. 自定义测试热点

## 第四步: 运行完整演示

```bash
node demo.js
```

演示程序会:
1. 从 GitHub Trending 获取 2 条
2. 从 Hacker News 获取 2 条
3. 从微博热搜获取 2 条
4. 依次推送到你的 Telegram (每条间隔 11 秒)

## 消息格式预览

```
🔥 微博热榜

📌 跟着总书记感受年味儿
🔗 https://m.weibo.cn/search?...
🔥 热度: 123,456
📅 02-13 22:30

#综合 #热点
```

```
💻 GitHub热榜

📌 andyhuo520/openclaw-assistant-mvp
🔗 https://github.com/andyhuo520/openclaw-assistant-mvp
⭐ 32
📅 02-13 15:20

#技术 #热点
```

## 常见问题

### Q: 推送失败怎么办?

A: 检查以下几点:
1. Clawdbot Gateway 是否运行: `docker ps | grep clawdbot` 或检查进程
2. Telegram Bot 是否配置: 查看 Clawdbot 日志
3. Chat ID 是否正确: 重新获取并验证
4. 网络连接: 服务器是否能访问 Telegram API

### Q: 收到消息但格式乱了?

A: 可能是 Markdown 转义问题，已在代码中处理常见字符。如遇特殊情况，请提 Issue。

### Q: 推送太频繁/太慢?

A: 修改 `TelegramNotifier` 构造函数中的 `cooldown` 参数(单位:秒)

```javascript
const notifier = new TelegramNotifier({
  target: chatId,
  cooldown: 30  // 30秒冷却
});
```

### Q: 如何只推送特定平台的热点?

A: 在 `demo.js` 中注释掉不需要的采集器代码即可。

## 下一步

- [ ] 配置定时任务(cron)定期推送
- [ ] 部署 Redis 实现去重
- [ ] 添加过滤规则(关键词/热度阈值)
- [ ] 集成微信推送(Server酱)
- [ ] 部署 Web 管理界面

---

**遇到问题?** 查看项目 [Issues](https://github.com/zhujun-123/hotspot-hub/issues) 或提交新 Issue。
