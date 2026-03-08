import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useGameContent } from "@/hooks/useGameContent";
import { hydrateGameContent } from "@/data/gameContent";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import GameHub from "./pages/GameHub";
import Chapter from "./pages/Chapter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { data, loading } = useGameContent();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (data) {
      hydrateGameContent(data);
      setReady(true);
    }
  }, [data]);

  if (loading || !ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono text-sm animate-pulse">Загрузка контента...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<GameHub />} />
        <Route path="/game/module/:moduleId" element={<Chapter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
