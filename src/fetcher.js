#!/usr/bin/env node
// 📈 trendpulse — GitHub Trending Repository Viewer

const https = require('https');
const { execSync } = require('child_process');

const GREEN  = '\x1b[32m'; const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m'; const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';  const BLUE   = '\x1b[34m';
const RED    = '\x1b[31m'; const NC     = '\x1b[0m';

const LANG_MAP = {
  js: 'javascript', ts: 'typescript', py: 'python',
  go: 'go', rs: 'rust', rb: 'ruby', java: 'java',
  cpp: 'c++', c: 'c', cs: 'c%23', swift: 'swift',
  kt: 'kotlin', php: 'php', sh: 'shell',
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'trendpulse-cli/1.0', 'Accept': 'application/json' }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ items: [] }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function starBar(stars, max, width = 25) {
  const filled = Math.round((stars / max) * width);
  return GREEN + '█'.repeat(filled) + NC + DIM + '░'.repeat(width - filled) + NC;
}

function formatStars(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

async function fetchTrending(options = {}) {
  const { lang = '', period = 'daily', minStars = 0, limit = 10 } = options;

  const dateMap = { daily: 1, weekly: 7, monthly: 30 };
  const days    = dateMap[period] || 1;
  const since   = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const langQ   = lang ? `+language:${LANG_MAP[lang] || lang}` : '';
  const query   = `created:>${since}${langQ}+stars:>${minStars}`;
  const url     = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${limit}`;

  console.log(`\n${CYAN}${BOLD}📈 trendpulse${NC} ${DIM}fetching ${period} trends${lang ? ' · ' + lang : ''}...${NC}\n`);

  let data;
  try {
    data = await fetch(url);
  } catch (e) {
    console.error(`${RED}❌ Network error: ${e.message}${NC}`);
    console.log(`${DIM}Tip: Check your internet connection or GitHub API rate limit.${NC}\n`);
    showSampleData(limit);
    return;
  }

  const repos = data.items || [];
  if (!repos.length) {
    console.log(`${YELLOW}No repos found for the given filters.${NC}\n`);
    return;
  }

  const maxStars = repos[0].stargazers_count || 1;
  const period_label = { daily: 'Today', weekly: 'This Week', monthly: 'This Month' }[period] || period;

  console.log(`${BOLD}Trending ${lang ? lang.toUpperCase() + ' ' : ''}Repos — ${period_label}${NC}`);
  console.log('─'.repeat(70));

  repos.forEach((repo, i) => {
    const rank   = String(i + 1).padStart(2);
    const stars  = formatStars(repo.stargazers_count).padStart(6);
    const name   = repo.full_name.padEnd(35);
    const desc   = (repo.description || 'No description').slice(0, 45);
    const bar    = starBar(repo.stargazers_count, maxStars, 15);
    console.log(`${YELLOW}#${rank}${NC} ⭐${GREEN}${stars}${NC} ${bar} ${BOLD}${BLUE}${name}${NC}`);
    console.log(`       ${DIM}${desc}${NC}`);
  });

  console.log('─'.repeat(70));
  console.log(`${DIM}Updated: ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC${NC}\n`);
}

function showSampleData(limit = 5) {
  console.log(`${YELLOW}${BOLD}Sample output (offline mode):${NC}\n`);
  const sample = [
    { rank: 1, stars: '2.8k', name: 'vercel/ai', desc: 'Build AI-powered applications' },
    { rank: 2, stars: '1.9k', name: 'shadcn-ui/ui', desc: 'Beautifully designed components' },
    { rank: 3, stars: '1.2k', name: 'biomejs/biome', desc: 'Fast formatter and linter' },
    { rank: 4, stars: '987',  name: 'electric-sql/electric', desc: 'Local-first sync layer' },
    { rank: 5, stars: '743',  name: 'BuilderIO/mitosis', desc: 'Write components once, run everywhere' },
  ].slice(0, limit);
  sample.forEach(({ rank, stars, name, desc }) => {
    console.log(`${YELLOW}#${rank}${NC} ⭐${GREEN}${stars.padStart(6)}${NC} ${BOLD}${BLUE}${name}${NC}`);
    console.log(`       ${DIM}${desc}${NC}`);
  });
  console.log();
}

// ── CLI ──────────────────────────────────────────────────
const args     = process.argv.slice(2);
const lang     = args[args.indexOf('--lang') + 1]      || '';
const period   = args[args.indexOf('--period') + 1]    || 'daily';
const minStars = parseInt(args[args.indexOf('--min-stars') + 1]) || 0;
const limit    = parseInt(args[args.indexOf('--limit') + 1])     || 10;

if (args.includes('--help') || args.includes('-h')) {
  console.log(`\n${CYAN}${BOLD}📈 trendpulse${NC} — GitHub Trending Viewer\n`);
  console.log(`Usage:`);
  console.log(`  node src/fetcher.js [options]\n`);
  console.log(`Options:`);
  console.log(`  --lang      <lang>   Filter by language (js, py, go, rs, ts...)`);
  console.log(`  --period    <p>      daily | weekly | monthly  (default: daily)`);
  console.log(`  --min-stars <n>      Minimum star count filter`);
  console.log(`  --limit     <n>      Number of results (default: 10)\n`);
  console.log(`Examples:`);
  console.log(`  node src/fetcher.js`);
  console.log(`  node src/fetcher.js --lang python --period weekly`);
  console.log(`  node src/fetcher.js --lang rust --min-stars 500 --limit 5\n`);
  process.exit(0);
}

fetchTrending({ lang, period, minStars, limit });
