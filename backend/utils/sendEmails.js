const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'techshop.asistente@gmail.com',
        to: options.email,
        subject: options.subject,
        html: options.html, // Cambiado de text a html para enviar contenido HTML en el correo
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
