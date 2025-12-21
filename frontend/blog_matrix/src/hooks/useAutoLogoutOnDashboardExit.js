import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useAutoLogoutOnDashboardExit(onLogout) {
  const location = useLocation();

  useEffect(() => {
    // 🚨 Logout only if user leaves /dashboard routes
    if (!location.pathname.startsWith("/dashboard")) {
      onLogout();
    }
  }, [location.pathname, onLogout]);
}
