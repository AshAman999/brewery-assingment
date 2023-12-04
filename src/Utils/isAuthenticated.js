import {jwtDecode} from 'jwt-decode';

function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) {
    // If there's no token, return false
    return false;
  }
  
  try {
    // Decode the token
    const decoded = jwtDecode(token);

    // If the token is valid and decoded object is not null, return true
    return !!decoded;
  } catch (error) {
    // If the token is invalid or expired, return false
    return false;
  }
}

export default isAuthenticated;