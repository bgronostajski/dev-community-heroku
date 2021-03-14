const express = require('express');
const jwt = require('jsonwebtoken');
const jsForce = require('jsforce');

const sfConnection = new jsForce.Connection({ loginUrl : process.env.SF_ORG_URL });

const app = express();

app.use(express.json());


app.get('/vehicles-event', (req, res) => {

})

app.get('/vehicles-connect', (req, res) => {

})

app.get('/vehicles-rest', (req, res) => {
    console.log(sfConnection.accessToken)
})

app.post('/login', (req, res) =>{
    console.log(sfConnection.accessToken)
    const userName = req.body.username;
    const user = { name : userName};
})

app.post('/login-with-sf', (req, res) =>{
    const userName = req.body.username;
    const userPassword = req.body.password;

    sfConnection.login(userName, userPassword).then((userInfo) => {
        res.json({
            organizationId: userInfo.organizationId,
            userId: userInfo.id,
            accessToken: sfConnection.accessToken,
            refreshToken: sfConnection.refreshToken
        })
    }).catch((error)=>{
        console.log(error)
        res.sendStatus(403)
    })

})

app.use((req, res)=>{
    res.status(404).send({
        error: "Server Error",
        message: "Route Not Found"
    })
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(process.env.PORT);

