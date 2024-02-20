const user = require("./user");

function route(app) {
    app.use("/users", user);
};

module.exports = route;