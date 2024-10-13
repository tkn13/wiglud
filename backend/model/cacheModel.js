const Genre = require('./enum/Genre');
const Instrument = require('./enum/Instrument');
const WorkStatus = require('./enum/WorkStatus');

const cacheModel = {
    "request_id": "",
    "genre": Genre.default,
    "duration": "",
    "instrument": Instrument.default,
    "status": WorkStatus.default,
    "status_code": 0,
    "message": "",
    "loading": true,
    "file_url": null
}

module.exports = {
    cacheModel
}

