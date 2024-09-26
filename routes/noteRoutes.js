const express = require('express');
const { createNote, getNotes, searchNotes, updateNote, deleteNote, pinNote, getSingleNote, getUser } = require('../controllers/noteController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/notes', authenticateToken, createNote);
router.get('/notes', authenticateToken, getNotes);
router.get('/notes/:id', authenticateToken, getSingleNote);
router.get('/get-user', authenticateToken, getUser);
router.get('/notes/search', authenticateToken, searchNotes);
router.put('/notes/:id', authenticateToken, updateNote);
router.delete('/notes/:id', authenticateToken, deleteNote);
router.patch('/notes/:id/pin', authenticateToken, pinNote);

module.exports = router;
