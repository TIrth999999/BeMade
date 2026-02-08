import { StoreProvider } from "./context/StoreContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DesignPage } from "./ui/DesignPage";
import { Checkout } from "./ui/Components/Checkout";
import "./App.css";
import { observer } from "mobx-react-lite";

export default observer(function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DesignPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
});
