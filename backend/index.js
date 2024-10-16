const express = require("express");
const { v4: uuidv4 } = require('uuid');
const app = express();
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

app.use(express.json());

app.use(cors());


const PORT = 3000;
const HOST = "localhost";



const { statusEndpoint } = require('./service/status/statusEndpoint');
const { generateEndpoint } = require("./service/generate/generateEndpoint");
const { downloadEndpoint } = require("./service/download/downloadEndpoint");


app.post('/api/music/status', async (req, res) => {

    const {cookie_id} = req.body
    console.log(cookie_id)

    const resualt = await statusEndpoint(cookie_id);

    const resualtCode = resualt.status_code;
    const requestData = resualt.message;

    //res.status(resualtCode).send(requestData);
    res.send(requestData);

});

app.get('/api/music/download/:id', async (req, res) => {
    const cookie_id = req.params.id;

    const resualt = await downloadEndpoint(cookie_id);

    const resualtCode = resualt.status_code;
    const requestData = resualt.message;
    const resualtFilePath = resualt.filePath;

    if (resualtFilePath !== null) {
        res.download(resualtFilePath);
        return
    } 

    //res.status(resualtCode).send(requestData);
    const errorFilePath = path.join(__dirname, 'model', 'html', 'error.html');
    res.status(resualtCode).sendFile(errorFilePath);
    
});

app.post('/api/music/generate', async (req, res) => {
    let { genre, duration, instrument } = req.body;
    duration = parseInt(duration);
    const requestId = uuidv4();

    console.log(genre, duration, instrument, requestId);
    console.log(req.body);
  
    const resualt = await generateEndpoint(genre, duration, instrument, requestId);
  
    const resualtCode = resualt.status_code;
    const requestData = resualt.message;
    
    //res.status(resualtCode).send(requestData);
    res.send(requestData);
});

app.get('/api/music/ai', (req, res) => {
    // Use the Python executable from the virtual environment

    const pythonScriptPath = path.join(__dirname, '../ai', 'interface.py');
    const pythonExecutable = '/opt/venv/bin/python3'; // Path to Python in the virtual environment

    const requestId = uuidv4();

    const arr = requestId.split("-");
    const filename = arr[arr.length-1];

        // Spawn a new process to run the Python script
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, 1, "beeth", "piano", filename]);
      
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
            res.status(500).send(`Error running Python script ${output}`);
        }
    });
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});