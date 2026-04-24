/**
 * Expense Categorizer Utility
 * Uses simple heuristics + optional AI/LLM for categorization
 */

const axios = require('axios');

const categories = {
  'Food & Dining': ['restaurant', 'food', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'drink'],
  'Transportation': ['taxi', 'uber', 'petrol', 'gas', 'auto', 'bus', 'train', 'parking', 'metro', 'fuel'],
  'Groceries': ['grocery', 'supermarket', 'whole foods', 'trader joe', 'costco', 'walmart', 'market'],
  'Shopping': ['mall', 'amazon', 'shopping', 'shop', 'store', 'purchase', 'buy', 'clothes', 'apparel'],
  'Entertainment': ['movie', 'cinema', 'game', 'concert', 'music', 'spotify', 'netflix', 'gaming', 'entertainment'],
  'Bills & Utilities': ['electricity', 'water', 'internet', 'phone', 'utility', 'bill', 'rent', 'lease'],
  'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medicine', 'medical', 'health', 'dentist', 'clinic'],
  'Education': ['school', 'tuition', 'course', 'book', 'learning', 'training', 'education', 'udemy'],
  'Travel': ['hotel', 'flight', 'airbnb', 'vacation', 'trip', 'travel', 'resort', 'airline'],
  'Business': ['office', 'business', 'work', 'meeting', 'conference', 'professional'],
  'Personal Care': ['salon', 'haircut', 'spa', 'beauty', 'grooming', 'personal'],
  'Fitness': ['gym', 'fitness', 'yoga', 'sports', 'exercise', 'training']
};

/**
 * Simple heuristic-based categorization
 * Looks for keywords in description
 */
const categorizeByHeuristics = (description) => {
  const lowerDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return {
          category,
          confidence: 0.7 + Math.random() * 0.25, // 0.7-0.95 confidence
          method: 'heuristic'
        };
      }
    }
  }

  return {
    category: 'Other',
    confidence: 0.3,
    method: 'default'
  };
};

/**
 * AI-based categorization using OpenAI
 * Falls back to heuristics if API fails
 */
const categorizeWithAI = async (description) => {
  try {
    // If no API key, use heuristics
    if (!process.env.OPENAI_API_KEY) {
      return categorizeByHeuristics(description);
    }

    const prompt = `Categorize this expense description into one of these categories: ${Object.keys(categories).join(', ')}. Response format: {"category": "...", "confidence": 0.0-1.0}

Description: "${description}"`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    return {
      category: parsed.category,
      confidence: parsed.confidence,
      method: 'ai'
    };
  } catch (error) {
    console.error('AI categorization error:', error.message);
    // Fallback to heuristics
    return categorizeByHeuristics(description);
  }
};

module.exports = {
  categorizeByHeuristics,
  categorizeWithAI
};
