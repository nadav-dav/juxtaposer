'use strict';

var ld = require('lodash');

function ResultsPresenter() { }

var printGroup = function (title, items, color) {
  if (!ld.isEmpty(items))  {
    console.log("\n");
    console.log((title + "\n----------------------")[color]);
    items.forEach(function (image) {
      console.log("  " + image.imageName[color]);
    });
    console.log("----------------------"[color]);
  }
};

var isFailed = function (tr) {
  return tr.exists && !tr.matches;
};

ResultsPresenter.prototype.generate = function (results) {
  var skipped = ld.where(results.test, "isSkipped");
  var failed  = ld.where(results.test, "isFailed");
  var success = ld.where(results.test, "isSuccess");

  printGroup('Passed', success, 'green');
  printGroup('Skipped', skipped, 'yellow');
  printGroup('Failed', failed, 'red');

  console.log("");
  console.log(("Passed: " + success.length).green);
  console.log(("Skipped: " + skipped.length).yellow);
  console.log(("Failed: " + failed.length).red);
};

ResultsPresenter.getExitCode = function (results) {
  if (ld.find(results.test, { state: "failed" }))  {
    return 1;
  } else {
    return 0;
  }
};

module.exports = ResultsPresenter;
