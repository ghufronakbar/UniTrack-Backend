import cron from 'node-cron';
import { db } from '../config/db.js';
import { sendEmailTaskNotification } from '../utils/node-mailer/send-email.js';

export const remindTasks = async () => {
    const users = await db.user.findMany({
        where: {
            shouldRemindTasks: true
        },
        select: {
            name: true,
            email: true,
            semesters: {
                select: {
                    courses: {
                        select: {
                            tasks: {
                                where: {
                                    isDone: false
                                },
                                select: {
                                    name: true,
                                    priority: true,
                                    deadline: true,
                                    course: {
                                        select: {
                                            name: true,
                                            code: true,
                                            instructor: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    })
    const filteredUser = users.filter((user) => {
        const tasks = user.semesters.flatMap((semester) => semester.courses.flatMap((course) => course.tasks));
        return tasks.length > 0;
    })

    filteredUser.forEach(async (user) => {
        const tasks = user.semesters.flatMap((semester) => semester.courses.flatMap((course) => course.tasks));
        await sendEmailTaskNotification(user.email, user.name, tasks);
    })
};

cron.schedule('0 * * * *', () => {
    try {
        console.log('Mengirim notifikasi pengingat tasks');
        remindTasks();
    } catch (error) {
        console.log('Error pada cron job pengingat tasks:', error);
    }
});
