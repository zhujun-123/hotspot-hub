/**
 * Hotspot Hub 演示程序
 * 获取热点并推送到 Telegram
 */
import { GitHubTrendingCollector } from './src/collectors/github.js';
import { HackerNewsCollector } from './src/collectors/hackernews.js';
import { RSSHubCollector } from './src/collectors/rsshub.js';
import { TelegramNotifier } from './src/notifier/telegram.js';

console.log('🚀 Hotspot Hub - 热点推送演示\n');

// 检查配置
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!chatId) {
  console.error('❌ 未配置 TELEGRAM_CHAT_ID');
  console.log('💡 请先设置: export TELEGRAM_CHAT_ID="你的ChatID"');
  console.log('📖 参考: get-chat-id.md\n');
  process.exit(1);
}

// 初始化推送器
const notifier = new TelegramNotifier({
  target: chatId,
  cooldown: 10 // 演示模式: 10秒冷却
});

console.log(`📱 推送目标: ${chatId}`);
console.log(`⏱️  冷却时间: 10秒\n`);

// 收集所有热点
const allHotspots = [];

// 1. GitHub Trending
console.log('📦 获取 GitHub Trending...');
try {
  const github = new GitHubTrendingCollector();
  const repos = await github.fetchTrending('javascript', 'daily');
  allHotspots.push(...repos.slice(0, 2)); // 取前2个
  console.log(`   ✅ 获取 ${repos.length} 个仓库\n`);
} catch (error) {
  console.error(`   ❌ GitHub 失败: ${error.message}\n`);
}

// 2. Hacker News
console.log('📰 获取 Hacker News...');
try {
  const hn = new HackerNewsCollector();
  const stories = await hn.fetchTopStories(5);
  allHotspots.push(...stories.slice(0, 2)); // 取前2个
  console.log(`   ✅ 获取 ${stories.length} 个故事\n`);
} catch (error) {
  console.error(`   ❌ HackerNews 失败: ${error.message}\n`);
}

// 3. 微博热搜
console.log('🔥 获取微博热搜...');
try {
  const rsshub = new RSSHubCollector('http://localhost:1200');
  const weibo = await rsshub.fetchFeed('/weibo/search/hot');
  allHotspots.push(...weibo.slice(0, 2)); // 取前2个
  console.log(`   ✅ 获取 ${weibo.length} 条热搜\n`);
} catch (error) {
  console.error(`   ❌ 微博 失败: ${error.message}\n`);
}

// 开始推送
console.log('═══════════════════════════════════');
console.log(`📤 开始推送 ${allHotspots.length} 条热点`);
console.log('═══════════════════════════════════\n');

for (let i = 0; i < allHotspots.length; i++) {
  const item = allHotspots[i];
  console.log(`[${i + 1}/${allHotspots.length}] ${item.platform}: ${item.title.substring(0, 30)}...`);

  const success = await notifier.send(item);

  if (success && i < allHotspots.length - 1) {
    console.log('   ⏳ 等待冷却...\n');
    await new Promise(resolve => setTimeout(resolve, 11000)); // 等待11秒
  }
}

console.log('\n✨ 演示完成！');
console.log('📱 请检查 Telegram 查看推送消息');
