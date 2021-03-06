'use strict';

var ld     = require('lodash');
var async  = require('async');
var util   = require('util');
var events = require("events");

var Paparazzi  = require('./paparazzi');

function GatherScreenshots (settings) {
  this.settings = settings;

  ld.bindAll(this, 'run', 'paparazzi');
}
util.inherits(GatherScreenshots, events.EventEmitter);

GatherScreenshots.prototype.run = function (cb) {
  var paparazzi = this.paparazzi();

  var self = this;

  self._startCalls = 0;
  self.total = 0;
  paparazzi.forEach(function (x) {
    x.on("start", function (data) {
      self._startCalls += 1;
      if (self._startCalls === self.paparazzi().length) {
        self.emit("start", { title: "Gathering Images: ", size: self.total + data.size });
      } else {
        self.total  = data.size;
      }
    });
    x.on("tick", function (data) {
      self.emit("tick");
    });
  });
  var actions = ld.pluck(paparazzi, "run");

  async.parallel(actions, cb);
};

GatherScreenshots.prototype.paparazzi = function () {
  var paparazzi = [];
  paparazzi.push(new Paparazzi(this.settings.targets, {
                                                        dest: this.settings.samplesDir,
                                                        env: this.settings.targetEnv,
                                                        substitutions: this.settings.substitutions[this.settings.targetEnv]
                                                      }, this.settings));
  if (this.settings.isBaselineNeeded) {
    paparazzi.push(new Paparazzi(this.settings.targets, {
                                                          dest: this.settings.baselinesDir,
                                                          env: this.settings.baselineEnv,
                                                          substitutions: this.settings.substitutions[this.settings.baselineEnv]
                                                        }, this.settings));
  }
  return paparazzi;
};

module.exports = GatherScreenshots;
