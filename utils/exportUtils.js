// Export utilities for analysis results
window.exportToCSV = async function exportToCSV(history) {
  try {
    if (!history || history.length === 0) {
      throw new Error('No data to export');
    }

    const headers = [
      'Timestamp', 'Text', 'Sentiment', 'Score', 'Confidence',
      'Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Trust'
    ];

    const rows = history.map(item => [
      new Date(item.timestamp).toLocaleString(),
      `"${item.text.replace(/"/g, '""')}"`,
      item.sentiment,
      item.score,
      item.confidence,
      item.emotions.joy || 0,
      item.emotions.sadness || 0,
      item.emotions.anger || 0,
      item.emotions.fear || 0,
      item.emotions.surprise || 0,
      item.emotions.trust || 0
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    downloadFile(csvContent, 'sentiment-analysis.csv', 'text/csv');
  } catch (error) {
    console.error('CSV export failed:', error);
    throw error;
  }
}

window.exportToJSON = async function exportToJSON(history) {
  try {
    if (!history || history.length === 0) {
      throw new Error('No data to export');
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalAnalyses: history.length,
      analyses: history.map(item => ({
        id: item.id,
        timestamp: item.timestamp,
        text: item.text,
        sentiment: item.sentiment,
        score: item.score,
        confidence: item.confidence,
        emotions: item.emotions
      }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, 'sentiment-analysis.json', 'application/json');
  } catch (error) {
    console.error('JSON export failed:', error);
    throw error;
  }
}

window.exportToPDF = async function exportToPDF(history, currentAnalysis) {
  try {
    // Simple PDF export using HTML content
    const pdfContent = generatePDFContent(history, currentAnalysis);
    
    // Create a blob and download as HTML file that can be printed as PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment-analysis-report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    // Also try to open in new window for printing if possible
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (windowError) {
      // Ignore window.open errors, file download will still work
      console.log('Print window blocked, but HTML file downloaded successfully');
    }
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

function generatePDFContent(history, currentAnalysis) {
  const sentimentStats = history.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {});

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sentiment Analysis Report</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; background: #f8fafc; padding: 20px; border-radius: 8px; }
        .stat-item { text-align: center; }
        .stat-item h3 { margin: 0; color: #1e293b; }
        .stat-item p { font-size: 24px; font-weight: bold; margin: 5px 0; color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #e2e8f0; padding: 12px 8px; text-align: left; }
        th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .current-analysis { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .current-analysis h2 { color: #1e293b; margin-top: 0; }
        .sentiment-positive { color: #059669; font-weight: bold; }
        .sentiment-negative { color: #dc2626; font-weight: bold; }
        .sentiment-neutral { color: #6b7280; font-weight: bold; }
        @media print { 
          body { margin: 20px; } 
          .header { border-color: #666; }
          .stats { background: #f5f5f5; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Sentiment Analysis Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>Advanced AI-powered text emotion analysis</p>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <h3>Total Analyses</h3>
          <p>${history.length}</p>
        </div>
        <div class="stat-item">
          <h3>✅ Positive</h3>
          <p>${sentimentStats.positive || 0}</p>
        </div>
        <div class="stat-item">
          <h3>❌ Negative</h3>
          <p>${sentimentStats.negative || 0}</p>
        </div>
        <div class="stat-item">
          <h3>➖ Neutral</h3>
          <p>${sentimentStats.neutral || 0}</p>
        </div>
      </div>

      ${currentAnalysis ? `
        <div class="current-analysis">
          <h2>🎯 Latest Analysis</h2>
          <p><strong>Text:</strong> "${currentAnalysis.text}"</p>
          <p><strong>Sentiment:</strong> <span class="sentiment-${currentAnalysis.sentiment}">${currentAnalysis.sentiment.toUpperCase()}</span></p>
          <p><strong>Score:</strong> ${currentAnalysis.score > 0 ? '+' : ''}${currentAnalysis.score.toFixed(2)} (Range: -1 to +1)</p>
          <p><strong>Confidence:</strong> ${(currentAnalysis.confidence * 100).toFixed(1)}%</p>
          <p><strong>Dominant Emotion:</strong> ${Object.entries(currentAnalysis.emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0].charAt(0).toUpperCase() + Object.entries(currentAnalysis.emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0].slice(1)}</p>
        </div>
      ` : ''}

      <h2>📋 Analysis History</h2>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Sentiment</th>
            <th>Score</th>
            <th>Confidence</th>
            <th>Dominant Emotion</th>
            <th>Text Preview</th>
          </tr>
        </thead>
        <tbody>
          ${history.slice(0, 20).map(item => {
            const dominantEmotion = Object.entries(item.emotions).reduce((a, b) => a[1] > b[1] ? a : b);
            return `
            <tr>
              <td>${new Date(item.timestamp).toLocaleString()}</td>
              <td><span class="sentiment-${item.sentiment}">${item.sentiment.toUpperCase()}</span></td>
              <td>${item.score > 0 ? '+' : ''}${item.score.toFixed(2)}</td>
              <td>${(item.confidence * 100).toFixed(1)}%</td>
              <td>${dominantEmotion[0].charAt(0).toUpperCase() + dominantEmotion[0].slice(1)} (${(dominantEmotion[1] * 100).toFixed(0)}%)</td>
              <td>${item.text.length > 60 ? item.text.substring(0, 60) + '...' : item.text}</td>
            </tr>
          `;}).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>© 2025 Sentiment Analyzer Dashboard - AI-powered text emotion analysis</p>
      </div>
    </body>
    </html>
  `;
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}