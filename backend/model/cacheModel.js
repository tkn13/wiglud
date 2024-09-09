import Genre from "./enum/Genre.js";
import Instrument from "./enum/Instrument";
import WorkStatus from "./enum/WorkStatus";

const cacheModel = {
    "id": "",
    "genre": Genre.default,
    "duration": "",
    "instrument": Instrument.default,
    "status": WorkStatus.default,
    "status_code": 0,
    "message": "",
    "loading": true,
    "file_url": null
}

export default cacheModel;