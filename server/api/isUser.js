const {
    models: { User },
  } = require("../db");

const isUser = async (req, res, next) => {
    try {
      const user = await User.findByToken(req.headers.authorization);
      req.user = user;
      if (user.id) {
        next();
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      next(error);
    }
  };

module.exports = isUser