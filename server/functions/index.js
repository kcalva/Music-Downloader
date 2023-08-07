const functions = require('firebase-functions');
const { exec } = require('child_process');

const cors = require('cors')({ origin: true });

exports.musicDownload = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        console.log(req.body)
        const { youtubeLink } = req.body;

        const directory = `/Users/kev/Documents/Music`;

        const command = `youtube-dl --audio-quality 0 -i --extract-audio --audio-format mp3 -o './%(title)s.%(ext)s' --add-metadata --embed-thumbnail --metadata-from-title "%(artist)s - %(title)s" ${youtubeLink}`;

        await exec(command, { shell: '/bin/zsh' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                res.status(500).send(`Error occurred ${error.message}`);
            } else if (stderr) {
                console.error(`Stderr: ${stderr}`);
                res.status(500).send(`Error occurred ${stderr}`);
            } else {
                console.log(`Command output: ${stdout}`);
                res.send('Command executed successfully');
            }
        });
    })
});
