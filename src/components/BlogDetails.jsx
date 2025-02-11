import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from './common/Modal';
import Navbar from './common/NavBar';
import axiosUrl from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';

const BlogDetails = () => {
  const [isEditBlogOpen, setIsEditBlogOpen] = useState(false);
  const [blogData, setBlogData] = useState({
    image: '',
    title: '',
    date: '',
    userId: '',
    description: '',
  });
  const userData = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const location = useLocation();
  const { blogId,userId } = location.state || {}; // Retrieve blogId from the location state
  

  const categories = [
    'Technology', 'Health', 'Science', 'Travel', 'Lifestyle', 'Business', 'Art', 'Sports',
    'Food', 'Education', 'Music', 'Movies', 'Books', 'Fitness', 'Nature', 'Photography',
    'Gaming', 'Politics', 'Finance', 'Culture', 'History', 'News', 'Fashion', 'Beauty',
    'Environment', 'Design', 'Innovation', 'Society', 'Economy', 'Marketing', 'Spirituality', 
    'Psychology', 'Parenting'
  ];

  useEffect(() => {
    if (blogId) {
      axiosUrl
        .get(`/blog-details/${blogId}`)
        .then((response) => {
          console.log("dataa",response.data);
          
          setBlogData(response.data);
        })
        .catch((err) => {
          console.error('Error fetching blog details:', err);
        });
    }
  }, [blogId]);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().trim().required('Title is required'),
    description: Yup.string().trim().required('Description is required'),
    image: Yup.mixed()
      .nullable()
      .test('fileSize', 'File is too large (max 2MB)', (value) => {
        if (!value) return true; // Allow empty values
        return value.size <= 2000000;
      })
      .test('fileType', 'Unsupported file format (only JPG, JPEG, PNG allowed)', (value) => {
        if (!value) return true; // Allow empty values
        return ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type);
      }),
    
  });
  
  

  const formik = useFormik({
    initialValues: {
      title: blogData.title.trim() || '',
      description: blogData.description.trim() || '',
      image: null,
      categories: blogData.categories || [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
  
        if (values.image) {
          formData.append('image', values.image);
        }
  
        formData.append('title', values.title.trim());
        formData.append('description', values.description.trim());
        formData.append('categories', JSON.stringify(values.categories)); // Send categories as JSON array
  
        const response =await axiosUrl.put(`/edit-blog/${blogId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log("edit res",response.data);
        
  
        setBlogData(response.data)
        setIsEditBlogOpen(false);
      } catch (error) {
        if(error.response.status==401){
                    if(userData){
                      await dispatch(logoutUser(userData.id));
                    }
                    navigate("/login")
                  }
                  
                  
        console.error('Error updating blog:', error);
        alert('Failed to update blog. Please try again.');
      }
    },
  });
  

  return (
    <>
      <Navbar />
      <div className="mt-14">
        <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-lg">
          {/* Blog Image */}
          <div className="relative h-150 mb-6 rounded-lg overflow-hidden">
            <img
              src={blogData.image.url}
              alt={blogData.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-4">
  <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{blogData.title}</h1>
  
  {/* Conditionally render the edit icon */}
  {(userData?.id !== undefined && userId === undefined) || (userId && userData?.id === userId) ? (
    <AiOutlineEdit
      className="text-blue-500 mt-2 text-2xl cursor-pointer hover:text-blue-600 transition"
      onClick={() => setIsEditBlogOpen(true)}
    />
  ) : null}
</div>

          {/* Posted Date */}
          <p className="text-sm text-gray-500 mb-2">
  Posted on <span className="font-semibold">
    {blogData?.createdAt ? blogData.createdAt.split("T")[0] : "N/A"}
  </span>
</p>


          <p className="text-sm text-gray-500 mb-2">
  Tags:{" "}
  {blogData.categories && blogData.categories.length > 0 ? (
    blogData.categories.map((category, index) => (
      <span key={index} className="font-semibold">
        {category}
        {index !== blogData.categories.length - 1 && ", "}
      </span>
    ))
  ) : (
    <span className="text-gray-400">No tags available</span>
  )}
</p>

          <p className="text-sm text-gray-500 mb-6">
            Posted by <span className="font-bold text-xl text-black">{blogData.userId.name}</span>
          </p>

          {/* Blog Description */}
          <p className="text-lg text-gray-700 leading-relaxed">{blogData.description}</p>

          {/* Edit Blog Modal */}
          <Modal isOpen={isEditBlogOpen} onClose={() => setIsEditBlogOpen(false)}>
            <h3 className="text-xl font-semibold mb-4">Edit Blog</h3>
            <form onSubmit={formik.handleSubmit}>
              {/* Blog Image Upload */}
              <div className="mb-4">
                <label className="block text-gray-700">Blog Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={(event) => {
                    formik.setFieldValue('image', event.currentTarget.files[0]);
                  }}
                  className="w-full p-2 border rounded-md"
                />
                {formik.errors.image && formik.touched.image && (
                  <p className="text-red-500 text-sm">{formik.errors.image}</p>
                )}
              </div>

              {/* Blog Title */}
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded-md"
                />
                {formik.errors.title && formik.touched.title && (
                  <p className="text-red-500 text-sm">{formik.errors.title}</p>
                )}
              </div>

              {/* Blog Description */}
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded-md"
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="text-red-500 text-sm">{formik.errors.description}</p>
                )}
              </div>
              {/* Blog Categories */}
              <div className="mb-4">
  <label className="block text-gray-700 font-semibold mb-2">Categories</label>
  <div className="grid grid-cols-5 gap-2">
    {categories.map((category) => (
      <label key={category} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="categories"
          value={category}
          checked={formik.values.categories.includes(category)}
          onChange={(event) => {
            const isChecked = event.target.checked;
            const selectedCategories = isChecked
              ? [...formik.values.categories, category] // Add if checked
              : formik.values.categories.filter((c) => c !== category); // Remove if unchecked
            formik.setFieldValue('categories', selectedCategories);
          }}
          className="h-4 w-4"
        />
        <span>{category}</span>
      </label>
    ))}
  </div>
  {formik.errors.categories && formik.touched.categories && (
    <p className="text-red-500 text-sm">{formik.errors.categories}</p>
  )}
</div>



              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
