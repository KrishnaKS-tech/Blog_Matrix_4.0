// React hook to run side effects
import { useEffect } from "react";

// Hooks to access current route and navigate programmatically
import { useLocation, useNavigate } from "react-router-dom";

/**
 * 🌍 GlobalRouteGuard Component
 * Purpose:
 *  - Enforces global navigation rules across the app
 *  - Prevents unauthorized access to dashboard routes
 *  - Prevents logged-in users from accessing public pages
 *  - Runs automatically on route changes
 */
export default function GlobalRouteGuard() {
  // Used to programmatically redirect users
  const navigate = useNavigate();

  // Provides information about the current URL path
  const location = useLocation();

  // Fetch JWT token from localStorage
  const token = localStorage.getItem("token");

  // Check if current route is a dashboard-related route
  const isDashboardPath = location.pathname.startsWith("/dashboard");

  /**
   * useEffect runs whenever:
   *  - token changes (login/logout)
   *  - route path changes
   */
  useEffect(() => {
    // ❌ User is NOT logged in and tries to access dashboard
    // Redirect them back to home page
    if (!token && isDashboardPath) {
      navigate("/", { replace: true });
      return;
    }

    // ✅ User IS logged in but tries to access public pages (like /)
    // Force them to stay inside the dashboard
    if (token && !isDashboardPath) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, isDashboardPath, navigate]);

  // This component does not render anything to the UI
  return null;
}
