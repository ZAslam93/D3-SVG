// Visualize GDP data as a bar chart
const dataURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const w = 800;
const h = 400;
const padding = 60;
const barWidth = w / 275; //JSON has 275 entries

// Fetch data from API, load into [dataset]
fetch(dataURL)
  .then((response) => response.json())
  .then((data) =>
    // Main functionality
    {
      const tooltip = d3.select("body").append("div").attr("id", "tooltip");

      const dataset = data.data;
      const dateArr = dataset.map((d) => new Date(d[0]));
      const gdpArr = dataset.map((d) => d[1]);

      // xAxis will scale year, yAxis GDP
      const xScale = d3
        .scaleTime()
        .domain([d3.min(dateArr, (d) => d), d3.max(dateArr, (d) => d)])
        .range([padding, w - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdpArr, (d) => d)])
        .range([h - padding, padding]);

      // gdpScale to scale bar heights
      const gdpScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdpArr, (d) => d)])
        .range([0, h - 2 * padding]);

      const xAxis = d3.axisBottom(xScale);

      // Look I wanted to use trillions so the axis doesn't look dumb but the tests didn't want me to so here we are with "Eighteen thousand billion dollars GDP" don't blame me ok I'm just a poor potato farmer
      const yAxis = d3.axisLeft(yScale);

      const svg = d3
        .select("#svg-tag")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("display", "block")
        .style("margin", "auto")
        .style("background-color", "#F2EDDF")
        .style("border-style", "groove");

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},               0)`)
        .call(yAxis);

      svg
        .append("text")
        .attr("transform", `translate(${w / 2}, ${h - padding / 3})`)
        .text("Year");

      svg
        .append("text")
        .text("GDP (Billions)")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - h / 2)
        .attr("y", 0 + padding / 6);

      // Defining, drawing bars
      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(new Date(d[0])))
        .attr("y", (d) => h - padding - gdpScale(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => gdpScale(d[1]))
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d, i) => d[1])
        .attr("class", "bar")

        // Tooltip functionality
        .on("mouseover", (d, i) => {
          //Parsing data for tooltip
          let qtrCheck = parseInt(i[0].slice(5, 7));
          let year = i[0].slice(0, 4);
          var quarter = "";
          switch (qtrCheck) {
            case 1:
              quarter = "Q1";
              break;
            case 4:
              quarter = "Q2";
              break;
            case 7:
              quarter = "Q3";
              break;
            case 10:
              quarter = "Q4";
              break;
            default:
              console.log("how is this possible send help");
              break;
          }

          // Displaying, hiding tooltip
          tooltip
            .text(`${year} ${quarter} $${i[1]}B`)
            .transition()
            .duration(100)
            .attr("data-date", i[0])
            .attr("data-gdp", i[1])
            .style("opacity", 0.8)
            .style("left", `${d.pageX + 10}px`)
            .style("top", `${d.pageY}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
        });
    }
  );
