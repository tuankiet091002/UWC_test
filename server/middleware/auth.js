import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js"

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await UserModel.findById(decodedData._id).select("name role available task");
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthenticated. Please login or verify the access token"})
        console.log(error);
    }
};

export const authorize  = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You don't have permission to access this route" });
        }
        next();
    };
};

