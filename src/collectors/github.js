/**
 * GitHub Trending 采集器
 * 数据源: GitHub 官方 API
 */

export class GitHubTrendingCollector {
  constructor() {
    this.apiBase = 'https://api.github.com';
  }

  /**
   * 获取 Trending 仓库
   * @param {string} language - 编程语言 (可选)
   * @param {string} since - 时间范围: daily, weekly, monthly
   */
  async fetchTrending(language = '', since = 'daily') {
    try {
      // 使用 GitHub Search API 模拟 Trending
      const date = new Date();
      date.setDate(date.getDate() - (since === 'daily' ? 1 : since === 'weekly' ? 7 : 30));
      const dateStr = date.toISOString().split('T')[0];
      
      const query = `created:>${dateStr}${language ? ` language:${language}` : ''}`;
      const url = `${this.apiBase}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hotspot-Hub/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.normalize(data.items, language, since);
    } catch (error) {
      console.error('[GitHub Collector] Error:', error.message);
      return [];
    }
  }

  /**
   * 标准化数据格式
   */
  normalize(repos, language, since) {
    return repos.map(repo => ({
      title: repo.full_name,
      description: repo.description || '暂无描述',
      url: repo.html_url,
      platform: 'GitHub',
      category: 'tech',
      heat: repo.stargazers_count,
      publishTime: new Date(repo.created_at).getTime(),
      metadata: {
        language: repo.language || language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        since: since,
        topics: repo.topics || []
      }
    }));
  }

  /**
   * 获取多个语言的 Trending
   */
  async fetchMultipleLanguages(languages = ['javascript', 'python', 'go']) {
    const results = await Promise.all(
      languages.map(lang => this.fetchTrending(lang, 'daily'))
    );
    return results.flat();
  }
}
