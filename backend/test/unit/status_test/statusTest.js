const { statusEndpoint } = require("../../../service/status/statusEndpoint");
const { setTestFile, resetFile } = require("../../../util/cache-modifier")

/*

case 1: requestId is undefined
    expected: 
        status_code: 400,
        message: {
            message: "Request Id is missing"
        }

case 2: requestId is null
    expected: 
        status_code: 400,
        message: {
            message: "Request Id is missing"
        }

case 3: requestId is empty string
    expected: 
        status_code: 400,
        message: {
            message: "Request Id is missing"
        }

case 4: requestId is valid but not in the cache
    expected: 
        status_code: 404,
        message: {
            message: "Request Id not found"
        }

case 5: requestId is valid and in the cache
    expected: 
        status_code: 200,
        message: cacheObject
*/

async function testStatusEndpoint() {
    setTestFile("test/statusEndpoint/case1_5.json");
    
    const testData1 = undefined;
    const testData2 = null;
    const testData3 = "";
    const testData4 = "0002";
    const testData5 = "0001";

    const resualt1 = await statusEndpoint(testData1);
    const resualt2 = await statusEndpoint(testData2);
    const resualt3 = await statusEndpoint(testData3);
    const resualt4 = await statusEndpoint(testData4);
    const resualt5 = await statusEndpoint(testData5);

    const expected1 = {
        status_code: 400,
        message: {
            message: "Request Id is missing"
        }
    }

    const expected2 = {
        status_code: 400,
        message: {
            message: "Request Id is missing"
        }
    }

    const expected3 = {
        status_code: 400,
        message: {
            message: "Request Id is missing"
        }
    }

    const expected4 = {
        status_code: 404,
        message: {
            message: "Request Id not found"
        }
    }

    const expected5 = {
        status_code: 200,
        message: {
            "id": "0001",
            "genre": "Pop",
            "duration": "1m",
            "instrument": "Guitar",
            "status": "Processing",
            "status_code": 102,
            "message": "File generation in progress",
            "loading": true,
            "file_url": null
        }
    }

    if (JSON.stringify(resualt1) === JSON.stringify(expected1)) {
        console.log("Test case 1 passed");
    }
    else {
        console.log("Test case 1 failed");
    }

    if (JSON.stringify(resualt2) === JSON.stringify(expected2)) {
        console.log("Test case 2 passed");
    }
    else {
        console.log("Test case 2 failed");
    }

    if (JSON.stringify(resualt3) === JSON.stringify(expected3)) {
        console.log("Test case 3 passed");
    }
    else {
        console.log("Test case 3 failed");
    }

    if (JSON.stringify(resualt4) === JSON.stringify(expected4)) {
        console.log("Test case 4 passed");
    }
    else {
        console.log("Test case 4 failed");
    }

    if (JSON.stringify(resualt5) === JSON.stringify(expected5)) {
        console.log("Test case 5 passed");
    }
    else {
        console.log("Test case 5 failed");
    }

    resetFile();
}

async function main() {
    await testStatusEndpoint();
}

main();