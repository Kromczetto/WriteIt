import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Profile from './pages/menu/Profile';
import Write from './pages/menu/Write';
import Store from './pages/menu/Store';
import Edit from './pages/menu/Edit';
import TopRented from './pages/menu/TopRented';
import Chat from './pages/Chat';
import Friends from './pages/Friends';

import MyRentals from './pages/MyRentals';
import ReadArticle from './pages/ReadArticle';

import ProtectedRoute from './pages/components/ProtectedRoute';
import Layout from './layout/Layout';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/store" replace />} />

          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />

          <Route
            path="/top"
            element={
              <ProtectedRoute>
                <TopRented />
              </ProtectedRoute>
            }
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-rentals"
            element={
              <ProtectedRoute>
                <MyRentals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/read/:id"
            element={
              <ProtectedRoute>
                <ReadArticle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
