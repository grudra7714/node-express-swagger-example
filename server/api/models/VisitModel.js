import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var VisitSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    isbn: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Visit", VisitSchema);