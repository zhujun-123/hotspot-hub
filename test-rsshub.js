/**
 * RSSHub 数据源测试脚本
 */
import { RSSHubCollector } from './src/collectors/rsshub.js';

const collector = new RSSHubCollector('http://localhost:1200');

const routes = [
  { name: '微博热搜', path: '/weibo/search/hot' },
  { name: 'B站热搜', path: '/bilibili/hot-search' },
  { name: '36氪快讯', path: '/36kr/newsflashes' }
];

console.log('🔍 开始测试 RSSHub 数据源...\n');

for (const route of routes) {
  try {
    console.log(`📊 测试: ${route.name}`);
    const items = await collector.fetchFeed(route.path);
    console.log(`✅ 成功获取 ${items.length} 条数据`);
    
    if (items.length > 0) {
      console.log(`   📌 示例: ${items[0].title}`);
      console.log(`   🔗 链接: ${items[0].url}`);
      console.log(`   🔥 热度: ${items[0].heat}\n`);
    }
  } catch (error) {
    console.error(`❌ 失败: ${error.message}\n`);
  }
}

console.log('✨ 测试完成！');
