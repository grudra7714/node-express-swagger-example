import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var VisitSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Visit", VisitSchema);