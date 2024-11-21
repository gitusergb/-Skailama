import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsProvider } from './components/ProjectsContext';

import AddPodcast from './components/AddPodcast';
import Login from './components/Login';
import NewProject from './components/NewProject';
import HomePage from './components/HomePage';
import UserSettings from './components/UserSettings';
import Transcript from './components/Transcript';
import Register from './components/Register';
import Auth from './Context/AuthContext';
import Protect from './Context/Protect'



function App() {
  return (
    <div className="App">
      <ProjectsProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Auth><Register /></Auth>} />
          <Route path="/" element={<Auth><Login /></Auth>} />
          <Route path="/newProject" element={<Protect><NewProject /></Protect>} />
          <Route path="/homePage" element={<Protect><HomePage /></Protect>} /> 
          <Route path="/addPodcast" element={<Protect><AddPodcast /></Protect>} />
          <Route path="/userSettings" element={<Protect><UserSettings /></Protect>} />
          <Route path="/transcript" element={<Protect><Transcript /></Protect> } />
        </Routes>
      </Router>
    </ProjectsProvider>
    </div>
  );
}

export default App;
