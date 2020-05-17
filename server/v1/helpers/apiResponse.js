export const SuccessResponse = function (res, status=0, msg) {
    var data = {
        status: status,
        message: msg
    };
    return res.status(200).json(data);
};

export const SuccessResponseWithData = function (res, status=0, msg, data) {
    var resData = {
        status: status,
        message: msg,
        data: data
    };
    return res.status(200).json(resData);
};

export const ErrorResponse = function (res, status=0, msg) {
    var data = {
        status: status,
        message: msg,
    };
    return res.status(500).json(data);
};

export const NotFoundResponse = function (res, msg) {
    var data = {
        status: 404,
        message: msg,
    };
    return res.status(404).json(data);
};

export const ValidationErrorWithData = function (res, status=0, msg, data) {
    var resData = {
        status: status,
        message: msg,
        data: data
    };
    return res.status(400).json(resData);
};

export const UnauthorizedResponse = function (res, status=0, msg) {
    var data = {
        status: status,
        message: msg,
    };
    return res.status(401).json(data);
};