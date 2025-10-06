// Sentiment analysis utility using Hugging Face API
async function analyzeSentiment(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input');
    }

    // Use Hugging Face Inference API for sentiment analysis
    const sentimentResponse = await fetch('https://proxy-api.trickle-app.host/?url=https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_demo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text
      })
    });

    const sentimentData = await sentimentResponse.json();
    
    // Use Hugging Face emotion analysis model
    const emotionResponse = await fetch('https://proxy-api.trickle-app.host/?url=https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_demo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text
      })
    });

    const emotionData = await emotionResponse.json();

    // Process sentiment results
    let sentiment = 'neutral';
    let score = 0;
    let confidence = 0.7;

    if (sentimentData && Array.isArray(sentimentData) && sentimentData.length > 0) {
      const topSentiment = sentimentData[0];
      if (topSentiment.label === 'LABEL_2') {
        sentiment = 'positive';
        score = topSentiment.score * 0.8; // Scale to reasonable range
      } else if (topSentiment.label === 'LABEL_0') {
        sentiment = 'negative';
        score = -topSentiment.score * 0.8; // Negative score
      } else {
        sentiment = 'neutral';
        score = 0;
      }
      confidence = topSentiment.score;
    }

    // Process emotion results
    const emotions = {
      joy: 0.1,
      sadness: 0.1,
      anger: 0.1,
      fear: 0.1,
      surprise: 0.1,
      trust: 0.1
    };

    if (emotionData && Array.isArray(emotionData) && emotionData.length > 0) {
      emotionData.forEach(emotion => {
        const emotionName = emotion.label.toLowerCase();
        if (emotionName === 'joy') emotions.joy = emotion.score;
        else if (emotionName === 'sadness') emotions.sadness = emotion.score;
        else if (emotionName === 'anger') emotions.anger = emotion.score;
        else if (emotionName === 'fear') emotions.fear = emotion.score;
        else if (emotionName === 'surprise') emotions.surprise = emotion.score;
        else if (emotionName === 'love') emotions.trust = emotion.score; // Map love to trust
        else if (emotionName === 'disgust') emotions.anger = Math.max(emotions.anger, emotion.score);
      });
    }

    return {
      sentiment,
      score: Math.max(-1, Math.min(1, score)),
      confidence: Math.max(0, Math.min(1, confidence)),
      emotions
    };

  } catch (error) {
    console.error('Hugging Face API error:', error);
    
    // Fallback to simple analysis if API fails
    const words = text.toLowerCase().split(/\W+/);
    const positiveWords = ['love', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'best', 'perfect', 'happy'];
    const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'disappointing', 'poor', 'failed', 'sad'];
    
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    let sentiment = 'neutral';
    let score = 0;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = Math.min(0.8, positiveCount * 0.3);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = -Math.min(0.8, negativeCount * 0.3);
    }
    
    return {
      sentiment,
      score,
      confidence: 0.6,
      emotions: {
        joy: sentiment === 'positive' ? 0.6 : 0.1,
        sadness: sentiment === 'negative' ? 0.6 : 0.1,
        anger: negativeCount > 0 ? 0.4 : 0.1,
        fear: 0.1,
        surprise: 0.1,
        trust: sentiment === 'positive' ? 0.5 : 0.1
      }
    };
  }
}
