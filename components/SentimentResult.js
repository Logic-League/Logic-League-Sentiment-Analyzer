function SentimentResult({ analysis }) {
  try {
    if (!analysis) return null;

    const getSentimentColor = (sentiment) => {
      switch (sentiment) {
        case 'positive': return 'text-green-600 bg-green-50 border-green-200';
        case 'negative': return 'text-red-600 bg-red-50 border-red-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };

    const getSentimentIcon = (sentiment) => {
      switch (sentiment) {
        case 'positive': return 'icon-smile';
        case 'negative': return 'icon-frown';
        default: return 'icon-minus';
      }
    };

    const getScoreColor = (score) => {
      if (score > 0.6) return 'text-green-600';
      if (score < -0.6) return 'text-red-600';
      return 'text-gray-600';
    };

    return (
      <div className="card" data-name="sentiment-result" data-file="components/SentimentResult.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-target text-xl text-[var(--primary-color)]"></div>
          <h3 className="text-xl font-semibold">Analysis Results</h3>
        </div>

        <div className="space-y-6">
          {/* Sentiment Overview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getSentimentColor(analysis.sentiment)}`}>
                <div className={`${getSentimentIcon(analysis.sentiment)} text-xl`}></div>
              </div>
              <div>
                <h4 className="font-semibold text-lg capitalize">{analysis.sentiment}</h4>
                <p className="text-sm text-gray-600">
                  Confidence: {(analysis.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score > 0 ? '+' : ''}{analysis.score.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Sentiment Score</p>
            </div>
          </div>

          {/* Analyzed Text */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-sm text-gray-700 mb-2">Analyzed Text:</h5>
            <p className="text-gray-800 text-sm leading-relaxed">
              {analysis.text}
            </p>
          </div>

          {/* Emotion Breakdown */}
          <div>
            <h5 className="font-medium text-sm text-gray-700 mb-3">Emotion Breakdown:</h5>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(analysis.emotions).map(([emotion, score]) => (
                <div key={emotion} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium capitalize">{emotion}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{(score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Analysis completed at {new Date(analysis.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SentimentResult component error:', error);
    return null;
  }
}