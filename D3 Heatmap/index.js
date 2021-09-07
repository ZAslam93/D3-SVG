const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const w = 1000;
const h = 600;
const padding = {
  width: 100,
  height: 80
};

let intervals = [-6.976];
for (let i = 1; i <= 6; i++) {
  intervals.push(-6.976 + 2.034*i);
}
console.log(intervals);
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const barWidth = (w - padding.width * 2) / (3153 / 12); //Approx 3.5

const barHeight = (h - padding.height * 2) / (12); // 40

const tempArr = ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"];
const colorArr = tempArr.reverse();

fetch(dataURL) 
  .then(response => response.json())
  .then(data => {
  // Main functionality
 const tempArr = data["monthlyVariance"];
 const baseTemp = data["baseTemperature"];
  
//console.log(tempArr[4]);
//console.log(d3.min(tempArr, d => d["variance"]));
//console.log(d3.max(tempArr, d => d["variance"]));
  
const tooltip = d3.select("body").append("div").attr("id", "tooltip");
  
 const xScale = d3.scaleLinear()
  .domain([
    d3.min(tempArr, d => d["year"]),
    d3.max(tempArr, d => d["year"])
  ])
  .range([padding.width, w - padding.width]);
  
const yScale = d3.scaleLinear()
  .domain([
    d3.min(tempArr, d => d["month"] - 1),
    d3.max(tempArr, d => d["month"] - 1)
  ])
  .range([h - padding.height, padding.height]);

const xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format("d"));

const yAxis = d3.axisLeft(yScale)
.tickFormat((d, i) => months[i]);

const svg = d3
      .select("#svg-tag")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("display", "block")
      .style("margin", "auto")
      .style("background-color", "#F2EDDF")
      .style("border-style", "ridge")
      .style("border-width", "6px")
      .style("border-color", "rgba(222, 120, 31, .4)");
  
  // Axes
  svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding.height})`)
      .call(xAxis);
  
  svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding.width}, 0)`)
      .call(yAxis);
  
  // Legends
    svg
      .append("text")
      .text("Month")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - h / 2)
      .attr("y", 0 + padding.width / 3);
  
  svg
      .append("text")
      .attr("transform", `translate(${w / 2}, ${h - padding.height / 3})`)
      .text("Year");
  
  var legend = svg
    .append("g")
    .attr("id", "legend");
  
  legend 
    .append("text")
    .attr("x", padding.width/ 3)
    .attr("y", h - padding.height/2)
    .text("Legend")
  
  legend
    .selectAll("rect")
    .data(colorArr)
    .enter()
    .append("rect")
    .attr("width", (d, i) => 20)
    .attr("height", 20)
    .attr("x", (d, i) => padding.width + 20*i)
    .attr("y", h - 2*padding["height"]/3)
    .style("fill", d => d)
    .style("stroke", "#3A141F")
    .style("stroke-width", "1px");
  
  svg
    .append("text")
    .attr("x", 90)
    .attr("y", h - padding.height/4)       
    .text(`<${(baseTemp + intervals[0]).toFixed(2)}°C`)
    .style("font-size", "10px")
    .style("text-align", "center");
    
    svg
    .append("text")
    .attr("x", padding.width + 100)
    .attr("y", h - padding.height/4)       
    .text(`>${(baseTemp + intervals[5]).toFixed(2)}°C`)
    .style("font-size", "10px")
    .style("text-align", "center");;
    
  
  // Drawing rects
  svg
    .selectAll("rect")
    .data(tempArr)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d["year"]))
    .attr("y", d => yScale(d["month"]))
    .attr("width", barWidth)
    .attr("height", barHeight)
    .attr("data-month", d =>  d["month"] - 1)
    .attr("data-year", d => d["year"])
    .attr("data-temp", d => baseTemp - d["variance"])
    .style("fill", d => {
    return (d["variance"] <= intervals[1]) ? colorArr[0] : (d["variance"] <= intervals[2]) ? colorArr[1] : (d["variance"] <= intervals[3]) ? colorArr[2] : (d["variance"] <= intervals[4]) ? colorArr[3] : (d["variance"] <= intervals[5]) ? colorArr[4] : colorArr[5]
  })
  
  // Tooltip functionality
  .on("mouseover", (d, i) => {
    //console.log(i.variance);
    const monthval = months[i.month - 1];
    tooltip.html(
    `${monthval} ${i.year}<br/>Surface Temperature | ${(baseTemp + i.variance).toFixed(2)}°C<br/>Variance |  ${i.variance}°C`)
    .transition()
    .duration(100)
    .attr("data-year", i.year)
    .attr("data-month", i.month)
    .attr("data-var", (i.variance).toFixed(2))
    .style("opacity", 0.8)
          .style("left", `${d.pageX + 10}px`)
          .style("top", `${d.pageY}px`);
  })
  
  .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
});
      