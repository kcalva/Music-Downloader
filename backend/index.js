// server.js

const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());

// const port = process.env.PORT || 5000;

app.use(express.json());

app.post('/execute-script', (req, res) => {
    const { youtubeLink } = req.body;

    const shellScript = `cd /Users/kev/Documents/Music && youtube-dl --audio-quality 0 -i --extract-audio --audio-format mp3 -o './%(title)s.%(ext)s' --add-metadata --embed-thumbnail --metadata-from-title "%(artist)s - %(title)s" ${youtubeLink}`

    exec(shellScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing shell script: ${error}`);
            return res.status(500).json({ error: 'Failed to execute shell script' });
        }
        console.log('Shell script executed successfully');
        // Optionally, you can provide additional response data based on your requirements

        return res.status(200).json({ success: true });
    });


});

// app.listen(port, () => {
//     console.log(`Server is running on port ${port} `);
// });
