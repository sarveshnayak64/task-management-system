const { pool } = require('../server'); 

exports.findByUserId = async (userId) => {
    const [rows] = await pool.execute('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
};

exports.findByIdAndUserId = async (projectId, userId) => {
    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
    return rows[0];
};

exports.create = async (userId, name, description) => {
    const [result] = await pool.execute(
        'INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?)',
        [userId, name, description]
    );
    return result.insertId;
};

exports.update = async (id, name, description) => {
    const [result] = await pool.execute(
        'UPDATE projects SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
    );
    return result.affectedRows;
};

exports.remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows;
};
