import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'maid4maid_token';

export const cookieService = {
  setAuthCookie(token: string) {
    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 7, // 7 days
      secure: true,
      sameSite: 'strict',
    });
  },

  getAuthCookie() {
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  clearAuthCookies() {
    Cookies.remove(AUTH_TOKEN_KEY);
  },
};
