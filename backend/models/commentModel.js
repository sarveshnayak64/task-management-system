const { pool } = require('../server'); 

exports.findByTaskId = async (taskId) => {
    const [rows] = await pool.execute(`
        SELECT c.*, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.task_id = ?
        ORDER BY c.created_at ASC
    `, [taskId]);
    return rows;
};

exports.create = async (taskId, userId, content, parentCommentId, fileAttachmentUrl) => {
    const [result] = await pool.execute(
        'INSERT INTO comments (task_id, user_id, content, parent_comment_id, file_attachment_url) VALUES (?, ?, ?, ?, ?)',
        [taskId, userId, content, parentCommentId || null, fileAttachmentUrl]
    );
    return result.insertId;
};

exports.update = async (id, userId, content, fileAttachmentUrl) => {
    const [result] = await pool.execute(
        'UPDATE comments SET content = ?, file_attachment_url = ? WHERE id = ? AND user_id = ?',
        [content, fileAttachmentUrl, id, userId]
    );
    return result.affectedRows;
};

exports.remove = async (id, userId) => {
    const [result] = await pool.execute('DELETE FROM comments WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows;
};
