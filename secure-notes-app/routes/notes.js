const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(String(process.env.ENCRYPTION_KEY))
  .digest('base64')
  .substr(0, 32); // AES-256 requires 32 bytes

const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const [ivHex, encrypted] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// CREATE NOTE
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const encryptedContent = encrypt(content);

  try {
    const newNote = await pool.query(
      'INSERT INTO notes (user_id, title, content_encrypted) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, title, encryptedContent]
    );
    res.json({ message: 'Note created', note: newNote.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET ALL NOTES FOR USER
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    const decryptedNotes = notes.rows.map(n => ({
      ...n,
      content_encrypted: decrypt(n.content_encrypted)
    }));
    res.json(decryptedNotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE NOTE
router.put('/:id', authMiddleware, async (req, res) => {
  console.log('PUT /notes/:id called');
  console.log('req.params.id:', req.params.id);
  console.log('req.user:', req.user);
  console.log('req.body:', req.body);

  const { title, content } = req.body;
  const { id } = req.params;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }

  const encryptedContent = encrypt(content);

  try {
    const updated = await pool.query(
      'UPDATE notes SET title=$1, content_encrypted=$2, updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING *',
      [title, encryptedContent, id, req.user.userId]
    );

    if (updated.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note updated', note: updated.rows[0] });
  } catch (err) {
    console.error('PUT /notes error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE NOTE
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query(
      'DELETE FROM notes WHERE id=$1 AND user_id=$2 RETURNING *',
      [id, req.user.userId]
    );
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted', note: deleted.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
