import { body } from 'express-validator';

// Check validators against path and type.

export const validators = {
    "visits": {
        "POST": [
            body("userId", "userId parameter must be present").isLength({ min: 1 }).trim(),
            body("name", "name paramter must be present").isLength({ min: 1 }).trim(),
        ]
    }
}