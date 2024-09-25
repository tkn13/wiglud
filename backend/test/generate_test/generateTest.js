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

case 4: invalid genre
    expected: 
        status_code: 409,
        message: {
            message: "Invalid genre. Allowed genres are: <list_of_genres>"
        }

case 5: invalid instrument
    expected: 
        status_code: 400,
        message: {
            message: "Invalid instrument. Allowed instruments are: <list_of_instruments>"
        }

case 6: invalid duration
    expected: 
        status_code: 400,
        message: {
            message: "Invalid duration. Allowed durations are: <list_of_durations>"
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
    const invalidDuration = "30s"; // assuming 30s is not in the allowed duration list
    const validGenre = "Pop";
    const validDuration = "1m"; // assuming 1m is in the allowed duration list
    const validInstrument = "Guitar";

    const result1 = await generateEndpoint(undefined, validDuration, validInstrument, validRequestId);
    const result2 = await generateEndpoint(validGenre, undefined, validInstrument, validRequestId);
    const result3 = await generateEndpoint(validGenre, validDuration, undefined, validRequestId);
    const result4 = await generateEndpoint(invalidGenre, validDuration, validInstrument, validRequestId);
    const result5 = await generateEndpoint(validGenre, validDuration, invalidInstrument, validRequestId);
    const result6 = await generateEndpoint(validGenre, invalidDuration, validInstrument, validRequestId);

    // Mock a valid cache addition with no error
    const result7 = await generateEndpoint(validGenre, validDuration, validInstrument, validRequestId);

    const expected1 = {
        status_code: 400,
        message: {
            message: "genre is missing"
        }
    };

    const expected2 = {
        status_code: 400,
        message: {
            message: "duration is missing"
        }
    };

    const expected3 = {
        status_code: 400,
        message: {
            message: "instrument is missing"
        }
    };

    const expected4 = {
        status_code: 400,
        message: {
            message: `Invalid genre. Allowed genres are: Default, Pop, Rock.`
        }
    };

    const expected5 = {
        status_code: 400,
        message: {
            message: `Invalid instrument. Allowed instruments are: Default, Guitar, Saxophone.`
        }
    };

    const expected6 = {
        status_code: 400,
        message: {
            message: `Invalid duration. Allowed durations are: 1m, 2m, 3m, Default.`
        }
    };

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
    };

    function checkResult(result, expected, testCaseNumber) {
        if (JSON.stringify(result) === JSON.stringify(expected)) {
            console.log(`Test case ${testCaseNumber} passed`);
        } else {
            console.log(`Test case ${testCaseNumber} failed`);
            console.log("Expected: ", expected);
            console.log("Result: ", result);
        }
    }

    checkResult(result1, expected1, 1);
    checkResult(result2, expected2, 2);
    checkResult(result3, expected3, 3);
    checkResult(result4, expected4, 4);
    checkResult(result5, expected5, 5);
    checkResult(result6, expected6, 6);
    checkResult(result7, expected7, 7);

    resetFile();
}

async function main() {
    await testGenerateEndpoint();
}

main();
