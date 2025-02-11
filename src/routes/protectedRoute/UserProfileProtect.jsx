import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function UserProfileProtect({ children }) {
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.user.userInfo);

  console.log("eeeeeeeeeeeeeee", userToken);

  useEffect(() => {
    if (userToken == null) {
        console.log("logged in");
        
      navigate('/', {
        state: { message: 'logged in' },
        replace: true,
      });
    }
  }, [navigate, userToken]);

  return <>{children}</>;
}

export default UserProfileProtect;
