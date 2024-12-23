import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import RegisterForm from "./components/RegisterForm";
import VerifyOtpPage from "./components/VerifyOtpPage";
import PrivatePage from "./components/PrivatePage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verifyotp" element={<VerifyOtpPage />} />
          <Route path="/private" element={
            <ProtectedRoute element={ <PrivatePage />}  />
            } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
