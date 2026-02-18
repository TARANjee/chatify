import { createWelcomeEmailTemplate } from "./emailTemplates.js"
import { resendClient,sender } from "../lib/resend.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const {data,error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatify!",
        html: createWelcomeEmailTemplate(name, clientURL)
    })

    if (error) {
        console.error("Failed to send welcome email:", error)
    }

    console.log("Welcome email sent:", data)

}