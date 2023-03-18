import TaskModel from '../models/taskModel.js'
import UserModel from '../models/userModel.js'
import MCPModel from '../models/mcpModel.js'
import TruckModel from '../models/truckModel.js'

export const getTasks = async (req, res) => {
    const { date, shift, state } = req.query
    try {
        let query = {}
        if (req.user.role == "collector") {
            query.collector = req.user._id;
        }
        else if (req.user.role == "janitor") {
            query.janitor = { $all: [[req.user._id]] }
        }

        if (date) query.date = date
        if (shift) query.shift = shift
        if (state) query.state = state

        const tasks = await TaskModel.find(query).sort({ date: -1 })
            .populate("taskmaster", "name role available")
            .populate("truck")
            .populate("collector", "name role available")
            .populate("janitor", "name role available")
            .populate("path", "-janitor")

        res.status(200).json({ message: "Tasks fetched", result: tasks })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getTasks process" });
        console.log(error)
    }
}

export const getSingleTask = async (req, res) => {
    const { id } = req.params
    try {
        const task = await TaskModel.findById(id)
            .populate("taskmaster", "name role available")
            .populate("collector", "name role available")
            .populate("janitor", "name role available")
            .populate("truck", "-path -nextMCP")
            .populate("path", "-janitor")

        if (!task) return res.status(404).json({ message: "Task not found" });
        for (const i in task.janitor)
            for (const k in task.janitor[i])
                task[i][k] = await UserModel.findById(task.janitor[i][k]).select("name role available")

        res.status(200).json({ message: "Task fetched", result: task })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleTask process" });
        console.log(error);
    }
};


export const createTask = async (req, res) => {
    let { collector, truck, janitor, path, date, shift } = req.body
    try {
        date = new Date(date);
        if (date.getUTCHours() != 17 || date.getUTCMinutes() != 0) return res.status(400).json({ message: "Date must be 0h:00 GMT+7" })

        collector = await UserModel.findById(collector).select("name role available task").populate("task");
        if (!collector) return res.status(404).json({ message: "Collector not found" });
        if (collector.role != "collector") return res.status(400).json({ message: "That is not a collector" });
        for (const i in collector.task) {
            if (collector.task[i].date == date && collector.task[i].shift == shift)
                return res.status(400).json({ message: "Collector is busy at that time" })
        }

        for (const i in path) {
            path[i] = await MCPModel.findById(path[i])
            if (!path[i]) return res.status(404).json({ message: `Invalid MCP path(${i}), please check again` })
        }

        truck = await TruckModel.findById(truck)
        if (!truck) return res.status(404).json({ message: "Truck not found" });

        for (const i in janitor) {
            for (const k in janitor[i]) {
                janitor[i][k] = await UserModel.findById(janitor[i][k]).select("name role available task");
                if (!janitor[i][k]) return res.status(404).json({ message: `Janitor[${i}][${k}] not found` });
                if (janitor[i][k].role != "janitor") return res.status(400).json({ message: `That is not a janitor(janitor[${i}][${k}])` });
                for (const l in janitor[i][k].task) {
                    if (janitor[i][k].task[l].date == date && janitor[i][k].task[l].shift == shift)
                        return res.status(400).json({ message: "Janitor is busy at that time" })
                }
            }
        }

        const newTask = await TaskModel.create({ taskmaster: req.user._id, collector, truck, janitor, path: [0, ...path, 0], date, shift })
        await newTask.populate("path", "-janitor");

        await UserModel.findByIdAndUpdate(collector._id, { task: [...collector.task, newTask] })
        await TruckModel.findByIdAndUpdate(truck._id, { driver: collector, path: [0, ...path, 0] })
        for (const i in janitor) {
            for (const k in janitor[i]) {
                await UserModel.findByIdAndUpdate(janitor[i][k]._id, { task: [...janitor[i][k].task, newTask] })
                const mcp = await MCPModel.findById(path[i]._id)
                await MCPModel.findByIdAndUpdate(path[i]._id, { janitor: [...mcp.janitor, janitor[i][k]] })
            }
        }

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
        let task = await TaskModel.findById(id)
            .populate("taskmaster", "name role available")
            .populate("collector", "name role available")
            .populate("janitor", "name role available")
            .populate("truck", "-path -nextMCP")
            .populate("path", "-janitor")

        if (!task) return res.status(404).json({ message: "Task not found" })
        if (task.state == "done" || task.state == "fail") return res.status(400).json({ message: "Task is already finished" });

        // 6->9 || 9->12 || 12->15 || 15->18  diem danh duoc quyen tre nua tieng, diem danh ra duoc som nua tieng
        const checkinDeadline = task.date.getTime() + 3600000 * (task.shift * 3 + 3.5)
        const checkoutPoint = task.date.getTime() + 3600000 * (task.shift * 3 + 5.5)

        if (req.user.role == "collector") {
            if (!req.user.task.includes(task._id))
                return res.status(403).json({ message: "You are not belong to this task" })

            if (!task.checkIn) {
                if (Date.now() < checkinDeadline) {
                    if (checkinDeadline - Date.now() > 3600000)
                        return res.status(400).json({ message: "Too early to check" })
                    task.checkIn = Date.now()
                    task.state = "executing"

                    await UserModel.findByIdAndUpdate(req.user._id, { available: false })

                    await TruckModel.findByIdAndUpdate(task.truck._id, { nextMCP: task.path[1] })
                } else {
                    task.state = "fail"
                }
            }
            else if (task.checkIn && !task.checkOut) {
                if (Date.now() > checkoutPoint) {
                    task.checkOut = Date.now()
                    task.state = "done"
                }
                else return res.status(400).json({ message: "Wrong time to check" })

                await UserModel.findByIdAndUpdate(req.user._id, { available: true })
                await TruckModel.findByIdAndUpdate(task.truck._id, { driver: null, path:[], nextMCP: null })
            }
            else return res.status(400).json({ message: "Wrong time to check" })
        }
        else if (req.user.role == "janitor") {
            if (!req.user.task.includes(task._id))
                return res.status(403).json({ message: "You are not belong to this task" })

            const mcp = await MCPModel.findOne({ janitor: { $elemMatch: { $eq: req.user._id } } })

            if (Date.now() < checkinDeadline) {
                if (checkinDeadline - Date.now() > 3600000)
                    return res.status(400).json({ message: "Too early to check" })
                await UserModel.findByIdAndUpdate(req.user._id, { available: false })
            }
            else if (Date.now() > checkoutPoint) {
                if (!req.user.available)
                    await UserModel.findByIdAndUpdate(req.user._id, { available: true })
                await MCPModel.findByIdAndUpdate(mcp, { janitor: mcp.janitor.filter((jan) => jan != req.user._id) })
            }
            else 
                return res.status(400).json({ message: "Too late to check" })
        }

        // thu don neu task fail
        if (task.state == "fail") {
            await TruckModel.findByIdAndUpdate(task.truck._id, { driver: null, path: [], nextMCP: null })

            let taskPath = []

            for (const i in task.janitor) {
                taskPath.push(await MCPModel.findById(task.path[Number(i) + 1]))
                for (const k in task.janitor[i]) {
                    taskPath[i].janitor = taskPath[i].janitor.filter((jan) => jan.toString() != task.janitor[i][k].toString())
                }
                await MCPModel.findByIdAndUpdate(task.path[Number(i) + 1]._id, taskPath[i])
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
            .populate("collector", "name role available task")
            .populate("janitor", "name role available task")
        if (!task) return res.status(404).json({ message: "Task not found" })
        if (task.state != "waiting") return res.status(400).json({ message: "You can only delete waiting task" })

        await UserModel.findByIdAndUpdate(task.collector._id, { task: task.collector.task.filter(x => x != task._id) })

        await TruckModel.findByIdAndUpdate(task.truck, { driver: null, path: [], nextMCP: null })

        let taskPath = []

        for (const i in task.janitor) {
            taskPath.push(await MCPModel.findById(task.path[Number(i) + 1]))
            for (const k in task.janitor[i]) {
                const jan = await UserModel.findById(task.janitor[i][k])
                await UserModel.findByIdAndUpdate(jan._id, { task: jan.task.filter(x => x != task._id) })
                taskPath[i].janitor = taskPath[i].janitor.filter((jan) => jan.toString() != jan._id.toString())
            }

            await MCPModel.findByIdAndUpdate(task.path[Number(i) + 1], taskPath[i])
        }

        task = await TaskModel.findByIdAndRemove(id);

        res.status(200).json({ message: "Task deleted", result: task })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in deleteTask process" });
        console.log(error)
    }
}


