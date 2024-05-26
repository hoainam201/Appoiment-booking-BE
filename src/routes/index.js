const user = require("./user");
const facility = require("./facility");
const healthService = require("./healthService");
const booking = require("./booking");
const news = require("./news");
const staff = require("./staff");
const serviceReview = require("./serviceReview");
const facilityResporne = require("./facilityResponse");

function route(app) {
    app.use("/user", user);
    app.use("/health-facilities", facility);
    app.use("/health-service", healthService);
    app.use("/booking", booking);
    app.use("/news", news);
    app.use("/staff", staff);
    app.use("/service-review", serviceReview);
    app.use("/facility-resprone", facilityResporne);
};

module.exports = route;