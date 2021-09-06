const dataURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 800;
const h = 600;
const padding = 60;
const radius = 7; //Circle radius TBD

fetch(dataURL)
  .then((response) => response.json())
  .then((data) => {
    // Main functionality
    //console.log(data);
    const tooltip = d3.select("body").append("div").attr("id", "tooltip");

    // Parsing data
    const timeArr = data.map((d) => {
      let time = [0, 0];
      time[0] = d["Time"].substring(0, 2);
      time[1] = d["Time"].substring(3, 5);
      return new Date(1970, 0, 1, 0, time[0], time[1]);
    });

    const dataset = data.map((d) => [d["Year"], d["Time"]]);

    const yearArr = data.map((d) => d["Year"]);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(yearArr, (d) => d), d3.max(yearArr, (d) => d)])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleTime()
      .domain([d3.max(timeArr, (d) => d), d3.min(timeArr, (d) => d)])
      .range([h - padding, padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    var timeFormat = d3.timeFormat("%M:%S");

    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

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
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Legends
    svg
      .append("text")
      .text("Time (Minutes)")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - h / 2)
      .attr("y", 0 + padding / 3);

    svg
      .append("text")
      .attr("transform", `translate(${w / 2}, ${h - padding / 3})`)
      .text("Year");

    svg
      .append("circle")
      .attr("cx", 580)
      .attr("cy", 100)
      .attr("r", radius)
      .style("fill", "#2B8A19")
      .style("stroke", "#3A141F")
      .style("stroke-width", "2px");

    svg
      .append("text")
      .attr("x", 590)
      .attr("y", 105)
      .attr("id", "legend")
      .text("No allegations of doping");

    svg
      .append("circle")
      .attr("cx", 580)
      .attr("cy", 130)
      .attr("r", radius)
      .style("fill", "#CC0909")
      .style("stroke", "#3A141F")
      .style("stroke-width", "2px");

    svg
      .append("text")
      .attr("x", 590)
      .attr("y", 135)
      .text("Alleged/confirmed doping");

    // Drawing circles
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d["Year"]))
      .attr("cy", (d, i) => yScale(timeArr[i]))
      .attr("r", radius)
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d["Year"])
      .attr("data-yvalue", (d, i) => timeArr[i])
      .style("fill", (d) => (d["Doping"] == "" ? "#2B8A19" : "#CC0909"))

      // Tooltip functionality
      .on("mouseover", (d, i) => {
        console.log(i);
        tooltip
          .html(
            `${i["Name"]} | ${i["Nationality"]} <br/> Time | ${i["Time"]} <br/> ${i["Doping"]}`
          )
          .transition()
          .duration(100)
          .attr("data-year", i["Year"])
          .style("opacity", 0.8)
          .style("left", `${d.pageX + 10}px`)
          .style("top", `${d.pageY}px`);
      })

      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  });
