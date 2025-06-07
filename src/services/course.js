import express from 'express'
import { db } from '../config/db.js'
const router = express.Router()
import verification from '../middleware/verification.js'

const getAllCourses = async (req, res) => {
    try {
        const userId = req.decoded.id
        const courses = await db.course.findMany({
            where: {
                semester: {
                    userId,
                }
            },
            include: {
                semester: true,
                tasks: {
                    orderBy: {
                        deadline: "asc",
                    }
                }
            },
            orderBy: {
                semester: {
                    dateStart: "asc"
                }
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengambil data", data: courses })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const getCourse = async (req, res) => {
    const { id } = req.params
    try {
        const course = await db.course.findUnique({
            where: {
                id
            },
            include: {
                tasks: {
                    orderBy: {
                        deadline: "asc",
                    }
                }
            },
        })
        if (!course) {
            return res.status(400).json({ status: 400, message: 'Course tidak valid' })
        }
        return res.status(200).json({ status: 200, message: "Berhasil mengambil data", data: course })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const createCourse = async (req, res) => {
    const { name, semesterId, code, instructor } = req.body
    if (!name || !semesterId || !code || !instructor) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    try {
        const checkSemester = await db.semester.findUnique({
            where: {
                id: semesterId
            }
        })
        if (!checkSemester) {
            return res.status(400).json({ status: 400, message: 'Semester tidak valid' })
        }
        const course = await db.course.create({
            data: {
                name,
                semesterId,
                code,
                instructor,
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil membuat course", data: course })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editCourse = async (req, res) => {
    const { id } = req.params
    const { name, code, instructor, semesterId } = req.body
    if (!name || !code || !instructor || !semesterId) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    try {
        const checkSemester = await db.semester.findUnique({
            where: {
                id: semesterId
            }
        })
        if (!checkSemester) {
            return res.status(400).json({ status: 400, message: 'Semester tidak valid' })
        }
        const course = await db.course.update({
            where: {
                id
            },
            data: {
                name,
                code,
                instructor,
                semesterId
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengedit course", data: course })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params
        const check = await db.course.findUnique({
            where: {
                id
            },
            select: {
                id: true,
            }
        })
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Course tidak valid' })
        }
        const course = await db.course.delete({
            where: {
                id
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil menghapus course", data: course })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

router.get("/", verification, getAllCourses)
router.get("/:id", verification, getCourse)
router.post("/", verification, createCourse)
router.put("/:id", verification, editCourse)
router.delete("/:id", verification, deleteCourse)


export default router