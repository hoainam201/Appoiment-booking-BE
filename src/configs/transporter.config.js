const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mayurijedgement@gmail.com',
    pass: 'nbwiwwiurissaykj',
  },
});

module.exports = transporter;