import MainEditor from './components/editor/MainEditor';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainApp from './MainApp';
import CreateProject from './pages/CreateProject';
import ProjectPage from './pages/ProjectPage';
import { Routes, Route } from "react-router";
function App() {


  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainApp />} />
             <Route path="/create-project" element={<MainEditor />} />
             <Route path="/project/:projectId" element={<ProjectPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
