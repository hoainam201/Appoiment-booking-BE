const Doctor = require("../models/Doctor");
const DoctorReview = require("../models/DoctorReview");
const UserResponseDoctorReview = require("../models/UserResponseDoctorReview");
const sequelize = require("../configs/db.config");
const generateNewPassword = require("../utils/generateNewPassword");

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

const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      where: {
        id: req.params.id
      }
    });
    if(!doctor) {
      return res.status(404).json({message: "Doctor not found"});
    }
    const reviews = await sequelize.query(
      "SELECT dr.id, dr.rating, dr.comment, dr.created_at, u.name FROM doctor_reviews dr JOIN users u ON dr.user_id = u.id WHERE doctor_id = " + req.params.id,
      {type: sequelize.QueryTypes.SELECT});
    for (const review of reviews) {
      review.like_count = await UserResponseDoctorReview.count({
        where: {
          doctor_review_id: review.id,
          liked: true
        }
      });
      review.dislike_count = await UserResponseDoctorReview.count({
        where: {
          doctor_review_id: review.id,
          liked: false
        }
      })
    }
    res.status(200).json({doctor: doctor, reviews: reviews});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


module.exports = {
  getAllDoctor,
  getDoctor
}