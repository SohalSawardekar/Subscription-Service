import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") // Fixed spelling
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "No token provided",
      });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure `decoded` contains `userId`
    const user = await User.findById(decoded.userId); // Use correct key from token payload

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "User not found",
      });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authorize;
