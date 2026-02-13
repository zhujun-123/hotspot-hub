# 📱 Server酱 (ServerChan) 配置指南

Server酱是一个微信推送服务，可以将消息推送到你的微信。

## 🚀 快速开始

### 第一步: 注册并获取 SendKey

1. **访问官网**: https://sct.ftqq.com/
2. **微信登录**: 使用微信扫码登录
3. **获取 SendKey**:
   - 登录后进入「发送消息」页面
   - 找到你的 SendKey (格式: `SCT****`)
   - 复制保存

### 第二步: 测试推送

在官网测试页面测试推送:

- 标题: `测试消息`
- 内容: `Hello from Server酱`
- 点击"发送"

你应该会在微信「服务号消息」中收到推送。

### 第三步: 配置到项目

在服务器上设置环境变量:

```bash
# 临时配置
export SERVERCHAN_SENDKEY="你的SendKey"

# 永久配置
echo 'export SERVERCHAN_SENDKEY="你的SendKey"' >> ~/.bashrc
source ~/.bashrc
```

### 第四步: 测试推送

```bash
cd ~/clawd/hotspot-hub
node test-wechat.js
```

## 📊 免费版 vs Turbo版

### 免费版
- ✅ 每天 **5 条**消息
- ✅ 推送到微信服务号
- ⚠️  适合低频推送

### Turbo版 (推荐)
- ✅ **无限制**推送
- ✅ 更快的推送速度
- ✅ 支持企业微信
- 💰 **¥1/月** (非常便宜!)

**升级方式**: 在 Server酱 官网点击「升级」

## 💡 使用建议

### 场景 1: 低频重要热点
使用免费版，设置高热度阈值，每天推送 5 条最热门内容。

```javascript
// 在过滤器中设置高阈值
{
  "minHeat": 100000,  // 只推送超高热度
  "platforms": ["微博", "GitHub"]  // 只推送特定平台
}
```

### 场景 2: 全量推送
升级 Turbo 版(¥1/月)，享受无限推送。

### 场景 3: 每日摘要
使用每日摘要功能，一条消息包含所有热点:

```javascript
import { WechatNotifier } from './src/notifier/wechat.js';

const notifier = new WechatNotifier();
await notifier.sendDailySummary(allHotspots);
```

## 🔧 API 使用

### 基础推送

```javascript
import { WechatNotifier } from './src/notifier/wechat.js';

const notifier = new WechatNotifier({
  sendKey: 'SCT****',
  cooldown: 300  // 5分钟冷却
});

// 推送单条热点
await notifier.send(hotItem);

// 批量推送
await notifier.sendBatch(items, 5000);  // 每条间隔5秒

// 每日摘要
await notifier.sendDailySummary(items);
```

### 配置检查

```javascript
const status = notifier.checkConfig();
console.log(status);
// { valid: true, message: 'SendKey 已配置' }
```

## 📱 消息格式

### 单条热点

```
🔥 微博 | 跟着总书记感受年味儿

## 跟着总书记感受年味儿

**平台**: 微博

**热度**: 🔥 1,234,567

**发布时间**: 📅 2026-02-13 22:30

---

[点击查看详情](https://weibo.com/...)

> 来源: Hotspot Hub 热点推送系统
```

### 每日摘要

```
📊 热点日报 | 2026-02-13

## 2026-02-13 热点摘要

共收集 **20** 条热点

---

### 🔥 微博 (8条)

1. [热点标题1](链接1)
2. [热点标题2](链接2)
...

### 💻 GitHub (5条)

1. [仓库1](链接1)
...
```

## ⚠️ 常见问题

### Q: 没收到推送消息?

A: 检查以下几点:
1. SendKey 是否正确配置
2. 是否超过免费版每日 5 条限制
3. 微信是否关注了「方糖服务号」
4. 查看 Server酱 官网发送记录

### Q: 推送太慢?

A:
- 免费版可能有延迟
- 升级 Turbo 版获得更快速度
- 使用每日摘要减少推送次数

### Q: 如何推送到企业微信?

A:
- 需要升级 Turbo 版
- 在官网配置企业微信应用

### Q: SendKey 泄露了怎么办?

A:
- 立即在官网重置 SendKey
- 更新项目配置

## 🔗 相关链接

- 官网: https://sct.ftqq.com/
- 文档: https://sct.ftqq.com/sendkey
- GitHub: https://github.com/easychen/serverchan

---

**💰 推荐**: 如果每天推送超过 5 条，强烈建议升级 Turbo 版(¥1/月)，性价比极高！
