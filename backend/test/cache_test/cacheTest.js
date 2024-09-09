const { setTestFile, resetFile, getCache } = require("../../util/cache-modifier")


/* 

Test cases for getCache function

case 1: cacheId is undefined
    expected: null

case 2: cacheId is null
    expected: null

case 3: cacheId is empty string
    expected: null

case 4: cacheId is valid but not in the cache
    expected: null

case 5: cacheId is valid and in the cache
    expected: cacheObject
----------------------------------------------------------------

*/

async function test_getCache() {
    setTestFile("test/getCache/case1_5.json");

    const testData1 = undefined;
    const testData2 = null;
    const testData3 = "";
    const testData4 = "0002";
    const testData5 = "0001";

    const resualt1 = await getCache(testData1);
    const resualt2 = await getCache(testData2);
    const resualt3 = await getCache(testData3);
    const resualt4 = await getCache(testData4);
    const resualt5 = await getCache(testData5);

    const expected1 = null;
    const expected2 = null;
    const expected3 = null;
    const expected4 = null;
    const expected5 = {
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
    await test_getCache();
}

main();