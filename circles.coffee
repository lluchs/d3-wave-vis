
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

    x1 = (1/2) * (xb + xa) + (1/2) * (xb - xa) * (ra*ra - rb*rb) / (d*d) + 2 * (yb - ya) * k / (d*d)
    y1 = (1/2) * (yb + ya) + (1/2) * (yb - ya) * (ra*ra - rb*rb) / (d*d) - 2 * (xb - xa) * k / (d*d)
    x2 = (1/2) * (xb + xa) + (1/2) * (xb - xa) * (ra*ra - rb*rb) / (d*d) - 2 * (yb - ya) * k / (d*d)
    y2 = (1/2) * (yb + ya) + (1/2) * (yb - ya) * (ra*ra - rb*rb) / (d*d) + 2 * (xb - xa) * k / (d*d)

    return if isNaN(x1)

    type = @high is other.high

    [[x1, y1, type], [x2, y2, type]]

class CircleVis
  SVG_WIDTH = 800
  SVG_HEIGHT = 800
  constructor: (sel) ->
    @vis = d3.select(sel)
    @vis.selectAll('input').on 'change', => @update()
    @svg = d3.select(sel + '> div').append 'svg:svg'
    @svg.attr('width', SVG_WIDTH).attr('height', SVG_HEIGHT)
    @wrapper = @svg.append 'svg:g'
    @cg = for name in ['top', 'bottom']
      @wrapper.append('svg:g').attr('id', name).attr('class', 'circles')
    @intersections = @wrapper.append 'svg:g'
    @update()

  update: ->
    distance = +@vis.select('#distance input').property 'value'
    lambda   = +@vis.select('#lambda input').property 'value'
    num      = +@vis.select('#num input').property 'value'
    @vis.select('#distance td:last-child').text distance
    @vis.select('#lambda td:last-child').text lambda
    @vis.select('#num td:last-child').text num
    @generateCircles lambda, num
    @draw distance

  generateCircles: (lambda, num) ->
    @circles = for i in [1..num]
      new Circle i * lambda / 2, (i % 2) is 0

  draw: (distance) ->
    @wrapper.attr('transform', "translate(#{SVG_WIDTH / 2} #{(SVG_HEIGHT - distance) / 2})")
    @cg[1].attr('transform', "translate(0 #{distance})")
    for group in @cg
      circles = group.selectAll('circle').data(@circles)
      circles.enter().append('svg:circle')
        .attr('fill', 'transparent')
        .attr('stroke-width', 3)
      circles.attr('r', (d) -> d.radius)
        .attr('stroke', (d) -> if d.high then 'black' else 'grey')
      circles.exit().remove()

    # find intersections
    results = []
    for c1 in @circles
      for c2 in @circles
        result = c1.intersection distance, c2
        results = results.concat result if result

    circles = @intersections.selectAll('circle').data results
    circles.enter().append('svg:circle')
      .attr('r', 5)
    circles.attr('cx', (d) -> d[0]).attr('cy', (d) -> d[1])
      .attr('fill', (d) -> if d[2] then 'red' else 'blue')
    circles.exit().remove()

new CircleVis '#vis'
