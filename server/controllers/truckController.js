import TruckModel from '../models/truckModel.js'
import UserModel from '../models/userModel.js'


export const getTrucks = async (req, res) => {
    const { path } = req.query;
	try {
        let query = {};

        if (path === 'null') query.path = null; 

        const trucks = await TruckModel.find(query).select('-path -nextMCP').populate("driver", "name role available");
   
        res.status(200).json({ message: "Trucks fetched", result: trucks });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getTrucks process" });
        console.log(error)
    }
}	
	
export const getSingleTruck = async (req, res) => {
    const { id } = req.params
    try {
        const truck = await TruckModel.findById(id).populate("driver", "name role available");
        
        if (!truck) return res.status(404).json({ message: "Truck not found" });

        res.status(200).json({ message: "Truck fetched", result: truck })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleTruck process" });
        console.log(error);
    }
};

export const createTruck = async (req, res) => {
	const { cap, load } = req.body
	try {
        if(!(load >= 0 && cap - load >= 0))
            return res.status(400).json({ message: "Incorrect logic in current load and/or max capacity value" })

		const truck = await TruckModel.create({ cap, load });

		res.status(201).json({ mesage: "Truck created", result: truck });
	} catch (error) {
        res.status(500).json({ message: "Something went wrong in createTruck process" });
        console.log(error);
    }
};

export const updateTruck = async (req, res) => {
	const { id } = req.params
    const { x, y, cap, load } = req.body
    try {
        const truck = await TruckModel.findById(id);
        if (!truck) return res.status(404).json({ message: "Truck not found"});
        
        if (x) truck.x = x;
        if (y) truck.y = y;
        if (cap) truck.cap = cap;
        if (load) truck.load = load;
        if(!(truck.load >= 0 && truck.cap - truck.load >= 0))
            return res.status(400).json({ message: "Incorrect logic in current load and/or max capacity value" })
    
        const newTruck = await TruckModel.findByIdAndUpdate(id, truck , {new: true , runValidators: true})
                                        .populate("driver", "name role available");
        
        res.status(200).json({ message: "Truck updated", result: newTruck })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in updateTruck process" });
        console.log(error);
    }	
};


export const deleteTruck = async (req, res) => {
	const { id } = req.params
    try {
        let truck = await TruckModel.findById(id).select("-path -nextMCP")
        if (!truck) return res.status(404).json({ message: "Truck not found" })
        if (truck.nextMCP) return res.status(400).json({ message: "Truck is still running"})
		
        truck = await TruckModel.findByIdAndRemove(id).select("-path -nextMCP")
        
		res.status(200).json({ message: "Truck removed", result: truck })
	} catch (error) {
        res.status(500).json({ message: "Something went wrong in deleteTruck process" });
        console.log(error);
    }
}
