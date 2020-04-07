const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.get('/shops/', (req, res) => {

    res.sendFile(path.join(__dirname, '', 'student-2.json'));
    //res.send('Hello World!')}
});

app.use(express.static('public'))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))