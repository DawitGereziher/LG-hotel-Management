import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/middleware/auth"; 

const AuthGuard = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          sessionStorage.clear();
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const res = await axios.post(API_URL); 
          if (res.data.success) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token"); 
            router.push("/login");
            sessionStorage.clear();
          }
        } catch (error) {
          console.error("Authentication error:", error);
          localStorage.removeItem("token"); 
          router.push("/login");
          sessionStorage.clear();
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) return <p>Loading...</p>; 
    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
};

export default AuthGuard;
