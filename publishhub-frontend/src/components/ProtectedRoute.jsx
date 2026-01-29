const ProtectedRoute = ({
  children,
  requiredRole,
  userRole,
  isAuthenticated,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
