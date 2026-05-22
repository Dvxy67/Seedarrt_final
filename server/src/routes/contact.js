const express = require('express')
const nodemailer = require('nodemailer')

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Champs manquants' })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Contact portfolio — ${name}`,
      text: message,
      html: `<p><strong>De :</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    res.status(500).json({ error: 'Erreur lors de l\'envoi' })
  }
})

module.exports = router
