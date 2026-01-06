async function fetchJSON(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers)
    }
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatPercent(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
}

async function loadSummary() {
  const summary = await fetchJSON('/api/creator/summary');

  document.getElementById('metric-earnings').textContent =
    formatCurrency(summary.earningsThisMonth);
  document.getElementById('metric-subs').textContent =
    summary.subscribers.toLocaleString('en-US');
  document.getElementById('metric-tips').textContent =
    formatCurrency(summary.tips);
  document.getElementById('metric-ppv').textContent =
    formatCurrency(summary.ppvRevenue);
  document.getElementById('metric-store').textContent =
    formatCurrency(summary.storefrontRevenue);

  const growth = document.getElementById('metric-subs-growth');
  growth.textContent = `(${formatPercent(summary.subscribersGrowth)} vs last month)`;
}

async function loadForecast() {
  const forecast = await fetchJSON('/api/earnings/forecast');

  document.getElementById('forecast-current').textContent =
    formatCurrency(forecast.currentMonthlyNet);
  document.getElementById('forecast-12m').textContent =
    formatCurrency(forecast.forecast12Months);
  document.getElementById('forecast-ai').textContent =
    formatCurrency(forecast.forecastWithAiBoost);

  const note = document.getElementById('forecast-note');
  note.textContent = `AI optimization boost factor: x${forecast.aiBoostFactor.toFixed(2)} on projected revenue.`;
}

async function loadAiInsights() {
  const insights = await fetchJSON('/api/ai/insights');
  const container = document.getElementById('ai-insights');

  const bestTimes = insights.bestPostingTimes.join(', ');
  const churn = insights.churnRiskPercent.toFixed(1);

  container.innerHTML = `
    <p><strong>Best posting times:</strong> ${bestTimes}</p>
    <p><strong>Churn risk:</strong> ${churn}%</p>
    <p><strong>High-value fans:</strong> ${insights.highValueFansCount}</p>
    <p><strong>Recommended content types:</strong> ${insights.recommendedContentTypes.join(', ')}</p>
    <p><strong>AI notes:</strong></p>
    <ul>
      ${insights.notes.map((n) => `<li>${n}</li>`).join('')}
    </ul>
  `;
}

async function loadContentPerformance() {
  const content = await fetchJSON('/api/content/performance');
  const list = document.getElementById('content-list');

  list.innerHTML = content
    .map(
      (item) => `
      <div class="content-item">
        <div class="content-title">${item.title}</div>
        <div class="content-metrics">
          ${item.views.toLocaleString('en-US')} views •
          ${item.likes.toLocaleString('en-US')} likes •
          ${item.comments.toLocaleString('en-US')} comments •
          ${formatCurrency(item.tips)} tips
        </div>
      </div>
    `
    )
    .join('');
}

function setupCaptionGenerator() {
  const btn = document.getElementById('caption-generate');
  const input = document.getElementById('caption-input');
  const output = document.getElementById('caption-output');

  btn.addEventListener('click', async () => {
    const summary = input.value.trim();
    output.textContent = 'Generating...';

    try {
      const res = await fetchJSON('/api/ai/caption', {
        method: 'POST',
        body: JSON.stringify({ summary })
      });
      output.textContent = res.caption;
    } catch (err) {
      console.error(err);
      output.textContent = 'Error generating caption. Please try again.';
    }
  });
}

async function init() {
  try {
    await Promise.all([
      loadSummary(),
      loadForecast(),
      loadAiInsights(),
      loadContentPerformance()
    ]);
    setupCaptionGenerator();
  } catch (err) {
    console.error('Error initializing demo:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
