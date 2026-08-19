import bcrypt from "bcryptjs"
import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    samesite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const sanitizeUser = (user) => {
    if (!user) return null;
    const doc = typeof user.toObject === "function" ? user.toObject() : user;
    const { password, ...safe } = doc;
    return safe;
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const existing = await UserModel.findOne({ email: email.trim() });
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }

        const hashed = await bcrypt.hash(String(password), 10);
        const user = await UserModel.create({
            name: name.trim(),
            email: email.trim(),
            password: hashed
        });

        const token = await getToken(user._id);
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(201).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: `register Error ${error.message}` });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await UserModel.findOne({ email: email.trim() }).select("+password");
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(String(password), user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = await getToken(user._id);
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: `login Error ${error.message}` });
    }
};

export const googleAuth = async (req,res) => {
    try{
        const {name, email} = req.body
        let user = await UserModel.findOne({email})

        if(!user){
            user = await UserModel.create({
                name,email
            })
        }
        let token = await getToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure: false,
            samesite: "strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(sanitizeUser(user))
    }
    catch (error) {
        return res.status(500).json({message:`googleSignup Error ${error}`})

    }
}

export const logOut = async (req,res) =>{
    try{
        await res.clearCookie("token")
        return res.status(200).json({message: "Logout Successfully"})

    }catch (error){
          return res.status(500).json({message:`Logout Error ${error}`})

    }
}