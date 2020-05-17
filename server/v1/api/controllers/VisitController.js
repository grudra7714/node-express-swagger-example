import Visit from '../models/VisitModel';
import UserVisitTrack from '../models/UserVisitsTrackModel';
import { validationResult } from 'express-validator';
import { ValidationErrorWithData } from '../../helpers/apiResponse';


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

    get(req, res) {
        // Check parameter validation
        console.log(req.query)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ValidationErrorWithData(res, 422, "Validation Error", errors.array())
        }        

        res.send("Inside get visitcontroller");

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
            timestamp: Date.now()
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