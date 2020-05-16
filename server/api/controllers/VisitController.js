import Visit from '../models/VisitModel';
import { db } from '../../utils/db';


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
        res.send("Inside get visitcontroller");

    }

    async post(req, res) {
        console.log("this",req.body)

        let userIdRes = await Visit.findOne({userId: req.body.userId})
        console.log(userIdRes)
        res.send("Inside post visitcontroller")
    }
}