import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useDashboardLeaveGuard(onLogout) {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const oldPath = previousPath.current;
    const newPath = location.pathname;

    // If leaving dashboard → ask to logout
    if (oldPath.startsWith("/dashboard") && !newPath.startsWith("/dashboard")) {
      const confirmLogout = window.confirm(
        "You are leaving the dashboard. Do you want to logout?"
      );

      if (confirmLogout) {
        onLogout();
        navigate("/", { replace: true });
      } else {
        navigate(oldPath, { replace: true });
      }
    }

    previousPath.current = newPath;
  }, [location, navigate, onLogout]);
}
