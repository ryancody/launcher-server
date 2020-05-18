const express = require('express')
const app = express()
const port = 3000
const fileReader = require('./controller/FileReader')
const path = require('path')
const appDir = path.dirname(require.main.filename)
const dataDirectory = 'data'

let fileState = {}

app.get('/', (req, res) => res.send('Online!'))

app.listen(port, () => console.log(`listening at ${port}`))

app.get('/latest', (req, res) => res.send(fileState))

app.get('/updateLatest', async (req, res) => {

    await updateFileState();
    res.send('done')
})

let updateFileState = async () => {
    fileState = await fileReader.buildFileStatus(dataDirectory)
}

(async () => updateFileState())()