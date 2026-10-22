import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import Index from "./pages/index";
import EventsPage from "./pages/events";
import EventPage from "./pages/event";
import PlacesPage from "./pages/places";
import PlacePage from "./pages/place";
import WalkPage from "./pages/walk";
import { Provider } from "./components/provider";
import { Layout } from "./components/layout";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function ScrollTop() {
  const [loc] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc]);
  return null;
}

function App() {
  return (
    <Provider>
      <ScrollTop />
      <Layout>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/events" component={EventsPage} />
          <Route path="/events/:id" component={EventPage} />
          <Route path="/places" component={PlacesPage} />
          <Route path="/places/:id" component={PlacePage} />
          <Route path="/walk" component={WalkPage} />
        </Switch>
      </Layout>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
