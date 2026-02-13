/**
 * RSSHub 采集器
 * 数据源: 自部署的 RSSHub 实例
 */
import Parser from 'rss-parser';

export class RSSHubCollector {
  constructor(baseUrl = 'http://localhost:1200') {
    this.baseUrl = baseUrl;
    this.parser = new Parser({
      customFields: {
        item: ['comments', 'category']
      }
    });
  }

  /**
   * 获取 RSS Feed
   */
  async fetchFeed(route) {
    try {
      const url = `${this.baseUrl}${route}`;
      console.log(`[RSSHub Collector] Fetching: ${url}`);
      
      const feed = await this.parser.parseURL(url);
      return this.normalize(feed.items, this.extractPlatform(route));
    } catch (error) {
      console.error(`[RSSHub Collector] Error fetching ${route}:`, error.message);
      return [];
    }
  }

  /**
   * 从路由提取平台名称
   */
  extractPlatform(route) {
    const platformMap = {
      '/weibo': '微博',
      '/zhihu': '知乎',
      '/bilibili': 'B站',
      '/36kr': '36氪',
      '/douyin': '抖音'
    };
    
    for (const [key, value] of Object.entries(platformMap)) {
      if (route.startsWith(key)) return value;
    }
    return 'RSS';
  }

  /**
   * 标准化数据格式
   */
  normalize(items, platform) {
    return items.map(item => ({
      title: item.title,
      description: this.stripHTML(item.contentSnippet || item.content || '').slice(0, 200),
      url: item.link,
      platform: platform,
      category: this.detectCategory(item.title),
      heat: this.estimateHeat(item), // 根据发布时间估算热度
      publishTime: new Date(item.pubDate || item.isoDate).getTime(),
      metadata: {
        author: item.creator || item.author || 'unknown',
        categories: item.categories || []
      }
    }));
  }

  /**
   * 估算热度 (RSS 源通常不提供具体热度值)
   */
  estimateHeat(item) {
    const now = Date.now();
    const pubTime = new Date(item.pubDate || item.isoDate).getTime();
    const ageHours = (now - pubTime) / (1000 * 60 * 60);
    
    // 越新的内容热度越高
    return Math.max(1000, Math.floor(10000 / (ageHours + 1)));
  }

  /**
   * 检测分类
   */
  detectCategory(title) {
    if (/AI|GPT|机器学习|深度学习/i.test(title)) return 'ai';
    if (/技术|编程|开发|开源/i.test(title)) return 'tech';
    if (/创业|融资|IPO/i.test(title)) return 'startup';
    return 'general';
  }

  /**
   * 移除 HTML 标签
   */
  stripHTML(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
  }
}
