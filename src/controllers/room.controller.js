  const pool = require('../config/database');
  const hmsClient = require('../config/hmssdk');
  require('dotenv').config();

  const createRoom = async (req, res) => {
    try {
      const { name } = req.body;
    
      // Create room in 100ms
      const hmsRoom = await hmsClient.rooms.create({
        name: name,
        description: `Room created for ${name}`,
        template_id: "67739e768102660b706a518d" // Replace with your template ID from 100ms dashboard
      });

      // Store room in database
      const query = 'INSERT INTO rooms (room_id, name) VALUES ($1, $2) RETURNING *';
      const values = [hmsRoom.id, name];
    
      const result = await pool.query(query, values);
    
      res.status(201).json({
        success: true,
        room: {
          ...result.rows[0],
          hmsRoom
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  const generateToken = async (req, res) => {
    try {
      const { roomId, userId, role } = req.body;
      
      // Generate 100ms token using the correct method
      const token = await hmsClient.auth.getManagementToken();
      
      // Generate auth token for the room
      const authToken = await hmsClient.auth.getAuthToken({
        roomId: roomId,
        userId: userId,
        role: role,
        type: 'app'
      });
      
      res.json({
        success: true,
        managementToken: token,
        authToken: authToken
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  

const listRooms = async (req, res) => {
    try {
      // Get rooms from database
      const query = 'SELECT * FROM rooms ORDER BY created_at DESC';
      const result = await pool.query(query);
      
      // Get active rooms from 100ms with management token
      const managementToken = await hmsClient.auth.getManagementToken();
      const activeRooms = await hmsClient.rooms.list({ auth_token: managementToken.token });
      
      // Merge database and 100ms room data
      const rooms = result.rows.map(room => {
        return {
          ...room,
          active: true,
          hmsDetails: activeRooms
        };
      });
      
      res.json({
        success: true,
        rooms,
        totalRooms: rooms.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  

  module.exports = {
    createRoom,
    generateToken,
    listRooms
  };
