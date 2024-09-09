const { statusEndpoint } = require("../../service/status/statusEndpoint");
const { setTestFile, resetFile } = require("../../util/cache-modifier")

/*

case 1: requestId is undefined
    expected: 
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }

case 2: requestId is null
    expected: 
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }

case 3: requestId is empty string
    expected: 
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }

case 4: requestId is valid but not in the cache
    expected: 
        status_code: 404,
        message: {
            message: "cookie_id not found"
        }

case 5: requestId is valid and in the cache and cache is Processing
    expected: 
        status_code: 102,
        message: cacheObject

case 6: requestId is valid and in the cache and cache is Ready
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
    const testData6 = "0004";

    const resualt1 = await statusEndpoint(testData1);
    const resualt2 = await statusEndpoint(testData2);
    const resualt3 = await statusEndpoint(testData3);
    const resualt4 = await statusEndpoint(testData4);
    const resualt5 = await statusEndpoint(testData5);
    const resualt6 = await statusEndpoint(testData6);

    const expected1 = {
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }
    }

    const expected2 = {
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }
    }

    const expected3 = {
        status_code: 400,
        message: {
            message: "cookie_id is missing"
        }
    }

    const expected4 = {
        status_code: 404,
        message: {
            message: "cookie_id not found"
        }
    }

    const expected5 = {
        status_code: 102,
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

    const expected6 = {
        status_code: 200,
        message: {
            "id": "0004",
            "genre": "Pop",
            "duration": "1m",
            "instrument": "Guitar",
            "status": "Success",
            "status_code": 200,
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
        console.log("Expected: ", expected1);
        console.log("Resualt: ", resualt1);
    }

    if (JSON.stringify(resualt2) === JSON.stringify(expected2)) {
        console.log("Test case 2 passed");
    }
    else {
        console.log("Test case 2 failed");
        console.log("Expected: ", expected2);
        console.log("Resualt: ", resualt2);
    }

    if (JSON.stringify(resualt3) === JSON.stringify(expected3)) {
        console.log("Test case 3 passed");
    }
    else {
        console.log("Test case 3 failed");
        console.log("Expected: ", expected3);
        console.log("Resualt: ", resualt3);
    }

    if (JSON.stringify(resualt4) === JSON.stringify(expected4)) {
        console.log("Test case 4 passed");
    }
    else {
        console.log("Test case 4 failed");
        console.log("Expected: ", expected4);
        console.log("Resualt: ", resualt4);
    }

    if (JSON.stringify(resualt5) === JSON.stringify(expected5)) {
        console.log("Test case 5 passed");
    }
    else {
        console.log("Test case 5 failed");
        console.log("Expected: ", expected5);
        console.log("Resualt: ", resualt5);
    }

    if (JSON.stringify(resualt6) === JSON.stringify(expected6)) {
        console.log("Test case 6 passed");
    }
    else {
        console.log("Test case 6 failed");
        console.log("Expected: ", expected6);
        console.log("Resualt: ", resualt6);
    }

    resetFile();
}

async function main() {
    await testStatusEndpoint();
}

main();