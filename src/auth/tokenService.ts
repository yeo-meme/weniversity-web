export interface TokenData {
  access: string;
  refresh?: string;
}

export interface UserData {
  id?: number;
  email: string;
  name?: string;
  role?: string;
}

export class TokenService {
  static isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }

  static getUserFromToken(token: string): UserData | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.user_id || payload.sub,
        email: payload.email,
        name: payload.name || payload.username,
        role: payload.role,
      };
    } catch (error) {
      console.error("Token parsing error:", error);
      return null;
    }
  }

  static getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return null;

      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      return Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
    } catch (error) {
      console.error("Token expiration parsing error:", error);
      return null;
    }
  }

  static isTokenExpiringSoon(
    token: string,
    thresholdMinutes: number = 5
  ): boolean {
    const remainingTime = this.getTokenExpiration(token);
    if (remainingTime === null) return true;

    return remainingTime < thresholdMinutes * 60;
  }
}
