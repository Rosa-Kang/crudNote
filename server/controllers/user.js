import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
      const oldUser = await User.findOne({ email });

      if (oldUser) return res.status(400).json({message: "User already exists."});

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await User.create({
        email,
        password: hashedPassword,
        fullName
      })

      const token = jwt.sign({email: result.email, password: result.password}, secret, {
        expiresIn: "1h",
      })

      res.status(201).json({ result, token });       
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
        console.log(error);
    }
}

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong."})
    }
}