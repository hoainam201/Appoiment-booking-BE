const Favourite = require("../models/Favourite");
const sequelize = require("../configs/db.config");

const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const user_id = req.user.id;
    const service_review_id = req.body.service_review_id;
    const exists = await Favourite.findOne({
      where: {
        user_id: user_id,
        service_review_id: service_review_id
      }
    });
    if (exists) {
      return res.status(400).json({message: "Favourite already exists"});
    }
    const favourite = await Favourite.create(
      {
        user_id: user_id,
        service_review_id: service_review_id,
      },
      {transaction: t}
    );
    await t.commit();
    res.status(201).json({message: "Favourite created successfully"});
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}

const destroy = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const user_id = req.user.id;
    const service_review_id = req.body.service_review_id;
    const favourite = await Favourite.destroy({
      where: {
        user_id: user_id,
        service_review_id: service_review_id
      },
      transaction: t
    });
    await t.commit();
    res.status(200).json({message: "Favourite deleted successfully"});
  } catch (error) {
    await t.rollback();
    res.status(500).json({message: error.message});
  }
}

module.exports = {
  create,
  destroy
}