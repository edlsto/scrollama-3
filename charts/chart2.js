var parseTime = d3.timeParse('%m/%d/%Y')
var dateFormatter = d3.timeFormat("%b. %d");




d3.tsv('https://gist.githubusercontent.com/edlsto/491bbd6d419f729df6b84ca94de04aff/raw/803b70154e55de29fd9fdb6903e22342f4962071/gistfile1.tsv', function(data) {
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
var margin = {left: 50, right: 30, top: 20, bottom: 20}

    var width = 800 - margin.left - margin.right;
    var height = 850 - margin.top - margin.bottom;

var svg1 = d3.select('#one')
  .append('svg')
  .attr("width", width + margin.left + margin.right )
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy);

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


  svg1.append("g")
      .style("font-size", "15px")
      .call(xAxis);
  svg1.append("g")
      .style("font-size", "15px")
      .call(yAxis);

  var path = svg1.append("g")
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


function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;
        console.log(svg.style("width"))

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width")) < 800 ? parseInt(container.style("width")) : 800;
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
        console.log(targetWidth)
    }
}

})
