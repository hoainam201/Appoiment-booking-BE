const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const doctor = await Doctor.findByPk(decoded.id);
        if (!doctor) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.doctor = doctor;
        next();
    }
    catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}