import mongoose from 'mongoose';
import FuzzySearch from 'fuzzy-search';
import Visit from '../models/VisitModel';
import UserVisitTrack from '../models/UserVisitsTrackModel';
import { validationResult } from 'express-validator';
import { ValidationErrorWithData, ErrorResponse, NotFoundResponse } from '../../helpers/apiResponse';


/**
 * 
 * 
 */
export default class VisitController {

    constructor() {
        console.log("Visit controller initialized");
    }

    /**
     * 
     * 
     * @param {Object} req 
     * @param {Object} res 
     */

    async get(req, res) {
        // Check parameter validation

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ValidationErrorWithData(res, 422, "Validation Error", errors.array())
        }        

        // check if visitId is present
        let {visitId, userId, searchString} = req.query;

        if(visitId) {

            try {


                if (!mongoose.Types.ObjectId.isValid(visitId)) {
                    return ValidationErrorWithData(res, 422, "Validation error", "ID Does is not of type ObjectId");
                }

                // Find by visitId
                let getLocations = await Visit.find(
                    { _id: visitId },
                )

                if (!getLocations || (getLocations.length == 0)) {
                    return NotFoundResponse(res, "No data found correspoding to the visitId");
                }

                let payload = [];

                // Response payload
                //  [{ userId: “user1”, name: “McDonald’s”, visitId: “some-visit-id-1” }]

                getLocations.forEach( (item) => {
                    payload.push({
                        userId: item.userId,
                        name: item.name,
                        visitId: item._id,
                    })
                })

                // Note: An improvement over here could be to allow pagination instead of sending all the payload

                res.json(payload);

            } catch(e) {
                return ErrorResponse(res, 403, "Error occured while retreving information", e);
            }

        } else {
            // This case will cover userId, searchString query params
            // This else block also runs under the assumption that the validators functions are written according to requirement


            let getLocations = await UserVisitTrack.findOne(
                { userId: userId },
                // Get top 5 elements per the spec below
                // A string which is attempted to be matched over the 5 most recent locations the user has visited. The matching should be fuzzy, and case insensitive
                { locations: { $slice: 5}}

            )
            
            if (!getLocations  || (getLocations.length == 0)) {
                return NotFoundResponse(res, "No data found correspoding to the userId");
            }

            const searcher = new FuzzySearch(getLocations.locations, ['name']);            
            var matchedLocations = searcher.search(searchString);

            if(matchedLocations.length == 0) {
                // Return an empty response if nothing is found
                res.json([])
            } else {

                var payload = [];
                // Response payload
                //  [{ userId: “user1”, name: “McDonald’s”, visitId: “some-visit-id-1” }]
                matchedLocations.forEach((item) => {
                    payload.push({
                        userId: userId,
                        name: item.name,
                        visitId: item.visitId,
                    })
                })

                res.json(payload);
            }


        }
    }

    /**
     *
     *
     * @param {Object} req
     * @param {Object} res
     */

    async post(req, res) {
        
        // Check if any errors was found by express-validator function
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ValidationErrorWithData(res, 422, "Validation Error", errors.array())
        }        

        // 1. Sanitize body
        // 2. Check for errors

        // Below code will work at follows, 

        // Visit model will save user's location and add records as they come in

        let visit = new Visit({
            userId: req.body.userId,
            name: req.body.name, 
        })


        let visitRes = await visit.save();

        // Ideally we can send a response right here, but dont know if its a valid pattern or not.
        // res.json({ visitId: visitRes._id });

        // We will use mongoDB's update method to do a couple of things
        // 1. We will check with userId and see if its present or not
        // 2. If not, we will create one and add the data
        // 3. If its present, then we will unshift data into the locations array

        // Why are we doing the unshift?
        // Since we have to search on user's top 5 locations, we can maintain a sorted list of locations and during query, we can just take top 5 elements from the array and search of it.

        // Keep a saved object to know when the location was visited

        // NOTE: Below code can be improved using a REDIS cache with a read-miss strategy.

        let savedObject = {
            name: req.body.name,
            timestamp: Date.now(),
            visitId: visitRes._id,            
        };

        await UserVisitTrack.update(
            { 
                userId: req.body.userId 
            }, 
            {
                // User ID to store 
                userId: req.body.userId,
                $push: {
                    locations: {
                        // Object to store
                        $each: [savedObject],
                        // Store the object at the `0th` index
                        $position: 0,
                    }
                }

            }, 
            // It will create the document if it doesnt exits
            { upsert: true }
        )


        res.json({ visitId: visitRes._id });
    }
}