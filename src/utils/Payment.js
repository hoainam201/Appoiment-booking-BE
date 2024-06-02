const crypto = require('crypto');
const moment = require('moment-timezone');
const paymentModel = require('../models/PaymentModel');
require('dotenv').config();

const HMAC = (s) => {
  const hmac = crypto.createHmac('sha512', process.env.HASH_SECRET);
  hmac.update(s);
  return hmac.digest('hex');
}

