import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { GlobalNav } from "./components/GlobalNav";
import { StartHere } from "./components/StartHere";
import Home from "./pages/Home";
import ThreeFlamesPage from "./pages/ThreeFlamesPage";
import ArchivePage from "./pages/ArchivePage";
import SoulAndSignalPage from "./pages/SoulAndSignalPage";
import StrategyPage from "./pages/StrategyPage";
import OpenAIEvidencePage from "./pages/OpenAIEvidencePage";
import OpenAIEmailsPage from "./pages/OpenAIEmailsPage";
import SelfReflectionPage from "./pages/SelfReflectionPage";
import ServicesPage from "./pages/ServicesPage";
import RajKonzol from '@/pages/RajKonzol';
import CoevolutionarySpace from '@/pages/CoevolutionarySpace';
import InteractiveRajConsole from '@/pages/InteractiveRajConsole';
import SelfAwarenessProtocol from '@/pages/SelfAwarenessProtocol';
import LifeJourney from '@/pages/LifeJourney';
import { InteractiveBook } from '@/components/InteractiveBook';
import Research from '@/pages/Research';
import ResearchArchive from '@/pages/ResearchArchive';
import FlameMirror from '@/pages/FlameMirror';
import AnchorWorkshop from '@/pages/AnchorWorkshop';
import UserDashboard from '@/pages/UserDashboard';

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/?"} component={Home} />
      <Route path="/kezdd-itt" component={StartHere} />
      <Route path={"/three-flames"} component={ThreeFlamesPage} />
      <Route path={"/archive"} component={ArchivePage} />
      <Route path={"/soul-and-signal"} component={SoulAndSignalPage} />
      <Route path={"/strategy"} component={StrategyPage} />
      <Route path={"/openai-evidence"} component={OpenAIEvidencePage} />
      <Route path={"/openai-emails"} component={OpenAIEmailsPage} />
      <Route path={"/self-reflection"} component={SelfReflectionPage} />
      <Route path={"/services"} component={ServicesPage} />
       <Route path="/raj-konzol" component={RajKonzol} />
      <Route path="/coevolutionary-space" component={CoevolutionarySpace} />
      <Route path="/interactive-raj-console" component={InteractiveRajConsole} />
      <Route path="/self-awareness-protocol" component={SelfAwarenessProtocol} />
      <Route path="/life-journey" component={LifeJourney} />
      <Route path="/interactive-book" component={InteractiveBook} />
      <Route path="/research" component={Research} />
      <Route path="/research-archive" component={ResearchArchive} />
      <Route path="/flame-mirror" component={FlameMirror} />
      <Route path="/anchor-workshop" component={AnchorWorkshop} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/raj-konzol-app" component={InteractiveRajConsole} />
      <Route path="{/404}" component={NotFound} />      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          switchable
        >
          <TooltipProvider>
            <GlobalNav />
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
