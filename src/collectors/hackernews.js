/**
 * Hacker News 采集器
 * 数据源: Hacker News Firebase API
 */

export class HackerNewsCollector {
  constructor() {
    this.apiBase = 'https://hacker-news.firebaseio.com/v0';
  }

  /**
   * 获取热门故事
   */
  async fetchTopStories(limit = 30) {
    try {
      // 1. 获取热门故事 ID 列表
      const response = await fetch(`${this.apiBase}/topstories.json`);
      const ids = await response.json();
      
      // 2. 获取前 N 个故事详情
      const stories = await Promise.all(
        ids.slice(0, limit).map(id => this.fetchStory(id))
      );
      
      // 3. 过滤掉获取失败的
      return this.normalize(stories.filter(Boolean));
    } catch (error) {
      console.error('[HackerNews Collector] Error:', error.message);
      return [];
    }
  }

  /**
   * 获取单个故事详情
   */
  async fetchStory(id) {
    try {
      const response = await fetch(`${this.apiBase}/item/${id}.json`);
      return await response.json();
    } catch (error) {
      console.error(`[HackerNews Collector] Failed to fetch story ${id}:`, error.message);
      return null;
    }
  }

  /**
   * 标准化数据格式
   */
  normalize(stories) {
    return stories.map(story => ({
      title: story.title,
      description: story.text ? this.stripHTML(story.text).slice(0, 200) : '',
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      platform: 'HackerNews',
      category: 'tech',
      heat: (story.score || 0) + (story.descendants || 0) * 2, // 分数 + 评论数*2
      publishTime: story.time * 1000, // Unix timestamp 转毫秒
      metadata: {
        score: story.score || 0,
        comments: story.descendants || 0,
        author: story.by || 'unknown',
        hnUrl: `https://news.ycombinator.com/item?id=${story.id}`
      }
    }));
  }

  /**
   * 移除 HTML 标签
   */
  stripHTML(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
  }
}
