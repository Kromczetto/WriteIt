import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Profile from './pages/menu/Profile';
import Write from './pages/menu/Write';
import Store from './pages/menu/Store';
import Edit from './pages/menu/Edit';
import Register from './pages/auth/Register';
import ProtectedRoute from './pages/components/ProtectedRoute';
import Layout from './layout/Layout';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="/profile" replace />}
          />

          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <Write />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route 
          path="/edit/:id" 
          element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            } 
          />
        <Route 
          path="/register" 
          element={
          <Register />
          } 
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
