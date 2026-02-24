import emailjs from '@emailjs/browser'

// Replace these with your actual EmailJS credentials
const SERVICE_ID = 'service_2er8mpu'
const TEMPLATE_ID = 'template_ygsb573'
const BOOKING_TEMPLATE_ID = 'template_g235sjf'
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

export const sendBookingEmail = async ({ user, trip }) => {
  // Strip ₹ prefix from price since the template already adds it
  const rawPrice = trip.price.replace(/^₹/, '')

  // Build numbered itinerary string
  const itineraryText = trip.itinerary
    .map((day, i) => `${i + 1}. ${day}`)
    .join('\n')

  // Common template params
  const baseParams = {
    from_name: user.name,
    from_email: user.email,
    phone: user.phone,
    emergency_contact: user.emergencyContact,
    age: user.age,
    blood_group: user.bloodGroup,
    note: user.description || '',
    trip_name: trip.name,
    trip_location: trip.location,
    trip_date: trip.date,
    trip_price: rawPrice,
    trip_difficulty: trip.difficulty,
    trip_includes: trip.includes.join(', '),
    trip_itinerary: itineraryText,
  }

  try {
    // Single send — the EmailJS template "To Email" field is already
    // configured as "sarkeet.official@gmail.com, {{from_email}}" so
    // both admin and user receive the email in one call.
    await emailjs.send(
      SERVICE_ID,
      BOOKING_TEMPLATE_ID,
      baseParams,
      PUBLIC_KEY
    )

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
