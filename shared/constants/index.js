// Shared constants used across client and server

export const PREDICTION_TYPES = {
  PRICE: 'price',
  DIRECTION: 'direction'
};

export const PREDICTION_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down'
};

export const PREDICTION_TIMEFRAMES = {
  ONE_HOUR: '1h',
  ONE_DAY: '1d',
  ONE_WEEK: '1w',
  ONE_MONTH: '1m'
};

export const REPUTATION_TIERS = {
  NOVICE: { min: 0, max: 10, label: 'Novice', color: '#6B7280' },
  APPRENTICE: { min: 10, max: 50, label: 'Apprentice', color: '#3B82F6' },
  EXPERT: { min: 50, max: 100, label: 'Expert', color: '#8B5CF6' },
  MASTER: { min: 100, max: 500, label: 'Master', color: '#F59E0B' },
  LEGEND: { min: 500, max: Infinity, label: 'Legend', color: '#EF4444' }
};

export const ANSWER_TTL_DAYS = 30; // Answers expire after 30 days

export const SOCKET_EVENTS = {
  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  
  // Questions
  QUESTION_NEW: 'question:new',
  QUESTION_UPDATE: 'question:update',
  
  // Answers
  ANSWER_NEW: 'answer:new',
  ANSWER_ACCEPTED: 'answer:accepted',
  
  // Predictions
  PREDICTION_NEW: 'prediction:new',
  PREDICTION_EVALUATED: 'prediction:evaluated',
  
  // Stocks
  STOCK_UPDATE: 'stock:update',
  
  // Reputation
  REPUTATION_UPDATE: 'reputation:update'
};

export const MANIPULATION_THRESHOLDS = {
  SIMILARITY_THRESHOLD: 0.8, // 80% similarity = potential copy-paste
  PUMP_THRESHOLD: 10, // 10+ positive predictions in 1 hour = potential pump
  RATE_LIMIT_PREDICTIONS: 5, // Max 5 predictions per hour per user
  RATE_LIMIT_WINDOW: 3600000 // 1 hour in milliseconds
};

export const QUESTION_TAGS = [
  'Technical Analysis',
  'Fundamental Analysis',
  'News',
  'Earnings',
  'Market Sentiment',
  'Options',
  'Dividends',
  'Risk Management',
  'Strategy',
  'Other'
];

export const STOCK_SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer',
  'Industrial',
  'Utilities',
  'Real Estate',
  'Materials',
  'Telecommunications'
];
