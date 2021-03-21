const express = require('express');
const router = require('./controllers');

const app = express();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT, ()=> {
    console.log('Server is up!')
})
