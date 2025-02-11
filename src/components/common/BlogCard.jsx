import React from "react";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white border p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-56 object-cover rounded-md shadow-sm"
      />
      <h4 className="text-lg font-bold mt-4 text-gray-800">{blog.title}</h4>
      <p className="text-sm text-gray-500 ">
        Posted on <span className="font-semibold">{blog.date}</span>
      </p>
    </div>
  );
};

export default BlogCard;
