import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDashboardExitBlocker(onLogout) {
  const location = useLocation();
  const navigate = useNavigate();

  const lastDashboardPath = useRef(location.pathname);

  useEffect(() => {
    const current = location.pathname;

    if (current.startsWith("/dashboard")) {
      lastDashboardPath.current = current;
    }

    if (
      lastDashboardPath.current.startsWith("/dashboard") &&
      !current.startsWith("/dashboard")
    ) {
      const ok = window.confirm(
        "You are leaving Dashboard. Do you want to logout?"
      );

      if (ok) {
        onLogout();
        navigate("/", { replace: true });
      } else {
        navigate(lastDashboardPath.current, { replace: true });
      }
    }
  }, [location.pathname, navigate, onLogout]);
}
