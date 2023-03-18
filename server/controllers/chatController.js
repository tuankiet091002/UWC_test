import ChatModel from '../models/chatModel.js'
import UserModel from '../models/userModel.js';

export const getChats = async (req, res) => {
    const { name } = req.query
    try {
        let query = { users: { $elemMatch: { $eq: req.user._id } } }
        if (name) query.name = { $regex: name, $options: 'i' }

        let chats = await ChatModel.find(query)
            .populate("users", "name role available")
            .populate("latestMessage")
            .sort({ updateAt: -1 });

        res.status(200).json({ message: "Chats fetched", result: chats });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getChats process" });
        console.log(error)
    }
};

export const getSingleChat = async (req, res) => {
    const { id } = req.params;
    try {
        let chat = await ChatModel.findById(id).sort({ updateAt: -1 })
            .populate("users", "name role available")
            .populate("groupAdmin", "name role available")
            .populate("latestMessage");
        if (!chat) return res.status(404).json("Chat not found");
        if (!chat.users.map(x => x._id.toString()).includes(req.user._id.toString())) return res.status(403).json("You are not in this group");

        chat = await UserModel.populate(chat, { path: "lastestMessage.sender", select: "name role available" })

        res.status(200).json({ message: "Chat fetched", result: chat })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleChat process" });
        console.log(error)
    }
}

export const createChat = async (req, res) => {
    let { name, users } = req.body
    try {
        for (const i in users) {
            const user = await UserModel.findById(users[i]).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });
        }

        users.push(req.user._id)

        const chat = await ChatModel.create({ name, users, groupAdmin: req.user });
        await chat.populate("users", "name role available")
        await chat.populate("groupAdmin", "name role available");

        res.status(201).json({ message: "Chat created", result: chat });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in createChat process" });
        console.log(error)
    }
};

export const updateChat = async (req, res) => {
    const { id } = req.params
    let { name, users } = req.body
    try {
        let chat = await ChatModel.findById(id);
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        if (name) chat.name = name;
        if (users) {
            for (const i in users) {
                const user = await UserModel.findById(users[i])
                if (!user) return res.status(404).json({ message: "User not found" });
            }
            users.push(req.user._id);
            chat.users = users;
        }

        chat = await ChatModel.findByIdAndUpdate(id, chat, { new: true, runValidators: true });
        chat = await ChatModel.findById(id)
            .populate("users", "name role available")
            .populate("groupAdmin", "name role available")
            .populate("latestMessage");
        chat = await UserModel.populate(chat, { path: "lastestMessage.sender", select: "name role available" })

        res.status(200).json({ message: "Chat updated", result: chat })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in updateChat process" });
        console.log(error)
    }
}

export const deleteChat = async (req, res) => {
    const { id } = req.params;
    try {
        const chat = await ChatModel.findByIdAndDelete(id);

        if (!chat) return res.status(404).json({ message: "Chat not found" })

        res.status(200).json({ message: "Chat deleted", result: chat });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in deleteChat process" });
        console.log(error)
    }
}

