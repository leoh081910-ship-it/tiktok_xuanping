import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import DataCollection from "./pages/DataCollection";
import Products from "./pages/Products";
import MarketInsights from "./pages/MarketInsights";
import TikTokOfficial from "./pages/TikTokOfficial";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export const routers = [
    {
      path: "/login",
      name: 'login',
      element: <Login />,
    },
    {
      path: "/",
      name: 'home',
      element: <Layout><Index /></Layout>,
    },
    {
      path: "/data-collection",
      name: 'data-collection',
      element: <Layout><DataCollection /></Layout>,
    },
    {
      path: "/products",
      name: 'products',
      element: <Layout><Products /></Layout>,
    },
    {
      path: "/market-insights",
      name: 'market-insights',
      element: <Layout><MarketInsights /></Layout>,
    },
    {
      path: "/tiktok-official",
      name: 'tiktok-official',
      element: <Layout><TikTokOfficial /></Layout>,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;