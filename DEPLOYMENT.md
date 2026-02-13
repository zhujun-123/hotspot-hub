# 🚀 部署文档

## 服务器信息

- **服务器**: 43.162.121.13
- **部署路径**: /root/clawd/hotspot-hub
- **RSSHub 端口**: 1200

## 已部署服务

### 1. RSSHub (Docker)

**镜像**: diygod/rsshub:chromium-bundled
**容器名**: rsshub  
**端口映射**: 1200:1200  
**自动重启**: ✅ 已启用

**管理命令**:
```bash
# 查看状态
docker ps | grep rsshub

# 查看日志
docker logs rsshub -f

# 重启服务
docker restart rsshub

# 停止服务
docker stop rsshub
```

## 已测试数据源

| 平台 | 路由 | 状态 | 数据量 |
|------|------|------|--------|
| 微博热搜 | /weibo/search/hot | ✅ | 50+ |
| B站热搜 | /bilibili/hot-search | ✅ | 10 |
| 36氪快讯 | /36kr/newsflashes | ✅ | 20 |
| GitHub Trending | GitHub API | ✅ | 10 |
| Hacker News | HN Firebase API | ✅ | 30 |

## 测试脚本

```bash
node test-rsshub.js
node test-all-sources.js
```
