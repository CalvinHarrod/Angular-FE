const express = require('express');
const path = require('path');
const app = express();

// Handle HEAD requests at root
app.head('/', (req, res) => {
    res.status(200).end();
});

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '/dist/red-form-ver8')));

app.get('/*', (req, res) => {
    // Send the Angular app's index.html file for all requests
    res.sendFile(path.join(__dirname, '/dist/red-form-ver8/index.html'));
});

app.listen(9000, () => {
    console.log('Server is running on port 9000');
});

