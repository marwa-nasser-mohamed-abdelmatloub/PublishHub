import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { NavBar } from "./components/Common";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArticleList from "./pages/ArticleList";
import ArticleDetail from "./pages/ArticleDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import AdminDashboard from "./pages/AdminDashboard";
import Activity from "./pages/Activity";
import AuthorDashboard from "./pages/AuthorDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewAssignments from "./pages/ReviewAssignments";
import MyRevisions from "./pages/MyRevisions";
import Revisions from "./pages/Revisions";
import UserProfile from "./pages/UserProfile";
import UserManagement from "./pages/UserManagement";
import ArticleReviewView from "./pages/ArticleReviewView";
import AdminWorkflowDashboard from "./pages/AdminWorkflowDashboard";
import ReviewerWorkflowDashboard from "./pages/ReviewerWorkflowDashboard";
import AuthorRevisionDashboard from "./pages/AuthorRevisionDashboard";

import "./App.css";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!isLandingPage && <NavBar />}
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              requiredRole="admin"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviewer/dashboard"
          element={
            <ProtectedRoute
              requiredRole="reviewer"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/author/dashboard"
          element={
            <ProtectedRoute
              requiredRole="author"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <AuthorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/articles"
          element={
            <ProtectedRoute
              requiredRole={null}
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ArticleList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/articles/:id/edit"
          element={
            <ProtectedRoute
              requiredRole="author"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <EditArticle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/articles/:id"
          element={
            <ProtectedRoute
              requiredRole={null}
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ArticleDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/articles/:id/review"
          element={
            <ProtectedRoute
              requiredRole={null}
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ArticleReviewView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/articles/create"
          element={
            <ProtectedRoute
              requiredRole="author"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <CreateArticle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute
              requiredRole="reviewer"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ReviewAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews/my"
          element={
            <ProtectedRoute
              requiredRole="reviewer"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ReviewAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviewer/workflow"
          element={
            <ProtectedRoute
              requiredRole="reviewer"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ReviewerWorkflowDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/revisions/my"
          element={
            <ProtectedRoute
              requiredRole="author"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <MyRevisions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/author/revisions"
          element={
            <ProtectedRoute
              requiredRole="author"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <AuthorRevisionDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/revisions"
          element={
            <ProtectedRoute
              requiredRole="admin"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <Revisions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/workflow"
          element={
            <ProtectedRoute
              requiredRole="admin"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <AdminWorkflowDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <ProtectedRoute
              requiredRole="admin"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <Activity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <ProtectedRoute
              requiredRole="admin"
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              requiredRole={null}
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute
              requiredRole={null}
              userRole={user?.role}
              isAuthenticated={isAuthenticated}
            >
              <ReviewAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "60vh" }}
            >
              <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="text-muted mb-4">Page not found</p>
                <a href="/" className="btn btn-primary">
                  Go to home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
