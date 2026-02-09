import emailjs from '@emailjs/browser';

// These should be in your .env file
// VITE_EMAILJS_SERVICE_ID=service_...
// VITE_EMAILJS_TEMPLATE_ID=template_...
// VITE_EMAILJS_PUBLIC_KEY=...

export const initEmail = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  } else {
    console.warn('EmailJS Public Key not found in environment variables.');
  }
};

export const sendBookingEmail = async (data: {
  name: string;
  phone: string;
  email?: string;
  date: string;
  description: string;
}) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS configuration missing.');
    throw new Error('Email service not configured.');
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: 'Danielle', // The owner's name
        from_name: data.name,
        from_email: data.email || 'No email provided',
        phone_number: data.phone,
        event_date: data.date,
        message: data.description,
        type: 'Booking Request'
      },
      publicKey
    );
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; // Can use same template or different one
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS configuration missing.');
    throw new Error('Email service not configured.');
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: 'Danielle',
        from_name: data.name,
        from_email: data.email,
        phone_number: data.phone || 'No phone provided',
        message: data.message,
        type: 'Contact Inquiry'
      },
      publicKey
    );
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
