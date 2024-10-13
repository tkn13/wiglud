const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/loading', (req, res) => {
    res.sendFile(path.join(__dirname, 'loading.html'));
});

app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'error.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});