/*

{
    cache:[
        {cacheObject},
    ]
}


// Cache Object
{

    id: "0001",
    genre: "Pop",
    duration: "1m",
    instrument: "Guitar",
    status: "Processing",
    status_Code: 102,
    message: "File generation in progress",
    loading: true,
    file_url: null,

}

*/

const Path = require('path');
const fs = require('fs');

const mainFile = "cookie.json";
let testFile = mainFile;
let cookiePath = Path.join(__dirname, '../data/cache/', testFile);


//this function will return the cache object if it exists else it will return null
async function getCache(cacheId) {
    try {
        const cache = await fs.promises.readFile(cookiePath, 'utf8');
        const cacheObj = JSON.parse(cache);
        const cacheObject = cacheObj.cache.find((cache) => cache.id === cacheId);

        if (!cacheObject) return null
        return cacheObject;

    } catch (err) {
        console.error("[cache-modifier.js] getCache() error: ", err);
        return null;
    }
}


//this function will add a cache object to the cache array
async function addCache(cacheObject) {
    try {
        const cache = await fs.promises.readFile(cookiePath, 'utf8');
        const cacheObj = JSON.parse(cache);
        cacheObj.cache.push(cacheObject);
        await fs.promises.writeFile(cookiePath, JSON.stringify(cacheObj, null, 2));
    } catch (err) {
        console.error("[cache-modifier.js] addCache() error: ", err);
        throw err;
    }
}

//this function will write over the existing cache array with the new cache array
async function setCache(cacheObjectArray) {
    /*
        input
        {
            cache: [{cacheObject}]
        }
    */
    try {
        await fs.promises.writeFile(cookiePath, JSON.stringify(cacheObjectArray, null, 2), { flag: 'w' });
    } catch (err) {
        console.error("[cache-modifier.js] setCache() error: ", err);
        throw err;
    }
}

async function deleteCache(cacheId) {
    try {
        const cache = await fs.promises.readFile(cookiePath, 'utf8');
        const cacheObj = JSON.parse(cache);
        const updatedCache = cacheObj.cache.filter((cache) => cache.id !== cacheId);
        cacheObj.cache = updatedCache;
        await setCache(cacheObj);

    } catch (err) {
        console.error("[cache-modifier.js] deleteCache() error: ", err);
        throw err;
    }
}

async function updateCache(cacheId, updatedCacheObject) {

    try {
        await deleteCache(cacheId);
        await addCache(updatedCacheObject);
    } catch (err) {
        console.error("[cache-modifier.js] updateCache() error: ", err);
        throw err;
    }
}

function setTestFile(fileName) {
    testFile = fileName;
    cookiePath = Path.join(__dirname, '../data/cache/', testFile);
}

function resetFile() {
    testFile = mainFile;
    cookiePath = Path.join(__dirname, '../data/cache/', testFile);
}

module.exports = {
    getCache,
    addCache,
    setCache,
    deleteCache,
    updateCache,
    setTestFile,
    resetFile
}