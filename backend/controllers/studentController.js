const pool = require('../config/database');

const STUDENT_FIELDS = [
  'roll_number',
  'first_name',
  'last_name',
  'email',
  'phone',
  'date_of_birth',
  'gender',
  'address',
  'city',
  'state',
  'postal_code',
  'enrollment_date',
  'status'
];

function normalizeStudent(body) {
  return {
    roll_number: body.roll_number?.trim(),
    first_name: body.first_name?.trim(),
    last_name: body.last_name?.trim(),
    email: body.email?.trim().toLowerCase(),
    phone: body.phone?.trim() || null,
    date_of_birth: body.date_of_birth || null,
    gender: body.gender || null,
    address: body.address?.trim() || null,
    city: body.city?.trim() || null,
    state: body.state?.trim() || null,
    postal_code: body.postal_code?.trim() || null,
    enrollment_date: body.enrollment_date,
    status: body.status || 'active'
  };
}

function validateStudent(student) {
  const missing = [];

  ['roll_number', 'first_name', 'last_name', 'email', 'enrollment_date'].forEach((field) => {
    if (!student[field]) {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    return 'Email address is invalid';
  }

  if (!['active', 'inactive', 'graduated'].includes(student.status)) {
    return 'Student status is invalid';
  }

  return null;
}

exports.listStudents = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const status = req.query.status?.trim();
    const params = [];
    const filters = [];

    if (search) {
      filters.push('(roll_number LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (status && status !== 'all') {
      filters.push('status = ?');
      params.push(status);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `SELECT * FROM students ${where} ORDER BY created_at DESC`,
      params
    );

    res.json({ success: true, students: rows });
  } catch (error) {
    console.error('List students error:', error);
    res.status(500).json({ success: false, message: 'Unable to load students' });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const [[totals]] = await pool.query(`
      SELECT
        COUNT(*) AS totalStudents,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeStudents,
        SUM(CASE WHEN enrollment_date >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01') THEN 1 ELSE 0 END) AS newStudents
      FROM students
    `);

    const totalStudents = Number(totals.totalStudents || 0);
    const activeStudents = Number(totals.activeStudents || 0);
    const activeStatus = totalStudents === 0
      ? 100
      : Math.round((activeStudents / totalStudents) * 100);

    res.json({
      success: true,
      stats: {
        totalStudents,
        newStudents: Number(totals.newStudents || 0),
        activeStatus,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Student stats error:', error);
    res.status(500).json({ success: false, message: 'Unable to load student statistics' });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, student: rows[0] });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: 'Unable to load student' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = normalizeStudent(req.body);
    const validationError = validateStudent(student);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const values = STUDENT_FIELDS.map((field) => student[field]);
    const placeholders = STUDENT_FIELDS.map(() => '?').join(', ');

    const [result] = await pool.query(
      `INSERT INTO students (${STUDENT_FIELDS.join(', ')}) VALUES (${placeholders})`,
      values
    );

    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Student created', student: rows[0] });
  } catch (error) {
    console.error('Create student error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A student with that roll number or email already exists'
      });
    }

    res.status(500).json({ success: false, message: 'Unable to create student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = normalizeStudent(req.body);
    const validationError = validateStudent(student);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const assignments = STUDENT_FIELDS.map((field) => `${field} = ?`).join(', ');
    const values = STUDENT_FIELDS.map((field) => student[field]);
    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE students SET ${assignments} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Student updated', student: rows[0] });
  } catch (error) {
    console.error('Update student error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A student with that roll number or email already exists'
      });
    }

    res.status(500).json({ success: false, message: 'Unable to update student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Unable to delete student' });
  }
};
