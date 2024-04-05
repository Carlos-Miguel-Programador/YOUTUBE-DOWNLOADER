const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());

const source = path.join(os.homedir(), 'Downloads');

app.get('/download/video', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ mensagem: 'A URL do vídeo não foi fornecida' });
        }

        ytdl.getInfo(url)
            .then(info => {
                const videoTitle = info.videoDetails.title;
                console.log('Iniciando o download do vídeo...');
                ytdl(url, { quality: 'highestvideo' })
                    .pipe(fs.createWriteStream(path.join(source, `${videoTitle}.mp4`)))
                    .on('finish', () => {
                        return res.json({ mensagem: 'Vídeo baixado com sucesso!' });
                    })
                    .on('error', () => {
                        return res.status(500).json({ mensagem: 'Ocorreu um erro durante o download do vídeo' });
                    });
            })
            .catch(error => {
                return res.status(404).json({ mensagem: 'Não foi possível obter informações do vídeo' });
            });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
    }
});

app.get('/download/audio', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ mensagem: 'A URL do vídeo não foi fornecida' });
        }

        ytdl.getInfo(url)
            .then(info => {
                const videoTitle = info.videoDetails.title;
                console.log('Iniciando o download do áudio...');
                ytdl(url, { quality: 'highestaudio', format: 'mp3' })
                    .pipe(fs.createWriteStream(path.join(source, `${videoTitle}.mp3`)))
                    .on('finish', () => {
                        return res.json({ mensagem: 'Áudio baixado com sucesso!' });
                    })
                    .on('error', () => {
                        return res.status(500).json({ mensagem: 'Ocorreu um erro durante o download do áudio' });
                    });
            })
            .catch(error => {
                return res.status(404).json({ mensagem: 'Não foi possível obter informações do vídeo' });
            });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro interno no servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
