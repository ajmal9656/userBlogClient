import React from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/action/userActions";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userInfo);

  const handleLogout = async () => {
    if (!userData?.id) return; // Prevent logout call if userId is missing

    try {
      await dispatch(logoutUser(userData.id));
      toast.success("Logged out Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handleProfileClick = () => {
    console.log("Profile icon clicked!");
    if (!userData?.id){
      navigate("/login");
      return;
    }
    // You can navigate to the profile page or open a dropdown/modal
    navigate("/profile", { state: { userId: userData?.id } });
  };

  return (
    <nav className="w-full bg-blue-600 p-4 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
        <h1 
        className="text-white text-2xl font-semibold ml-2 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        BlogHive
      </h1>

        </div>

        {/* Profile and Logout Icons */}
        <div className="flex items-center space-x-6">
          <FaUserCircle
            className="text-white text-3xl cursor-pointer hover:text-gray-300 transition"
            onClick={handleProfileClick} // Call function on click
          />
          {userData?.id && (
            <FaSignOutAlt
              className="text-white text-3xl cursor-pointer hover:text-gray-300 transition"
              onClick={handleLogout}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
