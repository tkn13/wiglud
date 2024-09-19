const { StatusCodes } = require("http-status-codes");
const { addCache } = require("../../util/cache-modifier");
const { cacheModel } = require("../../model/cacheModel");
const Genre  = require("../../model/enum/Genre");
const Instrument  = require("../../model/enum/Instrument");
const WorkStatus = require("../../model/enum/WorkStatus");

async function generateEndpoint(genre, duration, instrument, requestId) {
  if (genre === undefined || genre === null || genre === "") {
    return {
      status_code: StatusCodes.BAD_REQUEST,
      message: {
        message: "genre is missing",
      },
    };
  }

  if (duration === undefined || duration === null || duration === "") {
    return {
      status_code: StatusCodes.BAD_REQUEST,
      message: {
        message: "duration is missing",
      },
    };
  }

  if (instrument === undefined || instrument === null || instrument === "") {
    return {
      status_code: StatusCodes.BAD_REQUEST,
      message: {
        message: "instrument is missing",
      },
    };
  }

  if (requestId === undefined || requestId === null || requestId === "") {
    return {
      status_code: StatusCodes.BAD_REQUEST,
      message: {
        message: "cookie_id is missing",
      },
    };
  }

  if (!genre || !Object.values(Genre).includes(genre)) {
    return {
      status_code: StatusCodes.CONFLICT,
      message: {
        message: `Invalid genre. Allowed genres are: ${Object.values(Genre).join(", ")}.`,
      },
    };
  }

  if (!instrument || !Object.values(Instrument).includes(instrument)) {
    return {
      status_code: StatusCodes.BAD_REQUEST,
      message: {
        message: `Invalid instrument. Allowed instruments are: ${Object.values(Instrument).join(", ")}.`,
      },
    };
  }

  //เช็คว่ามันตรงกับอันไหน แล้วค่อยเอามาใส่

  const cacheModel = {
    id: requestId,
    genre: genre,
    duration: duration,
    instrument: instrument,
    status: WorkStatus.Processing,
    status_code: StatusCodes.PROCESSING,
    message: "File generation in progress",
    loading: true,
    file_url: null,
  };

  try {
    await addCache(cacheModel);
    return {
      status_code: StatusCodes.PROCESSING,
      message: {
        cacheModel,
      },
    };
  } catch (err) {
    cacheModel.status = "Error";
    cacheModel.status_code = StatusCodes.INTERNAL_SERVER_ERROR;
    cacheModel.message = "Internal server error during file generation";
    return {
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: {
        cacheModel,
      },
    };
  }
}

module.exports = {
  generateEndpoint,
};
