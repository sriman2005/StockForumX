export const getWelcomeEmail = (username, otp) => ({
    subject: 'Verify your email - StockForumX',
    message: `Welcome to StockForumX, ${username}!\n\nPlease verify your email to activate your account.\nYour Verification OTP is: ${otp}`
});

export const getLoginAlertEmail = (time, ip, userAgent) => ({
    subject: 'New Login Alert - StockForumX',
    message: `Security Alert: Login Detected\n\nSomeone logged into your account.\nTime: ${time}\nIP Address: ${ip}\nDevice: ${userAgent}\n\nIf this was not you, please reset your password immediately.`
});

export const getPasswordResetEmail = (otp) => ({
    subject: 'Password Reset OTP - StockForumX',
    message: `Your password reset OTP is: ${otp}\nIt is valid for 10 minutes.`
});

export const getLoginOtpEmail = (otp) => ({
    subject: 'Login OTP - StockForumX',
    message: `Your Login OTP is: ${otp}`
});

export const getLoginOtpAlertEmail = (time, ip) => ({
    subject: 'New Login Alert (OTP)',
    message: `Logged in via OTP at ${time}\nIP Address: ${ip}`
});
