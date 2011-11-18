
class Circle
  constructor: (@radius, @high) ->

  intersection: (distance, other) ->
    ra = @radius
    rb = other.radius
    # no intersection
    return if distance > ra + rb
    # one or two intersections
    xa = ya = xb = 0
    yb = d = distance
    k = (1/4) * Math.sqrt((Math.pow(ra + rb, 2) - d*d) * (d*d - Math.pow(ra - rb, 2)))

    p = (1/2) * (xb + xa) + (1/2) * (yb - ya) * (ra*ra - rb*rb) / (d*d) + 2 * (yb - ya) * k / (d*d)
    m = (1/2) * (xb + xa) + (1/2) * (yb - ya) * (ra*ra - rb*rb) / (d*d) - 2 * (yb - ya) * k / (d*d)

    [p, m, m, p]

class CircleVis
  SVG_WIDTH = 800
  SVG_HEIGHT = 800
  constructor: (sel) ->
    @svg = d3.select(sel).append 'svg:svg'
    @svg.attr('width', SVG_WIDTH).attr('height', SVG_HEIGHT)
    @wrapper = @svg.append 'svg:g'
    @cg = for name in ['top', 'bottom']
      @wrapper.append('svg:g').attr('id', name).attr('class', 'circles')
    @generateCircles 60, 5
    @draw 300

  generateCircles: (lambda, num) ->
    @circles = for i in [1..num]
      new Circle i * lambda / 2, (i % 2) is 0

  draw: (distance) ->
    @wrapper.attr('transform', "translate(0 #{(SVG_HEIGHT - distance) / 2})")
    @cg[1].attr('transform', "translate(0 #{distance})")
    for group in @cg
      circles = group.selectAll('circle').data(@circles)
      circles.enter().append('svg:circle')
        .attr('fill', 'transparent')
        .attr('stroke-width', 3)
      circles.attr('r', (d) -> d.radius)
        .attr('stroke', (d) -> if d.high then 'black' else 'grey')
      circles.exit().remove()

new CircleVis '#vis > div'
