import nodemailer from "nodemailer";

let transporter; // not created at import time

const getTransporter = () => {
    if (!transporter) {
        // env is read only when first used
        console.log("MAIL CONFIG:", process.env.MAIL_HOST, process.env.MAIL_PORT, process.env.MAIL_USER);

        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
    const t = getTransporter();

    return await t.sendMail({
        from: `"Fintola" <${process.env.MAIL_USER}>`, // fixed spacing
        to,
        subject,
        html,
    });
};

export { sendEmail };