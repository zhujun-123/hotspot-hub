/**
 * Telegram 推送测试脚本
 */
import { TelegramNotifier } from './src/notifier/telegram.js';
import { GitHubTrendingCollector } from './src/collectors/github.js';

console.log('🧪 Telegram 推送测试\n');

// 读取配置
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!chatId) {
  console.error('❌ 请设置环境变量 TELEGRAM_CHAT_ID');
  console.log('💡 获取方式: 在 Telegram 中向 @userinfobot 发送任意消息');
  process.exit(1);
}

console.log(`📱 推送目标: ${chatId}\n`);

// 创建推送器
const notifier = new TelegramNotifier({
  target: chatId,
  cooldown: 5 // 测试时缩短冷却时间
});

// 1. 测试 GitHub 热点推送
console.log('═══════════════════════════════════');
console.log('测试 1: GitHub Trending');
console.log('═══════════════════════════════════');

const github = new GitHubTrendingCollector();
const repos = await github.fetchTrending('javascript', 'daily');

if (repos.length > 0) {
  console.log(`获取到 ${repos.length} 个仓库，推送第一个...\n`);
  await notifier.send(repos[0]);
} else {
  console.error('未获取到 GitHub 数据');
}

// 等待冷却
console.log('\n⏳ 等待 6 秒...\n');
await new Promise(resolve => setTimeout(resolve, 6000));

// 2. 测试自定义热点推送
console.log('═══════════════════════════════════');
console.log('测试 2: 自定义热点');
console.log('═══════════════════════════════════');

const customHot = {
  title: '测试热点: Hotspot Hub 推送系统上线!',
  url: 'https://github.com/zhujun-123/hotspot-hub',
  platform: 'GitHub',
  category: 'tech',
  heat: 9999,
  publishTime: Date.now(),
  metadata: {
    stars: 100,
    language: 'JavaScript'
  }
};

await notifier.send(customHot);

console.log('\n✨ 测试完成！请检查你的 Telegram 是否收到消息。');
