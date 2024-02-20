const jwt = require("jsonwebtoken");
const HealthFacility = require("../models/HealthFacility");

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const manager = await HealthFacility.findByPk(decoded.id);
        if(!manager){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.manager = manager;
        next();
    }
    catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}