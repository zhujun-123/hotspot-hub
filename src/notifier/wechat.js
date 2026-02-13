/**
 * 微信推送模块
 * 使用 Server酱 (ServerChan) API
 * 文档: https://sct.ftqq.com/
 */

export class WechatNotifier {
  constructor(config = {}) {
    this.sendKey = config.sendKey || process.env.SERVERCHAN_SENDKEY;
    this.apiUrl = `https://sctapi.ftqq.com/${this.sendKey}.send`;
    this.cooldown = config.cooldown || 300; // 默认5分钟冷却
    this.lastPushTime = 0;

    if (!this.sendKey) {
      console.warn('[WeChat] ⚠️  未配置 SendKey，推送将失败');
    }
  }

  /**
   * 发送热点消息
   * @param {Object} hotItem - 热点数据对象
   */
  async send(hotItem) {
    if (!this.sendKey) {
      console.error('[WeChat] ❌ SendKey 未配置');
      return false;
    }

    // 检查冷却时间
    const now = Date.now();
    if (now - this.lastPushTime < this.cooldown * 1000) {
      console.log('[WeChat] 在冷却期内，跳过推送');
      return false;
    }

    try {
      const { title, desp } = this.formatMessage(hotItem);
      await this.sendRaw(title, desp);
      this.lastPushTime = now;
      console.log(`[WeChat] ✅ 推送成功: ${hotItem.title}`);
      return true;
    } catch (error) {
      console.error(`[WeChat] ❌ 失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 发送原始消息
   * @param {string} title - 消息标题
   * @param {string} desp - 消息内容(Markdown)
   */
  async sendRaw(title, desp) {
    const params = new URLSearchParams({
      title: title,
      desp: desp
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(`Server酱错误: ${result.message || '未知错误'}`);
    }

    return result;
  }

  /**
   * 格式化热点消息为 Markdown
   * @param {Object} item - 热点数据
   * @returns {Object} { title, desp }
   */
  formatMessage(item) {
    const emoji = this.getPlatformEmoji(item.platform);
    const timeStr = new Date(item.publishTime).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 标题: 平台 | 热点标题
    const title = `${emoji} ${item.platform} | ${item.title.substring(0, 50)}`;

    // 内容: Markdown 格式
    let desp = `## ${item.title}\n\n`;
    desp += `**平台**: ${item.platform}\n\n`;

    // 添加描述(如果有)
    if (item.description) {
      desp += `**简介**: ${item.description}\n\n`;
    }

    // 添加热度信息
    if (item.heat && !isNaN(item.heat)) {
      desp += `**热度**: 🔥 ${this.formatNumber(item.heat)}\n\n`;
    }

    // 添加元数据
    if (item.metadata) {
      if (item.metadata.stars) {
        desp += `**Stars**: ⭐ ${this.formatNumber(item.metadata.stars)}\n\n`;
      }
      if (item.metadata.forks) {
        desp += `**Forks**: 🔀 ${this.formatNumber(item.metadata.forks)}\n\n`;
      }
      if (item.metadata.score) {
        desp += `**Score**: 👍 ${item.metadata.score}\n\n`;
      }
      if (item.metadata.comments) {
        desp += `**评论数**: 💬 ${item.metadata.comments}\n\n`;
      }
      if (item.metadata.language) {
        desp += `**语言**: ${item.metadata.language}\n\n`;
      }
    }

    desp += `**发布时间**: 📅 ${timeStr}\n\n`;
    desp += `---\n\n`;
    desp += `[点击查看详情](${item.url})\n\n`;
    desp += `> 来源: Hotspot Hub 热点推送系统`;

    return { title, desp };
  }

  /**
   * 批量推送
   * @param {Array} items - 热点列表
   * @param {number} delay - 每条消息间隔(毫秒)
   */
  async sendBatch(items, delay = 5000) {
    const results = [];

    for (const item of items) {
      const result = await this.send(item);
      results.push({ item, success: result });

      if (delay > 0 && results.length < items.length) {
        console.log(`[WeChat] ⏳ 等待 ${delay/1000} 秒...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  }

  /**
   * 发送每日摘要
   * @param {Array} items - 热点列表
   * @param {string} date - 日期字符串
   */
  async sendDailySummary(items, date = null) {
    if (!date) {
      date = new Date().toLocaleDateString('zh-CN');
    }

    const title = `📊 热点日报 | ${date}`;

    let desp = `## ${date} 热点摘要\n\n`;
    desp += `共收集 **${items.length}** 条热点\n\n`;
    desp += `---\n\n`;

    // 按平台分组
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.platform]) {
        grouped[item.platform] = [];
      }
      grouped[item.platform].push(item);
    });

    // 生成摘要
    for (const [platform, platformItems] of Object.entries(grouped)) {
      const emoji = this.getPlatformEmoji(platform);
      desp += `### ${emoji} ${platform} (${platformItems.length}条)\n\n`;

      platformItems.slice(0, 5).forEach((item, index) => {
        desp += `${index + 1}. [${item.title}](${item.url})\n`;
      });

      desp += `\n`;
    }

    desp += `---\n\n`;
    desp += `> 来源: Hotspot Hub 热点推送系统`;

    return this.sendRaw(title, desp);
  }

  /**
   * 测试推送
   */
  async testPush() {
    const testData = {
      title: 'Server酱推送测试',
      url: 'https://github.com/zhujun-123/hotspot-hub',
      platform: 'GitHub',
      category: 'tech',
      heat: 9999,
      publishTime: Date.now(),
      description: 'Hotspot Hub 微信推送功能测试',
      metadata: {
        stars: 100,
        language: 'JavaScript'
      }
    };

    return this.send(testData);
  }

  /**
   * 获取平台对应的 Emoji
   */
  getPlatformEmoji(platform) {
    const emojiMap = {
      '微博': '🔥',
      'B站': '📺',
      '知乎': '💡',
      '36氪': '💼',
      'GitHub': '💻',
      'HackerNews': '📰',
      '抖音': '🎵',
      'V2EX': '🌐'
    };
    return emojiMap[platform] || '📌';
  }

  /**
   * 格式化数字(千分位)
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 检查配置状态
   */
  checkConfig() {
    if (!this.sendKey) {
      return {
        valid: false,
        message: 'SendKey 未配置，请访问 https://sct.ftqq.com/ 获取'
      };
    }

    return {
      valid: true,
      message: 'SendKey 已配置',
      apiUrl: this.apiUrl.replace(this.sendKey, '***')
    };
  }
}
