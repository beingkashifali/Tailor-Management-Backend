const jwt = require("jsonwebtoken");

// "protect" is our security guard function
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the frontend sent a token in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. The header looks like "Bearer eyJhbGci...", so we split it to get just the token part
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using your secret key from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. THE MAGIC HAPPENS HERE:
      // We take the decoded token (which contains the user's id, role, and shopId from when they logged in)
      // and attach it to the "req" object.
      req.user = decoded;

      // 5. Tell Express to move on to the next function (which will be your createCustomer controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        msg: "Not authorized, token failed or expired",
      });
    }
  }

  // If no token was found at all
  if (!token) {
    res
      .status(401)
      .json({ success: false, msg: "Not authorized, no token provided" });
  }
};

module.exports = protect;
