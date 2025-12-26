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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }

    const match = await comparePassword(password, user.password);
  
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch(error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }

}

module.exports = { test, registerUser, loginUser };