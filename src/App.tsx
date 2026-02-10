import { StoreProvider } from "./context/StoreContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { observer } from "mobx-react-lite";
import { useAssetPreloader } from "./utils/useAssetPreloader";
import { getAssetsToPreload } from "./utils/assetsToPreload";
import { LoadingScreen } from "./ui/Components/LoadingScreen";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

const DesignPage = lazy(() => import("./ui/DesignPage").then(module => ({ default: module.DesignPage })));
const Checkout = lazy(() => import("./ui/Components/Checkout").then(module => ({ default: module.Checkout })));

const assets = getAssetsToPreload();

export default observer(function App() {
  const { imagesLoaded } = useAssetPreloader(assets);

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <StoreProvider>
      <Toaster />
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<DesignPage />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Suspense>
      </Router>
    </StoreProvider>
  );
});
