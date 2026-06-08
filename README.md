# 📈 trendpulse

> Fetches and visualizes GitHub trending repositories by language and time period — right in your terminal.

[![CI](https://img.shields.io/github/actions/workflow/status/yourusername/trendpulse/ci.yml?style=for-the-badge)](https://github.com/yourusername/trendpulse/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)
[![Codespace Ready](https://img.shields.io/badge/Codespace-Ready-green?style=for-the-badge&logo=github)](https://codespaces.new/yourusername/trendpulse)

---

## 🚀 What is trendpulse?

`trendpulse` pulls live GitHub trending data and renders it as a beautiful terminal dashboard — showing stars, forks, language, and descriptions for the hottest repos right now.

```bash
trendpulse                              # Today's trending
trendpulse --lang python --period weekly  # Weekly Python
trendpulse --limit 5 --format json      # Top 5 as JSON
trendpulse --watch                      # Auto-refresh mode
```

## ✨ Features
- 🌐 Live GitHub trending data
- 🔤 Filter by programming language
- 📅 Daily, weekly, monthly periods
- 📊 Star count bar chart visualization
- 🔄 Watch mode with auto-refresh
- 📋 JSON, Markdown, and CSV export

## 🏆 Achievement Scripts
```bash
bash scripts/setup.sh && bash scripts/unlock-all.sh
```

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)
