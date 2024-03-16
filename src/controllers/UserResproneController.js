const UserResprone = require("../models/UserResponseFacilityReview");

const findUserResprone = async (req, res) => {
    try {
        const userResprone = await UserResprone.findByPk(req.params.id);
        if (!userResprone) {
            return res.status(404).json({message: "User resprone not found"});
        }
        res.status(200).json(userResprone);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createUserResprone = async (req, res) => {
    try {
        const userResprone = await UserResprone.create(req.body);
        res.status(201).json(userResprone);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateUserResprone = async (req, res) => {
    try {
        const userResprone = await UserResprone.findByPk(req.params.id);
        if (!userResprone) {
            return res.status(404).json({message: "User resprone not found"});
        }
        await userResprone.update(req.body);
        res.status(200).json(userResprone);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteUserResprone = async (req, res) => {
    try {
        const userResprone = await UserResprone.findByPk(req.params.id);
        if (!userResprone) {
            return res.status(404).json({message: "User resprone not found"});
        }
        await userResprone.destroy();
        res.status(200).json({message: "User resprone deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    findUserResprone,
    createUserResprone,
    updateUserResprone,
    deleteUserResprone
}