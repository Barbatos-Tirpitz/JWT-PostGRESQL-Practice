const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
console.log('authRoutes:', authRoutes);
const notesRoutes = require('./routes/notes');
console.log('notesRoutes:', notesRoutes);


const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// THIS LINE IS REQUIRED
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
    res.send('Secure Notes API running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
