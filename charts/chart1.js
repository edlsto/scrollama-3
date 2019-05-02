var parseTime = d3.timeParse('%m/%d/%Y')
var dateFormatter = d3.timeFormat("%b. %d");
var svg1 = d3.select('svg#one')
var svg2 = d3.select('svg#two')
var svg3 = d3.select('svg#three')
var svg4 = d3.select('svg#four')
var height = 400
var width = 800
var height1 = 400
var width1 = 800
var margin = {left: 30, right: 30, top: 20, bottom: 20}


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

  svg1.append("g")
      .call(xAxis);
  svg1.append("g")
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
    
  d3.select('path#year0').attr("stroke", "steelblue")
  const dot = svg1.append("g")
  dot.append("circle")
      .attr("r", 2.5);
  dot.append("text")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot.attr("transform", "translate(610.5012376237623,51.5)")
    .attr("id", "thisyear")
    dot.select("text").text("2018-19")
  svg1.call(hover, path);
  return svg1.node();

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

d3.tsv("https://gist.githubusercontent.com/edlsto/8970422bd7c7c135cdaad05470d7f03d/raw/91771879c78a8dc80bf58e7e07b92b494868f77f/gistfile1.tsv", function(error, data2) {
  if (error) throw error;



  // format the data
  data2.forEach(function(d) {
    d.inches = +d.inches;
  });

    var data2 =  {
    y: "# inches",
series: data2
}


  var x = d3.scaleBand()
    .domain(data2.series.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1)
var y = d3.scaleLinear()
    .domain([0, d3.max(data2.series, d => d.inches)]).nice()
    .range([height - margin.bottom, margin.top])


  // append the rectangles for the bar chart
  svg2.append("g")
      .attr("fill", "lightgray")
    .selectAll("rect")
    .data(data2.series)
    .enter()
    .append('rect')
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.inches))
      .attr("height", d => y(0) - y(d.inches))
      .attr("width", x.bandwidth())
      .attr("id", (d, i) => {
      return "year" + i
      })
        d3.select('rect#year9').attr("fill", "steelblue")


  // add the x Axis
xAxis = g => g
    .attr("transform", `translate(0,${height1 - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data2.y))

  svg2.append("g")
      .call(xAxis);
  
  svg2.append("g")
      .call(yAxis);


});


d3.tsv("https://gist.githubusercontent.com/edlsto/05fef0d61318a5b91f8d475216fba034/raw/e1787709132262fb0890bc33b6cdcfd8fd83fbf1/daily-new-snow.tsv", function(error, data3) {
  if (error) throw error;


  // format the data
  data3.forEach(function(d) {
    d.inches = +d.inches,
    d.date = parseTime(d.date)

  });

  var dates = data3.map(
    d => d.date
  )

console.log(dates)

    var data3 =  {
    y: "# inches",
series: data3,
dates: dates
}

console.log(data3)

  var x = d3.scaleTime()
    .domain(d3.extent(data3.dates))
    .range([margin.left, width - margin.right])

console.log(d3.max(data3.series, d => d.inches))
var y = d3.scaleLinear()
    .domain([0, 15])
    .range([height - margin.bottom, margin.top])

  // append the rectangles for the bar chart
  svg3.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data3.series)
    .enter()
    .append('rect')
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.inches))
      .attr("height", d => y(0) - y(d.inches))
      .attr("width", 5)



  // add the x Axis
xAxis = g => g
    .attr("transform", `translate(0,${height1 - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data3.y))

  svg3.append("g")
      .call(xAxis);
  
  svg3.append("g")
      .call(yAxis);


});


d3.tsv('https://gist.githubusercontent.com/edlsto/9c6c9c57326b82c8a61c339d3ef82798/raw/b3501fea7134a9db0afdd1d3bbbc40d45f07713e/snow-totals-resorts.tsv', function(data) {
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
          .curve(d3.step);
  
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

  svg4.append("g")
      .call(xAxis);
  svg4.append("g")
      .call(yAxis);

  var path = svg4.append("g")
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
      return "years" + i
      })
    
  d3.select('path#years0').attr("stroke", "steelblue")
  
  const dot = svg4.append("g")
  dot.append("circle")
      .attr("r", 2.5);
  dot.append("text")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot.attr("transform", "translate(610.5012376237623,51.5)")
    .attr("id", "thisyear")
    dot.select("text").text("2018-19")
  svg4.call(hover, path);
  return svg4.node();

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

