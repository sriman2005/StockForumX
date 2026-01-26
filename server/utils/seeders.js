import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

dotenv.config();

const stocks = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'Technology',
        currentPrice: 178.50,
        previousClose: 175.20,
        volume: 52000000,
        marketCap: 2800000000000,
        high24h: 179.80,
        low24h: 174.50,
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        sector: 'Technology',
        currentPrice: 142.30,
        previousClose: 140.80,
        volume: 28000000,
        marketCap: 1800000000000,
        high24h: 143.50,
        low24h: 140.20,
        description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.'
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        sector: 'Technology',
        currentPrice: 415.20,
        previousClose: 412.50,
        volume: 22000000,
        marketCap: 3100000000000,
        high24h: 417.80,
        low24h: 411.30,
        description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'
    },
    {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        sector: 'Automotive',
        currentPrice: 242.80,
        previousClose: 238.50,
        volume: 95000000,
        marketCap: 770000000000,
        high24h: 245.60,
        low24h: 237.20,
        description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.'
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        sector: 'Consumer',
        currentPrice: 178.90,
        previousClose: 176.30,
        volume: 42000000,
        marketCap: 1850000000000,
        high24h: 180.20,
        low24h: 175.80,
        description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.'
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        sector: 'Technology',
        currentPrice: 875.50,
        previousClose: 862.30,
        volume: 38000000,
        marketCap: 2150000000000,
        high24h: 882.40,
        low24h: 858.70,
        description: 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally.'
    },
    {
        symbol: 'META',
        name: 'Meta Platforms, Inc.',
        sector: 'Technology',
        currentPrice: 485.30,
        previousClose: 478.90,
        volume: 18000000,
        marketCap: 1240000000000,
        high24h: 488.60,
        low24h: 476.20,
        description: 'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.'
    },
    {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        sector: 'Finance',
        currentPrice: 195.40,
        previousClose: 193.20,
        volume: 12000000,
        marketCap: 570000000000,
        high24h: 196.80,
        low24h: 192.50,
        description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.'
    },
    {
        symbol: 'V',
        name: 'Visa Inc.',
        sector: 'Finance',
        currentPrice: 278.60,
        previousClose: 275.80,
        volume: 8000000,
        marketCap: 580000000000,
        high24h: 280.20,
        low24h: 274.90,
        description: 'Visa Inc. operates as a payments technology company worldwide.'
    },
    {
        symbol: 'WMT',
        name: 'Walmart Inc.',
        sector: 'Consumer',
        currentPrice: 168.50,
        previousClose: 167.20,
        volume: 7500000,
        marketCap: 455000000000,
        high24h: 169.80,
        low24h: 166.40,
        description: 'Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide.'
    }
];

const users = [
    {
        username: 'demo_user',
        fullName: 'Demo User',
        email: 'demo@stockforumx.com',
        password: 'password123',
        reputation: 45.5,
        totalPredictions: 25,
        accuratePredictions: 18,
        bio: 'Tech stock enthusiast with focus on AI and semiconductors'
    },
    {
        username: 'market_guru',
        fullName: 'Market Guru',
        email: 'guru@stockforumx.com',
        password: 'password123',
        reputation: 125.8,
        totalPredictions: 87,
        accuratePredictions: 72,
        bio: 'Full-time trader specializing in momentum strategies'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Stock.deleteMany({});
        await User.deleteMany({});
        await Question.deleteMany({});
        await Answer.deleteMany({});
        console.log('Cleared existing data');

        // Insert stocks
        const createdStocks = await Stock.insertMany(stocks);
        console.log('Seeded stocks');

        // Insert users
        const createdUsers = await User.insertMany(users);
        console.log('Seeded users');

        // Create questions
        const questions = [
            {
                stockId: createdStocks.find(s => s.symbol === 'AAPL')._id,
                userId: createdUsers[0]._id,
                title: 'AAPL Q3 Earnings Expectations?',
                content: 'With the recent iPhone sales data coming out of China, what are everyone\'s thoughts on the upcoming earnings report? I\'m seeing conflicting reports from analysts.',
                tags: ['earnings', 'iphone', 'analysis'],
                upvotes: 15,
                views: 230,
                answerCount: 1,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                stockId: createdStocks.find(s => s.symbol === 'NVDA')._id,
                userId: createdUsers[1]._id,
                title: 'Is NVDA valuation sustainable at these levels?',
                content: 'The PE ratio is sky high, but the AI demand seems insatiable. Are we in a bubble or is this just the beginning of the AI supercycle?',
                tags: ['valuation', 'AI', 'bubble'],
                upvotes: 42,
                views: 890,
                answerCount: 0,
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
            },
            {
                stockId: createdStocks.find(s => s.symbol === 'TSLA')._id,
                userId: createdUsers[0]._id,
                title: 'Tesla Cybertruck production ramp',
                content: 'Saw some new drone footage of Giga Texas. Looks like Cybertruck production is ramping up faster than expected. Bullish for Q4?',
                tags: ['cybertruck', 'production', 'bullish'],
                upvotes: 28,
                views: 560,
                answerCount: 1,
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
            },
            {
                stockId: createdStocks.find(s => s.symbol === 'MSFT')._id,
                userId: createdUsers[1]._id,
                title: 'Microsoft Copilot revenue impact',
                content: 'How significant do you think the Copilot subscription revenue will be for Microsoft this fiscal year? Enterprise adoption seems strong.',
                tags: ['copilot', 'revenue', 'cloud'],
                upvotes: 19,
                views: 180,
                answerCount: 0,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                stockId: createdStocks.find(s => s.symbol === 'AMZN')._id,
                userId: createdUsers[1]._id,
                title: 'Amazon Web Services (AWS) Growth',
                content: 'Is AWS facing real competition from Azure, or is it just a temporary blip? The cloud wars are heating up.',
                tags: ['cloud', 'aws', 'competition'],
                upvotes: 10,
                views: 150,
                answerCount: 0,
                createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
            }
        ];

        const createdQuestions = await Question.insertMany(questions);
        console.log('Seeded questions');

        // Create answers
        const answers = [
            {
                questionId: createdQuestions[0]._id,
                userId: createdUsers[1]._id,
                content: 'I am bullish. Services revenue will carry the day even if hardware is flat.',
                upvotes: 5,
                isAccepted: false,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                questionId: createdQuestions[2]._id,
                userId: createdUsers[1]._id,
                content: 'Be careful with production ramps, they burn cash fast. Margins might take a hit initially.',
                upvotes: 3,
                isAccepted: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
        ];

        await Answer.insertMany(answers);
        console.log('Seeded answers');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
