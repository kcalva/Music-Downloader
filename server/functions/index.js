const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ytdl = require('ytdl-core');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

admin.initializeApp();

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const cors = require('cors')({ origin: true });

const bucketName = "music-downloader-982f7.appspot.com";

exports.musicDownload = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { youtubeLink } = req.body;
            const videoInfo = await ytdl.getInfo(youtubeLink);

            const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
            if (!audioFormat) {
                return res.status(400).send('No audio format found');
            }

            const tempFilePath = path.join(os.tmpdir(), 'audio.mp3');
            console.log('tempFile path ', tempFilePath)
            const convertedFilePath = path.join(os.tmpdir(), 'audio.aac');
            console.log('convertedFile path', convertedFilePath)

            const file = fs.createWriteStream(tempFilePath);

            ytdl(youtubeLink, { format: audioFormat })
                .pipe(file)
                .on('finish', async () => {
                    // Specify the path to the FFmpeg binary within the 'functions' directory
                    const ffmpegPath = path.join(__dirname, 'ffmpeg');
                    console.log('ffmpegPath ', ffmpegPath)
                    const script = `${ffmpegPath} -i ${tempFilePath} ${convertedFilePath}`
                    console.log('script ', script)
                    exec(script, (error, stdout, stderr) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send('Error converting audio');
                        }

                        const bucket = storage.bucket(bucketName);
                        const destination = `audio/${videoInfo.videoDetails.title}.aac`;

                        bucket.upload(convertedFilePath, {
                            destination: destination,
                            metadata: {
                                contentType: 'audio/aac',
                            },
                        }, (uploadErr) => {
                            if (uploadErr) {
                                console.error(uploadErr);
                                return res.status(500).send('Error uploading audio');
                            }

                            fs.unlinkSync(tempFilePath); // Delete the temporary files
                            fs.unlinkSync(convertedFilePath);

                            return res.status(200).send('Audio downloaded, converted, and uploaded to Firebase Storage');
                        });
                    });
                });

        } catch (error) {
            console.error(error);
            return res.status(500).send('Error downloading audio');
        }
    })
});
