import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const secret = process.env.JWT_SECRET || 'default_secret_key';

if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not defined. Using default key.");
}

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    console.log('Signup route hit'); 

    try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(404).json({message: "User already exists."});

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await result.save();

    const token = jwt.sign({ id: result._id, email: result.email }, secret, {
        expiresIn: "1h",
    });

    res.status(201).json({ error: false, result, token, message: "Registration Succeed." });       

    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
        console.log(error);
    }
}

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
    const oldUser = await User.findOne({ email });
    if(!oldUser) return res.status(400).json({message: "User doesn't exist"});

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials."})

    const token = jwt.sign({ id: oldUser._id, email: oldUser.email }, secret, {
            expiresIn: "1h",
        });

    res.status(201).json({ oldUser, token });      
    } catch (error) {
        res.status(500).json({message : "Something went wrong."})
    }
}

export const getUser = async(req, res)=> {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
        const isUser = await User.findOne({ _id: userId });

        if (!isUser) return res.sendStatus(404);

        return res.json({
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                _id: isUser._id,
                createdOn: isUser.createdOn
            },
            message: ""
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}