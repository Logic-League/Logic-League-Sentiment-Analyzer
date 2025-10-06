class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [analysisHistory, setAnalysisHistory] = React.useState([]);
    const [currentAnalysis, setCurrentAnalysis] = React.useState(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [viewMode, setViewMode] = React.useState('single'); // 'single', 'bulk', or 'comparison'
    const [comparisonTexts, setComparisonTexts] = React.useState([]);
    const [selectedAnalyses, setSelectedAnalyses] = React.useState([]);
    const [bulkResults, setBulkResults] = React.useState([]);

    const handleTextAnalysis = async (text, label = '') => {
      if (!text.trim()) return;

      setIsAnalyzing(true);
      try {
        const result = await analyzeSentiment(text);
        const analysis = {
          id: Date.now(),
          text: text.trim(),
          label: label || `Text ${analysisHistory.length + 1}`,
          sentiment: result.sentiment,
          score: result.score,
          confidence: result.confidence,
          emotions: result.emotions,
          explanation: result.explanation,
          timestamp: new Date().toISOString()
        };

        setCurrentAnalysis(analysis);
        setAnalysisHistory(prev => [analysis, ...prev.slice(0, 19)]);
        
        if (viewMode === 'comparison') {
          setComparisonTexts(prev => [...prev, analysis]);
        }
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleBulkAnalysis = async (texts) => {
      if (!texts || texts.length === 0) return;

      setIsAnalyzing(true);
      setBulkResults([]);
      
      try {
        const results = [];
        for (let i = 0; i < texts.length; i++) {
          const text = texts[i].trim();
          if (!text) continue;

          const result = await analyzeSentiment(text);
          const analysis = {
            id: Date.now() + i,
            text: text,
            label: `Bulk Text ${i + 1}`,
            sentiment: result.sentiment,
            score: result.score,
            confidence: result.confidence,
            emotions: result.emotions,
            timestamp: new Date().toISOString()
          };

          results.push(analysis);
          setAnalysisHistory(prev => [analysis, ...prev.slice(0, 19)]);
        }
        setBulkResults(results);
      } catch (error) {
        console.error('Bulk analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100" data-name="app" data-file="app.js">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm w-fit border border-purple-100">
              <button
                onClick={() => setViewMode('single')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'single' 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                Single Analysis
              </button>
              <button
                onClick={() => setViewMode('bulk')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'bulk' 
                    ? 'bg-[var(--purple-accent)] text-white' 
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                Bulk Analysis
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'comparison' 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                Comparative Analysis
              </button>
            </div>
          </div>

          {viewMode === 'single' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                <TextInput 
                  onAnalyze={handleTextAnalysis}
                  isAnalyzing={isAnalyzing}
                />
                
                {currentAnalysis && (
                  <>
                    <SentimentResult analysis={currentAnalysis} />
                    <ExplanationPanel analysis={currentAnalysis} />
                  </>
                )}

                {/* Analysis Results Table */}
                {analysisHistory.length > 0 && (
                  <AnalysisResultsTable history={analysisHistory} />
                )}
              </div>

              {/* Analytics Section */}
              <div className="space-y-6">
                <ExportTools 
                  history={analysisHistory} 
                  currentAnalysis={currentAnalysis}
                />
                <VisualizationDashboard history={analysisHistory} />
                <HistoryPanel 
                  history={analysisHistory}
                  onSelectAnalysis={setSelectedAnalyses}
                />
              </div>
            </div>
          ) : viewMode === 'bulk' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <BulkTextInput 
                  onBulkAnalyze={handleBulkAnalysis}
                  isAnalyzing={isAnalyzing}
                  results={bulkResults}
                />
                
                {bulkResults.length > 0 && (
                  <div className="card border-l-4 border-l-[var(--accent-color)]">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="icon-check-circle text-xl text-[var(--accent-color)]"></div>
                      <h3 className="text-lg font-semibold">Bulk Analysis Complete</h3>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-700 mb-3">
                        Successfully analyzed <strong>{bulkResults.length} texts</strong>. 
                        View detailed results in the table below or export your data.
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">
                            {bulkResults.filter(r => r.sentiment === 'positive').length}
                          </div>
                          <div className="text-xs text-gray-600">Positive</div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-lg font-bold text-red-600">
                            {bulkResults.filter(r => r.sentiment === 'negative').length}
                          </div>
                          <div className="text-xs text-gray-600">Negative</div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-lg font-bold text-gray-600">
                            {bulkResults.filter(r => r.sentiment === 'neutral').length}
                          </div>
                          <div className="text-xs text-gray-600">Neutral</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {analysisHistory.length > 0 && (
                  <AnalysisResultsTable history={analysisHistory} />
                )}
              </div>

              <div className="space-y-6">
                <ExportTools 
                  history={analysisHistory} 
                  currentAnalysis={currentAnalysis}
                />
                <VisualizationDashboard history={analysisHistory} />
                <HistoryPanel 
                  history={analysisHistory}
                  onSelectAnalysis={setSelectedAnalyses}
                />
              </div>
            </div>
          ) : (
            <ComparisonView 
              onAnalyze={handleTextAnalysis}
              isAnalyzing={isAnalyzing}
              comparisons={comparisonTexts}
              onClearComparisons={() => setComparisonTexts([])}
            />
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2025 Sentiment Analyzer. Advanced text emotion analysis.</p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);