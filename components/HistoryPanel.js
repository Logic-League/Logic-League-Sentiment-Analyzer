function HistoryPanel({ history }) {
  try {
    const getSentimentIcon = (sentiment) => {
      switch (sentiment) {
        case 'positive': return 'icon-smile';
        case 'negative': return 'icon-frown';
        default: return 'icon-minus';
      }
    };

    const getSentimentColor = (sentiment) => {
      switch (sentiment) {
        case 'positive': return 'text-green-600';
        case 'negative': return 'text-red-600';
        default: return 'text-gray-600';
      }
    };

    if (history.length === 0) {
      return (
        <div className="card" data-name="history-panel" data-file="components/HistoryPanel.js">
          <div className="flex items-center space-x-2 mb-4">
            <div className="icon-clock text-xl text-[var(--primary-color)]"></div>
            <h3 className="text-lg font-semibold">Recent Analysis</h3>
          </div>
          <div className="text-center py-6 text-gray-500">
            <div className="icon-clock text-2xl text-gray-300 mb-2"></div>
            <p className="text-sm">Your analysis history will appear here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card" data-name="history-panel" data-file="components/HistoryPanel.js">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="icon-clock text-xl text-[var(--primary-color)]"></div>
            <h3 className="text-lg font-semibold">Recent Analysis</h3>
          </div>
          <span className="text-xs text-gray-500">{history.length} total</span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`${getSentimentIcon(item.sentiment)} text-sm ${getSentimentColor(item.sentiment)}`}></div>
                  <span className={`text-xs font-medium capitalize ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                {item.text.length > 60 ? `${item.text.substring(0, 60)}...` : item.text}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Score: {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                </span>
                <span className="text-xs text-gray-600">
                  {(item.confidence * 100).toFixed(0)}% confident
                </span>
              </div>
            </div>
          ))}
        </div>

        {history.length >= 10 && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">Showing latest 10 analyses</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('HistoryPanel component error:', error);
    return null;
  }
}