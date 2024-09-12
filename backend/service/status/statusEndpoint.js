const { StatusCodes } = require("http-status-codes");
const { getCache } = require("../../util/cache-modifier");
const WorkStatus = require("../../model/enum/WorkStatus");


async function statusEndpoint(requestId){

    if( requestId === undefined || requestId === null || requestId === "" ){
        return {
            status_code: StatusCodes.BAD_REQUEST,
            message: {
                message: "cookie_id is missing"
            }
        }
    }

    const cache = await getCache(requestId);

    if( cache === null ){
        return {
            status_code: StatusCodes.NOT_FOUND,
            message: {
                message: "cookie_id not found"
            }
        }
    }

    const cache_process = cache.status;

    if( cache_process === WorkStatus.Processing ){
        return {
            status_code: StatusCodes.PROCESSING,
            message: cache
        }
    }
    
    if( cache_process === WorkStatus.Success ){
        return {
            status_code: StatusCodes.OK,
            message: cache
        }
    }

    return {
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: {
            message: "Unknown error"
        }
    }
    

}

module.exports = {
    statusEndpoint
}