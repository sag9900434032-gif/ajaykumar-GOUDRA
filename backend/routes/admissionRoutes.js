const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

router.post('/', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.status(201).json({ success: true, message: 'Admission request submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
