// Sentiment analysis utility using multiple approaches for better accuracy
async function analyzeSentiment(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input');
    }

    // First try using a more reliable sentiment model
    let sentimentResult = null;
    
    try {
      const response = await fetch('https://proxy-api.trickle-app.host/?url=https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer hf_demo',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        })
      });
      
      const data = await response.json();
      console.log('Sentiment API response:', data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const sortedResults = data.sort((a, b) => b.score - a.score);
        const topResult = sortedResults[0];
        
        // This model returns 1-5 star ratings, map to sentiment
        if (topResult.label === 'LABEL_4' || topResult.label === 'LABEL_3') { // 4-5 stars
          sentimentResult = {
            sentiment: 'positive',
            score: topResult.score * 0.8,
            confidence: topResult.score
          };
        } else if (topResult.label === 'LABEL_0' || topResult.label === 'LABEL_1') { // 1-2 stars
          sentimentResult = {
            sentiment: 'negative',
            score: -topResult.score * 0.8,
            confidence: topResult.score
          };
        } else { // 3 stars - neutral
          sentimentResult = {
            sentiment: 'neutral',
            score: 0,
            confidence: topResult.score
          };
        }
      }
    } catch (apiError) {
      console.log('Primary sentiment API failed, trying fallback');
    }

    // If API failed, use enhanced rule-based analysis
    if (!sentimentResult) {
      const analysis = enhancedTextAnalysis(text);
      sentimentResult = {
        sentiment: analysis.sentiment,
        score: analysis.score,
        confidence: 0.7
      };
    }

    // Get emotions using the emotion model
    const emotions = await getEmotions(text);

    return {
      sentiment: sentimentResult.sentiment,
      score: Math.max(-1, Math.min(1, sentimentResult.score)),
      confidence: Math.max(0, Math.min(1, sentimentResult.confidence)),
      emotions
    };

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    
    // Final fallback
    const fallback = enhancedTextAnalysis(text);
    return {
      sentiment: fallback.sentiment,
      score: fallback.score,
      confidence: 0.6,
      emotions: {
        joy: fallback.sentiment === 'positive' ? 0.6 : 0.1,
        sadness: fallback.sentiment === 'negative' ? 0.6 : 0.1,
        anger: fallback.sentiment === 'negative' ? 0.4 : 0.1,
        fear: 0.1,
        surprise: 0.1,
        trust: fallback.sentiment === 'positive' ? 0.5 : 0.1
      }
    };
  }
}

function enhancedTextAnalysis(text) {
  const words = text.toLowerCase().split(/\W+/);
  
  const positiveWords = [
    'love', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'best', 'perfect', 
    'happy', 'awesome', 'brilliant', 'outstanding', 'superb', 'exceptional', 'incredible', 
    'fabulous', 'terrific', 'marvelous', 'delightful', 'pleased', 'satisfied', 'impressed'
  ];
  
  const negativeWords = [
    'hate', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'disappointing', 'poor', 'failed', 
    'sad', 'angry', 'frustrated', 'annoying', 'disgusting', 'pathetic', 'useless', 'stupid', 
    'boring', 'slow', 'broken', 'defective', 'inferior', 'inadequate'
  ];

  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  // Check for strong sentiment phrases
  const positiveIntensifiers = text.toLowerCase().includes('absolutely') || text.toLowerCase().includes('really') || text.toLowerCase().includes('so good') || text.toLowerCase().includes('so great');
  const negativeIntensifiers = text.toLowerCase().includes('completely') || text.toLowerCase().includes('totally') || text.toLowerCase().includes('so bad') || text.toLowerCase().includes('so terrible');
  
  let sentiment = 'neutral';
  let score = 0;
  
  if (positiveCount > negativeCount || positiveIntensifiers) {
    sentiment = 'positive';
    score = Math.min(0.9, (positiveCount * 0.2) + (positiveIntensifiers ? 0.3 : 0));
  } else if (negativeCount > positiveCount || negativeIntensifiers) {
    sentiment = 'negative';
    score = -Math.min(0.9, (negativeCount * 0.2) + (negativeIntensifiers ? 0.3 : 0));
  }
  
  return { sentiment, score };
}

async function getEmotions(text) {
  try {
    const response = await fetch('https://proxy-api.trickle-app.host/?url=https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_demo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text
      })
    });

    const data = await response.json();
    console.log('Emotion API response:', data);

    // Initialize with zeros instead of 0.1
    const emotions = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      trust: 0
    };

    if (data && Array.isArray(data) && data.length > 0) {
      // Process all emotions from API response
      data.forEach(emotion => {
        const emotionName = emotion.label.toLowerCase();
        if (emotionName === 'joy') emotions.joy = emotion.score;
        else if (emotionName === 'sadness') emotions.sadness = emotion.score;
        else if (emotionName === 'anger') emotions.anger = emotion.score;
        else if (emotionName === 'fear') emotions.fear = emotion.score;
        else if (emotionName === 'surprise') emotions.surprise = emotion.score;
        else if (emotionName === 'love') emotions.trust = emotion.score;
        else if (emotionName === 'disgust') emotions.anger = Math.max(emotions.anger, emotion.score);
      });
      
      return emotions;
    }

    // If API fails, use text analysis fallback
    return analyzeEmotionsFromText(text);
    
  } catch (error) {
    console.log('Emotion API failed, using text analysis fallback');
    return analyzeEmotionsFromText(text);
  }
}

function analyzeEmotionsFromText(text) {
  const words = text.toLowerCase().split(/\W+/);
  
  const emotionWords = {
    joy: ['love', 'happy', 'excited', 'wonderful', 'amazing', 'fantastic', 'great', 'excellent', 'brilliant', 'awesome', 'perfect', 'delighted', 'thrilled', 'pleased', 'satisfied', 'incredible', 'outstanding', 'superb', 'marvelous'],
    sadness: ['sad', 'disappointed', 'depressed', 'unhappy', 'miserable', 'devastated', 'heartbroken', 'sorrowful', 'gloomy', 'melancholy', 'upset', 'down', 'blue'],
    anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'outraged', 'livid', 'enraged', 'pissed', 'hate', 'disgusting', 'terrible', 'awful', 'horrible', 'pathetic', 'stupid', 'ridiculous'],
    fear: ['scared', 'afraid', 'terrified', 'worried', 'anxious', 'nervous', 'frightened', 'concerned', 'alarmed', 'apprehensive', 'panic', 'dread'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'bewildered', 'unexpected', 'incredible', 'unbelievable', 'wow'],
    trust: ['trust', 'reliable', 'dependable', 'honest', 'genuine', 'authentic', 'recommend', 'confident', 'secure', 'safe', 'professional', 'credible']
  };
  
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    trust: 0
  };
  
  // Count emotion words and calculate scores
  Object.keys(emotions).forEach(emotion => {
    const matchedWords = words.filter(word => emotionWords[emotion].includes(word));
    emotions[emotion] = Math.min(1.0, matchedWords.length * 0.3);
  });
  
  // Adjust based on text sentiment patterns
  if (text.toLowerCase().includes('absolutely') || text.toLowerCase().includes('really')) {
    emotions.joy = Math.min(1.0, emotions.joy + 0.2);
  }
  
  if (text.toLowerCase().includes('never') || text.toLowerCase().includes('worst')) {
    emotions.anger = Math.min(1.0, emotions.anger + 0.3);
    emotions.sadness = Math.min(1.0, emotions.sadness + 0.2);
  }
  
  return emotions;
}
