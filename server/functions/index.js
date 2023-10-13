const functions = require('firebase-functions');
const ytdl = require('ytdl-core');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors')({ origin: true });
const storage = new Storage()
exports.musicDownload = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { youtubeLink } = req.body;
        try {
            const videoInfo = await ytdl.getInfo(youtubeLink)
            console.log('this is videoInfo', videoInfo)
            const audioStream = ytdl(youtubeLink, { filter: 'audioonly' })
            const bucket = storage.bucket("music-downloader-982f7.appspot.com")
            const file = bucket.file(`audio/${videoInfo.videoDetails.title}.mp3`)
            const writeStream = file.createWriteStream()

            audioStream.pipe(writeStream)

            writeStream.on('error', (error) => {
                console.error('Error uploading to Firebase Storage:', error)
                res.status(500).send('Error uploading audio.')
            })

            writeStream.on('finish', () => {
                res.status(200).send('Audio uploaded successfully!')
            })
        }
        catch (error) {
            console.error('Error downloading audio:', error)
            res.status(500).send('Error downloading audio.')
        }

    })
});
