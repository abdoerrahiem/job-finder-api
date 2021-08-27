const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendGrid = ({ email, subject, text }) => {
  const msg = {
    to: email,
    from: 'Job Finder Team <no-reply@mail.com>',
    subject,
    text,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = sendGrid
