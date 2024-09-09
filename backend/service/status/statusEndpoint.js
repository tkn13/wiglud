const { StatusCodes } = require("http-status-codes");
const { getCache } = require("../../util/cache-modifier");


async function statusEndpoint(requestId){

    if( requestId === undefined || requestId === null || requestId === "" ){
        return {
            status_code: StatusCodes.BAD_REQUEST,
            message: {
                message: "Request Id is missing"
            }
        }
    }

    const cache = await getCache(requestId);

    if( cache === null ){
        return {
            status_code: StatusCodes.NOT_FOUND,
            message: {
                message: "Request Id not found"
            }
        }
    }

    return {
        status_code: StatusCodes.OK,
        message: cache
    }

}

module.exports = {
    statusEndpoint
}