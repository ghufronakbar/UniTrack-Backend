import express from 'express';
import { db } from '../config/db.js';
const router = express.Router();
import { sendEmailTaskNotification } from '../utils/node-mailer/send-email.js'
import { remindTasks } from '../cron/reminder.js';

router.get("/db", async (req, res) => {
    try {
        const user = await db.user.findMany()
        res.status(200).json({ status: 200, message: 'DB TESTED', data: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!', error: error?.message || "SOMETHING WENT WRONG" })
    }
})

router.get('/email', async (req, res) => {
    try {
        await remindTasks()
        res.status(200).json({ status: 200, message: 'EMAIL TESTED' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!', error: error?.message || "SOMETHING WENT WRONG" })
    }
})

export default router