const News = require("../models/News");
const {newsStatus} = require("../utils/constants");
const sequelize = require("../configs/db.config");

const create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const news = await News.create({
            doc_id: req.body.doc_id,
            title: req.body.title,
            status: newsStatus.PENDING,
            content: req.body.content,
            created_at: new Date(),
            updated_at: new Date()
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
        news.status = newsStatus.PENDING;
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
    maxPage = Math.ceil((await News.count()) / 20);
    const news = await News.findAll({
        offset: (page - 1) * 20,
        limit: 20,
    });
    return res.status(200).json(news);
}

const getById = async (req, res) => {
    const id = req.params.id;
    const news = await News.findByPk(id);
    if (!news) {
        return res.status(404).json({message: "News not found"});
    }
    return res.status(200).json(news);
}

const getByDocId = async (req, res) => {
    const doc_id = req.params.doc_id;
    const news = await News.findAll({
        where: {
            doc_id
        }
    });
    if (!news) {
        return res.status(404).json({message: "News not found"});
    }
    return res.status(200).json(news);
}

module.exports = {
    create,
    update,
    hide,
    show,
    getAll,
    getById,
    getByDocId
}