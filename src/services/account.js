import express from 'express'
import { db } from '../config/db.js'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../constant/index.js"
import verification from '../middleware/verification.js'
import validateEmail from "../utils/validateEmail.js"

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ status: 400, message: 'Harap isi email dan password' })
        }
        const user = await db.user.findFirst({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({ status: 404, message: 'Akun tidak ditemukan!' })
        }

        const check = await bcrypt.compare(password, user.password)
        if (!check) {
            return res.status(400).json({ status: 400, message: 'Password salah' })
        }
        const accessToken = jwt.sign({ id: user.id }, JWT_SECRET)
        return res.status(200).json({ status: 200, message: 'Login berhasil', data: { ...user, accessToken, role: user.role } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const profile = async (req, res) => {
    const { id } = req.decoded
    try {
        const data = await db.user.findFirst({
            where: {
                id
            },
            include: {
                semesters: {
                    include: {
                        courses: {
                            include: {
                                tasks: true
                            }
                        }
                    }
                }
            }
        })
        if (!data) {
            return res.status(404).json({ status: 404, message: 'Akun tidak ditemukan' })
        }
        const accessToken = jwt.sign({ id: user.id }, JWT_SECRET)
        return res.status(200).json({ status: 200, message: 'Account detail', data: { ...data, accessToken, } })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }


    if (!validateEmail(email)) {
        return res.status(400).json({ status: 400, message: 'Email tidak valid' })
    }
    try {
        const checkEmail = await db.user.findUnique({
            where: {
                email
            }
        })
        if (checkEmail) {
            return res.status(400).json({ status: 400, message: "Email sudah terdaftar" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        })

        return res.status(200).json({ message: "Berhasil membuat akun!", data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editProfile = async (req, res) => {
    const { name, email, picture } = req.body
    const { id } = req.decoded
    if (!name || !email) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ status: 400, message: 'Email tidak valid' })
    }
    try {
        const checkEmail = await db.user.findUnique({
            where: {
                email
            }
        })
        if (checkEmail && checkEmail.id !== id) {
            return res.status(400).json({ status: 400, message: "Email sudah terdaftar" })
        }
        const user = await db.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                picture: picture || null,
            }
        })
        const accessToken = jwt.sign({ id: user.id }, JWT_SECRET)
        return res.status(200).json({ status: 200, message: 'Berhasil mengedit profil', data: { ...user, accessToken, role: user.role } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const editPassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    const { id } = req.decoded

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ status: 400, message: 'Password tidak sama' })
    }

    try {
        const user = await db.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return res.status(404).json({ status: 404, message: 'Pengguna tidak ditemukan' })
        }

        const isValid = await bcrypt.compare(oldPassword, user.password)

        if (!isValid) {
            return res.status(400).json({ status: 400, message: 'Password lama salah' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        })
        const accessToken = jwt.sign({ id: user.id }, JWT_SECRET)
        return res.status(200).json({ status: 200, message: 'Password berhasil diubah', data: { ...updatedUser, accessToken, role: user.role } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}

const updateSettingNotification = async (req, res) => {
    const { id } = req.decoded
    const { notification } = req.body
    if (typeof notification !== "boolean") {
        return res.status(400).json({ status: 400, message: 'Harap isi semua field' })
    }
    try {
        const user = await db.user.update({
            where: {
                id
            },
            data: {
                shouldRemindTasks: notification
            }
        })
        return res.status(200).json({ status: 200, message: 'Berhasil mengubah notifikasi', data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem!' })
    }
}



router.post("/login", login)
router.post("/register", verification, register)

router.get("/", verification, profile)
router.put("/", verification, editProfile)
router.patch("/edit-password", verification, editPassword)
router.patch("/notification", verification, updateSettingNotification)


export default router