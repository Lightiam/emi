import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import WorkerDetails from "./pages/WorkerDetails";
import AllServicesPage from "./pages/AllServicesPage";
import { initializeAuth } from "./utils/auth";
import "./App.css";
import EnvTest from "./components/EnvTest";
import TranslationTest from "./components/TranslationTest";
import { ThemeProvider } from "next-themes";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  // Initialize demo users in localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/worker/:id" element={<WorkerDetails />} />
              <Route path="/categories/all-services" element={<AllServicesPage />} />
              
              {/* Route all other paths back to the landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <div className="fixed bottom-4 right-4 space-y-4">
            <EnvTest />
            <TranslationTest />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
