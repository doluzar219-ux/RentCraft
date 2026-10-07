import { useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import ProblemSolution from "./components/ProblemSolution";
import Workflow from "./components/Workflow";
import Features from "./components/Features";
import DashboardPreview from "./components/DashboardPreview";
import Pricing from "./components/Pricing";
import Team from "./components/Team";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";
import AppShell from "./components/app/AppShell";
import AuthModal from "./components/modals/AuthModal";
import ToastStack from "./components/app/ToastStack";
import { AppProvider, useApp } from "./store/AppContext";
import type { Role } from "./types";

function Landing() {
  const { role, setRole, session, enterApp } = useApp();

  const pickRole = useCallback(
    (r: Role) => {
      setRole(r);
      if (session) {
        enterApp();
      } else {
        document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [setRole, session, enterApp]
  );

  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      <Navbar />
      <main>
        <Hero onPickRole={pickRole} />
        <Marquee />
        <ProblemSolution />
        <Workflow />
        <Features />
        <DashboardPreview role={role} setRole={setRole} />
        <Pricing />
        <Team />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

function Root() {
  const { view, session } = useApp();
  const inApp = view === "app" && !!session;
  return (
    <>
      {inApp ? <AppShell /> : <Landing />}
      <AuthModal />
      <ToastStack />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
