import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { telegramLoginRequest } from "../api/auth";
import { tokenStorage } from "../api/axios";
import LoadingScreen from "../components/MiniApp/LoadingScreen";

const TelegramAuth = () => {
  const [status, setStatus] = useState("loading"); // loading | error | no-telegram
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const existingAccess = tokenStorage.getAccess();
    if (existingAccess) {
      navigate("/homepage", { replace: true });
      return;
    }

    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;

    if (!initData) {
      setStatus("no-telegram");
      return;
    }

    tg.ready();

    telegramLoginRequest(initData)
      .then((res) => {
        const data = res.data;
        const access = data?.tokens?.access || data?.access;
        const refresh = data?.tokens?.refresh || data?.refresh;

        if (!access || !refresh) {
          throw new Error("Tokens not found");
        }

        tokenStorage.setTokens(access, refresh);
        navigate("/homepage", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setErrorText("ورود با تلگرام ناموفق بود");
        setStatus("error");
      });
  }, [navigate]);

  if (status === "loading") {
    return <LoadingScreen text="در حال ورود از طریق تلگرام…" />;
  }

  if (status === "no-telegram") {
    return (
      <div style={{ padding: 24 }}>
        ❌ این صفحه باید داخل تلگرام باز شود
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ padding: 24 }}>
        ❌ {errorText}
      </div>
    );
  }

  return null;
};

export default TelegramAuth;
