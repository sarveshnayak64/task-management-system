const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

let pool;

// Function to connect to the database
async function connectDb() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Successfully connected to MySQL database.');
    } catch (error) {
        console.error('Failed to connect to MySQL database:', error.message);
        process.exit(1); 
    }
}

connectDb();

const JWT_SECRET = '1234567890'; 

module.exports.pool = pool;
module.exports.JWT_SECRET = JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user; 
        next(); 
    });
};
module.exports.authenticateToken = authenticateToken; 

app.get('/', (req, res) => {
    res.send('Task Management API is running!');
});

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use('/api', authRoutes); 
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', commentRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
