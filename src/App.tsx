import { StoreProvider } from "./context/StoreContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DesignPage } from "./ui/DesignPage";
import { Checkout } from "./ui/Components/Checkout";
import "./App.css";
import { observer } from "mobx-react-lite";
import { useAssetPreloader } from "./utils/useAssetPreloader";
import { getAssetsToPreload } from "./utils/assetsToPreload";
import { LoadingScreen } from "./ui/Components/LoadingScreen";
import { Toaster } from "react-hot-toast";

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
        <Routes>
          <Route path="/" element={<DesignPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
});
