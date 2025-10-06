function BulkTextInput({ onBulkAnalyze, isAnalyzing, results }) {
  try {
    const [textInputs, setTextInputs] = React.useState(['', '', '']);
    const [bulkText, setBulkText] = React.useState('');
    const [inputMode, setInputMode] = React.useState('individual'); // 'individual' or 'paste'

    const handleIndividualChange = (index, value) => {
      const newInputs = [...textInputs];
      newInputs[index] = value;
      setTextInputs(newInputs);
    };

    const addTextInput = () => {
      if (textInputs.length < 10) {
        setTextInputs([...textInputs, '']);
      }
    };

    const removeTextInput = (index) => {
      if (textInputs.length > 1) {
        setTextInputs(textInputs.filter((_, i) => i !== index));
      }
    };

    const handleBulkSubmit = () => {
      if (inputMode === 'individual') {
        const validTexts = textInputs.filter(text => text.trim());
        if (validTexts.length > 0) {
          onBulkAnalyze(validTexts);
          // Clear all text inputs after submission
          setTextInputs(['', '', '']);
        }
      } else {
        const texts = bulkText.split('\n').filter(text => text.trim());
        if (texts.length > 0) {
          onBulkAnalyze(texts);
          // Clear bulk text after submission
          setBulkText('');
        }
      }
    };

    const loadSampleTexts = () => {
      const samples = [
        "Amazing product with excellent quality and fast delivery!",
        "Terrible experience, very disappointed with the service.",
        "The item is okay, nothing special but does the job.",
        "Outstanding customer support, highly recommend this company!",
        "Poor quality materials, broke after just one week of use."
      ];
      
      if (inputMode === 'individual') {
        setTextInputs(samples.slice(0, Math.min(samples.length, textInputs.length)));
      } else {
        setBulkText(samples.join('\n'));
      }
    };

    const hasValidTexts = inputMode === 'individual' 
      ? textInputs.some(text => text.trim())
      : bulkText.trim();

    return (
      <div className="card border-l-4 border-l-[var(--purple-accent)]" data-name="bulk-text-input" data-file="components/BulkTextInput.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-layers text-xl text-[var(--purple-accent)]"></div>
          <h2 className="text-xl font-semibold">Bulk Sentiment Analysis</h2>
        </div>

        {/* Input Mode Toggle */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 bg-purple-50 p-2 rounded-lg w-fit">
            <button
              onClick={() => setInputMode('individual')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                inputMode === 'individual' 
                  ? 'bg-[var(--purple-accent)] text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              Individual Inputs
            </button>
            <button
              onClick={() => setInputMode('paste')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                inputMode === 'paste' 
                  ? 'bg-[var(--purple-accent)] text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              Paste & Split
            </button>
          </div>
        </div>

        {inputMode === 'individual' ? (
          <div className="space-y-4">
            {textInputs.map((text, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => handleIndividualChange(index, e.target.value)}
                    placeholder={`Text ${index + 1} for analysis...`}
                    className="w-full h-20 p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {text.length}/500 characters
                  </div>
                </div>
                {textInputs.length > 1 && (
                  <button
                    onClick={() => removeTextInput(index)}
                    className="mt-3 text-red-500 hover:text-red-700"
                  >
                    <div className="icon-x text-sm"></div>
                  </button>
                )}
              </div>
            ))}
            
            {textInputs.length < 10 && (
              <button
                onClick={addTextInput}
                className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="icon-plus text-sm"></div>
                  <span className="text-sm">Add Another Text</span>
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Paste multiple texts here (one per line)&#10;&#10;Example:&#10;Great product, love it!&#10;Not satisfied with the quality&#10;Average experience, nothing special"
              className="w-full h-48 p-4 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500">
              Enter each text on a new line • {bulkText.split('\n').filter(t => t.trim()).length} texts detected
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBulkSubmit}
            disabled={!hasValidTexts || isAnalyzing}
            className="btn btn-primary bg-[var(--purple-accent)] hover:bg-purple-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <div className="icon-zap text-sm"></div>
                <span>Analyze All Texts</span>
              </>
            )}
          </button>
          
          <button
            onClick={loadSampleTexts}
            className="btn btn-secondary"
          >
            Load Sample Texts
          </button>
        </div>


      </div>
    );
  } catch (error) {
    console.error('BulkTextInput component error:', error);
    return null;
  }
}