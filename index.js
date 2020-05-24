const express = require('express')
const app = express()
const fileReader = require('./controller/FileReader')
const path = require('path')
const dataDirectory = 'data'
const fs = require('fs')

let fileState = {}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/moongate-launcher Setup 0.0.1.exe'));
});

app.listen(process.env.PORT, () => console.log(`listening at ${process.env.PORT}`))

app.get('/latest', (req, res) => res.send(fileState))

app.get('/updateLatest', async (req, res) => {

    await updateFileState()
    res.send('done')
})

app.get('/getFile', async (req, res) => {
    let filepath = req.query.file
    let filename = path.basename(filepath)
    let file = await fileReader.getFile(filepath)

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', 'application/x-msdownload');
    res.setHeader('file-size', file.length)
    res.download(filepath, (e) => {
        if (e)
            console.log(e)
    })
})

app.get('/getFiles', async (req, res) => {
    let filepaths = Array.isArray(req.query.files) ? req.query.files : [req.query.files]
    let files = {}

    try {
        for (let i = 0; i < filepaths.length; i++) {
            let data = await fileReader.getFile(filepaths[i])
            console.log(data)
            files[filepaths[i]] = data
        }
    }
    catch (e) {
        console.log(e)
    }


    res.send(JSON.stringify(files))
})

let updateFileState = async () => {
    fileState = await fileReader.buildFileStatus(dataDirectory)
}

(async () => updateFileState())()