import jwt from "jsonwebtoken";
const secret = 'test';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token missing" });
    }

    const isCustomAuth = token.length < 500;
    let decodedData;

    if (isCustomAuth) {      
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.error("Auth middleware error: ", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};

export default auth;