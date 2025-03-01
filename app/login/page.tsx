"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Reception");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setCurrentDateTime(formattedDateTime);
    }, 1000);

    const storedLogin = sessionStorage.getItem("isLoggedIn");
    if (storedLogin) {
      setIsLoggedIn(true);
      router.push("/pages/Dashboard");
    }

    return () => clearInterval(interval);
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/user/login", {
        email,
        role,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      sessionStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      // Set Axios default headers after login
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      router.push("/pages/Dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left part with Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-96 p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-2 text-center">Login</h1>
          <p className="text-gray-600 mb-4 text-center">Please use your employee ID and password to login</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Reception">Reception</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Housekeeping">Housekeeping</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">
              LOGIN
            </button>
            {error && <p className="text-red-500 text-center font-bold">{error}</p>}
          </form>
        </div>
      </div>

      <div
        className="flex-1 bg-cover bg-center flex items-center justify-center text-center text-white"
        style={{ backgroundImage: "url(/main.jpg)", marginTop: "-50px" }}
      >
        <div>
          <p className="text-6xl font-bold text-black">{currentDateTime.split(" ").slice(1).join(" ")}</p>
          <p className="text-3xl text-black">{currentDateTime.split(" ")[0]}</p>
        </div>
      </div>
    </div>
  );
}
