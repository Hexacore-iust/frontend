import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { telegramLoginRequest } from "../api/auth";
import { tokenStorage } from "../api/axios";

const TelegramAuth = () => {
  const [status, setStatus] = useState("loading"); // loading | error | no-telegram
  const navigate = useNavigate();
  const [initDataText, setInitDataText] = useState("");
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const existingAccess = tokenStorage.getAccess();
    if (existingAccess) {
      navigate("/homepage", { replace: true });
      return;
    }

    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;
    setInitDataText(initData);

    if (!initData) {
      setStatus("no-telegram");
      return;
    }

    tg.ready();

    telegramLoginRequest(initData)
      .then((res) => {
        setResponseText(res);
        const data = res.data;

        const access = data?.tokens?.access || data?.access;
        const refresh = data?.tokens?.refresh || data?.refresh;

        if (!access || !refresh) {
          throw new Error("Tokens not found in response");
        }

        tokenStorage.setTokens(access, refresh);

        navigate("/homepage", { replace: true });
      })
      .catch((err) => {
        console.error("Telegram login error:", err);
        setResponseText(err.error);
        setStatus("error");
      });
  }, [navigate]);

  if (status === "no-telegram") {
    return (
      <div style={{ padding: 16 }}>
        این صفحه باید داخل تلگرام باز شود. "initData" {initDataText}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ padding: 16 }}>
        خطا در ورود با تلگرام. "initData" {initDataText}
        <div>
          response
          {responseText}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      "initData" {initDataText}
      در حال ورود از طریق تلگرام...
    </div>
  );
};

export default TelegramAuth;
