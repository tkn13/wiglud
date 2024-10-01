const { StatusCodes } = require("http-status-codes");
const { addCache } = require("../../util/cache-modifier");
const { cacheModel } = require("../../model/cacheModel");
const { generateMusic } = require("../generateMusic/generateMusic");
const Genre  = require("../../model/enum/Genre");
const Instrument  = require("../../model/enum/Instrument");
const WorkStatus = require("../../model/enum/WorkStatus");
const Duration = require("../../model/enum/Duration");

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

  if (!genre || !Object.values(Genre).includes(genre)) {
    return {
      status_code: StatusCodes.BAD_REQUEST,
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

  if (!Object.values(Duration).includes(duration)) {
    return {
      status_code: StatusCodes.BAD_REQUEST,
      message: {
        message: `Invalid duration. Allowed durations are: ${Object.values(Duration).join(", ")}.`,
      },
    };
  }

  const musicGenerationResult = generateMusic(duration, genre, instrument, requestId);

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
    console.log(cacheModel);
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
