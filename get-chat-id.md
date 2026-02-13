# 获取 Telegram Chat ID

## 方法 1: 使用 @userinfobot (推荐)

1. 在 Telegram 中搜索 `@userinfobot`
2. 向它发送任意消息
3. 它会回复你的 Chat ID，格式类似: `Id: 123456789`

## 方法 2: 使用 @getidsbot

1. 在 Telegram 中搜索 `@getidsbot`
2. 点击 Start
3. 它会显示你的 User ID

## 方法 3: 通过 Clawdbot 获取

如果 Clawdbot 已经与你的 Telegram 账号绑定，可以查看配置文件:

```bash
# 在服务器上执行
grep -r "telegram" ~/.config/clawdbot/ 2>/dev/null
```

## 配置到项目

获取到 Chat ID 后，在服务器上设置环境变量:

```bash
# 临时设置(当前 session)
export TELEGRAM_CHAT_ID="你的ChatID"

# 永久设置(添加到 ~/.bashrc)
echo 'export TELEGRAM_CHAT_ID="你的ChatID"' >> ~/.bashrc
source ~/.bashrc

# 或者创建项目配置文件
cd ~/clawd/hotspot-hub
cp config/notifications.example.json config/notifications.json
# 编辑 notifications.json，填入 chatId
```

## 测试推送

```bash
cd ~/clawd/hotspot-hub
TELEGRAM_CHAT_ID="你的ChatID" node test-telegram.js
```
