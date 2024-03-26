// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer"
import config from "../../config";

export const sendMailer = async(
    email: string,
    html : string
)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: config.email,
          pass: config.email_password,
        },
        tls: {
            rejectUnauthorized: false
        }
      });
      
      
        const info = await transporter.sendMail({
          from: '"SK Health Care" <smdemon3@gmail.email>', // sender address
          to: email, // list of receivers
          subject: "Reset Password Link", // Subject line
        //   text: "Hello world?", // plain text body
          html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
       
}