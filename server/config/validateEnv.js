const validateEnv = () => {
    const required = [
        'MONGODB_URI',
        'JWT_SECRET',
        'PORT'
    ];

    const missing = required.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        console.error('Missing required environment variables:');
        missing.forEach(varName => {
            console.error(`  - ${varName}`);
        });
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    // Validate JWT_SECRET length
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.warn('WARNING: JWT_SECRET should be at least 32 characters long for security');
    }

    // Validate MongoDB URI format
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
        throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
    }

    console.log('Environment variables validated successfully');
};

export default validateEnv;
