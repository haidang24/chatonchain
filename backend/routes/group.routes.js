const express = require('express');
const Group = require('./models/Group'); // Đường dẫn đến Group model mà bạn đã tạo
const router = express.Router();


// Route to create a new group
router.post('/create-group', async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !members) {
      return res.status(400).send({ error: 'Group name and members are required.' });
    }

    // Tạo group mới và lưu vào database
    const group = new Group({
      name,
      description,
      members, 
    });
    const createdGroup = await group.save();
    res.status(201).send(createdGroup);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;