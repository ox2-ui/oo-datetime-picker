Template.ooClock.helpers({
  coordinates: function() {
    var self = this;
    var angleDegrees = self.timeValue * self.timeFactor;
    if (isNaN(angleDegrees))
      return false
    var r = 100;
    var startFraction = 0;
    var endFraction = .9;
    var radians = (angleDegrees-90) / 180 * Math.PI;
    return {
      x1: r * startFraction * Math.cos(radians),
      y1: r * startFraction * Math.sin(radians),
      x2: r * endFraction * Math.cos(radians),
      y2: r * endFraction * Math.sin(radians)
    };
  }
});
