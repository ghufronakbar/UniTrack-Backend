import { APP_NAME, EMAIL, LOGO } from "../../constant/index.js";
import formatDate from "../../utils/format/formatDate.js";

export const emailTemplate = (name, subject, tasks) =>
    `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="./icon.png">
    <title>${APP_NAME + " - " + subject}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }

        .container {
            width: 100%;
            background-color: #f4f4f7;
            padding: 40px 0;
            text-align: center;
        }

        .email-content {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 30px;
            max-width: 700px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        .email-header img {
            margin-top: 10px;
            width: 200px;
            vertical-align: middle;
        }

        .email-body h1 {
            font-size: 26px;
            color: #000000;
            font-weight: bold;
        }

        .email-body p {
            font-size: 16px;
            color: #000000;
            line-height: 1.6;
            margin: 10px 0;
        }

        .task-list {
            margin-top: 20px;
            text-align: left;
        }

        .task-card {
            background-color: #ffffff;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #23ACE3;
            color: #333;
        }

        .task-card h4 {
            margin-top: 0;
            color: #23ACE3;
            font-size: 20px;
            font-weight: bold;
        }

        .task-card p {
            margin: 8px 0;
            font-size: 16px;
            color: #555;
        }

        .task-card .priority-badge {
            display: inline-block;
            padding: 6px 12px;
            font-size: 14px;
            color: white;
            border-radius: 50px;
            font-weight: bold;
            margin-top: 10px;
        }

        .priority-low {
            background-color: #28a745;
        }

        .priority-medium {
            background-color: #f39c12;
        }

        .priority-high {
            background-color: #e74c3c;
        }

        .task-card .deadline {
            font-size: 18px;
            font-weight: bold;
            color: #2ecc71;
        }

        .separator {
            border-top: 1px solid #ddd;
            margin: 15px 0;
        }

        .confirm-btn {
            display: inline-block;
            background-color: #23ACE3;
            color: #ffffff;
            margin-top: 20px;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 5px;
            text-decoration: none;
        }

        .email-footer {
            margin-top: 30px;
            text-align: center;
            color: #888888;
            font-size: 12px;
        }

        .email-footer a {
            color: #23ACE3;
            text-decoration: underline;
        }

        @media only screen and (max-width: 800px) {
            .email-content {
                width: 85%;
                padding: 15px;
                box-shadow: none;
                border-radius: 5px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="email-content">
            <div class="email-header">
                <img src="${LOGO}" alt="${APP_NAME}">
            </div>
            <div class="email-body">
                <h1>Halo ${name}!</h1>
                <div class="email-text">
                    <p>Terima kasih telah menggunakan layanan <strong>${APP_NAME}</strong>.</p>
                    <p>${subject}</p>
                </div>

                <div class="task-list">
                    <h3>Berikut adalah tugas-tugas yang perlu kamu perhatikan:</h3>
                    ${tasks.map((task) => `
                        <div class="task-card">
                            <h4>${task?.name}</h4>
                            <p class="deadline">Tugas ini harus diselesaikan paling lambat pada <strong>${formatDate(task?.deadline, false, true, true)}</strong>.</p>
                            <p>Prioritas: <span class="priority-badge ${task?.priority === 'LOW' ? 'priority-low' : task?.priority === 'MEDIUM' ? 'priority-medium' : 'priority-high'}">${task?.priority}</span></p>
                            <div class="separator"></div>
                            <p>Mata kuliah: <strong>${task?.course?.name}</strong> (<strong>${task?.course?.code}</strong>)</p>
                            <p>Dosen pengampu: <strong>${task?.course?.instructor}</strong></p>
                        </div>
                    `).join('')}
                </div>                
            </div>

            <div class="email-footer">
                <p>Jika Anda memiliki pertanyaan, silakan email ke <a href="mailto:${EMAIL}">${EMAIL}</a></p>
                <p>Sleman, Yogyakarta, Indonesia</p>
            </div>
        </div>
    </div>
</body>

</html>
`;
