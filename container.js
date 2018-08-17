const dependable = require("dependable");
const path = require("path");

const container = dependable.container();

const simpleDependencies = [["lodash", "lodash"], ["passport", "passport"]];

simpleDependencies.forEach(function(val) {
  container.register(val[0], function() {
    return require(val[1]);
  });
});

//All files in these folders would be injected into the params of the requested file.
container.load(path.join(__dirname, "/controllers"));
container.load(path.join(__dirname, "/helpers"));

container.register("container", function() {
  return container;
});

module.exports = container;
