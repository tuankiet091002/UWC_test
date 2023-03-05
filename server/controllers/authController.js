import UserModel from "../models/userModel.js";

export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const oldUser = await UserModel.findOne({ username }).select("-__v");
        if (!oldUser) return res.status(404).json({ message: "User not found" });
    
        const isPasswordCorrect = await oldUser.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Wrong password" });
        
        const token = oldUser.createJWT();

        res.status(200).json({ message: "Login completed", result: oldUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in signin process" });
        console.log(error)
    }
};

export const signup = async (req, res) => {
    const { name, username, password, role } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exist" });

        const newUser = await UserModel.create({ name, username, password, role });
       
        const token = newUser.createJWT();

        res.status(201).json({ message: "User created", result: newUser, token });
    } catch (error) {

        res.status(500).json({ message: "Something went wrong in signup process" });
        console.log(error);
    }
};
