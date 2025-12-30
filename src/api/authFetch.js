import { tokenStorage } from './axios';

export const authFetch = async (url, options = {}) => {
  let accessToken = tokenStorage.getAccess();

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  });

  // اگر access منقضی شده
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      tokenStorage.clear();
      alert('نشست شما منقضی شده، لطفاً دوباره وارد شوید.');
      throw new Error('Session expired');
    }

    // retry request
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return response;
};
