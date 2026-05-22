// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }
};

module.exports = { checkAuth };
