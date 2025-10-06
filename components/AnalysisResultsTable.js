function AnalysisResultsTable({ history }) {
  try {
    if (history.length === 0) {
      return (
        <div className="card" data-name="analysis-results-table" data-file="components/AnalysisResultsTable.js">
          <div className="flex items-center space-x-2 mb-4">
            <div className="icon-table text-xl text-[var(--primary-color)]"></div>
            <h3 className="text-lg font-semibold">Analysis Results Table</h3>
          </div>
          <div className="text-center py-6 text-gray-500">
            <div className="icon-table text-2xl text-gray-300 mb-2"></div>
            <p className="text-sm">No analysis results yet. Run some analyses to see detailed comparisons.</p>
          </div>
        </div>
      );
    }

    const getKeyInsights = (analysis) => {
      const dominantEmotion = Object.entries(analysis.emotions)
        .reduce((a, b) => a[1] > b[1] ? a : b);
      
      const confidenceLevel = analysis.confidence > 0.8 ? 'High' : 
                             analysis.confidence > 0.6 ? 'Medium' : 'Low';
      
      return {
        dominantEmotion: dominantEmotion[0],
        emotionScore: dominantEmotion[1],
        confidenceLevel,
        keyReason: analysis.score > 0.5 ? 'Strong positive indicators' :
                  analysis.score < -0.5 ? 'Strong negative indicators' :
                  'Neutral or mixed sentiment'
      };
    };

    const getSentimentIcon = (sentiment) => {
      switch (sentiment) {
        case 'positive': return 'icon-smile';
        case 'negative': return 'icon-frown';
        default: return 'icon-minus';
      }
    };

    const getSentimentColor = (sentiment) => {
      switch (sentiment) {
        case 'positive': return 'text-green-600 bg-green-50';
        case 'negative': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    return (
      <div className="card" data-name="analysis-results-table" data-file="components/AnalysisResultsTable.js">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="icon-table text-xl text-[var(--primary-color)]"></div>
            <h3 className="text-lg font-semibold">Analysis Results Overview</h3>
          </div>
          <span className="text-sm text-gray-500">{history.length} analyses</span>
        </div>

        {/* Export Bar */}
        <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Export Your Results:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.exportToCSV && window.exportToCSV(history)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                CSV
              </button>
              <button
                onClick={() => window.exportToJSON && window.exportToJSON(history)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                JSON
              </button>
              <button
                onClick={() => window.exportToPDF && window.exportToPDF(history)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                PDF
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold">#</th>
                <th className="text-left py-3 px-2 font-semibold">Text Preview</th>
                <th className="text-center py-3 px-2 font-semibold">Sentiment</th>
                <th className="text-center py-3 px-2 font-semibold">Score</th>
                <th className="text-center py-3 px-2 font-semibold">Confidence</th>
                <th className="text-left py-3 px-2 font-semibold">Dominant Emotion</th>
                <th className="text-left py-3 px-2 font-semibold">Key Insights</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 10).map((analysis, index) => {
                const insights = getKeyInsights(analysis);
                return (
                  <tr key={analysis.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2 font-medium text-gray-600">
                      {index + 1}
                    </td>
                    <td className="py-4 px-2 max-w-xs">
                      <p className="text-gray-800 line-clamp-2 leading-relaxed">
                        {analysis.text.length > 80 
                          ? `${analysis.text.substring(0, 80)}...` 
                          : analysis.text
                        }
                      </p>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSentimentColor(analysis.sentiment)}`}>
                          <div className={`${getSentimentIcon(analysis.sentiment)} text-sm`}></div>
                        </div>
                        <span className="capitalize font-medium">{analysis.sentiment}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className={`font-mono font-bold ${
                        analysis.score > 0 ? 'text-green-600' : 
                        analysis.score < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {analysis.score > 0 ? '+' : ''}{analysis.score.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          insights.confidenceLevel === 'High' ? 'bg-green-500' :
                          insights.confidenceLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">
                          {(analysis.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{insights.confidenceLevel}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="font-medium capitalize text-gray-800">
                          {insights.dominantEmotion}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${insights.emotionScore * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {(insights.emotionScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {insights.keyReason}
                      </p>
                      <span className="text-xs text-blue-600 font-medium">
                        {insights.confidenceLevel} confidence analysis
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {history.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing latest 10 results. Total: {history.length} analyses
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('AnalysisResultsTable component error:', error);
    return null;
  }
}