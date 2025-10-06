function ComparisonView({ onAnalyze, isAnalyzing, comparisons, onClearComparisons }) {
  try {
    const [texts, setTexts] = React.useState(['', '']);
    const [labels, setLabels] = React.useState(['Text A', 'Text B']);

    const handleAnalyzeAll = async () => {
      for (let i = 0; i < texts.length; i++) {
        if (texts[i].trim()) {
          await onAnalyze(texts[i], labels[i]);
        }
      }
      // Clear all text inputs after analysis
      setTexts(['', '']);
      setLabels(['Text A', 'Text B']);
    };

    const addTextInput = () => {
      if (texts.length < 4) {
        setTexts([...texts, '']);
        setLabels([...labels, `Text ${String.fromCharCode(65 + texts.length)}`]);
      }
    };

    const removeTextInput = (index) => {
      if (texts.length > 2) {
        setTexts(texts.filter((_, i) => i !== index));
        setLabels(labels.filter((_, i) => i !== index));
      }
    };

    return (
      <div className="space-y-8" data-name="comparison-view" data-file="components/ComparisonView.js">
        {/* Input Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="icon-git-compare text-xl text-[var(--primary-color)]"></div>
              <h2 className="text-xl font-semibold">Comparative Analysis</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={addTextInput}
                disabled={texts.length >= 4}
                className="btn btn-secondary text-sm disabled:opacity-50"
              >
                Add Text
              </button>
              <button
                onClick={onClearComparisons}
                disabled={comparisons.length === 0}
                className="btn btn-secondary text-sm disabled:opacity-50"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="grid gap-4 mb-6">
            {texts.map((text, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={labels[index]}
                    onChange={(e) => {
                      const newLabels = [...labels];
                      newLabels[index] = e.target.value;
                      setLabels(newLabels);
                    }}
                    className="text-sm font-medium bg-transparent border-b border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                  {texts.length > 2 && (
                    <button
                      onClick={() => removeTextInput(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <div className="icon-x text-sm"></div>
                    </button>
                  )}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => {
                    const newTexts = [...texts];
                    newTexts[index] = e.target.value;
                    setTexts(newTexts);
                  }}
                  placeholder={`Enter ${labels[index]} for comparison...`}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyzeAll}
            disabled={isAnalyzing || !texts.some(t => t.trim())}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Compare All Texts'}
          </button>
        </div>

        {/* Results Section */}
        {comparisons.length > 0 && (
          <div className="space-y-6">
            {/* Summary Comparison */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Comparison Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Text</th>
                      <th className="text-center py-2">Sentiment</th>
                      <th className="text-center py-2">Score</th>
                      <th className="text-center py-2">Confidence</th>
                      <th className="text-center py-2">Dominant Emotion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((analysis, index) => {
                      const dominantEmotion = Object.entries(analysis.emotions)
                        .reduce((a, b) => a[1] > b[1] ? a : b);
                      
                      return (
                        <tr key={analysis.id} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{analysis.label}</td>
                          <td className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {analysis.sentiment}
                            </span>
                          </td>
                          <td className="text-center font-mono">
                            {analysis.score > 0 ? '+' : ''}{analysis.score.toFixed(2)}
                          </td>
                          <td className="text-center">
                            {(analysis.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="text-center capitalize">
                            {dominantEmotion[0]} ({(dominantEmotion[1] * 100).toFixed(0)}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid gap-6 md:grid-cols-2">
              {comparisons.map((analysis) => (
                <div key={analysis.id} className="card">
                  <h4 className="font-semibold mb-3">{analysis.label}</h4>
                  <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                    {analysis.text.substring(0, 100)}...
                  </div>
                  <div className="space-y-2">
                    {Object.entries(analysis.emotions).map(([emotion, score]) => (
                      <div key={emotion} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{emotion}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-8">
                            {(score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ComparisonView component error:', error);
    return null;
  }
}