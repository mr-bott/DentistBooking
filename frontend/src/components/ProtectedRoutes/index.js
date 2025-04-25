import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element: Component, allowedRoles = [] }) => {
  const token = Cookies.get("jwt_token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (allowedRoles.includes(userRole)) {
      return <Component />;
    } else {
      return <Navigate to={`/${userRole}/dashboard`} />;
    }
  } catch (err) {
    console.error("Token decoding failed:", err.message);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
