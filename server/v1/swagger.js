export default 
{
    "swagger": "3.0",
    "openapi": "3.0.0",
    "info": {
        "description": "This is a sample node-express-swagger application",
        "version": "1.0.0",
        "title": "Swagger Node Express",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "email": "apiteam@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        }
    },
    "host": "localhost:3000",
    "basePath": "/api",
    "tags": [
        {
            "name": "visit",
            "description": "Saves locations",
            "externalDocs": {
                "description": "Find out more",
                "url": "http://swagger.io"
            }
        },
        {
            "name": "getvisit",
            "description": "Get locations data",
            "externalDocs": {
                "description": "Find out more about our store",
                "url": "http://swagger.io"
            }
        }
    ],
    "schemes": [
        "https"
    ],
    "paths": {
        "/visit": {
            "post": {
                "tags": [
                    "visit"
                ],
                "summary": "Returns a visitId which can be referenced in the GET. Visit IDs are globally unique to the location submission",
                "description": "",
                "operationId": "saveLocation",
                "requestBody": {
                    "$ref": "#/components/requestBodies/Visit"
                },
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "$ref": "#/components/schemas/PostVisit"
                        }
                    },
                    "403": {
                        "description": "Error ocurred while retrieving information"
                    },
                    "404": {
                        "description": "No data found correspoding to the visitId/ username && searchString"
                    },

                    "422": {
                        "description": "Validaton Error"
                    }
                }
            },
            "get": {
                "tags": [
                    "getvisit"
                ],
                "summary": "Returns array of object based on query parameters",
                "description": "",
                "operationId": "getLocationByVisitIDOrUserIdAndString",
                "produces": [
                    "application/xml",
                    "application/json"
                ],
                "parameters": [
                    {
                        "in": "query",
                        "name": "userId",
                        "description": "The name that needs to be fetched.",
                        "type": "string"
                    },
                    {
                        "in": "query",
                        "name": "searchString",
                        "description": "String that will be fuzzy matched with user's last 5 saved locations",
                        "type": "string"
                    },
                    {
                        "in": "query",
                        "name": "visitId",
                        "description": "Gets location based on visitId",
                        "type": "string"
                    },
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "$ref": "#/components/schemas/GetVisit"
                        }
                    },
                    "400": {
                        "description": "Invalid username supplied"
                    },
                    "404": {
                        "description": "User not found"
                    },
                    "422": {
                        "description": "Validaton Error"
                    }
                }
            }
        }
    },
    "components": {
        "requestBodies": {
            "Visit": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Visit"
                        }
                    },
                },
                "description": "Saves location per user id"
            }
        },
        "schemas": {
            "Visit": {
                "type": "object",
                "required": [
                    "userId",
                    "name",
                ],
                "properties": {
                    "userId": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                }
            },
            "GetVisit": {
                "type": "object",
                "properties": {
                    "visitId": {
                        "type": "string"
                    },
                    "userId": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    }
                }
            },
            "PostVisit": {
                "type": "object",
                "properties": {
                    "visitId": {
                        "type": "string"
                    },
                }
            },
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "type": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            }
        },
    },
    "externalDocs": {
        "description": "Find out more about Swagger",
        "url": "http://swagger.io"
    }
}