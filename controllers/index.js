const express = require('express');
const vehiclePgRoutes = require('./pg-vehicle-controller');
const vehicleApiRoutes = require('./api-vehicle-controller');
const auth = require("../services/auth-service");

const router = express.Router();

router.use('/vehicles-pg', vehiclePgRoutes)
router.use('/vehicles-api', vehicleApiRoutes)

router.post('/login', auth.loginToSF)
router.post('/logout', auth.authenticateToken, auth.logoutFromSF)

router.use((req,res)=>{
    res.status(404).send({
        error: "Server Error",
        message: "Route Not Found"
    })
})

module.exports = router;