// resolve the issue with localStorage
const localStorage = window.localStorage || {};

// default token names
const tokenNames = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

/**
 * Delete the specified token, or delete both
 * @param tokenName {string} - optional, pass the name of the token to delete
 * @returns {*}
 */
export const deleteTokens = (tokenName = '') => {
  if (tokenName && Object.keys(tokenNames).includes(tokenName)) {
    return localStorage.removeItem(tokenName);
  }
  return [
    localStorage.removeItem(tokenNames.accessToken),
    localStorage.removeItem(tokenNames.refreshToken),
  ];
};

/**
 * Get tokens from the localStorage
 * @returns {{ accessToken, refreshToken }}
 */
export const getTokens = () => ({
  accessToken: localStorage.getItem(tokenNames.accessToken),
  refreshToken: localStorage.getItem(tokenNames.refreshToken),
});

/**
 * Store tokens in the localStorage
 * @param tokens {{ accessToken, refreshToken }} - an object that contains access token and refresh token
 * @returns {*}
 */
export const storeTokens = (tokens = { accessToken: '', refreshToken: '' }) => [
  localStorage.setItem(tokenNames.accessToken, tokens.accessToken),
  localStorage.setItem(tokenNames.refreshToken, tokens.refreshToken),
];
