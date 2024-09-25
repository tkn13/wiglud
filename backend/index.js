const express = require("express");
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const { spawn } = require('child_process');
const path = require('path');

app.use(express.json());
app.use(cookieParser());

const PORT = 3000;
const HOST = "localhost";

const { statusEndpoint } = require('./service/status/statusEndpoint');
const { generateEndpoint } = require("./service/generate/generateEndpoint");
const { downloadEndpoint } = require("./service/download/downloadEndpoint");

app.get('/api/music/status', async (req, res) => {

    const cookie_id = req.cookies.cookie_id;

    const resualt = await statusEndpoint(cookie_id);

    const resualtCode = resualt.status_code;
    const requestData = resualt.message;

    res.status(resualtCode).send(requestData);

});

// app.get('/api/music/:id', async (req, res) => {
//     // const cookie_id = req.cookies.cookie_id;
//     const cookie_id = req.params.id;

//     console.log(cookie_id)
//     const resualt = await downloadEndpoint(cookie_id, res);

//     const resualtCode = resualt.status_code;
//     const resualtData = resualt.message;
//     const resualtFilePath = resualt.filePath;

//     res.status(resualtCode).send(resualtData);
//     res.download(resualtFilePath);
// });

app.get('/api/music/:id', async (req, res) => {
    const cookie_id = req.params.id;

    const result = await downloadEndpoint(cookie_id);

    res.status(result.status_code);

    if (result.filePath) {
        return res.download(result.filePath, (err) => {
            if (err) {
                console.error("Download error:", err);
                return res.status(500).send('Could not download the file');
            }
        });
    } else {
        return res.send(result.message);
    }
});



app.post('/api/music/generate', async (req, res) => {
    const { genre, duration, instrument } = req.body;
    const requestId = uuidv4();
  
    const resualt = await generateEndpoint(genre, duration, instrument, requestId);
  
    const resualtCode = resualt.status_code;
    const requestData = resualt.message;
  
    res.status(resualtCode).send(requestData);
});

app.listen(3000, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});