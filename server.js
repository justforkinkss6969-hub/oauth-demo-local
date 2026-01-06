const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ----- Mock data for investor demo -----

const creatorSummary = {
  creatorId: 'demo-creator-001',
  name: 'Demo Creator',
  earningsThisMonth: 3240,
  subscribers: 1482,
  subscribersGrowth: 0.14,
  tips: 410,
  ppvRevenue: 620,
  storefrontRevenue: 480
};

const aiInsights = {
  bestPostingTimes: ['8:00 PM CST', '11:00 AM CST'],
  churnRiskPercent: 3.2,
  highValueFansCount: 12,
  recommendedContentTypes: ['Behind-the-scenes', 'Short teasers', 'Weekly live Q&A'],
  notes: [
    'Posts with behind-the-scenes content have 27% higher engagement.',
    'Short teaser clips drive 18% more new subscribers.',
    'Livestreams scheduled at 8 PM CST perform 35% better than other times.'
  ]
};

const contentPerformance = [
  { id: 'post-1', title: 'Morning Routine', views: 1240, likes: 420, comments: 82, tips: 160 },
  { id: 'post-2', title: 'Weekend Drop', views: 980, likes: 350, comments: 57, tips: 120 },
  { id: 'post-3', title: 'Livestream Replay', views: 720, likes: 295, comments: 41, tips: 90 }
];

const earningsForecast = {
  currentMonthlyNet: 3240,
  forecast12Months: 12400,
  forecastWithAiBoost: 14260,
  aiBoostFactor: 1.15
};

// ----- API endpoints -----

app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/creator/summary', (_req, res) => res.json(creatorSummary));
app.get('/api/ai/insights', (_req, res) => res.json(aiInsights));
app.get('/api/content/performance', (_req, res) => res.json(contentPerformance));
app.get('/api/earnings/forecast', (_req, res) => res.json(earningsForecast));

app.post('/api/ai/caption', (req, res) => {
  const { summary } = req.body || {};
  const base = summary && summary.trim().length > 0 ? summary.trim() : 'New drop';
  res.json({ caption: `${base} is live on CreatorSphere. Tap in to unlock your universe.` });
});

// ----- Serve frontend -----
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

function start(port = PORT) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`CreatorSphere demo running at http://localhost:${port}`);
      resolve(server);
    });
    server.on('error', (err) => reject(err));
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = { app, start };
