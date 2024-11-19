import React , { useState , useEffect} from 'react'
import { useNavigate , useLocation } from 'react-router-dom';
import { useProjects } from './ProjectsContext';
import axios from 'axios';

const NewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const toggleUserDetails = () => setIsUserDetailsOpen((prev) => !prev);
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const handleCreateProject = async() => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
      }

      const response = await axios.post('https://podcastbe.onrender.com/projects/', { name: projectName }, {
          headers: { Authorization: `Bearer ${token}` }
      });
      if (!projectName.trim()) {
        alert("Project name can't be empty!");
        return;
      }
  
      if (projectName.trim() === '') {
        setError("Project Name Can't be empty");
        return;
    }
      setProjects([...projects, response.data]);
      setProjectName('');
      setIsPopupOpen(false);
      
      //project ID in local storage
      const existingProjects = JSON.parse(localStorage.getItem('projects')) || [];
      localStorage.setItem('projects', JSON.stringify([...existingProjects, response.data._id]));
      console.log('Stored project IDs:', JSON.parse(localStorage.getItem('projects')));
      navigate('/homePage'); // Navigate to Projects
  } catch (err) {
      console.error('Error creating project:', err);
      setError(`Failed to create project: ${err.message}`);
      if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
      }
  }

  };

  
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const fetchUserInfo = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`https://podcastbe.onrender.com/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        localStorage.setItem('user',response.data);
        setUser(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen">
         {/* Logo */}
        <div className="absolute top-0 left-0 p-10">
            <img src="https://i.ibb.co/gZn9H1F/full-logo.png" 
            alt="fullLogo" 
            className='h-14' />
        </div>
        {/* Top-right Icons */}
        <div className="absolute top-0 right-0 p-10 flex space-x-4">
                <i className="fas fa-cog text-gray-600 text-2xl" 
                id='setting'
                onClick={toggleUserDetails}
                ></i>
                <i className="fas fa-bell text-gray-600 text-2xl" 
                id='bell'></i>
        </div>

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
          <p><strong>Name:</strong> {username ||user?.username|| 'Username'}</p>
          <p><strong>Email:</strong> {email ||user?.email ||'username@gmail.com'}</p>
        </div>
      )}
         {/* Main Content */}
        <div className="text-center mt-28 ">
        <h1 className="text-4xl font-bold text-purple-700">
            Create a New Project
        </h1>
        <div className="mt-2">
            <img  className="mx-auto" src="https://i.ibb.co/k5bKgCK/new-Project.png" height="300"  width="425" alt="two people working on a project together" />
        </div>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        </p>
        <button className="mt-8 w-56 bg-purple-950 text-white font-bold pr-4 pl-4 py-2 rounded-lg flex items-center text-lg justify-self-center"
         onClick={openPopup}>
            <i className="fas fa-plus mr-2">
            </i>
            Create New Project
        </button >
        </div>

             {/* Popup */}
             {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-8 rounded-lg shadow-lg w-2/3 text-left">
            <h2 className="text-2xl font-bold mb-4">Create Project</h2>
            <label className="block text-lg mb-2">Enter Project Name:</label>
            <input 
            type="text" 
            placeholder="Type here" 
            className="w-full p-2 border rounded mb-2"
            value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
               />
            <p className="text-red-500 text-sm mb-4">Project Name Can't be empty</p>
            <div className="flex justify-end space-x-4">
              <button className="text-red-500" onClick={closePopup}>
                Cancel
              </button>
              <button className="bg-purple-700 text-white px-4 py-2 rounded"
                onClick={handleCreateProject}>Create</button>
            </div>
          </div>
        </div>

        )}
 </div>
  )
}

export default NewProject