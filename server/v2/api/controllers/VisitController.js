import FuzzySearch from 'fuzzy-search';
import { v4 as uuidv4 } from 'uuid';
import { getClient } from "../../utils/db";
import { validationResult } from 'express-validator';
import { ValidationErrorWithData, ErrorResponse, NotFoundResponse } from '../../helpers/apiResponse';

const redisClient = getClient();

/**
 * 
 * 
 */
export default class VisitController {

    constructor() {
        console.log("[v2][redis]Visit controller initialized");
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
                let order = redisClient.get('visit-' + visitId)
                order.then( (data) => {
                    let collection = JSON.parse(data);
                    delete collection.updatedAt;
                    res.json([collection])
                })
            } catch(e) {
                return ErrorResponse(res, 403, "Error occured while retreving information", e);
            }

        } else {
            // This case will cover userId, searchString query params
            // This else block also runs under the assumption that the validators functions are written according to requirement
            let order = redisClient.zrevrange('locations-userId-' + userId,  0,  -1)

            // TODO: Implement error handling here
            order.then((data) => {

                let payload = []
                
                data.forEach( (item) => { 
                    var obj = JSON.parse(item);
                    obj.userId = userId; 
                    payload.push(obj); 
                })

                const searcher = new FuzzySearch(payload, ['name']);
                var matchedLocations = searcher.search(searchString);

                if (matchedLocations.length == 0) {
                    // Return an empty response if nothing is found
                    res.json([])
                } else {
                    res.json(matchedLocations);
                }
            })

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

        const visitId = uuidv4();

        var visitPayload = {
            "visitId": visitId,
            "userId": req.body.userId,
            "name": req.body.name,
            "updatedAt": Date.now(),
        }

        // We have to use redis client here to save data per user_id
        redisClient.set("visit-" + visitId, JSON.stringify(visitPayload));

        let payloadForQuickAccess = {
            visitId: "visit-" + visitId,
            name: req.body.name,
        };

        redisClient.zadd("locations-userId-" + req.body.userId, Date.now(), JSON.stringify(payloadForQuickAccess))
        res.json({ visitId: visitId})
    }
}