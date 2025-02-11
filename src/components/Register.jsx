import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axiosUrl from '../utils/axios';
import { toast } from 'sonner';

function Register() {

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      aboutMe: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
    .trim()
    .required('Full Name is required')
    .min(3, 'Full Name must be at least 3 characters')
,
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          'Password must contain at least one letter, one number, and one special character'
        )
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    
    }),
    onSubmit: async (values) => {
      try {
        localStorage.clear();
        const response = await axiosUrl.post('/register', {
          name: values.fullName.trim(),
          email: values.email,
          password: values.password,
          about: values.aboutMe,
        });
        
        console.log('User registered successfully:', response.data);
        if (response.data) {
          localStorage.setItem('userEmail', values.email);
          navigate('/otp');
        }
      } catch (error) {
        toast.error(error.response?.data.message)
        console.error('Error registering user:', error.response ? error.response.data : error);
      }
    },
  });


  return (
    <div className="w-full h-auto">
      <div className="w-full h-[729px] flex justify-center items-center bg-gray-100">
        <div className="w-[35%] h-[670px] bg-white rounded-md shadow-lg flex flex-col space-y-3 justify-center items-center text-gray-800">
          <div className="w-[90%] h-[60px] flex place-content-center items-center">
            <h1 className="text-4xl font-semibold">Register</h1>
          </div>

          {/* Full Name */}
          <div className="w-[90%] h-auto flex flex-col space-y-1">
            <label htmlFor="fullName" className="font-medium">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your name"
              className="p-2 pl-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <div className="text-red-500 text-sm h-[7px]">{formik.errors.fullName}</div>
            ) : null}
          </div>

          {/* Email */}
          <div className="w-[90%] h-auto flex flex-col space-y-1">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className=" pl-2 p-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm h-[7px]">{formik.errors.email}</div>
            ) : null}
          </div>

          {/* Password */}
          <div className="w-[90%] h-auto flex flex-col space-y-1">
            <label htmlFor="password" className="font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              className="p-2 pl-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm h-[7px]">{formik.errors.password}</div>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div className="w-[90%] h-auto flex flex-col space-y-1">
            <label htmlFor="confirmPassword" className="font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Enter confirm password"
              className="p-2 pl-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-sm h-[7px]">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <div className="w-[90%] h-auto flex flex-col space-y-1">
            <label htmlFor="confirmPassword" className="font-medium">About Me</label>
                      
<textarea
            name="aboutMe"
            placeholder="About Me (Optional)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formik.values.aboutMe}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
            
         
          </div>

          

          {/* Submit Button */}
          <div className="w-[90%] h-auto flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white w-[25%] p-2 rounded-md hover:bg-blue-600"
              onClick={formik.handleSubmit}
            >
              Register
            </button>
          </div>
          <div className="w-[90%] h-auto flex justify-center items-center">
          <p className="text-sm font-light text-trbg-transparent0 dark:text-gray-700 text-center">
                Already have an account?{' '}
                <Link 
  className="font-medium text-blue-500 hover:underline hover:text-[#4c4ea9]"
  to="/login"
>
   login here
</Link>
              </p>
          </div>
        </div>
       
      </div>
    </div>
  );
}

export default Register;
