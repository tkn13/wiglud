const { StatusCodes } = require("http-status-codes");
const path = require('path');
const fs = require('fs');
const { statusEndpoint } = require('../status/statusEndpoint');

const downloadEndpoint = async (requestId) => {
    try {
        const statusResult = await statusEndpoint(requestId);

        if (statusResult.status_code === StatusCodes.PROCESSING) {
            return {
                status_code: StatusCodes.PROCESSING,
                message: 'Music is still being processed. Please wait.'
            };
        }

        const filePath = path.join(__dirname, '../../../generated_music', `${requestId}.mid`);
        const fileExists = fs.existsSync(filePath);
        console.log(filePath, fileExists);

        if (fileExists) {
            return {
                status_code: StatusCodes.OK,
                message: 'Music ready to download',
                filePath: filePath
            };
        } else {
            return {
                status_code: StatusCodes.NOT_FOUND,
                message: 'Music file not found',
                filePath: null
            };
        }
    } catch (error) {
        console.error('Error in downloadEndpoint:', error);

        return {
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
            filePath: null
        };
    }
};

module.exports = { downloadEndpoint };
