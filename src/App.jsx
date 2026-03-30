import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./App.css";

import Files from "./pages/FilesPage";
import Groups from "./pages/GroupsPage";
import Upload from "./pages/UploadPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Files />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;