import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddPodcast = () => {

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [name, setname] = useState('');
  const [fileurl, setfileurl] = useState('');
  
    const navigate = useNavigate();
    const location = useLocation();
  
    const project = location.state?.project || {};
    
    // State to manage episodes and notification visibility
    const [note, setNote] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [currentView, setCurrentView] = useState("upload"); // 'upload', 'rss', 'youtube'
    const [youtubeFormVisible, setYoutubeFormVisible] = useState(false);
    const [rssFiles, setRssFiles] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(localStorage.getItem('selectedProjectId') || '');

    // Fetch project details on component mount
useEffect(() => {
  const fetchProjectDetails = async () => {
    let projectId = localStorage.getItem("selected ProjectId");
    if (!projectId) {
      console.error("No projectId found in local storage.");
      return;
    }

    console.log('Selected project ID:', projectId ,typeof(projectId));
   
    try {
      const response = await axios.get(
        `https://podcastbe.onrender.com/podcasts/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.error("response:", response );
      if (!response) {
        throw new Error("Failed to fetch project details");
      }
      setRssFiles(response.data.podcasts|| []);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  fetchProjectDetails();
}, []);
    //To add a new video/podcast
    const addVideo= async(e) => {
        e.preventDefault();
        const projectId = localStorage.getItem("selected ProjectId");
        const podcast = {
          id: rssFiles.length + 1, 
          name,
          fileurl,
          uploadDate: new Date().toLocaleString("en-GB"),
          status: "In Progress",
        };
      
    try {
      const response = await axios.post(
        `https://podcastbe.onrender.com/podcasts/${projectId}`,
        podcast,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setRssFiles((prev) => [...prev, podcast]);
        setYoutubeFormVisible(false);
        alert("Video added successfully!");
      }
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video.");
    }
    };
  
    // Toggle notification visibility
    const toggleNotifications = () => setIsNotificationOpen((prev) => !prev);

    const handleLogout = async () => {
      try {
          await axios.post('https://podcastbe.onrender.com/users/logout', {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          localStorage.clear();
          navigate('/');
      } catch (error) {
          console.error('Logout failed:', error);
          toast.error(error.message);
      }
  };

  const handleView = (id) => {
    navigate(`/transcript`);
};

const handleDelete = async (id) => {
    try {
        await axios.delete(`https://podcastbe.onrender.com/podcasts/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const updatedPodcasts = rssFiles.filter(podcast => podcast._id !== id);
        setRssFiles(updatedPodcasts);
        localStorage.setItem(`podcasts_${selectedProjectId}`, JSON.stringify(updatedPodcasts));
        toast.success('Podcast deleted successfully');
    } catch (err) {
        console.error('Failed to delete podcast:', err);
        toast.error('Failed to delete podcast');
    }
};


  return (
    <div className="flex h-screen">
                    <aside className="w-64 bg-white shadow-md">
                        <div className="p-6">
                           <img src="https://i.ibb.co/gZn9H1F/full-logo.png" alt="fullLogo" />
                        </div>
                        <nav className="mt-6">
                            <a href="/addPodcast" className="flex items-center px-6 py-2 text-purple-600 bg-purple-100 rounded-lg">
                                <i className="fas fa-plus mr-3"></i>
                                Add your Podcast(s)
                            </a>
                            <a href="#" className="flex items-center px-6 py-2 mt-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <i className="fas fa-sync-alt mr-3"></i>
                                Create & Repurpose
                            </a>
                            <a href="#" className="flex items-center px-6 py-2 mt-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <i className="fas fa-podcast mr-3"></i>
                                Podcast Widget
                            </a>
                            <a href="#" className="flex items-center px-6 py-2 mt-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <i className="fas fa-arrow-up mr-3"></i>
                                Upgrade
                            </a>
                        </nav>
                        <div className="mt-auto p-6">
                            <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
                                <i className="fas fa-question-circle mr-3"></i>
                                Help
                            </a>
                            <div className="flex items-center mt-6">
                                <img src="https://placehold.co/40x40" alt="User avatar" className="w-10 h-10 rounded-full mr-3"/>
                                <div>
                                    <p className="text-gray-800"> {username || 'Username'}</p>
                                    <p className="text-gray-600 text-sm">{email || 'username@gmail.com'}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1 p-8">
                        <div className="flex-1 p-5 justify-around text-justify"> 
                            <div className="text-gray-600 text-sm ">
                            Home Page / {project.name || "Sample Project"} /{" "} <span className="text-purple-600">Add your podcast</span>
                             </div>
                                {/* Notification Icon */}
                                <div className="absolute top-5 right-5 flex gap-2 ">
                                <i className="fas fa-bell text-2xl cursor-pointer text-gray-600"
                                    onClick={toggleNotifications}
                                ></i> 
                                 <button  onClick={handleLogout}>
                                    <img className="h-7 cursor-pointer text-gray-600" src="https://i.ibb.co/QN6bPBs/logout.png" alt="logout" />
                                  </button>      
                                </div>
                                {/* Notifications */}
                                {isNotificationOpen && (
                                <div className="absolute top-20 right-10 bg-white p-4 shadow-lg rounded-lg border border-gray-300 z-50">
                                    <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">Notifications</h3>
                                    <button
                                        className="text-red-500 font-bold text-lg"
                                        onClick={toggleNotifications}
                                    >
                                        ×
                                    </button>
                                    </div>
                                    {note.length > 0 ? (
                                        note.map((nt) => (
                                        <div key={nt.id} className="mb-2">
                                        <strong>{nt.title}</strong>
                                        <p className="text-sm text-gray-500">{nt.description}</p>
                                        </div>
                                    ))
                                    ) : (
                                    <p className="text-gray-500">No Notifications yet.</p>
                                    )}
                                   </div>
                                )}

                        </div>
                       
                        <h2 className="mt-4 text-2xl font-semibold text-gray-800 text-left">Add Podcast</h2>
                     
                        <div  className="mt-6 grid grid-cols-3 gap-6">
                            <div onClick={() => setCurrentView("rss")} 
                                    className={`p-6 bg-white shadow-md rounded-lg text-center cursor-pointer 
                                    ${currentView === "rss" ? "border-2 border-purple-600" : ""}`}>
                                <i className="fas fa-rss text-4xl text-orange-500 mb-4"></i>
                                <h3 className="text-lg font-semibold text-gray-800">RSS Feed</h3>
                                <p className="text-gray-600 mt-2">Lorem ipsum dolor sit. Dolor lorem sit.</p>
                            </div>
                            <div onClick={() =>{
                                setYoutubeFormVisible(true);
                                
                            } } 
                            className="p-6 bg-white shadow-md rounded-lg text-center cursor-pointer">
                                <i className="fab fa-youtube text-4xl text-red-500 mb-4"></i>
                                <h3 className="text-lg font-semibold text-gray-800">Youtube Video</h3>
                                <p className="text-gray-600 mt-2">Lorem ipsum dolor sit. Dolor lorem sit.</p>
                            </div>
                            <div onClick={() => setCurrentView("upload")}
                                    className={`p-6 bg-white shadow-md rounded-lg text-center cursor-pointer 
                                    ${currentView === "upload" ? "border-2 border-purple-600" : ""
                                    }`}>
                                <i className="fas fa-upload text-4xl text-purple-500 mb-4"></i>
                                <h3 className="text-lg font-semibold text-gray-800">Upload Files</h3>
                                <p className="text-gray-600 mt-2">Lorem ipsum dolor sit. Dolor lorem sit.</p>
                            </div>
                        </div>
                        
                         {/* Content Sections */}
                            {currentView === "upload" && (
                            <div className="mt-6 p-6 bg-white shadow-md rounded-lg text-center">
                                <i className="fas fa-cloud-upload-alt text-6xl text-purple-500 mb-4"></i>
                                                <p className="text-gray-600">Select a file or drag and drop here (Podcast Media or Transcription Text)</p>
                                                <p className="text-gray-400 mt-2">MP4, MOV, MP3, WAV, PDF, DOCX or TXT file</p>
                                                <button className="mt-4 px-6 py-2 text-purple-600 bg-white rounded-lg ">Select File</button>
                            </div>
                            )}
                             {currentView === "rss" && (
                            
          <div className="mt-6 p-6 bg-white shadow-md rounded-lg ">
               <h2 className="text-lg font-semibold mb-4 text-left">Your Files</h2>
               <div >
                            0 file(s) are in progress, you would get an email once the transcription is complete.
                        </div>

                        {rssFiles.length===0?(<div >
                            0 file(s) ,Upload Files .
                        </div>):(
                               <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="py-2">No.</th>
                                        <th className="py-2">Name</th>
                                        <th className="py-2">Upload Date & Time</th>
                                        <th className="py-2">Status</th>
                                        <th className="py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {rssFiles.map((file,index) => (
                                        <tr className="border-t" key={file._id}>
                                            <td className="py-2">{index}</td>
                                            <td className="py-2">{file.title}</td>
                                            <td className="py-2">{file.updatedAt}</td>
                                            <td className="py-2">
                                            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                                {"In Progress"}
                                            </span>
                                            </td>
                                            <td className="py-2 flex items-center space-x-2">
                                            <button className="text-blue-600"onClick={() => handleView(file._id)}>View</button>
                                            <button className="text-red-600" onClick={() => handleDelete(file._id)}>Delete</button>
                                            <i className="fas fa-share text-gray-600"></i>
                                        </td>
                                        </tr>
                                        ))}
                                       
                                </tbody>
                            </table>)}
          </div>
        )}

        {/* YouTube Form Popup */}
        {youtubeFormVisible && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-2/3 text-left">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-red-600 h-16 font-bold text-2xl "
                onClick={() => setYoutubeFormVisible(false)}
              >
                ×
              </button>
              <div className="flex items-center mb-4">
              <i className="fab fa-youtube text-red-600 text-3xl mr-2"></i>
              <h2 className="text-xl font-semibold text-gray-800 ">
                Upload From Youtube</h2>
              </div>
              <form onSubmit={addVideo}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Name</label>
                                    <input type="text" 
                                     name="name"
                                     value={name}
                                     onChange={(e) => setname(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required/>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Link</label>
                                    <input type="url" 
                                            name="link"
                                            value={fileurl}
                                            onChange={(e) => setfileurl(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"/>
                                </div>
                                <button type="submit" 
                                    className="bg-purple-950 text-white px-4 py-2 rounded flex justify-self-end">Upload</button>
                            </form>
                        </div>
                    </div>
                    )}
                    </main>
                </div>
  )
}

export default AddPodcast