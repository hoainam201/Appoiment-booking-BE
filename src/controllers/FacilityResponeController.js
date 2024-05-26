const FacilityResponse = require("../models/FacilityResponse");


const getAll = async (req, res) => {
    const facilityResponse = await FacilityResponse.findAll();
    res.status(200).json(facilityResponse);
}

module.exports = {
    getAll
}