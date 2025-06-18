const { pool } = require('../server'); 

exports.findByUsername = async (username) => {
    const [rows] = await pool.execute('SELECT id, username, password FROM users WHERE username = ?', [username]);
    return rows[0];
};

exports.create = async (username, hashedPassword) => {
    const [result] = await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
    return result.insertId;
};
