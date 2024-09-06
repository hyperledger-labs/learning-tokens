import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()
// THE GLOBAL RETURNER
export const response = (statusCode: number, message: string, result?: any) => {
    return {
        statusCode: statusCode,
        message: message,
        result: result ?? null
    }
}

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465, // Zoho's SSL port
    secure: true, // Use SSL
    auth: {
        user: process.env.USEREMAIL, // Your Zoho email address
        pass: process.env.USERPASS // Your Zoho email password
    }
})

/**
 * Sends an email with login credentials.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} username - The username to send.
 * @param {string} password - The password to send.
 * @param {string} customMessage - A custom message to include in the email.
 * @returns {Promise<void>}
 */
export async function sendLoginCredentials(
    toEmail: string,
    username: string,
    password: string,
    customMessage: string
): Promise<void> {
    const mailOptions = {
        from: process.env.FROMEMAIL, // The email address you're sending from
        to: toEmail,
        subject: 'Your Login Credentials',
        text: `Hello,

Here are your login credentials:

Username: ${username}
Password: ${password}

${customMessage}

Best regards,
Learning Token
`
    }

    try {
        const info = await smtpTransport.sendMail(mailOptions)
        console.log('Email sent successfully:', info.response)
    } catch (error) {
        console.log('Error sending email:', error)
        throw new Error('Failed to send email')
    }
}

export const getIPFSFULLURL = (IPFSHASH: string) => {
    return process.env.IPFS_BASE_URL + '/' + IPFSHASH
}
