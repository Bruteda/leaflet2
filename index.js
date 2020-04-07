const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();

});


app.get('/shops/', (req, res) => {

    res.sendFile(path.join(__dirname, '', 'shops.json'));
    //res.send('Hello World!')}
});

app.use(express.static('public'))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))