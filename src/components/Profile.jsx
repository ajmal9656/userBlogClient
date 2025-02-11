import React, { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Modal from "./common/Modal";
import Navbar from "./common/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosUrl from "../utils/axios";
import { updateProfile } from "../redux/action/userActions";
import { logoutUser } from "../redux/action/userActions";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  const userData = useSelector((state) => state.user.userInfo);
  const location = useLocation();
  const { userId } = location.state || {};

  console.log('storedata',userData);
  console.log('usedata',userId);


  const categories = [
    'Technology', 'Health', 'Science', 'Travel', 'Lifestyle', 'Business', 'Art', 'Sports',
    'Food', 'Education', 'Music', 'Movies', 'Books', 'Fitness', 'Nature', 'Photography',
    'Gaming', 'Politics', 'Finance', 'Culture', 'History', 'News', 'Fashion', 'Beauty',
    'Environment', 'Design', 'Innovation', 'Society', 'Economy', 'Marketing', 'Spirituality', 
    'Psychology', 'Parenting'
  ];

 

 

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreateBlogOpen, setIsCreateBlogOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  
 

  useEffect(() => {
    // Check if userData.id is available
    if (userData?.id) {
      const fetchBlogs = async () => {
        try {
          // Make the API call to get the blogs by userId
          const response = await axiosUrl.get(`/user-blogs/${userData.id}`, {
            withCredentials: true,
          });
          
          console.log("user blogsssss",response)
          setBlogs(response.data.reverse()); // Set the fetched blogs in state
        } catch (err) {

          if(err.response.status==401){
            if(userData){
              await dispatch(logoutUser(userData.id));
            }
            navigate("/login")
          }
          
          console.log(err.response.status);
          
        } 
      };

      fetchBlogs();
    }
  }, [userData?.id]);

  const formikProfile = useFormik({
    initialValues: {
      name: userData?.name,
      about: userData?.about,
      
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('Name is required'),
      about: Yup.string().trim().required('About is required'),
      
    }),
    onSubmit: async(values) => {
      
      console.log("values",values);
      const userDetails = {
        name:values.name.trim(),
        about:values.about.trim(),
        id:userData.id
      }
      console.log("values",userDetails);
      try {
        const response = await dispatch(updateProfile(userDetails))
  
        console.log("Profile updated successfully:", response);
  
        // Optionally update UI or close modal after success
        setIsEditProfileOpen(false);
        
      } catch (error) {
        if(error.response.status==401){
          if(userData){
            await dispatch(logoutUser(userData.id));
          }
          navigate("/login")
        }
        
        
        console.error("Error updating profile:", error.response?.data || error.message);
      }
      // setIsEditProfileOpen(false);
    },
  });

  const formikBlog = useFormik({
    initialValues: {
      title: '',
      description: '',
      image: '',
      categories: [],
    },
    validationSchema: Yup.object({
      title: Yup.string()
    .trim()
    .required('Title is required'),
      description: Yup.string().trim().required('Description is required'),
      image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File is too large', (value) => value && value.size <= 2000000) // 2MB limit
        .test('fileType', 'Unsupported File Format', (value) => value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)),

    }),
    onSubmit: async (values) => {
      try {
        console.log("valueeee",values)
        const formData = new FormData();
        formData.append('title', values.title.trim());
        formData.append('description', values.description.trim());
        formData.append('image', values.image); // Assuming values.image is a File object
        formData.append('categories', JSON.stringify(values.categories)); // Convert array to JSON string
        formData.append('userId', userData.id); // Include user ID
        console.log("blog",formData)
  
        const response = await axiosUrl.post('/create-blog', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
  
        console.log('Blog created successfully:', response.data);
        setBlogs((prev)=>[response.data,...prev])
        setIsCreateBlogOpen(false); // Close modal after successful creation
      } catch (error) {
        if(error.response.status==401){
          if(userData){
            await dispatch(logoutUser(userData.id));
          }
          navigate("/login")
        }
        
        
        console.error('Error creating blog:', error.response?.data || error.message);
      }
    },
  });

  

  

  

 

  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("file",file)
      formikBlog.setFieldValue("image", file);
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    formikProfile.handleSubmit();
  };

  const handleSubmitBlog = (e) => {
    e.preventDefault();
    formikBlog.handleSubmit();
  };

  const handleCardClick = (blogId) => {
    // Navigate to /blog-details and pass the blog._id as state
    console.log(blogId);
    
    navigate('/blog-details', { state: { blogId: blogId } });
  };

  return (
    <>
      <Navbar />
      <div className="mt-6">
        <div className="w-full mx-auto p-20 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
          {/* User Info */}
          <div className="flex items-center space-x-6 border-b pb-6">
            
            <div className="flex justify-between w-full">
              <div>
                <div className="flex space-x-8">
                  <h2 className="text-3xl font-extrabold text-gray-800">{userData?.name}</h2>
                  {/* Show Edit Profile icon only if userData.id equals userId */}
                  {(userData?.id !== undefined && userId === undefined) || (userId && userData?.id === userId) ? (
  <AiOutlineEdit
    className="text-blue-500 mt-2 text-2xl cursor-pointer hover:text-blue-600 transition"
    onClick={() => setIsEditProfileOpen(true)}
  />
) : null}


                </div>
                <p className="text-gray-500 text-lg">{userData?.email}</p>
                <p className="text-gray-700 mt-3 text-base italic">{userData?.about}</p>
              </div>
            </div>
          </div>

          {/* User's Blog Posts */}
          <div className="my-6 flex justify-between items-center">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">User's Blog Posts</h3>
            {(userData?.id !== undefined && userId === undefined) || (userId && userData?.id === userId) ? (
  <button
    className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
    onClick={() => setIsCreateBlogOpen(true)}
  >
    Create Blog
  </button>
) : null}



          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden h-[420px] transition-transform transform hover:scale-105 hover:shadow-lg" onClick={()=>handleCardClick(blog._id)}>
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

          {/* Pagination */}
          {/* <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-blue-500 hover:text-white transition duration-200"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-blue-500 hover:text-white transition duration-200"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div> */}

          {/* Modal for Edit Profile */}
          <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)}>
  <h3 className="text-xl font-semibold mb-4 w-[400px]">Edit Profile</h3>
  <form onSubmit={handleSubmitProfile}>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
      <input
        type="text"
        name="name"
        value={formikProfile.values.name}
        onChange={formikProfile.handleChange}
        onBlur={formikProfile.handleBlur}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {formikProfile.errors.name && formikProfile.touched.name && (
        <div className="text-red-500 text-sm">{formikProfile.errors.name}</div>
      )}
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">About</label>
      <textarea
        name="about"
        value={formikProfile.values.about}
        onChange={formikProfile.handleChange}
        onBlur={formikProfile.handleBlur}
        rows="4"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {formikProfile.errors.about && formikProfile.touched.about && (
        <div className="text-red-500 text-sm">{formikProfile.errors.about}</div>
      )}
    </div>

    <button
      type="submit"
      className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Save Changes
    </button>
  </form>
</Modal>


          {/* Modal for Creating Blog */}
          <Modal isOpen={isCreateBlogOpen} onClose={() => setIsCreateBlogOpen(false)}>
            <h3 className="text-xl font-semibold mb-4">Create Blog</h3>
            <form onSubmit={handleSubmitBlog}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formikBlog.values.title}
                  onChange={formikBlog.handleChange}
                  onBlur={formikBlog.handleBlur}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formikBlog.errors.title && formikBlog.touched.title && (
                  <div className="text-red-500 text-sm">{formikBlog.errors.title}</div>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formikBlog.values.description}
                  onChange={formikBlog.handleChange}
                  onBlur={formikBlog.handleBlur}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formikBlog.errors.description && formikBlog.touched.description && (
                  <div className="text-red-500 text-sm">{formikBlog.errors.description}</div>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Blog Image</label>
                <input
                  type="file"
                  onChange={handleBlogImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                />
                {formikBlog.errors.image && formikBlog.touched.image && (
                  <div className="text-red-500 text-sm">{formikBlog.errors.image}</div>
                )}
              </div>

              <div className="mb-2 w-[750px]">
                <label className="block text-gray-700 text-sm font-medium mb-2">Categories</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-x-12 ">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={category}
                        checked={formikBlog.values.categories.includes(category)}
                        onChange={() => {
                          const newCategories = formikBlog.values.categories.includes(category)
                            ? formikBlog.values.categories.filter((item) => item !== category)
                            : [...formikBlog.values.categories, category];
                          formikBlog.setFieldValue('categories', newCategories);
                        }}
                        className="focus:ring-blue-500"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
                {formikBlog.errors.categories && formikBlog.touched.categories && (
                  <div className="text-red-500 text-sm">{formikBlog.errors.categories}</div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Create Blog
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Profile;
