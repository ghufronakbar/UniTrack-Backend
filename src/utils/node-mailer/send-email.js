import { mailer } from "../../config/mailer.js";
import { APP_NAME, EMAIL } from "../../constant/index.js";
import { emailTemplate } from "./email-template.js";

/**
 * 
 * @param {*} target 
 * @param {*} name 
 * @param {*} tasks {}[]
 * @returns 
 */

export const sendEmailTaskNotification = async (
    target,
    name,
    tasks,
) => {

    const subject = `${APP_NAME} - Notifikasi Tugas`;

    const html = emailTemplate(name, subject, tasks);

    const msg = {
        from: `"${APP_NAME}" <${EMAIL}>`,
        to: target,
        subject,
        html,
    };

    try {
        await mailer.sendMail(msg);
    } catch (error) {
        console.error(error);
        return new Error("Gagal mengirim email ");
    }
};
