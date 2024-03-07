const Doctor = require("../models/Doctor");

const getAllDoctor = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const maxPage = Math.ceil((await Doctor.count()) / 20);
    if(page > maxPage) {
      return res.status(404).json({message: "Page not found"});
    }
    const doctor = await Doctor.findAll({
      offset: (page - 1) * 20,
      limit: 20
    });
    res.status(200).json({
      doctor: doctor,
      maxPage: maxPage
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = {
  getAllDoctor,
}