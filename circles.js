(function() {
  var Circle, CircleVis;
  Circle = (function() {
    function Circle(radius, high) {
      this.radius = radius;
      this.high = high;
    }
    Circle.prototype.intersection = function(distance, other) {
      var d, k, m, p, ra, rb, xa, xb, ya, yb;
      ra = this.radius;
      rb = other.radius;
      if (distance > ra + rb) {
        return;
      }
      xa = ya = xb = 0;
      yb = d = distance;
      k = (1 / 4) * Math.sqrt((Math.pow(ra + rb, 2) - d * d) * (d * d - Math.pow(ra - rb, 2)));
      p = (1 / 2) * (xb + xa) + (1 / 2) * (yb - ya) * (ra * ra - rb * rb) / (d * d) + 2 * (yb - ya) * k / (d * d);
      m = (1 / 2) * (xb + xa) + (1 / 2) * (yb - ya) * (ra * ra - rb * rb) / (d * d) - 2 * (yb - ya) * k / (d * d);
      return [p, m, m, p];
    };
    return Circle;
  })();
  CircleVis = (function() {
    var SVG_HEIGHT, SVG_WIDTH;
    SVG_WIDTH = 800;
    SVG_HEIGHT = 800;
    function CircleVis(sel) {
      var name;
      this.svg = d3.select(sel).append('svg:svg');
      this.svg.attr('width', SVG_WIDTH).attr('height', SVG_HEIGHT);
      this.wrapper = this.svg.append('svg:g');
      this.cg = (function() {
        var _i, _len, _ref, _results;
        _ref = ['top', 'bottom'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _results.push(this.wrapper.append('svg:g').attr('id', name).attr('class', 'circles'));
        }
        return _results;
      }).call(this);
      this.generateCircles(60, 5);
      this.draw(300);
    }
    CircleVis.prototype.generateCircles = function(lambda, num) {
      var i;
      return this.circles = (function() {
        var _results;
        _results = [];
        for (i = 1; 1 <= num ? i <= num : i >= num; 1 <= num ? i++ : i--) {
          _results.push(new Circle(i * lambda / 2, (i % 2) === 0));
        }
        return _results;
      })();
    };
    CircleVis.prototype.draw = function(distance) {
      var circles, group, _i, _len, _ref, _results;
      this.wrapper.attr('transform', "translate(0 " + ((SVG_HEIGHT - distance) / 2) + ")");
      this.cg[1].attr('transform', "translate(0 " + distance + ")");
      _ref = this.cg;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        circles = group.selectAll('circle').data(this.circles);
        circles.enter().append('svg:circle').attr('fill', 'transparent').attr('stroke-width', 3);
        circles.attr('r', function(d) {
          return d.radius;
        }).attr('stroke', function(d) {
          if (d.high) {
            return 'black';
          } else {
            return 'grey';
          }
        });
        _results.push(circles.exit().remove());
      }
      return _results;
    };
    return CircleVis;
  })();
  new CircleVis('#vis > div');
}).call(this);
