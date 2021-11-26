const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authError = () => {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    return next(error);
  };

  if (!req.get('Authorization')) {
    return authError();
  }

  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    authError();
  }

  if (!decodedToken || !decodedToken.userId) {
    return authError();
  }

  //Could get sequelize user model instance and assign to req.user or something, but may not always need user model instance
  req.userId = decodedToken.userId;
  next();
};
