import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    // Request protection decision from Arcjet
    const decision = await aj.protect(req, { requested: 1 });

    // Handle denial cases
    if (decision.isDenied()) {
      if (decision.reason?.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: "Rate limit exceeded",
        });
      }
      if (decision.reason?.isBot()) {
        return res.status(403).json({
          success: false,
          message: "Bot detected",
        });
      }
      return res.status(403).json({
        success: false,
        message: "Request denied",
      });
    }

    // Allow request to continue
    next();
  } catch (error) {
    console.error(`Error in arcjetMiddleware: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default arcjetMiddleware;
