import jwt from 'jsonwebtoken'
import {ENV} from "../lib/env.js"
export const generateToken = (userId,res) => {
    const token = jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '7d' })
    
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents XSS attacks: cross-site scripting attacks
        secure: ENV.NODE_ENV === 'development' ? false : true, // Set secure flag in production
        sameSite: 'strict', // Prevents CSRF attacks: cross-site request forgery attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
}