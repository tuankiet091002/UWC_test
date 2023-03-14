import mongoose from 'mongoose';
import Inc from 'mongoose-sequence';

const AutoIncrement = Inc(mongoose);

const truckSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    x: { type: mongoose.Types.Decimal128, required: true, default: 0 },
    y: { type: mongoose.Types.Decimal128, required: true, default: 0 },
    // duong di 
    path: {
        type: [{ 
            type: Number,
            ref: 'MCP',
            required: true,    
        }],
        default: null
    },
    // dia diem ke tiep, nextMCP la index cua path
    nextMCP: { type: Number, ref: 'MCP', default: null },
    load: { type: mongoose.Types.Decimal128, default: 0},
    cap: { type: Number, required: true}
}, {_id: false, versionKey: false})

truckSchema.plugin(AutoIncrement, {id: "truck_seq", inc_field: '_id'});

export default mongoose.model("Truck", truckSchema)