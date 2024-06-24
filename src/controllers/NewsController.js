const News = require("../models/News");
const {newsStatus} = require("../utils/constants");
const sequelize = require("../configs/db.config");
const {Op} = require('sequelize');
const FacilityStaff = require("../models/FacilityStaff");

const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const news = await News.create({
      doc_id: req.staff.id,
      title: req.body.title,
      status: newsStatus.SHOW,
      banner: req.file?.path || null,
      content: req.body.content,
    }, {transaction: t});
    await t.commit();
    return res.status(200).json(news);
  } catch (e) {
    await t.rollback();
    return res.status(500).json({message: "Something went wrong"});
  }
};

const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({message: "News not found"});
    }
    news.title = req.body.title;
    news.content = req.body.content;
    news.updated_at = new Date();
    if (req.file) {
      news.banner = req.file?.filename;
    }
    await news.save();
    await t.commit();
    return res.status(200).json(news);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
};

const hide = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({message: "News not found"});
    }
    news.status = newsStatus.HIDE;
    news.updated_at = new Date();
    await news.save();
    await t.commit();
    return res.status(200).json(news);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
};

const show = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({message: "News not found"});
    }
    news.status = newsStatus.SHOW;
    news.updated_at = new Date();
    await news.save();
    await t.commit();
    return res.status(200).json(news);
  } catch (error) {
    await t.rollback();
    return res.status(500).json(error);
  }
};

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  // const maxPage = Math.ceil((await News.count()) / 21);
  const news = await News.findAndCountAll({
    offset: (page - 1) * 21,
    limit: 21,
    where: {
      status: {
        [Op.eq]: newsStatus.SHOW
      }
    }
  });
  if (!news) {
    return res.status(404).json({message: "News not found"});
  }

  return res.status(200).json({
    news: news.rows,
    maxPage: Math.ceil(news.count / 21),
  });
}

const getById = async (req, res) => {
  const id = req.params.id;
  const news = await News.findByPk(id);
  if (!news) {
    return res.status(404).json({message: "News not found"});
  }
  const ortherNews = await News.findAndCountAll({
    limit: 5,
    where: {
      id: {
        [Op.ne]: id,
      },
      status: {
        [Op.eq]: newsStatus.SHOW
      }
    }
  });
  const author = await FacilityStaff.findByPk(news.doc_id);
  news.dataValues.author = author.name;
  news.dataValues.orther = ortherNews.rows;
  return res.status(200).json(news);
}

const getByDocId = async (req, res) => {
  try {
    const id = req.staff.id;
    const news = await News.findAll({
      where: {
        doc_id: id
      }
    });
    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const getLatest = async (req, res) => {
  try {
    const news = await News.findAll({
      limit: 5,
      where: {
        status: {
          [Op.eq]: newsStatus.SHOW
        }
      },
      order: [['created_at', 'DESC']],
    });
    return res.status(200).json(news);
  }
  catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  create,
  update,
  hide,
  show,
  getAll,
  getById,
  getByDocId,
  getLatest
}