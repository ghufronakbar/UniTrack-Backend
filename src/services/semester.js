import express from 'express'
import { db } from '../config/db.js'
const router = express.Router()
import verification from '../middleware/verification.js'

const getAllSemesters = async (req, res) => {
    try {
        const userId = req.decoded.id
        const semesters = await db.semester.findMany({
            where: {
                userId
            },
            include: {
                courses: {
                    include: {
                        tasks: true
                    }
                }
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengambil data", data: semesters })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const getSemester = async (req, res) => {
    const { id } = req.params
    try {
        const semester = await db.semester.findUnique({
            where: {
                id
            },
            include: {
                courses: {
                    include: {
                        tasks: true
                    }
                }
            }
        })
        if (!semester) {
            return res.status(400).json({ status: 400, message: 'Semester tidak valid' })
        }
        return res.status(200).json({ status: 200, message: "Berhasil mengambil data", data: semester })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const createSemester = async (req, res) => {
    const { name, dateStart, dateEnd } = req.body
    if (!name || !dateStart || !dateEnd) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    if (isNaN(Date.parse(dateStart)) || isNaN(Date.parse(dateEnd))) {
        return res.status(400).json({ status: 400, message: 'Tanggal tidak valid' })
    }
    const userId = req.decoded.id
    try {
        const semester = await db.semester.create({
            data: {
                name,
                userId,
                dateStart: new Date(dateStart),
                dateEnd: new Date(dateEnd),
                markAsDone: false,
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil membuat semester", data: semester })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editSemester = async (req, res) => {
    const { id } = req.params
    const { name, dateStart, dateEnd } = req.body
    if (!name || !dateStart || !dateEnd) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    if (isNaN(Date.parse(dateStart)) || isNaN(Date.parse(dateEnd))) {
        return res.status(400).json({ status: 400, message: 'Tanggal tidak valid' })
    }
    try {
        const semester = await db.semester.update({
            where: {
                id
            },
            data: {
                name,
                dateStart: new Date(dateStart),
                dateEnd: new Date(dateEnd),
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengedit semester", data: semester })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editMarkSemester = async (req, res) => {
    const { id } = req.params
    const { markAsDone } = req.body
    try {
        const check = await db.semester.findUnique({
            where: {
                id
            },
            select: {
                markAsDone: true
            }
        })
        if (!id) {
            return res.status(400).json({ status: 400, message: 'Semester tidak valid' })
        }
        const semester = await db.semester.update({
            where: {
                id
            },
            data: {
                markAsDone: !check.markAsDone,
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil mengedit semester", data: semester })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const deleteSemester = async (req, res) => {
    const { id } = req.params
    try {
        const check = await db.semester.findUnique({
            where: {
                id
            },
            select: {
                id: true,
            }
        })
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Semester tidak valid' })
        }
        const semester = await db.semester.delete({
            where: {
                id
            }
        })
        return res.status(200).json({ status: 200, message: "Berhasil menghapus semester", data: semester })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

router.get("/", verification, getAllSemesters)
router.get("/:id", verification, getSemester)
router.post("/", verification, createSemester)
router.put("/:id", verification, editSemester)
router.patch("/:id", verification, editMarkSemester)
router.delete("/:id", verification, deleteSemester)


export default router