import express, { Request, Response } from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { exec } from 'child_process';

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/converted', express.static('converted'));

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    const file = req.file;
    const outputFormat = req.body.outputFormat;
    const outputPath = `./converted/${Date.now()}.${outputFormat}`;

    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let command = ffmpeg(file.path);

    if (outputFormat === 'wav') {
        command = command.audioCodec('pcm_s16le').audioChannels(2).audioFrequency(44100);
    }

    command
        .toFormat(outputFormat)
        .on('end', () => {
            res.json({ success: true, url: outputPath.replace('./', '/') });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Conversion failed' });
        })
        .save(outputPath);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
