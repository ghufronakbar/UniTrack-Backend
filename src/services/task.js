import express from 'express'
import { db } from '../config/db.js'
const router = express.Router()
import verification from '../middleware/verification.js'


const getAllTasks = async (req, res) => {
    try {
        const userId = req.decoded.id
        const tasks = await db.task.findMany({
            where: {
                course: {
                    semester: {
                        userId
                    }
                }
            },
            include: {
                course: {
                    include: {
                        semester: true
                    }
                }
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengambil data task", data: tasks })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const getTask = async (req, res) => {
    const { id } = req.params
    try {
        const task = await db.task.findUnique({
            where: {
                id
            },
            include: {
                course: {
                    include: {
                        semester: true
                    }
                }
            }
        })
        if (!task) {
            return res.status(400).json({ status: 400, message: 'Task tidak valid' })
        }
        return res.status(200).json({ status: 200, message: "Berhasil mengambil data task", data: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const createTask = async (req, res) => {
    const { name, deadline, courseId, priority } = req.body
    if (!name || !deadline || !courseId || !priority) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    if (priority !== "LOW" && priority !== "MEDIUM" && priority !== "HIGH") {
        return res.status(400).json({ status: 400, message: 'Priority harus LOW, MEDIUM, atau HIGH' })
    }
    if (isNaN(Date.parse(deadline))) {
        return res.status(400).json({ status: 400, message: 'Tanggal tidak valid' })
    }
    try {
        const check = await db.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
            }
        })
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Course tidak valid' })
        }
        const task = await db.task.create({
            data: {
                name,
                deadline: new Date(deadline),
                courseId,
                priority,
                isDone: false,
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil membuat task", data: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editTask = async (req, res) => {
    const { id } = req.params
    const { name, deadline, priority, courseId } = req.body
    if (!name || !deadline || !priority) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    if (priority !== "LOW" && priority !== "MEDIUM" && priority !== "HIGH") {
        return res.status(400).json({ status: 400, message: 'Priority harus LOW, MEDIUM, atau HIGH' })
    }
    if (isNaN(Date.parse(deadline))) {
        return res.status(400).json({ status: 400, message: 'Tanggal tidak valid' })
    }
    try {
        const check = await db.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
            }
        })
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Course tidak valid' })
        }
        const task = await db.task.update({
            where: {
                id
            },
            data: {
                name,
                deadline: new Date(deadline),
                priority,
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengedit task", data: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        const check = await db.task.findUnique({
            where: {
                id
            },
            select: {
                id: true,
            }
        })
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Task tidak valid' })
        }
        const task = await db.task.delete({
            where: {
                id
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil menghapus task", data: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editMarkTask = async (req, res) => {
    const { id } = req.params
    try {
        const check = await db.task.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                isDone: true,
            }
        })
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Task tidak valid' })
        }
        const task = await db.task.update({
            where: {
                id
            },
            data: {
                isDone: !check.isDone
            }
        })
        return res.status(200).json({ status: 200, message: task.isDone ? "Berhasil mengubah task menjadi selesai" : "Berhasil mengubah task menjadi belum selesai", data: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })

    }
}

router.get("/", verification, getAllTasks)
router.get("/:id", verification, getTask)
router.post("/", verification, createTask)
router.put("/:id", verification, editTask)
router.delete("/:id", verification, deleteTask)
router.patch('/:id', editMarkTask)


export default router