import { body, query, oneOf} from 'express-validator';

// Check validators against path and type.


// Below definations is suppose to enforce conditions listed in the API


export const validators = {
    "visit": {
        "POST": [
            // Both userId and name should be present

            body("userId", "userId parameter must be present").isLength({ min: 1 }).trim(),
            body("name", "name paramter must be present").isLength({ min: 1 }).trim(),
        ],
        "GET": [
            oneOf( // <-- one of the following must exist
                [
                    // Both userId and searchString should be present
                    [
                        query("userId", "userId should be present").isLength({ min: 1 }).trim(),
                        query("searchString", "Search String should be present").isLength({ min: 1 }).trim(),

                    ],

                    // Or just visitedId should be present
                    query("visitId", "visitId parameter must be present").isLength({ min: 1 }).trim(),

                ],
            ),
        ]
    }
}