const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Check if the 'Authorization' header is present
    const authHeader = req.headers['authorization'];
    // if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    //   return res.status(401).json({ message: 'Unauthorized access' });
    // }
    const token = getTokenFromHeader(authHeader);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' }); // Generic error message
    }  

    // Verify the token using jwt.verify
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      // Store the decoded user data (e.g., user ID) in the request object
      req.user = decoded;
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return null; // Return null if the header is invalid
  }
  return authHeader.split(' ')[1]; // Extract and return the token
};

module.exports = authenticate;
