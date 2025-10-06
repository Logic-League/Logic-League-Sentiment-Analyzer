function TextInput({ onAnalyze, isAnalyzing }) {
  try {
    const [text, setText] = React.useState('');
    const [sampleIndex, setSampleIndex] = React.useState(0);

    const sampleTexts = [
      "I absolutely love this new product! The quality is outstanding and the customer service was exceptional. Best purchase I've made this year!",
      "This experience was terrible and disappointing. The service was incredibly slow, staff seemed uninterested in helping, and I felt completely ignored.",
      "The product works as expected. It's decent quality for the price point. Nothing amazing but does what it's supposed to do.",
      "I'm so excited about this opportunity! This could be the breakthrough we've been waiting for. Can't wait to see what happens next!",
      "I'm deeply concerned about the recent changes. The new policy seems unfair and I'm worried about how it will affect everyone involved."
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      if (text.trim() && !isAnalyzing) {
        onAnalyze(text);
        setText(''); // Clear the text after analysis
      }
    };

    const loadSample = () => {
      setText(sampleTexts[sampleIndex]);
      setSampleIndex((prev) => (prev + 1) % sampleTexts.length);
    };

    return (
      <div className="card" data-name="text-input" data-file="components/TextInput.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-message-square text-xl text-[var(--primary-color)]"></div>
          <h2 className="text-xl font-semibold">Analyze Text Sentiment</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text to analyze (reviews, social media posts, feedback, etc.)
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here for sentiment analysis..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">{text.length}/2000 characters</span>
              <button
                type="button"
                onClick={loadSample}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Load sample text
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!text.trim() || isAnalyzing}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <div className="icon-search text-sm"></div>
                  <span>Analyze Sentiment</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setText('')}
              className="btn btn-secondary"
              disabled={!text}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('TextInput component error:', error);
    return null;
  }
}