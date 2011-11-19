(function() {
  var Circle, CircleVis;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Circle = (function() {
    function Circle(radius, high) {
      this.radius = radius;
      this.high = high;
    }
    Circle.prototype.intersection = function(distance, other) {
      var d, k, ra, rb, type, x1, x2, xa, xb, y1, y2, ya, yb;
      ra = this.radius;
      rb = other.radius;
      if (distance > ra + rb) {
        return;
      }
      xa = ya = xb = 0;
      yb = d = distance;
      k = (1 / 4) * Math.sqrt((Math.pow(ra + rb, 2) - d * d) * (d * d - Math.pow(ra - rb, 2)));
      x1 = (1 / 2) * (xb + xa) + (1 / 2) * (xb - xa) * (ra * ra - rb * rb) / (d * d) + 2 * (yb - ya) * k / (d * d);
      y1 = (1 / 2) * (yb + ya) + (1 / 2) * (yb - ya) * (ra * ra - rb * rb) / (d * d) - 2 * (xb - xa) * k / (d * d);
      x2 = (1 / 2) * (xb + xa) + (1 / 2) * (xb - xa) * (ra * ra - rb * rb) / (d * d) - 2 * (yb - ya) * k / (d * d);
      y2 = (1 / 2) * (yb + ya) + (1 / 2) * (yb - ya) * (ra * ra - rb * rb) / (d * d) + 2 * (xb - xa) * k / (d * d);
      if (isNaN(x1)) {
        return;
      }
      type = this.high === other.high;
      return [[x1, y1, type], [x2, y2, type]];
    };
    return Circle;
  })();
  CircleVis = (function() {
    var SVG_HEIGHT, SVG_WIDTH;
    SVG_WIDTH = 800;
    SVG_HEIGHT = 800;
    function CircleVis(sel) {
      var name;
      this.vis = d3.select(sel);
      this.vis.selectAll('input').on('change', __bind(function() {
        return this.update();
      }, this));
      this.svg = d3.select(sel + '> div').append('svg:svg');
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
      this.intersections = this.wrapper.append('svg:g');
      this.update();
    }
    CircleVis.prototype.update = function() {
      var distance, lambda, num;
      distance = +this.vis.select('#distance input').property('value');
      lambda = +this.vis.select('#lambda input').property('value');
      num = +this.vis.select('#num input').property('value');
      this.vis.select('#distance td:last-child').text(distance);
      this.vis.select('#lambda td:last-child').text(lambda);
      this.vis.select('#num td:last-child').text(num);
      this.generateCircles(lambda, num);
      return this.draw(distance);
    };
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
      var c1, c2, circles, group, result, results, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      this.wrapper.attr('transform', "translate(" + (SVG_WIDTH / 2) + " " + ((SVG_HEIGHT - distance) / 2) + ")");
      this.cg[1].attr('transform', "translate(0 " + distance + ")");
      _ref = this.cg;
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
        circles.exit().remove();
      }
      results = [];
      _ref2 = this.circles;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        c1 = _ref2[_j];
        _ref3 = this.circles;
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          c2 = _ref3[_k];
          result = c1.intersection(distance, c2);
          if (result) {
            results = results.concat(result);
          }
        }
      }
      circles = this.intersections.selectAll('circle').data(results);
      circles.enter().append('svg:circle').attr('r', 5);
      circles.attr('cx', function(d) {
        return d[0];
      }).attr('cy', function(d) {
        return d[1];
      }).attr('fill', function(d) {
        if (d[2]) {
          return 'red';
        } else {
          return 'blue';
        }
      });
      return circles.exit().remove();
    };
    return CircleVis;
  })();
  new CircleVis('#vis');
}).call(this);
