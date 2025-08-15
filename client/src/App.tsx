import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./components/navigation";
import Home from "./pages/home";
import Pets from "./pages/pets";
import PetDetails from "./pages/pet-details";
import Application from "./pages/application";
import AdoptionHistory from "./pages/adoption-history";
import StaffDashboard from "./pages/staff-dashboard";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pets" component={Pets} />
        <Route path="/pets/:id" component={PetDetails} />
        <Route path="/application" component={Application} />
        <Route path="/application/:petId" component={Application} />
        <Route path="/history" component={AdoptionHistory} />
        <Route path="/staff" component={StaffDashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
