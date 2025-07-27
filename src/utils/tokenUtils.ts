import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000; // seconds
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}
