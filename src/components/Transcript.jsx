import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transcript = () => {
  let projectId = localStorage.getItem("selected ProjectId");
  const navigate = useNavigate();

  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUserInfo();
     //fetchTranscript();
  }, []);
  const fetchUserInfo = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`https://podcastbe.onrender.com/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

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


  const fetchTranscript = async() => {
    setLoading(true);
    try {
        const response = await axios.get(`https://podcastbe.onrender.com/podcasts/${projectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        let ts=response.data
        console.log("ts",ts)
        setLoading(false);
        setTranscript(ts);
        setEditedTranscript(ts);
    } catch (error) {
      setLoading(false);
      setTranscript(dummyTranscript);
      setEditedTranscript(JSON.parse(JSON.stringify(dummyTranscript)));
    
        console.error('Error fetching transcript:', error);
    } finally {
        setLoading(false);
    }
  };
  
    const dummyTranscript = {
      title: "Sample Transcript",
      speakers: [
        {
          name: "Speaker",
          content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
        }
      ]
    };
  
    const handleEdit = () => {
      setIsEditing(true);
    };
  
    const handleSave = () => {
      setTranscript(editedTranscript);
      setIsEditing(false);
    };
  
    const handleDiscard = () => {
      setEditedTranscript(JSON.parse(JSON.stringify(transcript)));
      setIsEditing(false);
    };
  
    const handleContentChange = (index, newContent) => {
      const updatedSpeakers = [...editedTranscript.speakers];
      updatedSpeakers[index] = { ...updatedSpeakers[index], content: newContent };
      setEditedTranscript({ ...editedTranscript, speakers: updatedSpeakers });
    };
  return (
    <div className="flex h-screen">
                    <aside className="w-64 bg-white p-6 border-r border-gray-200">
                        <div className="flex items-center mb-8">
                        <img src="https://i.ibb.co/gZn9H1F/full-logo.png" alt="fullLogo" className='h-14' />
                        </div>
                        <nav>
                            <ul>
                                <li className="mb-4">
                                    <a href="#" className="flex items-center text-purple-600 font-medium">
                                        <i className="fas fa-plus mr-2"></i>
                                        Add your Podcast(s)
                                    </a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="flex items-center text-gray-600">
                                        <i className="fas fa-pen mr-2"></i>
                                        Create & Repurpose
                                    </a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="flex items-center text-gray-600">
                                        <i className="fas fa-podcast mr-2"></i>
                                        Podcast Widget
                                    </a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="flex items-center text-gray-600">
                                        <i className="fas fa-arrow-up mr-2"></i>
                                        Upgrade
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <div className="mt-auto">
                            <a href="#" className="flex items-center text-gray-600">
                                <i className="fas fa-cog mr-2"></i>
                                Help
                            </a>
                        </div>
                    </aside>
                    <main className="flex-1 p-8">
                        <div className="flex items-center mb-6">
                            <a href="#" className="text-gray-500 mr-2">
                                <i className="fas fa-home"></i>
                            </a>
                            <span className="text-gray-500">/</span>
                            <a href="#" className="text-gray-500 ml-2">Sample Project</a>
                            <span className="text-gray-500">/</span>
                            <a href="#" className="text-purple-600 ml-2">Add your podcast</a>
                             {/* Notification Icon */}
                             <div className="absolute top-5 right-5 flex gap-2 ">
                                <i className="fas fa-bell text-2xl cursor-pointer text-gray-600"
                                ></i> 
                                 <button  onClick={handleLogout}>
                                    <img className="h-7 cursor-pointer text-gray-600" src="https://i.ibb.co/QN6bPBs/logout.png" alt="logout" />
                                  </button>      
                                </div>
                        </div>
                        {loading && <p>Loading transcript...</p>}
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Transcript</h1>
                        
                        {(isEditing ? editedTranscript : transcript) && (
                            <div id="transcript-content"  className="bg-white p-6 rounded-lg shadow" >
                              <h2>{(isEditing ? editedTranscript : transcript).title}</h2>
                              {(isEditing ? editedTranscript : transcript).speakers.map((speaker, index) => (
                                <div key={index} className="speaker-section">
                                  <h3 className="text-purple-600 font-medium mb-4">{speaker.name}</h3>
                                  {isEditing ? (

                                    <textarea className="text-gray-700 mb-4" id="content-input"
                                      value={speaker.content}
                                      onChange={(e) => handleContentChange(index, e.target.value)}
                                    />
                                  ) : (
                                    <p className="text-gray-700 mb-4">{speaker.content}</p>
                                  )}
                                </div>
                              ))}
                               </div>
          )}
                        {!isEditing ? (
            <button className="mt-6 bg-purple-800 text-white px-4 py-2 rounded-lg shadow" onClick={handleEdit}>Edit</button>
          ) : (
            <div className="buttons">
              <button className="mt-6 text-purple-950 bg-white px-4 py-2 rounded-lg shadow" onClick={handleDiscard}>Discard</button>
              <button className="mt-6 bg-purple-800 text-white px-4 py-2 rounded-lg shadow" onClick={handleSave}>Save</button>
            </div>
          )}
                    </main>
                </div>
  )
}

export default Transcript