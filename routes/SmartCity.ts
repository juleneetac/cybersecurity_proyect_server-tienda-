"use strict";

import express = require("express");
let router = express.Router();
let tiendaControl = require('../controllers/tiendaControl');


///////////////////////////////Pagar/verificar/////////////////////////////
router.post('/postpayverify', tiendaControl.postpayverify);

///////////////////////////////Transmision de keys/////////////////////////////



module.exports = router;