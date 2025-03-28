//this file contains middleware for authenticating requests using 
//json web tokens

const jwt = require('jsonwebtoken');

//check if the Authorization header exists before trying to access it
const authMiddleware = (req, res, next) => {

  const authHeader = req.header('Authorization');
  
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token or invalid token format, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // This will get the token part after "Bearer "
  

  //verify the token using the secret key from the .env file
  //then add the user ID to the request object for use in the route handlers
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded.userId;
    next();
  } catch (error) {
    //console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;