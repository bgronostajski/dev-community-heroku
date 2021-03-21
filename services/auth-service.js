const jsForce = require("jsforce");

const OAuth2 = new jsForce.Connection({
    oauth2: {
        clientId: process.env.client_id,
        clientSecret: process.env.client_secret,
        redirectUri: process.env.redirect_uri,
    }
});

exports.authenticateToken = function(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) { return res.sendStatus(401); }

    req.conn = new jsForce.Connection({
        instanceUrl: process.env.instance_url,
        accessToken: token
    })

    req.conn.identity()
        .then((user) => {
            req.user = {
                userId : user.user_id,
                username : user.username,
                firstName : user.first_name,
                lastName : user.last_name,
                email: user.email
            }
            console.log(`User: ${user.display_name} authenticate successfully!`)
            next()
        })
        .catch((err)=> {
            console.log(`Authentication failed! Invalid Access Token`)
            res.json(err).status(403)
        })
}

exports.loginToSF = function(req, res, next) {
    const userName = req.body.username;
    const userPassword = req.body.password;

    OAuth2.login(userName, userPassword).then((userInfo) => {
        res.json({
            organization_id: userInfo.organizationId,
            user_id: userInfo.id,
            access_token: OAuth2.accessToken
        })
    }).catch((error)=>res.json(error).status(403))
}

exports.logoutFromSF = function (req, res, next) {
    req.conn.logout()
        .then(res.sendStatus(204))
        .catch((err) => res.json(err))
}

