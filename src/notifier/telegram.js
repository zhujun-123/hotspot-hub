import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class TelegramNotifier {
  constructor(config = {}) {
    this.target = config.target || process.env.TELEGRAM_CHAT_ID;
    this.cooldown = config.cooldown || 60;
    this.lastPushTime = 0;
  }

  async send(hotItem) {
    const now = Date.now();
    if (now - this.lastPushTime < this.cooldown * 1000) {
      console.log('[Telegram] 冷却中，跳过推送');
      return false;
    }

    try {
      const message = this.formatMessage(hotItem);
      await this.sendRaw(message);
      this.lastPushTime = now;
      console.log(`[Telegram] ✅ 推送成功: ${hotItem.title}`);
      return true;
    } catch (error) {
      console.error(`[Telegram] ❌ 失败: ${error.message}`);
      return false;
    }
  }

  async sendRaw(message) {
    const escapedMsg = message.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    const cmd = `clawdbot message send --channel telegram --target "${this.target}" --message "${escapedMsg}"`;
    const { stdout, stderr } = await execAsync(cmd);
    if (stderr && stderr.includes('error')) {
      throw new Error(stderr);
    }
    return stdout;
  }

  formatMessage(item) {
    const emoji = this.getPlatformEmoji(item.platform);
    const timeStr = new Date(item.publishTime).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    let msg = `${emoji} ${item.platform}热榜\n\n`;
    msg += `📌 ${item.title}\n`;
    msg += `🔗 ${item.url}\n`;

    if (item.heat && !isNaN(item.heat)) {
      msg += `🔥 热度: ${this.formatNumber(item.heat)}\n`;
    }

    if (item.metadata) {
      if (item.metadata.stars) msg += `⭐ ${item.metadata.stars}\n`;
      if (item.metadata.score) msg += `👍 ${item.metadata.score}\n`;
      if (item.metadata.comments) msg += `💬 ${item.metadata.comments}\n`;
    }

    msg += `📅 ${timeStr}`;
    return msg;
  }

  async sendBatch(items, delay = 2000) {
    const results = [];
    for (const item of items) {
      const result = await this.send(item);
      results.push({ item, success: result });
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return results;
  }

  getPlatformEmoji(platform) {
    const map = {
      '微博': '🔥',
      'B站': '📺',
      '知乎': '💡',
      '36氪': '💼',
      'GitHub': '💻',
      'HackerNews': '📰'
    };
    return map[platform] || '📌';
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
