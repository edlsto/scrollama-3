var parseTime = d3.timeParse('%m/%d/%Y')
var dateFormatter = d3.timeFormat("%b. %d");




var margin = {left: 80, right: 0, top: 70, bottom: 20}


    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;
            var fontSize = parseInt(container.style("width")) < 768 ? "20px" : "10px";


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
                console.log(container.style("height"))

    }
}



d3.tsv('https://gist.githubusercontent.com/edlsto/d5ca86134c84dbdb959c58d6b1404a93/raw/725e99a55d80cdb74e1cff6d91d5a018cc4453ec/water-data-060319', function(data) {
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



var svg1 = d3.select('#one')
  .append('svg')
  .attr("width", width + margin.left + margin.right )
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy);


;

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
  

var container = d3.select(svg1.node().parentNode);
    var fontSize = parseInt(container.style("width")) < 768 ? "20px" : "10px";

  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.timeFormat("%b")))
        .style("font-size", fontSize)

          svg1.append("text")
      .attr("x", 80 )
    .attr("y", 440)
    .text("Source: Natural Resources Conservation Service")
          .style("font", "sans-serif")
                  .attr("text-anchor", "start")
        .attr("font-weight", "bold")
    .style("font-size", fontSize)

;
    

    yAxis = g => g
    .style("font-size", fontSize)
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(width / 180))
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
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot.attr("transform", "translate(497,130)")
    .attr("id", "thisyear")
    dot.select("text").text("2018-19")


  const dot2 = svg1.append("g")
  dot2.append("circle")
      .attr("r", 2.5);
  dot2.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot2.attr("transform", "translate(632,89)")
    .attr("id", "thisyear")
    dot2.select("text").text("2010-11")

      const dot3 = svg1.append("g")
  dot3.append("circle")
      .attr("r", 2.5);
  dot3.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot3.attr("transform", "translate(543,306)")
    .attr("id", "thisyear")
    dot3.select("text").text("2011-12")

          const dot4 = svg1.append("g")
  dot4.append("circle")
      .attr("r", 2.5);
  dot4.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot4.attr("transform", "translate(632,165)")
    .attr("id", "thisyear")
    dot4.select("text").text("2009-10")

  return svg1.node();


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
  var svg2 = d3.select('#two')
  .append('svg')
  .attr("width", width + margin.left + margin.right )
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy);
  
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
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
            .style("font-size", fontSize)


     var container = d3.select(svg2.node().parentNode);
    var fontSize = parseInt(container.style("width")) < 768 ? "20px" : "10px";

          svg2.append("text")
      .attr("x", 80 )
    .attr("y", 440)
    .text("Source: onthesnow.com")
          .style("font", "sans-serif")
                  .attr("text-anchor", "start")
        .attr("font-weight", "bold")
    .style("font-size", fontSize)

;

    yAxis = g => g
    .style("font-size", fontSize)
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(width / 180))
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

    var data3 =  {
    y: "# inches",
series: data3,
dates: dates
}

  var x = d3.scaleTime()
    .domain(d3.extent(data3.dates))
    .range([margin.left, width - margin.right])

var y = d3.scaleLinear()
    .domain([0, 15])
    .range([height - margin.bottom, margin.top])

      var svg3 = d3.select('#three')
  .append('svg')
  .attr("width", width + margin.left + margin.right )
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy);
  

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
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
            .style("font-size", fontSize)


     var container = d3.select(svg3.node().parentNode);
    var fontSize = parseInt(container.style("width")) < 768 ? "20px" : "10px";

;


          svg3.append("text")
      .attr("x", 80 )
    .attr("y", 440)
    .text("Source: onthesnow.com")
          .style("font", "sans-serif")
                  .attr("text-anchor", "start")
        .attr("font-weight", "bold")
    .style("font-size", fontSize)

;

    yAxis = g => g
    .style("font-size", fontSize)
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


d3.tsv('https://gist.githubusercontent.com/edlsto/9c6c9c57326b82c8a61c339d3ef82798/raw/7677c77793f4fba175789340befa2b88d360a317/snow-totals-resorts.tsv', function(data) {
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

      var svg4 = d3.select('#four')
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
        .style("font-size", fontSize)

     var container = d3.select(svg4.node().parentNode);
    var fontSize = parseInt(container.style("width")) < 768 ? "20px" : "10px";


          svg4.append("text")
      .attr("x", 80 )
    .attr("y", 440)
    .text("Source: onthesnow.com")
          .style("font", "sans-serif")
                  .attr("text-anchor", "start")
        .attr("font-weight", "bold")
    .style("font-size", fontSize)

;


    yAxis = g => g
    .style("font-size", fontSize)
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(width / 180))
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
    
  d3.select('path#years2').attr("stroke", "steelblue")
  
  const dot = svg4.append("g")
  dot.append("circle")
      .attr("r", 2.5);
  dot.append("text")
       .style("font", "sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot.attr("transform", "translate(562.7506549178377,228)")
    .attr("id", "thisyear")
    dot.select("text").text("Vail")

      const dot2 = svg4.append("g")
  dot2.append("circle")
      .attr("r", 2.5);
  dot2.append("text")
      .style("font", "sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot2.attr("transform", "translate(562.7506549178377,167)")
    .attr("id", "thisyear")
    dot2.select("text").text("Aspen")

          const dot3 = svg4.append("g")
  dot3.append("circle")
      .attr("r", 2.5);
  dot3.append("text")
      .style("font", "sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot3.attr("transform", "translate(562.7506549178377,116)")
    .attr("id", "thisyear")
    dot3.select("text").text("Mammoth")

              const dot4 = svg4.append("g")
  dot4.append("circle")
      .attr("r", 2.5);
  dot4.append("text")
      .style("font", "sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot4.attr("transform", "translate(570,194)")
    .attr("id", "thisyear")
    dot4.select("text").text("Park City")

              const dot5 = svg4.append("g")
  dot5.append("circle")
      .attr("r", 2.5);
  dot5.append("text")
      .style("font", "sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot5.attr("transform", "translate(625.7506549178377,193)")
    .attr("id", "thisyear")
    dot5.select("text").text("Breckenridge")

  return svg4.node();








})


d3.tsv('https://gist.githubusercontent.com/edlsto/7d1c2a2a165c965e2272b4ad56870d22/raw/df14e7ecd96690f16cde14e4ebfc3a4a5893a613/snow-totals-060319', function(data) {
  var columns = data.columns.slice(1).map(d => parseTime(d))
  var series = data.map( (d, i, columns) => {
    return {
name: d.name,
values: data.columns.slice(1).map(k => +d[k])
}
  })
  var data =  {
    y: "# cubic feet per second",
series: series,
dates: columns
}



var svg5 = d3.select('#five')
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
    .call(d3.axisBottom(x).ticks(width / 160).tickSizeOuter(0).tickFormat(d3.timeFormat("%b")))
        .style("font-size", fontSize)


;
    var container = d3.select(svg5.node().parentNode);
    var fontSize = parseInt(container.style("width")) < 768 ? "20px" : "10px";


          svg5.append("text")
      .attr("x", 80 )
    .attr("y", 440)
    .text("Source: Natural Resources Conservation Service")
          .style("font", "sans-serif")
                  .attr("text-anchor", "start")
        .attr("font-weight", "bold")
    .style("font-size", fontSize)

;

    yAxis = g => g
    .style("font-size", fontSize)
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(width / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))

  svg5.append("g")
      .call(xAxis);
  svg5.append("g")
      .call(yAxis);

  var path = svg5.append("g")
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
      return "wateryear" + i
      })
    
  d3.select('path#wateryear9').attr("stroke", "steelblue")
  const dot = svg5.append("g")
  dot.append("circle")
      .attr("r", 2.5);
  dot.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot.attr("transform", "translate(360,298)")
    .attr("id", "thisyear")
    dot.select("text").text("2019")

  const dot2 = svg5.append("g")
  dot2.append("circle")
      .attr("r", 2.5);
  dot2.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot2.attr("transform", "translate(600,144)")
    .attr("id", "thisyear")
    dot2.select("text").text("2011")

      const dot3 = svg5.append("g")
  dot3.append("circle")
      .attr("r", 2.5);
  dot3.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot3.attr("transform", "translate(488,87)")
    .attr("id", "thisyear")
    dot3.select("text").text("2010")

          const dot4 = svg5.append("g")
  dot4.append("circle")
      .attr("r", 2.5);
  dot4.append("text")
      .style("font", "10px sans-serif")
      .style("font-size", fontSize)
      .attr("text-anchor", "middle")
      .attr("y", -8);
    dot4.attr("transform", "translate(517,362)")
    .attr("id", "thisyear")
    dot4.select("text").text("2012")

  return svg5.node();


})
