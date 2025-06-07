import express from 'express'
import { db } from '../config/db.js'
const router = express.Router()
import ExcelJS from 'exceljs'
import formatDate from '../utils/format/formatDate.js'

// GENERATE LAPORAN BERDASARKAN SEMESTER
const getSemesterReports = async (req, res) => {
    try {
        const { id } = req.params
        const semester = await db.semester.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                courses: {
                    include: {
                        tasks: {
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }
            }
        })

        if (!semester) {
            return res.status(404).json({ status: 404, message: 'Data tidak ditemukan' })
        }

        // Membuat workbook Excel
        const workbook = new ExcelJS.Workbook()

        // Loop untuk setiap course
        for (const course of semester.courses) {
            // Buat worksheet baru untuk setiap mata kuliah
            const worksheet = workbook.addWorksheet(course.name)

            // Header kolom untuk sheet tugas
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Nama Tugas', key: 'name', width: 30 },
                { header: 'Deadline', key: 'deadline', width: 20 },
                { header: 'Prioritas', key: 'priority', width: 15 },
                { header: 'Status', key: 'status', width: 15 }
            ]

            // Set header menjadi bold
            worksheet.getRow(1).font = { bold: true }

            // Menambahkan data tugas ke sheet dengan nomor urut
            let rowNumber = 1
            course.tasks.forEach((task) => {
                worksheet.addRow({
                    no: rowNumber++, // Increment nomor urut
                    name: task.name,
                    deadline: formatDate(task.deadline, false, true, true),
                    priority: task.priority,
                    status: task.isDone ? 'Selesai' : 'Belum Selesai'
                })
            })
        }

        // Nama file berdasarkan semester dan nama pengguna
        const filename = `${semester.name}_${semester.user.name}_Laporan.xlsx`

        // Set header untuk response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

        // Menulis workbook ke response
        await workbook.xlsx.write(res)
        res.end()

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Terjadi Kesalahan Sistem' })
    }
}

router.get('/:id', getSemesterReports)

export default router
