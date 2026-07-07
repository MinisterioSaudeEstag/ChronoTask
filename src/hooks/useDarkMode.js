import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }, []);

  const toggleTheme = () => {
    return false;
  };

  return { isDark, toggleTheme };
}