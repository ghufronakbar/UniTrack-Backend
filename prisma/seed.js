import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();



const main = async () => {
    try {
        await db.$connect()
        console.log('Seeding data...')
        const user = await db.user.findMany()
        if (user.length > 0) {
            console.log('Data sudah ada')
            return
        }
        const hashedPassword = await bcrypt.hash('12345678', 10)
        const seedUser = await db.user.create({
            data: {
                name: "Lans The Prodigy",
                email: "lanstheprodigy@gmail.com",
                password: hashedPassword,
                shouldRemindTasks: true,
                semesters: {
                    create: {
                        name: "Semester 1",
                        dateStart: new Date(2025, 2, 1),
                        dateEnd: new Date(2025, 6, 30),
                        courses: {
                            create: {
                                name: "Aljabar Linear",
                                code: "PROG-101",
                                instructor: "Albert Einstein",
                                tasks: {
                                    createMany: {
                                        data: [
                                            {
                                                name: "Variables and Constantas",
                                                deadline: new Date(2025, 2, 10),
                                                isDone: true,
                                                priority: "LOW"
                                            },
                                            {
                                                name: "Linear Equations",
                                                deadline: new Date(2025, 5, 20),
                                                isDone: false,
                                                priority: "HIGH"
                                            },
                                            {
                                                name: "Matrix",
                                                deadline: new Date(2025, 6, 1),
                                                isDone: false,
                                                priority: "MEDIUM"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        console.log("SEED USER", seedUser.name)

    } catch (error) {
        console.log(error)
        process.exit(1)
    } finally {
        await db.$disconnect()
        console.log('Seeding data selesai')
    }
}

main()