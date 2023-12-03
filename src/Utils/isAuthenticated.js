import { verify } from 'jsonwebtoken';

function isAuthenticated() {
  const token = localStorage.getItem("token");
  try {
    // Verify the token
    const decoded = verify(token, 'your_secret_key');

    // If the token is valid, return true
    return true;
  } catch (error) {
    // If the token is invalid or expired, return false
    return false;
  }
}

export default isAuthenticated;