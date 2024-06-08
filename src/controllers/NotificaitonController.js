const Notificaiton = require("../models/Notification");

const getAll = async (req, res) => {
  const notifications = await Notificaiton.findAll(
    {
      where: {
        facility_id: req.staff.facility_id,
        status: 0,
      },
      order: [
        ['created_at', 'DESC']
      ]
    }
  );
  return res.status(200).json(notifications);
};

const seeAll = async (req, res) => {
  const notifications = await Notificaiton.update(
    {
      status: 1
    },
    {
      where: {
        facility_id: req.staff.facility_id
      }
    }
  );
  return res.status(200).json(notifications);
};

module.exports = {
  getAll,
  seeAll
}
