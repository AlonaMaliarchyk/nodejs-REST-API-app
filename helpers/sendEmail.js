const nodemailer = require('nodemailer');
require('dotenv').config();
const {META_PASSWORD, EMAIL_FROM} = process.env;
// const app = require('./app')

// app.post('/', (req, res, next) => {
//     const { email, name, text } = req.body
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_FROM,
        pass: META_PASSWORD,
      },
    }
  
    const transporter = nodemailer.createTransport(config);

    const sendEmail = async(data)=> {
        const email = {...data, from: EMAIL_FROM};
        await transporter.sendMail(email);
        return true;
    }
    
   

//     const emailOptions = {
//       from: EMAIL_FROM,
//       to: 'fivokig698@saeoil.com',
//       subject: 'Nodemailer test',
//       text: `${text}, Отправитель: ${Alona}`,
//     }
  
//     transporter
//       .sendMail(emailOptions)
//       .then((info) => console.log("done"))  /* res.render('done')) */
//       .catch((err) => console.log(err.message))
//   })
//  
   module.exports = sendEmail;