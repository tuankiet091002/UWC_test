import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';

export const getUsers  = async (req, res) => {
	const { name, role, available, mcp, truck } = req.query;
    try {
        var query = {}

        if (name) query.name = {$regex: name, $options: 'i'}
        if (role) query.role = role
        if (available) query.available = available === 'true'
       
        const users = await UserModel.find(query).select('-password -task').sort({ role: 1, _id: 1});
   
        res.status(200).json({ message: "Users fetched", result: users });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getUsers process" });
        console.log(error)
    }
};

export const getSingleUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await UserModel.findById(id).select('-password');
        if (!user) return res.status(404).json({message: "User not found"});

        res.status(200).json({ message: "User fetched", result: user})
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleUser process" });
        console.log(error);
    }
};

export const updateUser = async(req, res) => {
    const { id } = req.params;
    const { name, password } = req.body
    try {
        const user = await UserModel.findById(id);
        if(!user) return res.status(404).json({ message: "User not found" })

        if( req.user.role != "backofficer" && req.user._id != id)
            return res.status(403).json({ message: "Can`t change other's infomation unless ur a back officer" })

        if(name) user.name = name
        if(password){
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
        }

        const newUser = await UserModel.findByIdAndUpdate(id, user, {new: true, runValidators: true}).select("-password -__v");

        res.status(200).json({ message: "User updated", result: newUser })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in updaterUser process" });
        console.log(error);
    }
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
    try {
        if( req.user.role != "backofficer" && req.user._id != id )
            return res.status(403).json({ message: "Can`t delete other's infomation unless ur a back officer"})

        const user = await UserModel.findByIdAndRemove(id).select("-password -__v");
	    if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted", result: user  })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleUser process"});
        console.log(error);
    }
};