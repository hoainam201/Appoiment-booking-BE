const user = require("./user");
const facility = require("./facility");

function route(app) {
    app.use("/user", user);
    app.use("/health-facilities", facility);
};

module.exports = route;