/**
 * 双通道推送演示
 * 同时推送到 Telegram 和 微信
 */
import { GitHubTrendingCollector } from './src/collectors/github.js';
import { HackerNewsCollector } from './src/collectors/hackernews.js';
import { RSSHubCollector } from './src/collectors/rsshub.js';
import { TelegramNotifier } from './src/notifier/telegram.js';
import { WechatNotifier } from './src/notifier/wechat.js';

console.log('🚀 Hotspot Hub - 双通道推送演示\n');

// 检查配置
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const wechatSendKey = process.env.SERVERCHAN_SENDKEY;

const enableTelegram = !!telegramChatId;
const enableWechat = !!wechatSendKey;

console.log('📋 推送通道状态:');
console.log(`  Telegram: ${enableTelegram ? '✅ 已启用' : '❌ 未配置'}`);
console.log(`  微信:     ${enableWechat ? '✅ 已启用' : '❌ 未配置'}\n`);

if (!enableTelegram && !enableWechat) {
  console.error('❌ 至少需要配置一个推送通道');
  console.log('\n配置方式:');
  console.log('  export TELEGRAM_CHAT_ID="你的ChatID"');
  console.log('  export SERVERCHAN_SENDKEY="你的SendKey"\n');
  process.exit(1);
}

// 初始化推送器
const notifiers = [];

if (enableTelegram) {
  const telegram = new TelegramNotifier({
    target: telegramChatId,
    cooldown: 10
  });
  notifiers.push({ name: 'Telegram', notifier: telegram });
}

if (enableWechat) {
  const wechat = new WechatNotifier({
    sendKey: wechatSendKey,
    cooldown: 10
  });
  notifiers.push({ name: 'WeChat', notifier: wechat });
}

console.log(`🎯 将使用 ${notifiers.length} 个推送通道\n`);

// 收集热点
const allHotspots = [];

// 1. GitHub Trending
console.log('📦 获取 GitHub Trending...');
try {
  const github = new GitHubTrendingCollector();
  const repos = await github.fetchTrending('javascript', 'daily');
  allHotspots.push(...repos.slice(0, 1));
  console.log(`   ✅ ${repos.length} 个仓库\n`);
} catch (error) {
  console.error(`   ❌ ${error.message}\n`);
}

// 2. Hacker News
console.log('📰 获取 Hacker News...');
try {
  const hn = new HackerNewsCollector();
  const stories = await hn.fetchTopStories(5);
  allHotspots.push(...stories.slice(0, 1));
  console.log(`   ✅ ${stories.length} 个故事\n`);
} catch (error) {
  console.error(`   ❌ ${error.message}\n`);
}

// 3. 微博热搜
console.log('🔥 获取微博热搜...');
try {
  const rsshub = new RSSHubCollector('http://localhost:1200');
  const weibo = await rsshub.fetchFeed('/weibo/search/hot');
  allHotspots.push(...weibo.slice(0, 1));
  console.log(`   ✅ ${weibo.length} 条热搜\n`);
} catch (error) {
  console.error(`   ❌ ${error.message}\n`);
}

console.log('═══════════════════════════════════');
console.log(`📤 开始推送 ${allHotspots.length} 条热点`);
console.log('═══════════════════════════════════\n');

// 推送热点
for (let i = 0; i < allHotspots.length; i++) {
  const item = allHotspots[i];
  console.log(`\n[${i + 1}/${allHotspots.length}] ${item.platform}: ${item.title.substring(0, 40)}...`);

  // 推送到所有启用的通道
  for (const { name, notifier } of notifiers) {
    console.log(`  → ${name}...`);
    await notifier.send(item);
  }

  // 等待冷却
  if (i < allHotspots.length - 1) {
    console.log('  ⏳ 等待 11 秒...');
    await new Promise(resolve => setTimeout(resolve, 11000));
  }
}

console.log('\n✨ 推送完成！');
console.log('📱 请检查:');
if (enableTelegram) console.log('  - Telegram 消息');
if (enableWechat) console.log('  - 微信服务号消息');
