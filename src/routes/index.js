const user = require("./user");
const facility = require("./facility");
const healthService = require("./healthService");
const booking = require("./booking");
const admin = require("./admin");
const news = require("./news");
const staff = require("./staff");
const serviceReview = require("./serviceReview");

function route(app) {
    app.use("/user", user);
    app.use("/health-facilities", facility);
    app.use("/health-service", healthService);
    app.use("/booking", booking);
    app.use("/admin", admin);
    app.use("/news", news);
    app.use("/staff", staff);
    app.use("/service-review", serviceReview);
};

module.exports = route;