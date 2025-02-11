import React, { useState, useEffect } from 'react';
import Navbar from './common/NavBar';
import axiosUrl from '../utils/axios';
import { useNavigate } from 'react-router-dom';

// Dummy topics
const topics = [
  'Technology', 'Health', 'Science', 'Travel', 'Lifestyle', 'Business', 'Art', 'Sports',
  'Food', 'Education', 'Music', 'Movies', 'Books', 'Fitness', 'Nature', 'Photography',
  'Gaming', 'Politics', 'Finance', 'Culture', 'History', 'News', 'Fashion', 'Beauty',
  'Environment', 'Design', 'Innovation', 'Society', 'Economy', 'Marketing', 'Spirituality', 'Psychology', 'Parenting'
];

function Blogs() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);  // Selected topics for filtering
  const [blogs, setBlogs] = useState([]); // For storing fetched blog data

  const navigate =useNavigate();

  const fetchBlogs = async () => {
    try {
      console.log("preferences:", selectedTopics);

      const response = await axiosUrl.post('getAllBlogs', 
        { preferences: selectedTopics },  // Pass preferences as query parameter
);
      console.log("data:", response.data);
      
      setBlogs(response.data.reverse()); // Assuming your API returns an array of blogs
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs whenever selectedTopics changes
  }, []);  // Dependency array includes selectedTopics

  // Add or remove the topic from the selectedTopics array
  const handleTopicChange = (topic) => {
    setSelectedTopics((prevTopics) => {
      if (prevTopics.includes(topic)) {
        // If the topic is already in the array, remove it
        return prevTopics.filter((t) => t !== topic);
      } else {
        // Otherwise, add the topic to the array
        return [...prevTopics, topic];
      }
    });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCardClick = (blogId,userId) => {
    // Navigate to /blog-details and pass the blog._id as state
    console.log(blogId);
    
    navigate('/blog-details', { state: { blogId: blogId,userId:userId } });
  };

  return (
    <>
      <Navbar />

      <div className="mt-14">
        {/* Top Section with Background Image and Text */}
        <div className="relative w-full h-140 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <h1 className="text-5xl font-extrabold">Welcome to Our Blog</h1>
            <p className="text-lg mt-4 ml-4">Explore the latest stories and insights from around the world.</p>
          </div>
        </div>

        {/* Blog List Section */}
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">Latest Articles</h2>
            <div>
              <button
                onClick={toggleModal}
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Preferences
              </button>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">Stay updated with our most recent blogs, covering diverse topics that matter to you.</p>

          <div className="grid gap-14 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden h-[420px] transition-transform transform hover:scale-105 hover:shadow-lg" onClick={()=>handleCardClick(blog._id,blog.userId)}>
                {/* Blog Image */}
                <img
                  src={blog.image.url}
                  alt={blog.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  {/* Blog Title */}
                  <h3 className="text-2xl font-semibold text-gray-900">{blog.title}</h3>
                  {/* Blog Date */}
                  <p className="text-sm text-gray-500 mb-2">
  Posted on <span className="font-semibold">{blog?.createdAt ? blog.createdAt.split("T")[0] : "N/A"}</span>
</p>

                  {/* Blog Description */}
                  <p className="text-gray-700 mt-4 h-[30px]">{blog.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
              <h2 className="text-2xl font-semibold mb-4">Select Your Topics</h2>
              <div className="grid grid-cols-4 gap-6">
                {topics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={topic}
                      checked={selectedTopics.includes(topic)} // Check if the topic is in the selectedTopics array
                      onChange={() => handleTopicChange(topic)} // Handle the checkbox change
                      className="h-4 w-4"
                    />
                    <label htmlFor={topic} className="text-lg">{topic}</label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={toggleModal}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                >
                  Close
                </button>
                <button
  onClick={() => {
    fetchBlogs(); // Call fetchBlogs to fetch the blogs
    setShowModal(false); // Close the modal
  }}
  className="px-6 py-3 bg-green-500 text-white rounded-lg"
>
  Save Preferences
</button>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Blogs;
