var parseTime = d3.timeParse('%m/%d/%Y')
var dateFormatter = d3.timeFormat("%b. %d");
var svg = d3.select('svg')
var height = 400
var width = 800
var margin = {left: 20, right: 30, top: 20, bottom: 20}
const data = d3.tsv('https://gist.githubusercontent.com/edlsto/491bbd6d419f729df6b84ca94de04aff/raw/803b70154e55de29fd9fdb6903e22342f4962071/gistfile1.tsv', function(data) {
  var columns = data.columns.slice(1).map(d => parseTime(d))
  var series = data.map( (d, i, columns) => {
    return {
name: d.name,
values: data.columns.slice(1).map(k => +d[k])
}
  })
  var data =  {
    y: "# inches",
series: series,
dates: columns
}
  console.log(data)
  var x = d3.scaleTime()
    .domain(d3.extent(data.dates))
    .range([margin.left, width - margin.right])
  var y = d3.scaleLinear()
    .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
    .range([height - margin.bottom, margin.top])
  var line = d3.line()
    .defined(d => !isNaN(d))
    .x((d, i) => x(data.dates[i]))
    .y(d => y(d))
          .curve(d3.curveCatmullRom);
  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.timeFormat("%b")))
;
    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))
  svg.append("g")
      .call(xAxis);
  svg.append("g")
      .call(yAxis);
  var path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
    .data(data.series)
   .enter()
   .append("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.values))
      .attr("id", (d, i) => {
      return "year" + i
      })
    
  d3.select('path#year0').attr("stroke", "steelblue")
  const dot = svg.append("g")
  dot.append("circle")
      .attr("r", 2.5);
  dot.append("text")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot.attr("transform", "translate(610.5012376237623,51.5)")
    .attr("id", "thisyear")
    dot.select("text").text("2018-19")
  svg.call(hover, path);
  return svg.node();
function hover(svg, path) {
  svg
      .style("position", "relative");
  if ("ontouchstart" in document) svg
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchmove", moved)
      .on("touchstart", entered)
      .on("touchend", left)
  else svg
      .on("mousemove", moved)
      .on("mouseenter", entered)
      .on("mouseleave", left);
  const dot = svg.append("g")
      .attr("display", "none");
  dot.append("circle")
      .attr("r", 2.5);
  dot.append("text")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle")
      .attr("y", -8);
  function moved() {
    d3.event.preventDefault();
    const ym = y.invert(d3.event.layerY);
    const xm = x.invert(d3.event.layerX);
    const i1 = d3.bisectLeft(data.dates, xm, 1);
    const i0 = i1 - 1;
    const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
    const s = data.series.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
    path.attr("stroke", d => d === s ? 'steelblue' : "#ddd").filter(d => d === s).raise();
    dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
    dot.select("text").text(s.name)
    d3.select('#thisyear').remove()
  }
  function entered() {
    path.style("mix-blend-mode", null).attr("stroke", "#ddd");
    dot.attr("display", 'null');
  }
  function left() {
    path.style("mix-blend-mode", "multiply").attr("stroke", null);
    dot.attr("transform", "translate(610.5012376237623,51.5)")
      d3.select('path#year0').attr("stroke", "steelblue")
    dot.select("text").text("2018-19")
  }
}
})