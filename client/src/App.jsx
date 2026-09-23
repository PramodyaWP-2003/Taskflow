import { Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Boards from "./pages/Boards";
import BoardView from "./pages/BoardView";

export default function App() {
  return (
    <div className="relative isolate flex min-h-screen flex-col text-slate-800">
      <Background />
      <Navbar />
      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Boards /></ProtectedRoute>} />
          <Route path="/boards/:id" element={<ProtectedRoute><BoardView /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
}