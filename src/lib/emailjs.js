import emailjs from '@emailjs/browser'

// Replace these with your actual EmailJS credentials
const SERVICE_ID = 'service_2er8mpu'
const TEMPLATE_ID = 'template_ygsb573'
const PUBLIC_KEY = '3tJGSr5DMn1cctMGP'

export const sendContactEmail = async (formData) => {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: 'sarkeet.official@gmail.com',
      },
      PUBLIC_KEY
    )
    return { success: true, result }
  } catch (error) {
    return { success: false, error }
  }
}
