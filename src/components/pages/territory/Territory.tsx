import MapComponent from "../components/MapComponent";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

const Territory = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-background/80 backdrop-blur-sm"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
      <MapComponent />
    </div>
  );
};

export default Territory;