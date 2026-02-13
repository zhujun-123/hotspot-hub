/**
 * 微信推送测试脚本
 * 使用 Server酱 (ServerChan)
 */
import { WechatNotifier } from './src/notifier/wechat.js';
import { GitHubTrendingCollector } from './src/collectors/github.js';
import { HackerNewsCollector } from './src/collectors/hackernews.js';

console.log('🧪 微信推送测试 (Server酱)\n');

// 检查配置
const sendKey = process.env.SERVERCHAN_SENDKEY;
if (!sendKey) {
  console.error('❌ 请设置环境变量 SERVERCHAN_SENDKEY');
  console.log('\n📖 获取 SendKey 步骤:');
  console.log('1. 访问 https://sct.ftqq.com/');
  console.log('2. 使用微信扫码登录');
  console.log('3. 在"发送消息"页面找到你的 SendKey');
  console.log('4. 复制 SendKey 并设置: export SERVERCHAN_SENDKEY="你的SendKey"\n');
  process.exit(1);
}

console.log(`🔑 SendKey: ${sendKey.substring(0, 10)}...${sendKey.substring(sendKey.length - 5)}`);

// 创建推送器
const notifier = new WechatNotifier({
  sendKey: sendKey,
  cooldown: 10 // 测试时缩短冷却时间
});

// 检查配置
const configStatus = notifier.checkConfig();
console.log(`📋 配置状态: ${configStatus.message}\n`);

// 测试 1: 基础推送测试
console.log('═══════════════════════════════════');
console.log('测试 1: 基础推送测试');
console.log('═══════════════════════════════════');

try {
  await notifier.testPush();
  console.log('✅ 基础推送成功\n');
} catch (error) {
  console.error(`❌ 基础推送失败: ${error.message}\n`);
}

// 等待冷却
console.log('⏳ 等待 11 秒...\n');
await new Promise(resolve => setTimeout(resolve, 11000));

// 测试 2: GitHub 热点推送
console.log('═══════════════════════════════════');
console.log('测试 2: GitHub Trending 推送');
console.log('═══════════════════════════════════');

try {
  const github = new GitHubTrendingCollector();
  const repos = await github.fetchTrending('javascript', 'daily');

  if (repos.length > 0) {
    console.log(`获取到 ${repos.length} 个仓库，推送第一个...\n`);
    await notifier.send(repos[0]);
  } else {
    console.error('未获取到 GitHub 数据');
  }
} catch (error) {
  console.error(`❌ GitHub 推送失败: ${error.message}\n`);
}

// 等待冷却
console.log('\n⏳ 等待 11 秒...\n');
await new Promise(resolve => setTimeout(resolve, 11000));

// 测试 3: Hacker News 推送
console.log('═══════════════════════════════════');
console.log('测试 3: Hacker News 推送');
console.log('═══════════════════════════════════');

try {
  const hn = new HackerNewsCollector();
  const stories = await hn.fetchTopStories(5);

  if (stories.length > 0) {
    console.log(`获取到 ${stories.length} 个故事，推送第一个...\n`);
    await notifier.send(stories[0]);
  } else {
    console.error('未获取到 Hacker News 数据');
  }
} catch (error) {
  console.error(`❌ HackerNews 推送失败: ${error.message}\n`);
}

console.log('\n✨ 测试完成！');
console.log('📱 请检查微信"服务号消息"查看推送\n');
console.log('💡 提示: 免费版 Server酱 每天限制 5 条消息');
console.log('💰 升级 Turbo 版(¥1/月)可无限推送');
