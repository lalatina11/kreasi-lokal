import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ToasterProvider = () => {
  const { theme, systemTheme } = useTheme();
  const inverting = () => {
    if (theme === "system") {
      return systemTheme === "light";
    }
    return theme === "light";
  };

  const isInvert = inverting();

  return <Toaster invert={isInvert} />;
};

export default ToasterProvider;
