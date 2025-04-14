class SessionManager {
  static SESSION_CHECK_INTERVAL = 60000; // Check every minute
  static TOKEN_EXPIRY_BUFFER = 300000; // 5 minutes buffer before token expires

  static init(onSessionExpired) {
    this.checkInterval = setInterval(() => {
      this.checkSession(onSessionExpired);
    }, this.SESSION_CHECK_INTERVAL);
  }

  static cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  static checkSession(onSessionExpired) {
    const user = this.getStoredUser();
    if (!user || !user.token) {
      this.handleSessionExpired(onSessionExpired);
      return false;
    }

    // Check if token is expired or will expire soon
    if (this.isTokenExpiringSoon(user.token)) {
      this.handleSessionExpired(onSessionExpired);
      return false;
    }

    return true;
  }

  static getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static isTokenExpiringSoon(token) {
    try {
      const payload = this.parseJwt(token);
      if (!payload.exp) return true;

      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      return (expirationTime - currentTime) < this.TOKEN_EXPIRY_BUFFER;
    } catch {
      return true;
    }
  }

  static parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch {
      return {};
    }
  }

  static handleSessionExpired(onSessionExpired) {
    localStorage.removeItem('user');
    if (onSessionExpired) {
      onSessionExpired();
    }
  }
}

export default SessionManager;