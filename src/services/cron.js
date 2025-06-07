import express from 'express'
import { cronTest, remindTasks } from '../cron/reminder.js'
const router = express.Router()

router.get('/test', (req, res) => {
    cronTest()
    return res.status(200).json({ status: 200, message: 'Cron Test' })
})

router.get('/remind', async (req, res) => {
    try {
        await remindTasks()
        res.status(200).json({ status: 200, message: 'EMAIL TESTED' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!', error: error?.message || "SOMETHING WENT WRONG" })
    }
})

export default router