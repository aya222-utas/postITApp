import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isLogin} = useSelector(state => state.users)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLogin) { navigate("/login") }

  }
)
  return (
    <h1>Profile</h1>
  );
};

export default Profile;
