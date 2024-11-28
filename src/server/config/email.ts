import nodemailer from 'nodemailer';

export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

export const transporter = nodemailer.createTransport(emailConfig);

export const emailTemplates = {
  welcomeClient: {
    subject: 'Welcome to LegalConnect',
    text: (name: string) => `
      Dear ${name},
      
      Welcome to LegalConnect! We're excited to help you find the perfect legal professional for your needs.
      
      Best regards,
      The LegalConnect Team
    `
  },
  welcomeLawyer: {
    subject: 'Welcome to LegalConnect - Legal Professional',
    text: (name: string) => `
      Dear ${name},
      
      Welcome to LegalConnect! We're excited to have you join our network of legal professionals.
      Please complete your profile to start receiving client requests.
      
      Best regards,
      The LegalConnect Team
    `
  },
  newRequest: {
    subject: 'New Legal Service Request',
    text: (lawyerName: string, clientName: string) => `
      Dear ${lawyerName},
      
      You have received a new service request from ${clientName}.
      Please log in to your dashboard to review the details and respond.
      
      Best regards,
      The LegalConnect Team
    `
  },
  appointmentReminder: {
    subject: 'Upcoming Appointment Reminder',
    text: (name: string, date: string, lawyer: string) => `
      Dear ${name},
      
      This is a reminder of your upcoming appointment with ${lawyer} on ${date}.
      
      Best regards,
      The LegalConnect Team
    `
  }
};