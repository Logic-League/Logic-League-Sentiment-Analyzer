function VisualizationDashboard({ history }) {
  try {
    const sentimentChartRef = React.useRef(null);
    const emotionChartRef = React.useRef(null);
    const timelineChartRef = React.useRef(null);
    const chartInstances = React.useRef({});

    React.useEffect(() => {
      if (history.length === 0) return;

      // Destroy existing charts
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });

      createSentimentChart();
      createEmotionChart();
      createTimelineChart();

      return () => {
        Object.values(chartInstances.current).forEach(chart => {
          if (chart) chart.destroy();
        });
      };
    }, [history]);

    const createSentimentChart = () => {
      if (!sentimentChartRef.current) return;

      const ctx = sentimentChartRef.current.getContext('2d');
      const sentimentCounts = history.reduce((acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
      }, {});

      chartInstances.current.sentiment = new window.ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Positive', 'Negative', 'Neutral'],
          datasets: [{
            data: [
              sentimentCounts.positive || 0,
              sentimentCounts.negative || 0,
              sentimentCounts.neutral || 0
            ],
            backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    };

    const createEmotionChart = () => {
      if (!emotionChartRef.current) return;

      const ctx = emotionChartRef.current.getContext('2d');
      const emotionAverages = history.reduce((acc, item) => {
        Object.entries(item.emotions).forEach(([emotion, score]) => {
          acc[emotion] = (acc[emotion] || 0) + score;
        });
        return acc;
      }, {});

      Object.keys(emotionAverages).forEach(emotion => {
        emotionAverages[emotion] /= history.length;
      });

      chartInstances.current.emotion = new window.ChartJS(ctx, {
        type: 'radar',
        data: {
          labels: Object.keys(emotionAverages),
          datasets: [{
            label: 'Average Emotions',
            data: Object.values(emotionAverages),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            pointBackgroundColor: '#2563eb'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 1
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    };

    const createTimelineChart = () => {
      if (!timelineChartRef.current || history.length < 2) return;

      const ctx = timelineChartRef.current.getContext('2d');
      const timelineData = history.slice().reverse().map((item, index) => ({
        x: index + 1,
        y: item.score
      }));

      chartInstances.current.timeline = new window.ChartJS(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Sentiment Score',
            data: timelineData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: -1,
              max: 1
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    };

    if (history.length === 0) {
      return (
        <div className="card" data-name="visualization-dashboard" data-file="components/VisualizationDashboard.js">
          <div className="flex items-center space-x-2 mb-4">
            <div className="icon-chart-bar text-xl text-[var(--primary-color)]"></div>
            <h3 className="text-lg font-semibold">Visualization Dashboard</h3>
          </div>
          <div className="text-center py-8 text-gray-500">
            <div className="icon-chart-bar text-3xl text-gray-300 mb-2"></div>
            <p>Start analyzing to see visualizations</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6" data-name="visualization-dashboard" data-file="components/VisualizationDashboard.js">
        {/* Sentiment Distribution */}
        <div className="card">
          <h4 className="font-medium mb-3">Sentiment Distribution</h4>
          <div className="h-32">
            <canvas ref={sentimentChartRef}></canvas>
          </div>
        </div>

        {/* Emotion Analysis */}
        <div className="card">
          <h4 className="font-medium mb-3">Emotion Profile</h4>
          <div className="h-32">
            <canvas ref={emotionChartRef}></canvas>
          </div>
        </div>

        {/* Timeline */}
        {history.length >= 2 && (
          <div className="card">
            <h4 className="font-medium mb-3">Sentiment Timeline</h4>
            <div className="h-32">
              <canvas ref={timelineChartRef}></canvas>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('VisualizationDashboard component error:', error);
    return null;
  }
}
