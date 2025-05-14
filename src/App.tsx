import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainApp from './MainApp';
import CreateProject from './pages/CreateProject';
import ProjectPage from './pages/ProjectPage';
import { Routes, Route } from "react-router";
import TestPage from './pages/TestPage';



function App() {


  return (
    <>
   
      {/* <TestPage/> */}
  
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />

          <div className="p-4">
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
