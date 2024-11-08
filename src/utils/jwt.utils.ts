import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  role: string;
  organizationId: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);

  if (!decoded) return true;

  return decoded.exp * 1000 < Date.now();
};
