import { apiInstance } from "./axios";

export const telegramLoginRequest = (initData) => {
  return apiInstance.post("/api/auth/telegram/", { init_data: initData });
};
