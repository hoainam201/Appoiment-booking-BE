const user = require("./user");
const facility = require("./facility");
const doctor = require("./doctor");

function route(app) {
    app.use("/user", user);
    app.use("/health-facilities", facility);
    app.use("/doctor", doctor);
};

module.exports = route;