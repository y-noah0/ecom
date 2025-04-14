class RateLimiter {
  static MAX_ATTEMPTS = 5;
  static LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  static ATTEMPTS_RESET = 60 * 1000; // 1 minute in milliseconds

  static attempts = new Map();
  static lockouts = new Map();

  static checkRateLimit(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    const lockoutTime = this.lockouts.get(key);

    // Check if user is locked out
    if (lockoutTime && now < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - now) / 1000 / 60);
      throw new Error(`Too many attempts. Please try again in ${remainingTime} minutes.`);
    }

    // Clean up old attempts
    const recentAttempts = userAttempts.filter(time => now - time < this.ATTEMPTS_RESET);

    // Check if max attempts exceeded
    if (recentAttempts.length >= this.MAX_ATTEMPTS) {
      this.lockouts.set(key, now + this.LOCKOUT_DURATION);
      throw new Error(`Too many attempts. Please try again in 15 minutes.`);
    }

    // Record new attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
  }

  static resetAttempts(key) {
    this.attempts.delete(key);
    this.lockouts.delete(key);
  }

  // Clean up expired entries periodically
  static cleanup() {
    const now = Date.now();

    // Clean up attempts
    for (const [key, attempts] of this.attempts.entries()) {
      const validAttempts = attempts.filter(time => now - time < this.ATTEMPTS_RESET);
      if (validAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validAttempts);
      }
    }

    // Clean up lockouts
    for (const [key, lockoutTime] of this.lockouts.entries()) {
      if (now >= lockoutTime) {
        this.lockouts.delete(key);
      }
    }
  }
}

// Start periodic cleanup
setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000); // Every 5 minutes

export default RateLimiter;