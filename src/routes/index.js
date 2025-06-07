import express from 'express';
const router = express.Router();
import account from '../services/account.js';
import image from '../services/image.js'
import report from '../services/report.js'
import semester from '../services/semester.js'
import course from '../services/course.js'
import task from '../services/task.js'
import anaylitic from '../services/analytics.js'

router.use('/account', account);
router.use("/image", image)
router.use("/report", report)

router.use("/semester", semester)
router.use("/course", course)
router.use("/task", task)

router.use('/analytics', anaylitic)


export default router