import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'maid4maid_token';
const REFRESH_TOKEN_KEY = 'maid4maid_refresh_token';

export const cookieService = {
  setAuthCookie(token: string) {
    Cookies.remove(AUTH_TOKEN_KEY);

    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 1, // Matching JWT_ACCESS_EXPIRES_IN in backend
      secure: true,
      sameSite: 'strict',
    });
  },

  setRefreshCookie(token: string) {
    Cookies.remove(REFRESH_TOKEN_KEY);

    Cookies.set(REFRESH_TOKEN_KEY, token, {
      expires: 15, // Matching JWT_REFRESH_EXPIRES_IN in backend
      secure: true,
      sameSite: 'strict',
    });
  },

  getAuthCookie() {
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  getRefreshCookie() {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  clearAuthCookies() {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};
