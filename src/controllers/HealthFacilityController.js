const HealthFacilityController = require("../controllers/HealthFacilityController");

const createHealthFacility = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name ? req.body.name : null;
        const password = req.body.password ? req.body.password : null;
        const address = req.body.address ? req.body.address : null;
        const specialities = req.body.specialities ? req.body.specialities : null;
        const phone = req.body.phone ? req.body.phone : null;
        const email = req.body.email ? req.body.email : null;
        const latitude = req.body.latitude ? req.body.latitude : null;
        const longitude = req.body.longitude ? req.body.longitude : null;

        if (!name || !password || !address || !specialities || !phone || !email || !latitude || !longitude) {
            return res.status(400).json({message: "All fields are required"});
        }

        const healthFacility = await HealthFacility.create({
            name,
            password,
            address,
            specialities,
            phone,
            email,
            latitude,
            longitude
        });
        await t.commit();
        res.status(201).json(healthFacility);
    } catch (error) {
        await t.rollback();
        res.status(500).json({message: error.message});
    }
};

const getHealthFacility = async (req, res) => {
    try {
        const healthFacility = await HealthFacility.findAll(
            {
                order: [
                    ["createdAt", "DESC"]
                ]
            },
            {
                attributes: ["id", "name", "address", "specialities", "phone", "email", "latitude", "longitude"],
            }
        );
        res.status(200).json(healthFacility);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateHealthFacility = async (req, res) => {

}