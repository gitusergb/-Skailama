import React, { useState , useEffect}  from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const navigate = useNavigate(); 

    useEffect(() => {
      fetchProjects();
  }, []);

  const fetchProjects = async () => {
      try {
          const userId = localStorage.getItem('userId');
          if (!userId) {
              setError('User ID not found. Please login again.');
              return;
          }

          const token = localStorage.getItem('token');
          if (!token) {
              setError('No authentication token found. Please log in again.');
              return;
          }

          const response = await axios.get(`https://podcastbe.onrender.com/projects/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setProjects(response.data);
      } catch (err) {
          console.error('Error fetching projects:', err);
          if (err.response) {
              setError(`Server error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`);
          } else if (err.request) {
              setError('No response received from server. Please check your connection.');
          } else {
              setError(`Error: ${err.message}`);
          }
      }
  };

    const handleCreateNewProject = () => {
      navigate('/newProject'); 
    };
    const handleProjectClick = (project) => {
      console.log(project)
      if (project._id) {
        localStorage.setItem('selected ProjectId', project._id);
        //navigate(`/${_id}`);
        console.log('Selected project ID:', project._id);
        navigate('/addPodcast');
    } else {
        console.error('Invalid project ID:', project._id);
    }
    };
  
    const toggleUserDetails = () => setIsUserDetailsOpen((prev) => !prev);
  return (
    <div className="p-8">
    <header className="flex justify-between items-center mb-16">
          {/* Logo */}
        <div className="absolute top-0 left-0 p-10">
            <img src="https://i.ibb.co/gZn9H1F/full-logo.png" alt="fullLogo" className='h-14' />
        </div>
       
         {/* Top-right Icons */}
         <div className="absolute top-0 right-0 p-10 flex space-x-4">
                <i className="fas fa-cog text-gray-600 text-2xl"
                 onClick={toggleUserDetails}></i>
                <i className="fas fa-bell text-gray-600 text-2xl"></i>
        </div>
    </header>
 {/* User Details Popup */}
 {isUserDetailsOpen && (
              <div className="absolute top-20 right-10 bg-white p-4 shadow-lg rounded border border-gray-300 z-50">
             <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">User Details</h3>
            <button
              className="text-red-500 font-bold text-lg"
              onClick={toggleUserDetails}
            > ×
            </button>
          </div>
          <p><strong>Name:</strong> {username || 'Username'}</p>
          <p><strong>Email:</strong> {email || 'username@gmail.com'}</p>
        </div>
      )}
  {/* Main Content */}
    <main className="p-8" >
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-purple-600">Projects</h1>
            
            <button className="flex items-center bg-purple-900 text-white px-4 py-2 rounded" 
                onClick={handleCreateNewProject} >
                <i className="fas fa-plus mr-2"></i>
                Create New Project
            </button>
        </div>

        <div className="ProjectList">
        {projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} 
              className="flex items-center border rounded-lg p-4 shadow-sm mb-4" 
              id='ProjectDiv'
              onClick={() => handleProjectClick(project)}>
                <div className="bg-yellow-500 text-white text-3xl font-bold w-16 h-16 flex items-center justify-center rounded-lg">
                  {project.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-purple-600">{project.name}</h2>
                  <p className="text-gray-600">{project.episodeCount} Episodes</p>
                  <p className="text-gray-400 text-sm">Last edited: {project.updatedAt}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects yet. Create one to get started!</p>
          )}
        </div>
    </main>
</div>
  )
}

export default HomePage