import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var UserVisitsTrackSchema = new Schema({
    userId: { type: String, required: true },
    // Locations will keep track of users most recent locations
    locations: { type: Array, required: true },
}, { timestamps: true });

export default mongoose.model("UserVisitsTrack", UserVisitsTrackSchema);