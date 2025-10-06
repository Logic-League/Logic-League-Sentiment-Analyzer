function AnalyticsChart({ history }) {
  try {
    const chartRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);

    React.useEffect(() => {
      if (!chartRef.current || history.length === 0) return;

      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Calculate sentiment distribution
      const sentimentCounts = history.reduce((acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
      }, {});

      const data = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [{
          data: [
            sentimentCounts.positive || 0,
            sentimentCounts.negative || 0,
            sentimentCounts.neutral || 0
          ],
          backgroundColor: [
            '#10b981',
            '#ef4444',
            '#6b7280'
          ],
          borderWidth: 0
        }]
      };

      chartInstanceRef.current = new window.ChartJS(ctx, {
        type: 'doughnut',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, [history]);

    if (history.length === 0) {
      return (
        <div className="card text-center" data-name="analytics-chart" data-file="components/AnalyticsChart.js">
          <div className="flex items-center space-x-2 mb-4">
            <div className="icon-chart-bar text-xl text-[var(--primary-color)]"></div>
            <h3 className="text-lg font-semibold">Analytics</h3>
          </div>
          <div className="py-8 text-gray-500">
            <div className="icon-chart-bar text-3xl text-gray-300 mb-2"></div>
            <p>No data yet. Start analyzing text to see insights.</p>
          </div>
        </div>
      );
    }

    const sentimentCounts = history.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="card" data-name="analytics-chart" data-file="components/AnalyticsChart.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-chart-bar text-xl text-[var(--primary-color)]"></div>
          <h3 className="text-lg font-semibold">Sentiment Distribution</h3>
        </div>

        <div className="h-48 mb-4">
          <canvas ref={chartRef}></canvas>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Positive</span>
            </div>
            <span className="text-sm font-medium">{sentimentCounts.positive || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Negative</span>
            </div>
            <span className="text-sm font-medium">{sentimentCounts.negative || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Neutral</span>
            </div>
            <span className="text-sm font-medium">{sentimentCounts.neutral || 0}</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AnalyticsChart component error:', error);
    return null;
  }
}