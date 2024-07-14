const HealthFacility = require("../models/HealthFacility");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const sequelize = require("../configs/db.config");
const FacilityStaff = require("../models/FacilityStaff");
const Booking = require("../models/Booking");
const HealthService = require("../models/HealthService");
const diacritics = require('diacritics');
const {QueryTypes, Sequelize} = require("sequelize");

function abbreviateName(fullName) {
  // Chia tách tên đầy đủ thành mảng các từ
  const words = fullName.trim().split(/\s+/);

  // Lấy chữ cái đầu của từng từ và chuyển thành viết hoa
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');

  return initials;
}

const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const name = req.body.name ? req.body.name : null;
    const address = req.body.address ? req.body.address : null;
    const specialities = req.body.specialities ? req.body.specialities : null;
    const type = req.body.type ? req.body.type : null;
    const phone = req.body.phone ? req.body.phone : null;
    const email = req.body.email ? req.body.email : null;
    const latitude = req.body.latitude ? req.body.latitude : null;
    const longitude = req.body.longitude ? req.body.longitude : null;
    const description = req.body.description ? req.body.description : null;
    const avatar = req.file ? req.file.path : null;
    if (!name || !address || !specialities || !type || !phone || !email || !latitude || !longitude) {
      return res.status(400).json({message: "All fields are required"});
    }
    const healthFacility = await HealthFacility.create({
      name: name,
      address: address,
      specialities: specialities,
      type: type,
      phone: phone,
      email: email.toLowerCase(),
      avatar: avatar,
      description: description,
      active: true,
      avg_rating: 0.0,
      latitude: latitude,
      longitude: longitude,
      created_at: new Date(),
      updated_at: new Date()
    });
    await t.commit();
    res.status(201).json(healthFacility);
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
};

const getAll = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const maxPage = Math.ceil((await HealthFacility.count()) / 20);
    if (page > maxPage) {
      return res.status(404).json({message: "Page not found"});
    }
    const healthFacility = await HealthFacility.findAll({
      offset: (page - 1) * 20,
      limit: 20
    });
    res.status(200).json({
      healthFacility: healthFacility,
      maxPage: maxPage
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const search = async (req, res) => {
  try {
    const name = req.body.name ? req.body.name : null;
    const specialities = req.body.speciality ? req.body.speciality : null;
    const page = req.body.page ? parseInt(req.body.page) : 1;
    const maxPage = Math.ceil((await HealthFacility.count()) / 20);
    const address = req.body.address ? req.body.address : null;
    const query = {};
    if (name) {
      query.name = {
        [Op.or]:[
          {[Op.iLike]: `%${name}%`},
          {[Op.iLike]: `%${diacritics.remove(name)}%`},
          {[Op.iLike]: `%${diacritics.remove(name.replace(/\s+/g, ""))}%`},
          {[Op.iLike]: `%${abbreviateName(name)}%`},
        ]
      }
    }
    if (specialities) {
      query.specialities = {
        [Op.or]: [
          {[Op.eq]: specialities},
          {[Op.eq]: '0'}
        ]
      }
    }
    if (address) {
      query.address = {
        [Op.or]: [
          {[Op.iLike]: `%${address}%`},
          {[Op.iLike]: `%${diacritics.remove(address)}%`},
          {[Op.iLike]: `%${diacritics.remove(address.replace(/\s+/g, ""))}%`},
          {[Op.iLike]: `%${abbreviateName(address)}%`},
        ]
      }
    }
    query.active = {
      [Op.eq]: true
    }
    const healthFacility = await HealthFacility.findAndCountAll({
      where: query,
      offset: (page - 1) * 20,
      limit: 20
    });
    if (!healthFacility) {
      return res.status(404).json({message: "Not found"});
    }
    res.  status(200).json({
      healthFacility: healthFacility.rows,
      maxPage: parseInt((healthFacility.count / 20) + 1)
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getHealthFacility = async (req, res) => {
  try {
    const name = req.body.name ? req.body.name : null;
    const address = req.body.address ? req.body.address : null;
    const specialities = req.body.specialities ? req.body.specialities : null;
    const latitude = req.body.latitude ? req.body.latitude : null;
    const longitude = req.body.longitude ? req.body.longitude : null;

    const query = {};


    if (latitude && longitude) {
      query.latitude = {
        [Op.between]: [latitude - 0.27, latitude + 0.27]
      };
      query.longitude = {
        [Op.between]: [longitude - 0.27, longitude + 0.27]
      };
    }
    ;

    if (name) {
      query.name = {
        [Op.iLike]: `%${name.toLowerCase()}%`
      }
    }
    if (address) {
      query.address = {
        [Op.iLike]: `%${address}%`
      }
    }
    if (specialities) {
      query.specialities = {
        [Op.iLike]: `%${specialities}%`
      }
    }
    const healthFacility = await HealthFacility.findAll({
      where: query
    });
    if (!healthFacility) {
      return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
    }
    res.status(200).json(healthFacility);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const name = req.body.name ? req.body.name : null;
    const address = req.body.address ? req.body.address : null;
    const specialities = req.body.specialities ? req.body.specialities : null;
    const type = req.body.type ? req.body.type : null;
    const avatar = req.file ? req.file.path : null;
    const phone = req.body.phone ? req.body.phone : null;
    const email = req.body.email ? req.body.email : null;
    const description = req.body.description ? req.body.description : null;
    const latitude = req.body.latitude ? req.body.latitude : null;
    const longitude = req.body.longitude ? req.body.longitude : null;
    const healthFacility = await HealthFacility.findOne({
      where: {
        id: req.staff.facility_id
      }
    });
    if (!healthFacility) {
      await t.rollback();
      return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
    }
    if (!name || !address || !specialities || type === null || !description || !phone || !email || !latitude || !longitude) {
      await t.rollback();
      return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin"});
    }
    if (latitude > 90 || latitude < -90 || longitude > 180 || longitude < -180) {
      await t.rollback();
      return res.status(400).json({message: "thông tin địa điểm không hợp lệ"});
    }
    healthFacility.name = name;
    healthFacility.address = address;
    healthFacility.specialities = specialities;
    healthFacility.type = type;
    healthFacility.phone = phone;
    healthFacility.description = description;
    healthFacility.avatar = avatar ? avatar : healthFacility.avatar;
    healthFacility.email = email;
    healthFacility.latitude = latitude;
    healthFacility.longitude = longitude;
    healthFacility.updated_at = new Date();
    await healthFacility.save();
    await t.commit();
    res.status(200).json("Cập nhật thành công");
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
};


const getById = async (req, res) => {
  try {
    const healthFacility = await HealthFacility.findOne({
      where: {
        id: req.params.id,
        active: true
      }
    });
    if (!healthFacility) {
      return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
    }
    const healthService = await HealthService.findAll({
      where: {
        facility_id: healthFacility.id
      }
    });
    healthFacility.dataValues.services = healthService;
    res.status(200).json(healthFacility);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getByToken = async (req, res) => {
  try {
    const healthFacility = await HealthFacility.findOne({
      where: {
        id: req.staff.facility_id,
        active: true
      }
    });
    if (!healthFacility) {
      return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
    }
    res.status(200).json(healthFacility);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getAllNotPaged = async (req, res) => {
  try {
    const healthFacilities = await HealthFacility.findAll();
    res.status(200).json(healthFacilities);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getByAdmin = async (req, res) => {
  try {
    const healthFacility = await HealthFacility.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!healthFacility) {
      return res.status(404).json({message: "Không tìm thấy cơ sở y tế phù hợp"});
    }
    const staffs = await FacilityStaff.count({
      where: {
        facility_id: req.params.id
      }
    });
    healthFacility.dataValues.staffs = staffs;
    const services = await HealthService.count({
      where: {
        facility_id: req.params.id
      }
    });
    healthFacility.dataValues.services = services;
    const query = `select count(bookings.id)
                   from bookings
                            join health_services on bookings.service_id = health_services.id
                            join health_facilities on health_services.facility_id = health_facilities.id
                   where facility_id = ${req.params.id}`;
    const books = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    healthFacility.dataValues.books = books[0].count;
    healthFacility.dataValues.services = services;
    res.status(200).json(healthFacility);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const getTopHealthFacilities = async (req, res) => {
  try {
    const healthFacilities = await HealthFacility.findAll({
      where: {
        active: true
      },
      order: [['avg_rating', 'DESC']],
      limit: 10
    });
    res.status(200).json(healthFacilities);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const active = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const healthFacility = await HealthFacility.findByPk(id);
    if (!healthFacility) {
      return res.status(404).json({message: "Health facility not found"});
    }
    healthFacility.active = !healthFacility.active;
    healthFacility.updated_by = req.staff.email;
    healthFacility.updated_at = new Date();
    await healthFacility.save({transaction: t});
    await t.commit();
    res.status(200).json({message: "Health facility updated"});
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}

module.exports = {
  create,
  getAll,
  getHealthFacility,
  update,
  getById,
  getByToken,
  getAllNotPaged,
  getByAdmin,
  search,
  getTopHealthFacilities,
  active,
}