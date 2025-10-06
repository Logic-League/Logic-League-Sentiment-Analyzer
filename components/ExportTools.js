function ExportTools({ history, currentAnalysis }) {
  try {
    const [isExporting, setIsExporting] = React.useState(false);

    const handleExport = async (format) => {
      setIsExporting(true);
      try {
        switch (format) {
          case 'csv':
            await exportToCSV(history);
            break;
          case 'json':
            await exportToJSON(history);
            break;
          case 'pdf':
            await exportToPDF(history, currentAnalysis);
            break;
        }
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        setIsExporting(false);
      }
    };

    const hasData = history.length > 0 || currentAnalysis;

    return (
      <div className="card" data-name="export-tools" data-file="components/ExportTools.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-download text-xl text-[var(--primary-color)]"></div>
          <h3 className="text-lg font-semibold">Export Results</h3>
        </div>

        {!hasData ? (
          <div className="text-center py-6 text-gray-500">
            <div className="icon-download text-2xl text-gray-300 mb-2"></div>
            <p className="text-sm">No data to export yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="w-full btn btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <div className="icon-file-text text-sm"></div>
              <span>Export as CSV</span>
            </button>

            <button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              className="w-full btn btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <div className="icon-code text-sm"></div>
              <span>Export as JSON</span>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="w-full btn btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <div className="icon-file text-sm"></div>
              <span>Export as PDF</span>
            </button>

            {isExporting && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Exporting...</span>
              </div>
            )}


          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ExportTools component error:', error);
    return null;
  }
}