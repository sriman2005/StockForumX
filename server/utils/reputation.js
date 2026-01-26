// Reputation calculation algorithm
// score = accuracy * log(total_predictions + 1)

export const calculateReputation = (accuratePredictions, totalPredictions) => {
    if (totalPredictions === 0) return 0;

    const accuracy = accuratePredictions / totalPredictions;
    const score = accuracy * Math.log(totalPredictions + 1) * 100; // Multiply by 100 for better scaling

    return Math.round(score * 10) / 10; // Round to 1 decimal place
};

export const getReputationTier = (reputation) => {
    if (reputation >= 500) return { label: 'Legend', color: '#EF4444' };
    if (reputation >= 100) return { label: 'Master', color: '#F59E0B' };
    if (reputation >= 50) return { label: 'Expert', color: '#8B5CF6' };
    if (reputation >= 10) return { label: 'Apprentice', color: '#3B82F6' };
    return { label: 'Novice', color: '#6B7280' };
};

export const updateUserReputation = async (User, userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    const newReputation = calculateReputation(user.accuratePredictions, user.totalPredictions);
    user.reputation = newReputation;
    await user.save();

    return user;
};
