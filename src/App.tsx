import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainApp from './MainApp';
import CreateProject from './pages/CreateProject';
import ProjectPage from './pages/ProjectPage';
import { Routes, Route } from "react-router";
import TestPage from './pages/TestPage';
import {PhoneMockup} from './pages/MockUp';
import { DragDropProvider } from "@dnd-kit/react";
import Dashboard from './pages/dashboard';
function App() {


  return (
    <>
      {/* <TestPage /> */}

      {/* <PhoneMockup /> */}
      <div className="max-h-screen max-w-screen overflow-x-auto overflow-y-hidden   flex no-scrollbar flex-col">
        {/* <Navbar /> */}
        <div className="flex flex-1 no-scrollbar">
          {/* <Sidebar /> */}

          <div className="">
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
