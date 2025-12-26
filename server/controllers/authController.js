const User = require('../models/User');
const { hashPassword, comparePassword } = require('../services/auth');

const test = (req, res) => {    
    res.json({ message: "Auth route is working!" });
}

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        if(!email || !password) {
            return res.status(400).json({ message: "Please provide username and password" });
        }

        const hashedPassword = await hashPassword(password);

        const exist = await User.findOne({ email });

        if(exist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user });
        
    } catch (error) {
        console.error('REGISTER ERROR:', error);
      
        if (error.code === 11000) {
          return res.status(400).json({
            message: 'Email already exists',
          });
        }
      
        res.status(500).json({ message: 'Server error' });
      }
      
}
module.exports = { test, registerUser };