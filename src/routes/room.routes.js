
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');

router.post('/create', roomController.createRoom);
router.post('/token', roomController.generateToken);
router.get('/list', roomController.listRooms);

module.exports = router;
