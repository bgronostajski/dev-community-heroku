const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use((req, res)=>{
    res.status(404).send({
        error: "Server Error",
        message: "Route Not Found"
    })
})

app.listen(port, ()=>{
    console.log(`app is listening at port ${port}`);
})

