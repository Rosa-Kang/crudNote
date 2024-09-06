import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";


const secret = 'test';

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
      const userInfo = await User.findOne({ email });
  
      if (userInfo)
        return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await User.create({
        email,
        password: hashedPassword,
        fullName,
      });
  
      const token = jwt.sign({ email: result.email, id: result._id }, secret, {
        expiresIn: "1h",
      });
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
  
      console.log(error);
    }
}

export const signin = async (req, res) => {
    const { email, password}  = req.body;

    try {
    const userInfo = await User.findOne({ email });
    if(!userInfo) return res.status(400).json({message: "User doesn't exist"});

    const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);
    if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials."})

    const token = jwt.sign({ id: userInfo._id, email: userInfo.email }, secret, {
            expiresIn: "1h",
        });

    res.status(201).json({ result: userInfo, token });      
    } catch (error) {
        res.status(500).json({message : "Something went wrong."})
    }
}

export const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    if(!userId) return res.status(200).json({message: "No user is logged in"})

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
  }
};