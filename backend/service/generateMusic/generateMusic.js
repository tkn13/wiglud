const { spawn } = require('child_process');
const path = require('path');
const { updateCache } = require('../../util/cache-modifier');
const WorkStatus = require("../../model/enum/WorkStatus");
const { StatusCodes } = require("http-status-codes");
const { cacheModel } = require("../../model/cacheModel");

async function generateMusic(duration, genre, instrument, requestId) {
    return new Promise((resolve, reject) => {
        // Define the paths for the Python script and executable
        const pythonScriptPath = path.join(__dirname, '../../../ai', 'interface.py');
        const pythonExecutable = '/opt/venv/bin/python3'; // Path to Python in the virtual environment

        const arr = requestId.split("-");
        const filename = arr[arr.length-1];

        // Spawn a new process to run the Python script
        const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, duration, genre, instrument, filename]);

        let outputData = ''; // To collect stdout data
        let errorData = ''; // To collect stderr data

        // Handle stdout data from the Python process
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python output: ${data}`);
            outputData += data.toString(); // Collect data
        });

        // Handle stderr data (error messages) from the Python process
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
            errorData += data.toString();
        });

        // Handle when the Python process exits
        pythonProcess.on('exit', async (code) => {
            if (code === 0) {
                console.log('Python process completed successfully.');

                const generatedFilePath = filename; // Assume this is the output file path
                

                const cacheModel = {
                    request_id: requestId,
                    genre: genre,
                    duration: duration,
                    instrument: instrument,
                    status: WorkStatus.Success,
                    status_code: StatusCodes.OK,
                    message: "Music generation complete",
                    loading: false,
                    file_url: generatedFilePath
                };

                try {
                    // Update the cache with success information
                    await updateCache(requestId, cacheModel);
                    console.log("-----------");
                    console.log(cacheModel);
                    resolve({
                        status_code: StatusCodes.OK,
                        message: cacheModel
                    });
                } catch (err) {
                    console.error("Error updating cache:", err);
                    reject({
                        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: "Error while updating cache after file generation"
                    });
                }

            } else {
                console.error(`Python process exited with code: ${code}`);
                reject({
                    status_code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: `Music generation failed with exit code ${code}`
                });
            }
        });

        // Handle errors that occur during the process execution
        pythonProcess.on('error', (err) => {
            console.error('Failed to spawn the process:', err);
            reject({
                status_code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Internal server error while running the Python script"
            });
        });
    });
}

module.exports = { generateMusic };
