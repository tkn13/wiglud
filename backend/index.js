const express = require("express");
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
app.use(cookieParser());

const musicRequests = {
  "0001": {
    id: "0001",
    genre: "Pop",
    duration: "1m",
    instrument: "Guitar",
    status: "Processing",
    status_Code: 102,
    message: "File generation in progress",
    loading: true,
    file_url: null,
  },
  "0002": {
    id: "0002",
    genre: "Rock",
    duration: "2m",
    instrument: "Piano",
    status: "Success",
    status_code: 200,
    message: "File generated successfully",
    loading: false,
    file_url: "https://example.com/files/generatedSong.mp3",
  },
  "0003": {
    requestId: "0003",
    genre: null,
    duration: null,
    instrument: null,
    status: "No Content",
    status_code: 204,
    message: "No ongoing file generation for this request",
    loading: false,
    file_url: null,
  },
};

app.get('/api/music/status', (req, res) => {
  const requestId = req.cookies.requestId;

  if (requestId && musicRequests[requestId]) {
      res.status(200).json(musicRequests[requestId]);
  } else {
      res.status(404).json({
          status: "Not Found",
          status_code: 404,
          message: "Request not found",
          loading: false,
          fileUrl: null
      });
  }
});

app.post('/api/music/generate', (req, res) => {
  const requestId = uuidv4();
  const { genre, duration, instrument } = req.body;

  musicRequests[requestId] = {
      id: requestId,
      genre,
      duration,
      instrument,
      status: "Processing",
      status_code: 102,
      message: "File generation in progress",
      loading: true,
      fileUrl: null
  };

  res.cookie('requestId', requestId, { httpOnly: true });

  res.status(202).json(musicRequests[requestId]);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
