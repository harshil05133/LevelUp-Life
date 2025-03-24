//this file contains middleware for authenticating requests using 
//json web tokens

const jwt = require('jsonwebtoken');

//check if the Authorization header exists before trying to access it
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : '';

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  //verify the token using the secret key from the .env file
  //then add the user ID to the request object for use in the route handlers
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;