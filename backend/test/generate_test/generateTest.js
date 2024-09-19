const { generateEndpoint } = require("../../service/generate/generateEndpoint");
const { setTestFile, resetFile } = require("../../util/cache-modifier");
const { v4: uuidv4 } = require('uuid');

/*

Test cases for generateEndpoint:

case 1: genre is missing
    expected: 
        status_code: 400,
        message: {
            message: "genre is missing"
        }

case 2: duration is missing
    expected: 
        status_code: 400,
        message: {
            message: "duration is missing"
        }

case 3: instrument is missing
    expected: 
        status_code: 400,
        message: {
            message: "instrument is missing"
        }

case 4: requestId is missing
    expected: 
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }

case 5: invalid genre
    expected: 
        status_code: 409,
        message: {
            message: "Invalid genre. Allowed genres are: <list_of_genres>"
        }

case 6: invalid instrument
    expected: 
        status_code: 400,
        message: {
            message: "Invalid instrument. Allowed instruments are: <list_of_instruments>"
        }

case 7: valid input, file generation in progress
    expected: 
        status_code: 102,
        message: {
            cacheModel: <cache_model>
        }

*/

async function testGenerateEndpoint() {
    setTestFile("test/generateEndpoint/testCache.json");

    const validRequestId = uuidv4();
    const invalidGenre = "Jazz"; // assuming Jazz is not in the allowed genres list
    const invalidInstrument = "Flute"; // assuming Flute is not in the allowed instruments list
    const validGenre = "Pop";
    const validDuration = "1m";
    const validInstrument = "Guitar";

    const resualt1 = await generateEndpoint(undefined, validDuration, validInstrument, validRequestId);
    const resualt2 = await generateEndpoint(validGenre, undefined, validInstrument, validRequestId);
    const resualt3 = await generateEndpoint(validGenre, validDuration, undefined, validRequestId);
    const resualt4 = await generateEndpoint(validGenre, validDuration, validInstrument, undefined);
    const resualt5 = await generateEndpoint(invalidGenre, validDuration, validInstrument, validRequestId);
    const resualt6 = await generateEndpoint(validGenre, validDuration, invalidInstrument, validRequestId);

    // Mock a valid cache addition with no error
    const resualt7 = await generateEndpoint(validGenre, validDuration, validInstrument, validRequestId);

    const expected1 = {
        status_code: 400,
        message: {
            message: "genre is missing"
        }
    }

    const expected2 = {
        status_code: 400,
        message: {
            message: "duration is missing"
        }
    }

    const expected3 = {
        status_code: 400,
        message: {
            message: "instrument is missing"
        }
    }

    const expected4 = {
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }
    }

    const expected5 = {
        status_code: 409,
        message: {
            message: `Invalid genre. Allowed genres are: Default, Pop, Rock.`
        }
    }

    const expected6 = {
        status_code: 400,
        message: {
            message: `Invalid instrument. Allowed instruments are: Default, Guitar, Saxophone.`
        }
    }

    const expected7 = {
        status_code: 102,
        message: {
            cacheModel: {
                id: validRequestId,
                genre: validGenre,
                duration: validDuration,
                instrument: validInstrument,
                status: "Processing",
                status_code: 102,
                message: "File generation in progress",
                loading: true,
                file_url: null
            }
        }
    }

    function checkResult(result, expected, testCaseNumber) {
        if (JSON.stringify(result) === JSON.stringify(expected)) {
            console.log(`Test case ${testCaseNumber} passed`);
        } else {
            console.log(`Test case ${testCaseNumber} failed`);
            console.log("Expected: ", expected);
            console.log("Result: ", result);
        }
    }

    checkResult(resualt1, expected1, 1);
    checkResult(resualt2, expected2, 2);
    checkResult(resualt3, expected3, 3);
    checkResult(resualt4, expected4, 4);
    checkResult(resualt5, expected5, 5);
    checkResult(resualt6, expected6, 6);
    checkResult(resualt7, expected7, 7);

    resetFile();
}

async function main() {
    await testGenerateEndpoint();
}

main();

