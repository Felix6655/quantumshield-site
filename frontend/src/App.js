import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import WalletPage from "@/pages/WalletPage";
import RoadmapPage from "@/pages/RoadmapPage";
import TeamPage from "@/pages/TeamPage";
import ContactPage from "@/pages/ContactPage";

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
