function ExplanationPanel({ analysis }) {
  try {
    if (!analysis) return null;

    const getKeyPhrases = (text) => {
      // Simple keyword extraction for demonstration
      const positiveWords = ['love', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'best', 'perfect'];
      const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'disappointing', 'poor', 'failed'];
      
      const words = text.toLowerCase().split(/\W+/);
      const foundPositive = words.filter(word => positiveWords.includes(word));
      const foundNegative = words.filter(word => negativeWords.includes(word));
      
      return { positive: foundPositive, negative: foundNegative };
    };

    const keyPhrases = getKeyPhrases(analysis.text);

    const getScoreInterpretation = (score) => {
      if (score >= 0.7) return { level: 'Very Positive', color: 'text-green-700', desc: 'Strong positive sentiment detected' };
      if (score >= 0.3) return { level: 'Positive', color: 'text-green-600', desc: 'Moderate positive sentiment' };
      if (score >= -0.3) return { level: 'Neutral', color: 'text-gray-600', desc: 'Balanced or neutral tone' };
      if (score >= -0.7) return { level: 'Negative', color: 'text-red-600', desc: 'Moderate negative sentiment' };
      return { level: 'Very Negative', color: 'text-red-700', desc: 'Strong negative sentiment detected' };
    };

    const scoreInterpretation = getScoreInterpretation(analysis.score);

    return (
      <div className="card" data-name="explanation-panel" data-file="components/ExplanationPanel.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-lightbulb text-xl text-[var(--primary-color)]"></div>
          <h3 className="text-xl font-semibold">Analysis Explanation</h3>
        </div>

        <div className="space-y-6">
          {/* Score Interpretation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Score Interpretation</h4>
            <div className="flex items-center justify-between">
              <div>
                <span className={`font-semibold ${scoreInterpretation.color}`}>
                  {scoreInterpretation.level}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {scoreInterpretation.desc}
                </p>
              </div>
              <div className={`text-2xl font-bold ${scoreInterpretation.color}`}>
                {analysis.score > 0 ? '+' : ''}{analysis.score.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Key Phrases */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Key Phrases Detected</h4>
            <div className="space-y-3">
              {keyPhrases.positive.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-green-700 block mb-2">
                    Positive indicators:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {keyPhrases.positive.map((word, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {keyPhrases.negative.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-red-700 block mb-2">
                    Negative indicators:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {keyPhrases.negative.map((word, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {keyPhrases.positive.length === 0 && keyPhrases.negative.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No obvious positive or negative keywords detected. Analysis based on context and tone.
                </p>
              )}
            </div>
          </div>

          {/* Confidence Factors */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Confidence Factors</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Text Length</span>
                <span className={analysis.text.length > 50 ? 'text-green-600' : 'text-yellow-600'}>
                  {analysis.text.length > 50 ? 'Sufficient' : 'Limited'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Clear Sentiment Indicators</span>
                <span className={keyPhrases.positive.length + keyPhrases.negative.length > 0 ? 'text-green-600' : 'text-yellow-600'}>
                  {keyPhrases.positive.length + keyPhrases.negative.length > 0 ? 'Present' : 'Subtle'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Overall Confidence</span>
                <span className={analysis.confidence > 0.8 ? 'text-green-600' : analysis.confidence > 0.6 ? 'text-yellow-600' : 'text-red-600'}>
                  {(analysis.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Emotion Context */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Emotional Context</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              The analysis detected {analysis.sentiment} sentiment primarily driven by{' '}
              {Object.entries(analysis.emotions)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 2)
                .map(([emotion, score]) => `${emotion} (${(score * 100).toFixed(0)}%)`)
                .join(' and ')
              } emotions.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ExplanationPanel component error:', error);
    return null;
  }
}