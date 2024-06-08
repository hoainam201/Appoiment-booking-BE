const jwt = require("jsonwebtoken");
const FacilityStaff = require("../models/FacilityStaff");
const {staffRole} = require("../utils/constants");


module.exports = (role) =>{
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const staff = await FacilityStaff.findByPk(decoded.id);
            if (!staff || staff.token !== token || !staff.active) {
                return res.status(401).json({message: "Unauthorized"});
            }
            if(role && staff.role !== role && staff.role !== staffRole.ADMIN) {
                return res.status(403).json({message: "Forbidden"});
            }
            req.staff = staff;
            next();
        } catch (error) {
            return res.status(403).json({message: "Forbidden"});
        }
    }
}