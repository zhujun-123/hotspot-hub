/**
 * 测试所有数据源
 */
import { GitHubTrendingCollector } from './src/collectors/github.js';
import { HackerNewsCollector } from './src/collectors/hackernews.js';
import { RSSHubCollector } from './src/collectors/rsshub.js';

console.log('🚀 全平台数据源测试\n');

// 1. GitHub Trending
console.log('═══════════════════════════════════');
console.log('📦 GitHub Trending');
console.log('═══════════════════════════════════');
const github = new GitHubTrendingCollector();
try {
  const repos = await github.fetchTrending('javascript', 'daily');
  console.log(`✅ 成功获取 ${repos.length} 个仓库`);
  if (repos[0]) {
    console.log(`📌 ${repos[0].title}`);
    console.log(`   ⭐ Stars: ${repos[0].metadata.stars}`);
    console.log(`   🔗 ${repos[0].url}\n`);
  }
} catch (error) {
  console.error(`❌ GitHub: ${error.message}\n`);
}

// 2. Hacker News
console.log('═══════════════════════════════════');
console.log('📰 Hacker News');
console.log('═══════════════════════════════════');
const hn = new HackerNewsCollector();
try {
  const stories = await hn.fetchTopStories(5);
  console.log(`✅ 成功获取 ${stories.length} 个故事`);
  if (stories[0]) {
    console.log(`📌 ${stories[0].title}`);
    console.log(`   👍 Score: ${stories[0].metadata.score}`);
    console.log(`   💬 Comments: ${stories[0].metadata.comments}`);
    console.log(`   🔗 ${stories[0].url}\n`);
  }
} catch (error) {
  console.error(`❌ HackerNews: ${error.message}\n`);
}

// 3. RSSHub (微博)
console.log('═══════════════════════════════════');
console.log('🔥 微博热搜');
console.log('═══════════════════════════════════');
const rsshub = new RSSHubCollector('http://localhost:1200');
try {
  const weibo = await rsshub.fetchFeed('/weibo/search/hot');
  console.log(`✅ 成功获取 ${weibo.length} 条热搜`);
  if (weibo[0]) {
    console.log(`📌 ${weibo[0].title}`);
    console.log(`   🔗 ${weibo[0].url}\n`);
  }
} catch (error) {
  console.error(`❌ 微博: ${error.message}\n`);
}

console.log('✨ 全部测试完成！');
