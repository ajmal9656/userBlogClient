import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/userActions";

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
              .min(8, 'Password must be at least 8 characters')
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                'Password must contain at least one letter, one number, and one special character'
              )
              .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await dispatch(login(values)) 
        console.log("res",response);
        
        if(response.payload.status){
          toast.success("Logged in Successfully")
          console.log("dataz",response.payload.userInfo);
          
          
          navigate("/")

        }
        console.log("Login Successful:", response.payload);
      } catch (error) {
        console.error("Login Failed:", error.response?.data || error.message);
        toast.error(error.response?.data.message)
      }
    },
  });

  return (
    <div className="w-full h-auto">
      <div className="w-full h-[729px] flex justify-center items-center bg-gray-100">
        <div className="w-[35%] h-[400px] bg-white rounded-md shadow-lg flex flex-col space-y-4 justify-center items-center text-gray-800">
          <h1 className="text-4xl font-semibold">Login</h1>
          <form className="w-[90%] flex flex-col space-y-3" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <label className="font-medium">Enter Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                className="h-[40px] pl-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium">Enter Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="h-[40px] pl-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
            <p className="text-sm font-light text-trbg-transparent0 dark:text-gray-700 text-center">
                Don't have an account?{' '}
                <Link 
  className="font-medium text-blue-500 hover:underline hover:text-[#4c4ea9]"
  to="/register"
>
  Sign in here
</Link>
              </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
