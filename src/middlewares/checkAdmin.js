const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await Admin.findByPk(decoded.id);
        if (!admin) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}