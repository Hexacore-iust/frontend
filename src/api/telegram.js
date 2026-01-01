export const getTelegramWebApp = () => {
  return window.Telegram?.WebApp;
};

export const getTelegramInitData = () => {
  return window.Telegram?.WebApp?.initData || "";
};

export const getTelegramUserUnsafe = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
};

export const isTelegramEnv = () => {
  return !!window.Telegram?.WebApp;
};
