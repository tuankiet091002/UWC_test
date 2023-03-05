import MCPModel from '../models/mcpModel.js'
import UserModel from '../models/userModel.js'

export const getMCPs = async (req, res) => {
	try {
        const mcps = await MCPModel.find().select('-__v').sort({_id: 1});
        
        res.status(200).json({ message: "MCPs fetched", result: mcps.filter(mcp => mcp._id != 0) })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getMCPs process" });
        console.log(error)
    }
}	
	
export const getSingleMCP = async (req, res) => {
    const { id } = req.params
    try {
        const mcp = await MCPModel.findById(id).select('-__v').populate("janitor").populate("truck")
        if (!mcp) return res.status(404).json({message: "MCP not found"});

        res.status(200).json({ message: "MCP fetched", result: mcp })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getSingleMCP process" });
        console.log(error);
    }
};

export const createMCP = async (req, res) => {
	const { x, y, cap, load } = req.body
	try {
        if(!(load >= 0 && cap - load >= 0))
            return res.status(400).json({ message: "Incorrect logic in current load and/or max capacity value" })
            
		const mcp = await MCPModel.create({ x, y, cap, load });

		res.status(201).json({ message: "MCP created", result: mcp })
	} catch (error) {
        res.status(500).json({ message: "Something went wrong in createMCP process" });
        console.log(error);
    }
}

export const updateMCP = async (req, res) => {
	const { id } = req.params
    const { cap, load } = req.body
    try {
        let mcp = await MCPModel.findById( id )
        if (!mcp) return res.status(404).json({ message: "MCP not found"})

        if(cap) mcp.cap = cap
        if(load) mcp.load = load
        if(!(mcp.load >= 0 && mcp.cap - mcp.load >= 0))
            return res.status(400).json({ message: "Incorrect logic in current load and/or max capacity value" })
        
        const newMCP = await MCPModel.findByIdAndUpdate(id, mcp , {new: true , runValidators: true})
                                    .populate("janitor").populate("truck").select("-__v")
        
        res.status(200).json({ message: "MCP updated", result: newMCP })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong in updateMCP process" });
        console.log(error);
    }	
}


export const deleteMCP = async (req, res) => {
	const { id } = req.params
    try {
        let mcp = await MCPModel.findById(id).select("-truck -__v");
        if (!mcp) return res.status(404).json({ message: "MCP not found" })
        if (mcp.truck) return res.status(400).json({ message: "MCP is still being use" }
        )
		mcp = await MCPModel.findByIdAndRemove(id).select("-truck -__v")
   
        for (const i in mcp.janitor){
            const janitor = await UserModel.findById(mcp.janitor[i]).select('-password -__v')
            if (!janitor) res.status(400).json({ message: `Janitor ${janitor.name} is still working in this MCP`})
            await UserModel.findByIdAndUpdate(janitor._id, {mcp: null});
        }

		res.status(200).json( { message: "MCP deleted", result: mcp } )
	} catch (error) {
        res.status(500).json({ message: "Something went wrong in deleteMCP process" });
        console.log(error);
    }
}
