const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const validateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(403).send({ message: "Missing token" });
    } else {
      const data = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = data;
      if (!id) {
        res.status(403).send({ message: "id missing in token" });
      } else {
        const user = await User.findById(id);
        if (!user) {
          res.status(403).send({ message: "User does not exists" });
        } else {
          req.user = user;
          next();
        }
      }
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
};

module.exports = { validateUser };
