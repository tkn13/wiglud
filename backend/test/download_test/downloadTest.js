const { downloadEndpoint } = require("../../service/download/downloadEndpoint");
const { setTestFile, resetFile } = require("../../util/cache-modifier");
const path = require('path');

/*

case 1: requestId is valid but file is not found
    expected: 
        status_code: 404,
        message: "Music file not found"

case 2: requestId is valid and the music file is ready
    expected: 
        status_code: 200,
        message: `Music file is ready for download: <full file path>`
*/

async function testDownloadEndpoint() {
    setTestFile("test/downloadEndpoint/downloadCache.json");

    const testData1 = "0001"; 
    const testData2 = "0002"; 

    const result1 = await downloadEndpoint(testData1);
    const result2 = await downloadEndpoint(testData2);

    const expected1 = {
        status_code: 404,
        message: 'Music file not found',
        filePath: null
    };

    const expected2 = {
        status_code: 200,
        filePath: path.join(__dirname, '../../generated_music', `${testData2}.midi`)
    };

    if (JSON.stringify(result1) === JSON.stringify(expected1)) {
        console.log("Test case 1 passed");
    } else {
        console.log("Test case 1 failed");
        console.log("Expected:", expected1);
        console.log("Result:", result1);
    }

    if (result2.status_code === expected2.status_code && result2.filePath === expected2.filePath) {
        console.log("Test case 2 passed");
    } else {
        console.log("Test case 2 failed");
        console.log("Expected:", expected2);
        console.log("Result:", result2);
    }

    resetFile();
}

async function main() {
    await testDownloadEndpoint();
}

main();
