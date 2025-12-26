const User = require('../models/User');

const test = (req, res) => {    
    res.json({ message: "Auth route is working!" });
}

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please provide username and password" });
        }

        const exist = await User.findOne({ email });

        if(exist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ email, password });
        res.status(201).json({ message: "User registered successfully", user });
        
    } catch(error) {
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { test, registerUser };