const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  password: String,
  participants: [
    {
      id: String,
      username: String,
    },
  ],
  text: String, 
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
