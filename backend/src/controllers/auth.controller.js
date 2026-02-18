import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'

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

        //todo: send welcome email

    } else {
        res.status(400).json({ message: 'Invaild user data' })
    }
}
catch (error) {
    console.error('Error in signup controller', error)
    res.status(500).json({ message: 'Internal Server error',error: error.message })
}
}