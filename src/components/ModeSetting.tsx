import { useTheme } from "next-themes";
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const ModeSetting = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const allModes = ["system", "dark", "light"];
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return Array.from({ length: 3 }).map((_, i) => (
      <div key={i}>
        <Skeleton
          className={
            "w-full flex justify-center items-center" +
            buttonVariants({ variant: "default" })
          }
        >
          Loading...
        </Skeleton>
      </div>
    ));

  return allModes.map((mode) => (
    <Button
      key={mode}
      variant={theme === mode ? "default" : "outline"}
      onClick={() => setTheme(mode)}
      className="capitalize"
    >
      {mode === "system" ? "Auto" : mode}
    </Button>
  ));
};

export default ModeSetting;
