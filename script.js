fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const timeParts = item.Time.split(":");
      item.TotalSeconds = +timeParts[0] * 60 + +timeParts[1];
    });

    createScatterplotGraph(data);
  });

function createScatterplotGraph(data) {
  const width = 960;
  const height = 600;
  const padding = 60;

  const svg = d3.select("#scatterplot-graph")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3.scaleTime()
    .domain([d3.min(data, d => new Date(d.Year, 0)), d3.max(data, d => new Date(d.Year, 0))])
    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
    .domain([d3.min(data, d => new Date(0, 0, 0, 0, 0, d.TotalSeconds)), d3.max(data, d => new Date(0, 0, 0, 0, 0, d.TotalSeconds))])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(new Date(d.Year, 0)))
    .attr("cy", d => yScale(new Date(0, 0, 0, 0, 0, d.TotalSeconds)))
    .attr("r", 5)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => new Date(0, 0, 0, 0, 0, d.TotalSeconds));

  const tooltip = d3.select("#tooltip");

  svg.selectAll("circle")
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1)
        .html(`Year: ${d.Year}<br>Time: ${d.Time}`)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .attr("data-year", d.Year);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}
