import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GlobalRouteGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isDashboardPath = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    // NOT LOGGED IN — just redirect, no toast here
    if (!token && isDashboardPath) {
      navigate("/", { replace: true });
      return;
    }

    // LOGGED IN — block leaving dashboard
    if (token && !isDashboardPath) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, isDashboardPath, navigate]);

  return null;
}
