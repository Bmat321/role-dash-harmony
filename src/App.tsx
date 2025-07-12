
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CombinedProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store} from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

const App = () => (
  // <QueryClientProvider client={queryClient}>
  //   <TooltipProvider>
  //      <CombinedProvider>

  //       <Toaster />
  //       <Sonner />
  //       <Routes>
  //         <Route path="/" element={<Index />} />
  //         <Route path="*" element={<NotFound />} />
  //       </Routes>
  //      </CombinedProvider>
  //   </TooltipProvider>
  // </QueryClientProvider>

    <Provider store={store}>
    {/* <PersistGate loading={<div>Loading...</div>} persistor={persistor}> */}
      <TooltipProvider>
        <CombinedProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CombinedProvider>
      </TooltipProvider>
    {/* </PersistGate> */}
  </Provider>
);

export default App;
