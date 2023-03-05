import TaskModel from '../models/taskModel.js'
import UserModel from '../models/userModel.js'
import MCPModel from '../models/mcpModel.js'
import TruckModel from '../models/truckModel.js'

export const getTasks = async (req, res) => {
    const { date, shift, state } = req.query
    try {
        let query = {}
        if (req.user.role == "collector") {
            query.colllector = req.user._id;
        }
        else if (req.user.role == "janitor") {
            query.janitor = { $all: [[req.user._id]] }
        }

        if (date) query.date = date
        if (shift) query.shift = shift
        if (state) query.state = state

        const tasks = await TaskModel.find(query).select('-__v').sort({ date: -1 })
            .populate("collector", "-password -__v").populate("janitor", "-password -__v")
            .populate("path", "-__v")

        res.status(200).json({ message: "Tasks fetched", result: tasks })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getTasks process" });
        console.log(error)
    }
}

export const getSingleTask = async (req, res) => {
    const { id } = req.params
    try {
        const task = await TaskModel.findById(id).select('-__v');

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task fetched", result: task })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleTask process" });
        console.log(error);
    }
};


export const createTask = async (req, res) => {
    let { collector, truck, janitor, path, date, shift } = req.body
    try {
        collector = await UserModel.findById(collector).select("-username -__v");
        if (!collector) return res.status(404).json({ message: "Collector not found" });
        if (collector.role != "collector") return res.status(400).json({ message: "That is not a collector" });
        if (!collector.available) return res.status(400).json({ message: "Selected collector is busy" });


        for (const i in path) {
            path[i] = await MCPModel.findById(path[i]).select("-__v");
            if (!path[i]) return res.status(404).json({ message: `Invalid MCP path(${i}), please check again` })
        }

        truck = await TruckModel.findByIdAndUpdate(truck, { driver: collector, path }, { new: true, runValidators: true }).select("-__v");
        if (!truck) return res.status(404).json({ message: "Truck not found" });
        collector = await UserModel.findByIdAndUpdate(collector, { truck: truck }, { new: true, runValidators: true }).select("-password -__v")


        for (const i in janitor) {
            for (const k in janitor[i]) {
                janitor[i][k] = await UserModel.findById(janitor[i][k]).select("-password -__v");

                if (!janitor[i][k]) return res.status(404).json({ message: `Janitor[${i}][${k}] not found` });
                if (janitor[i][k].role != "janitor") return res.status(400).json({ message: `That is not a janitor(janitor[${i}][${k}])` });

                if (janitor[i][k].mcp) return res.status(400).json({ message: `Selected janitor[${i}][${k}] is busy` });

                janitor[i][k] = await UserModel.findByIdAndUpdate(janitor[i][k]._id, { mcp: path[i] }, { new: true, runValidators: true }).select("-password -__v");
                path[i].janitor.push(janitor[i][k])
            }

            path[i] = await MCPModel.findByIdAndUpdate(path[i]._id, path[i], { new: true, runValidators: true }).select("-__v");
        }

        date = new Date(date);
        if (date.getUTCHours() != 17 || date.getUTCMinutes() != 0) return res.status(400).json({ message: "Date must be 0h:00 GMT+7" })
        const newTask = await TaskModel.create({ taskmaster: req.user._id, collector, truck: truck._id, janitor, path, date, shift })

        res.status(201).json({ message: "Task created", result: newTask })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in createTask process" });
        console.log(error);
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params
    let { date, shift } = req.body
    try {
        const task = await TaskModel.findById(id)
        if (!task) return res.status(404).json({ message: "Task not found" })
        if (task.state != "waiting") return res.status(404).json({ message: "Task is executing" })

        if (date) {
            date = new Date(date);
            if (date.getUTCHours() != 17 || date.getUTCMinutes() != 0) return res.status(400).json({ message: "Date must be 0h:00 GMT+7" })
            task.date = date
        }

        if (shift) task.shift = shift

        const newTask = await TaskModel.findByIdAndUpdate(id, task, { new: true, runValidators: true })

        res.status(200).json({ message: "Task updated", result: newTask })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in updateTask process" });
        console.log(error);
    }
};

export const checkTask = async (req, res) => {
    const { id } = req.params
    try {
        let task = await TaskModel.findById(id).select("-__v");
        if (!task) return res.status(404).json({ message: "Task not found" })
        if (task.state == "done" || task.state == "fail") return res.status(400).json({ message: "Task is already finished" });

        // 6->9 || 9->12 || 12->15 || 15->18  diem danh duoc quyen tre nua tieng, diem danh ra duoc som nua tieng
        const checkinDeadline = task.date.getTime() + 3600000 * (task.shift * 3 + 3.5)
        const checkoutDeadline = task.date.getTime() + 3600000 * (task.shift * 3 + 5.5)

        const collector = await UserModel.findById(task.collector).select("-username -password -__v");

        if (req.user.role == "collector") {
            if (collector._id.toString() != req.user._id.toString())
                return res.status(403).json({ message: "You are not belong to this task" })

            if (!task.checkIn) {
                if (Date.now() < checkinDeadline) {
                    task.checkIn = Date.now()
                    task.state = "executing"

                    // collector vao viec
                    await UserModel.findByIdAndUpdate(collector._id, { available: false })
                    await TruckModel.findByIdAndUpdate(collector.truck, { nextMCP: task.path[0] })

                } else {
                    task.state = "fail"
                }
            }
            else if (task.checkIn && !task.checkOut) {
                if (Date.now() > checkoutDeadline && Date.now() - checkoutDeadline < 3600000) {
                    task.checkOut = Date.now()
                    task.state = "done"
                }
                else if (Date.now() - checkoutDeadline > 3600000) {
                    task.checkOut = Date.now()
                    task.state = "fail"
                }
                else return res.status(400).json({ message: "Wrong time to check" })

                await UserModel.findByIdAndUpdate(collector._id, { available: true, truck: null })
                await TruckModel.findByIdAndUpdate(collector.truck, { driver: null })
            }
            else return res.status(400).json({ message: "Wrong time to check" })
        }
        else if (req.user.role == "janitor") {
            if (!task.path.includes(req.user.mcp))
                return res.status(404).json({ message: "Janitor is not belong to this task" })
            const mcp = await MCPModel.findById(req.user.mcp)

            if (Date.now() < checkinDeadline) {
                await UserModel.findByIdAndUpdate(req.user._id, { available: false })
            }
            else if (Date.now() > checkoutDeadline) {
                await UserModel.findByIdAndUpdate(req.user._id, { available: true, mcp: null })
                mcp.janitor.filter((jan) => jan != req.user._id);
                await MCPModel.findByIdAndUpdate(mcp, mcp)
            }
            else return res.status(400).json({ message: "Wrong time to check" })
        }


        // thu don neu task fail
        if (task.state == "fail") {
            await UserModel.findByIdAndUpdate(task.collector, { truck: null, avaiable: true })

            await TruckModel.findByIdAndUpdate(task.truck, { driver: null, path: null, nextMCP: null })

            let taskPath = []

            for (const i in task.janitor) {
                taskPath.push(await MCPModel.findById(task.path[i]))
                for (const k in task.janitor[i]) {
                    await UserModel.findByIdAndUpdate(task.janitor[i][k], { mcp: null, available: true })
                    taskPath[i] = taskPath[i].janitor.filter((jan) => jan.toString() != task.janitor[i][k].toString())
                }

                await MCPModel.findByIdAndUpdate(task.path[i], { path: taskPath })
            }
        }
        const newTask = await TaskModel.findByIdAndUpdate(id, task, { new: true, runValidators: true })

        res.status(200).json({ message: `Task checked, status: ${newTask.state}`, result: newTask })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in checkIn process" });
        console.log(error);
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params
    try {

        let task = await TaskModel.findById(id)
        if (!task) return res.status(404).json({ message: "Task not found" })
        if (task.state == "executing") return res.status(400).json({ message: "Task is being executed" })

        await UserModel.findByIdAndUpdate(task.collector, { truck: null, avaiable: true })

        await TruckModel.findByIdAndUpdate(task.truck, { driver: null, path: null, nextMCP: null })

        let taskPath = []

        for (const i in task.janitor) {
            taskPath.push(await MCPModel.findById(task.path[i]))
            for (const k in task.janitor[i]) {
                await UserModel.findByIdAndUpdate(task.janitor[i][k], { mcp: null, available: true })
                taskPath[i].janitor = taskPath[i].janitor.filter((jan) => jan.toString() != task.janitor[i][k].toString())
            }

            await MCPModel.findByIdAndUpdate(task.path[i], taskPath[i])
        }

        task = await TaskModel.findByIdAndRemove(id).select("-__v")
        res.status(200).json({ message: "Task deleted", result: task })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in deleteTask process" });
        console.log(error)
    }
}


