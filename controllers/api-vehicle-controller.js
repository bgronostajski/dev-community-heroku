const express = require('express');
const service = require('../services/vehicle-service');
const auth = require("../services/auth-service");

const router = express.Router();

router.get('/', auth.authenticateToken, service.getListUsingAPI)

router.post('/', auth.authenticateToken, service.createNewVehicleAPI)

module.exports = router;