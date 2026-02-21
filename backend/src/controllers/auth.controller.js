import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import "dotenv/config"

export const signup = async(req, res) => {
 const { fullname, email, password } = req.body

 try {
    // Validate input
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    //check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' })
    }   

    // Check if user already exists
     const existingUser = await User.findOne({ email })
     if (existingUser) {
        return res.status(400).json({ message: 'email already exists' })
    }            

    //123456 -> $4553453665dfgdfgd_
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        username: fullname,
        email,
        password: hashedPassword
    })

    if (newUser) {
        //before CR
        // generateToken(newUser._id,res) // Generate token and set cookie
        // await newUser.save()

        //after CR
        const savedUser = await newUser.save()
        generateToken(savedUser._id, res) 

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilepic: newUser.profilepic,
        })

        
        try {
            await sendWelcomeEmail(savedUser.email,savedUser.username,ENV.CLIENT_URL)

        } catch (error) {
            console.error('Failed to send welcome email', error)
        }

    } else {
        res.status(400).json({ message: 'Invaild user data' })
    }
}
catch (error) {
    console.error('Error in signup controller', error)
    res.status(500).json({ message: 'Internal Server error',error: error.message })
}
}

export const login = async(req,res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid email or password' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' })

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
        })
    }
    catch (error) {
        console.error('Error in login controller', error)
        res.status(500).json({ message: 'Internal Server error',error: error.message })
    }
        
}

export const logout = (_,res) => {
    res.cookie('jwt','',{maxAge:0})
    res.status(200).json({ message: 'Logged out successfully' })
}

export const updateProfile = async(req,res) => {
    try {
        const userId = req.user._id
        const { profilepic} = req.body

        if(!profilepic) return res.status(400).json({message:"Profile picture is required"})

        const uploadResponse= await cloudinary.uploader.upload(profilepic)

        await User.findByIdAndUpdate(
            userId,
            {profilepic:uploadResponse.secure_url},{new:true}
        )

        res.status(200).json({message:"Profile updated successfully", profilepic: uploadResponse.secure_url})
    }
    catch (error) {
        console.error('Error in updateProfile controller', error)
        res.status(500).json({ message: 'Internal Server error',error: error.message })
    }
}