// utils/cookieUtils.ts

export function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([$?*|{}\\()[]\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

export const getTokens = (): { token?: string; refreshToken?: string } => ({
  token: getCookie('token') || undefined,
  refreshToken: getCookie('refreshToken') || undefined,
});
