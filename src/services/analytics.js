import { db } from '../config/db.js'
import express from 'express'
import verification from '../middleware/verification.js'
const router = express.Router()

const analytic = async (req, res) => {
    try {
        const userId = req.decoded.id
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                semesters: {
                    select: {
                        courses: {
                            select: {
                                tasks: true
                            }
                        }
                    }
                }
            }
        })
        if (!user) {
            return res.status(404).json({ status: 404, message: 'Pengguna tidak ditemukan' })
        }

        const semesters = user.semesters
        const courses = semesters.reduce((total, semester) => total + semester.courses.length, 0)
        const tasks = semesters.reduce((total, semester) => total + semester.courses.reduce((total, course) => total + course.tasks.length, 0), 0)

        const completedTask = semesters.reduce((total, semester) => total + semester.courses.reduce((total, course) => total + course.tasks.filter(task => task.isDone).length, 0), 0)
        const pendingTask = semesters.reduce((total, semester) => total + semester.courses.reduce((total, course) => total + course.tasks.filter(task => !task.isDone).length, 0), 0)
        const highPriorityTask = semesters.reduce((total, semester) => total + semester.courses.reduce((total, course) => total + course.tasks.filter(task => task.priority === 'HIGH').length, 0), 0)

        const percentage = Number(Number(Number(completedTask) / Number(tasks)) * 100).toFixed(2) || 0

        const task = {
            total: tasks,
            completed: completedTask,
            pending: pendingTask,
            highPriority: highPriorityTask,
            percentage
        }

        const data = {
            count: {
                semesters,
                courses,
                tasks
            },
            task
        }
        res.status(200).json({ status: 200, message: 'Berhasil mengambil data', data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!', error: error?.message || "SOMETHING WENT WRONG" })
    }
}


router.get('/', verification, analytic)


export default router