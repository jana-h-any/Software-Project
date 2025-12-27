const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

async function register(req, res) {
    const { name, email, phone, password } = req.body;

    try {
        const existing = await UserModel.findByEmail(email);

        if(existing.length > 0){
            return res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create(name, email, phone, hashedPassword);

        res.json({ message: "User registered successfully!" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
  
    try {
        const userResult = await UserModel.findByEmail(email);
  
        if(userResult.length === 0){
            return res.status(400).json({ message: "Incorrect email or password!" });
        }
  
        const user = userResult[0];
  
        const isMatch = await bcrypt.compare(password, user.Password);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect email or password!" });
        }
  
        res.json({ message: "Login successful!", userId: user.Id });
  
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    register,
    login
};

