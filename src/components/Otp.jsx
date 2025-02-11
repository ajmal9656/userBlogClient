import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import axiosUrl from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Otp() {
  const [seconds, setSeconds] = useState(60); // Initialize timer with 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [buttonText, setButtonText] = useState('Verify'); // Button text state
  const inputRefs = useRef([]); // To store references to each input field

  const navigate = useNavigate()

  // Function to format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Get the time when OTP was sent from localStorage or set it initially
  const getStoredTime = () => {
    const storedTime = localStorage.getItem('otpSentTime');
    return storedTime ? parseInt(storedTime, 10) : null;
  };

  // Start or reset the timer
  const startTimer = () => {
    const otpSentTime = getStoredTime();
    if (otpSentTime) {
      // Calculate remaining time if OTP has already been sent before
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - otpSentTime) / 1000); // Elapsed time in seconds
      const remainingTime = Math.max(0, 60 - elapsedTime); // Remaining time
      setSeconds(remainingTime);
      setIsTimerActive(remainingTime > 0);
    } else {
      // Start a new timer if OTP has not been sent
      const otpSentNow = Date.now();
      localStorage.setItem('otpSentTime', otpSentNow); // Store OTP sent time
      setSeconds(60);
      setIsTimerActive(true);
    }
  };

  // useEffect hook to manage the countdown timer
  useEffect(() => {
    if (isTimerActive && seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear the interval on component unmount or timer stop
    } else {
      setIsTimerActive(false); // Stop the timer when it reaches 0
      setButtonText('Resend OTP'); // Change button text to "Resend OTP"
    }
  }, [seconds, isTimerActive]);

  // Formik initialization
  const formik = useFormik({
    initialValues: { otp: ['', '', '', ''] },
    validateOnChange: false,  // Disable validation on change
    validateOnBlur: false,    // Disable validation on blur
    validate: (values) => {
      const errors = {};
      if (buttonText === 'Verify' && values.otp.some(val => val === '')) {
        errors.otp = 'Please fill in all OTP fields';
      }
      return errors;
    },
    onSubmit: (values) => {
      if (buttonText === 'Verify') {
        // Handle OTP verification logic
        verifyOtp(values.otp.join(''));
      } else if (buttonText === 'Resend OTP') {
        // Handle OTP resend logic
        resendOtp();
      }
    },
  });
  

  // Function to handle OTP verification
  const verifyOtp = async (otp) => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await axiosUrl.post('/verifyOtp', { otp, email});
      console.log('OTP verified successfully:', response.data);
      if(response.data){
        localStorage.removeItem('userEmail');
        toast.success("Registered Successfully")
        navigate("/login")
      }
      // Proceed with successful verification logic
    } catch (error) {
      toast.error(error.response.data.message)
      console.error('mwssError verifying OTP:', error.response.data.message);
    }
  };

  // Function to handle OTP resend
  const resendOtp = async () => {
    try {
      // Your resend OTP logic here (e.g., making an API request)
      const email = localStorage.getItem('userEmail');
      const response = await axiosUrl.post('/resendOtp',{email});
      console.log('OTP resent successfully:', response.data);
      localStorage.removeItem('otpSentTime');
      startTimer(); // Reset the timer when OTP is resent
      setButtonText('Verify'); // Change button text back to "Verify"
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };
  

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1) {
      // Move focus to the next input
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    const value = e.target.value;
    if (value === '') {
      // Move focus to the previous input when backspace is pressed
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  useEffect(() => {
    startTimer(); // Start or reset the timer when the component mounts
  }, []);

  return (
    <div className="w-full h-auto">
      <div className="w-full h-[729px] flex justify-center items-center bg-gray-100">
        <div className="w-[35%] h-[350px] bg-white rounded-md shadow-lg flex flex-col space-y-4 justify-center items-center text-gray-800">
          <div className="w-[90%] h-[70px] flex place-content-center items-center">
            <h1 className="text-4xl font-semibold">Enter OTP</h1>
          </div>

          {/* Timer below the heading */}
          <div className="w-[90%] h-[30px] flex justify-center items-center text-xl text-gray-600">
            <p>Time Remaining: {formatTime(seconds)}</p>
          </div>

          <div className="w-[90%] h-[130px] flex justify-center items-center space-x-4">
            {Array(4).fill().map((_, index) => (
              <input
                key={index}
                type="text"
                name={`otp[${index}]`}
                value={formik.values.otp[index]}
                className="h-[80%] w-[20%] rounded-sm border-2 text-center text-3xl"
                maxLength="1" // Limit to 1 character per input
                ref={(el) => (inputRefs.current[index] = el)} // Assign reference to each input
                onChange={(e) => {
                  formik.handleChange(e);
                  handleInputChange(e, index);
                }} // Handle input change
                onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(e, index)} // Handle backspace
              />
            ))}
          </div>

          {/* Form errors */}
          {formik.errors.otp && <div className="text-red-500">{formik.errors.otp}</div>}

          <div className="w-[90%] h-[70px] flex justify-center items-center">
            <button
              onClick={formik.handleSubmit}
              className="bg-blue-500 text-white w-[25%] p-2 rounded-md hover:bg-blue-600"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
