const express = require('express');
const service = require('../services/vehicle-service');
const auth = require("../services/auth-service");

const router = express.Router();

router.get('/', auth.authenticateToken, service.getListUsingPG)

router.post('/', auth.authenticateToken, service.createNewVehiclePG)


module.exports = router;