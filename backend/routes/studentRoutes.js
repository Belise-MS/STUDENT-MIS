const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { checkAuth } = require('../middleware/auth');

router.use(checkAuth);

router.get('/stats/summary', studentController.getStudentStats);
router.get('/', studentController.listStudents);
router.get('/:id', studentController.getStudent);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
