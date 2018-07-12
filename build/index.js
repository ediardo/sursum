"use strict";

var _expresS = require("expresS");

var _expresS2 = _interopRequireDefault(_expresS);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var app = (0, _expresS2.default)();
var port = 3000;

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.listen(3000, function () {
  console.log("Listening on port " + port);
});