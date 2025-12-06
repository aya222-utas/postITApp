import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";


const User = () => {
  const { user} = useSelector((state) => state.users);
  const [ip, setIp] = useState(null); //State to hold the IP address
  const [country, setCountry] = useState(null); //State to hold geolocation
  const [region, setRegion] = useState(null); // State to hold geolocation

async function getGeoLocationData()  {
  try {
   
    const response = await axios.get(process.env.REACT_APP_LOCATION_API_KEY)
    setIp(response.data.ip);//set ip address
    setCountry(response.data.location.country); // Set country
    setRegion(response.data.location.region); // Set region
  } catch (error) {
    console.error("Error fetching geolocation data:", error.message);
  }
};

  useEffect(() => {
    getGeoLocationData()
  },[])

  return (
    <div>
      <img src={user} className="userImage" alt="" />
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <div>
        <h6>{ip}</h6>
        <h6>{country}</h6>
        <h6>{region}</h6>
      </div>
    </div>
  );
};

export default User;
