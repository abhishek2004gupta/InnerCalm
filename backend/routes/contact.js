const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
    const { name, email, phone, subject, message, preferredContact, urgency } = req.body;
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'abhishekg272004@gmail.com',
                pass: process.env.CONTACT_EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: 'abhishekg272004@gmail.com',
            to: 'abhi123456789g@gmail.com',
            subject: `Contact Form: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPreferred Contact: ${preferredContact}\nUrgency: ${urgency}\n\nMessage:\n${message}`
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
});

module.exports = router; 