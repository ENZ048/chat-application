import "./App.css";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<p>404 Not Found</p>} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
