import { createContext, useState, useEffect } from "react";

export const IdentityContext = createContext(null);

export function IdentityProvider({ children }) {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/api/identity", {
          credentials: "include",
        });
        const data = await res.json();
        setIdentity(data);
      } catch (err) {
        console.error("Failed to fetch identity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdentity();
  }, []);

  return (
    <IdentityContext.Provider value={{ identity, loading }}>
      {children}
    </IdentityContext.Provider>
  );
}
