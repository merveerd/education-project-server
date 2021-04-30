const express = require('express');
const router = express.Router();
const courseController = require('../controllers').course;

router.route('/').post(courseController.create).get(courseController.list);
router.route('/:id').get(courseController.getOne).patch(courseController.update).delete(courseController.deleteOne);

module.exports = router;
