import mongoose from 'mongoose';
import Inc from 'mongoose-sequence';

const AutoIncrement = Inc(mongoose);

const mcpSchema = new mongoose.Schema({
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    janitor: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }],
        default: null
    },
    load: { type: mongoose.Types.Decimal128, required: true, default: 0 },
    cap: { type: Number, required: true },
}, { _id: false, versionKey: false })

mcpSchema.plugin(AutoIncrement, { id: "mcp_seq", inc_field: '_id' });

export default mongoose.model("MCP", mcpSchema)