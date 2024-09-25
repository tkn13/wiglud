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

app.get('/api/music/status', async (req, res) => {

    const cookie_id = req.cookies.cookie_id;

    const resualt = await statusEndpoint(cookie_id);

    const resualtCode = resualt.status_code;
    const requestData = resualt.message;

    res.status(resualtCode).send(requestData);

});

app.post('/api/music/generate', async (req, res) => {
    const { genre, duration, instrument } = req.body;
    const requestId = uuidv4();
  
    const resualt = await generateEndpoint(genre, duration, instrument, requestId);
  
    const resualtCode = resualt.status_code;
    const requestData = resualt.message;
  
    res.status(resualtCode).send(requestData);
});

app.get('/api/music/ai', (req, res) => {
    // Use the Python executable from the virtual environment
    const pythonScriptPath = path.join('../ai/', 'interface.py');
    const pythonExecutable = '/opt/venv/bin/python3'; // Path to Python in the virtual environment
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath]);
  
    let output = '';
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
  
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });
  
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.send(`Python Run Success: ${output}`);
        } else {
            res.status(500).send('Error running Python script');
        }
    });
  });

app.listen(3000, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});