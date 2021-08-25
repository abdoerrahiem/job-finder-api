const nodemailer = require('nodemailer')

const sendEmail = async ({ email, subject, text }) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const message = {
    from: `${process.env.NAME} <${process.env.EMAIL}>`,
    to: email,
    subject,
    text,
  }

  await transport.sendMail(message)
}

module.exports = sendEmail
