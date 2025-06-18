const { pool } = require('../server'); 

exports.findByProjectId = async (projectId) => {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC', [projectId]);
    return rows;
};

exports.findOwnerByTaskId = async (taskId) => {
    const [rows] = await pool.execute(`
        SELECT p.user_id FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.id = ?
    `, [taskId]);
    return rows[0];
};

exports.create = async (projectId, title, description, priority, deadline, status, file_attachment_url) => {
    const [result] = await pool.execute(
        'INSERT INTO tasks (project_id, title, description, priority, deadline, status, file_attachment_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [projectId, title, description, priority || 'Medium', deadline, status || 'to-do', file_attachment_url]
    );
    return result.insertId;
};

exports.update = async (id, title, description, priority, deadline, status, file_attachment_url) => {
    const [result] = await pool.execute(
        'UPDATE tasks SET title = ?, description = ?, priority = ?, deadline = ?, status = ?, file_attachment_url = ? WHERE id = ?',
        [title, description, priority, deadline, status, file_attachment_url, id]
    );
    return result.affectedRows;
};

exports.remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows;
};
