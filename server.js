const express = require('express');
const jwt = require('jsonwebtoken');
const jsForce = require('jsforce');

const OAuth2 = new jsForce.Connection({
    oauth2: {
        clientId: process.env.client_id,
        clientSecret: process.env.client_secret,
        redirectUri: process.env.redirect_uri,
    }
});

const app = express();

app.use(express.json());


app.get('/vehicles', authenticateToken, (req, res) => {
    req.conn.query("SELECT Id, Name FROM Vehicle__c").then((vehicles)=>{
        res.json(vehicles.records);
    }).catch((err)=>{
        res.json(err)
    })
})

app.get('/vehicles-test', authenticateToken, (req, res) => {
    req.conn.query("SELECT Id, Name FROM Vehicle__c").then((vehicles)=>{
        res.json(vehicles.records);
    }).catch((err)=>{
        res.json(err)
    })
})

app.post('/logout', authenticateToken, (req, res) =>{
    req.conn.logout((err)=>{
        res.send(err)
    })
})

app.post('/login-with-sf', (req, res) =>{
    const userName = req.body.username;
    const userPassword = req.body.password;

    OAuth2.login(userName, userPassword).then((userInfo) => {
        res.json({
            organization_id: userInfo.organizationId,
            user_id: userInfo.id,
            access_token: OAuth2.accessToken
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
    if (token == null) { return res.sendStatus(401); }
    req.conn = new jsForce.Connection({
        instanceUrl: process.env.instance_url,
        accessToken: token
    })

    next();
}

app.listen(process.env.PORT);

