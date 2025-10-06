function Header() {
  try {
    return (
      <header className="text-white" style={{ background: 'var(--purple-gradient)' }} data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-25 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="icon-brain text-xl text-purple-600"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-shadow">Sentiment Analyzer</h1>
                <p className="text-purple-100 text-sm">AI-powered text emotion analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-purple-100">
                <div className="icon-zap text-lg"></div>
                <span className="text-sm">Hugging Face API</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}