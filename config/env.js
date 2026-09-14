import "dotenv/config";
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
export const JWT_EXPIRES_IN = "1h";
export const TOKEN_COOKIE_NAME = "token";
export const TOKEN_COOKIE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour, matches JWT_EXPIRES_IN
