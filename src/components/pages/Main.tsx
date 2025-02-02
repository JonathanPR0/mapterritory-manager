import { useTheme } from "@/providers/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Cadastro from "./cadastro/Cadastro";
import Territory from "./territory/Territory";

export default function Main() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex flex-col gap-4 h-full w-full bg-background py-8 px-4 ">
      <Tabs defaultValue="territorio" className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 my-4 ">
          <TabsTrigger value="territorio" className="text-sm">
            Território
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="text-sm">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="cadastro" className="text-sm">
            Cadastros
          </TabsTrigger>
        </TabsList>
        <TabsContent value="territorio" className="mt-0">
          <Territory />
        </TabsContent>
        <TabsContent value="dashboard" className="mt-0"></TabsContent>
        <TabsContent value="cadastro" className="mt-0">
          <Cadastro />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end mb-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </main>
  );
}
