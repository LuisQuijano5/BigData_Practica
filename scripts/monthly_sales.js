function renderMonthlySales(data, selector) {
    d3.select(selector).html(""); 

    const margin = {top: 50, right: 80, bottom: 60, left: 80};

    const container = d3.select(selector);
    const containerRect = container.node().getBoundingClientRect();
    const width = containerRect.width - margin.left - margin.right;
    const height = containerRect.height - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${containerRect.width} ${containerRect.height}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const parseTime = d3.timeParse("%Y-%m");

    data.forEach(d => {
        d.date = parseTime(d.sale_month);
        d.monthly_sales = +d.monthly_sales;
    });

    data.sort((a, b) => a.date - b.date);

    let runningTotal = 0;
    data.forEach(d => {
        runningTotal += d.monthly_sales;
        d.cumulative_sales = runningTotal;
    });

    const x = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])
        .padding(0.2);

    const yBars = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.monthly_sales)])
        .range([height, 0])
        .nice(); 

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cumulative_sales)])
        .range([height, 0])
        .nice();


    svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%b")) 
        );

    svg.append("g")
        .attr("class", "axis axis-y-bars")
        .call(d3.axisLeft(yBars)
            .ticks(6)
            .tickFormat(d => `$${d / 1000}k`) 
        );

    svg.append("g")
        .attr("class", "axis axis-y-line")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(yLine)
            .ticks(6)
            .tickFormat(d => `$${(d / 1000000).toFixed(1)}M`) 
        );

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => yBars(d.monthly_sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - yBars(d.monthly_sales))
        .attr("fill", "var(--highlight-color)") 
        .attr("opacity", 0.7);

    const line = d3.line()
        .x(d => x(d.date) + x.bandwidth() / 2) 
        .y(d => yLine(d.cumulative_sales))
        .curve(d3.curveMonotoneX); 

    svg.append("path")
        .datum(data) 
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#ffc107") 
        .attr("stroke-width", 3);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date) + x.bandwidth() / 2)
        .attr("cy", d => yLine(d.cumulative_sales))
        .attr("r", 5)
        .attr("fill", "#ffc107");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Monthly Sales (2025)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15) 
        .attr("x", 0 - (height / 2))
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .text("Month Sale");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right - 20) 
        .attr("x", 0 - (height / 2))
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .text("Accumulated");

    let tooltip = d3.select("body").select(".d3-tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0);
    }

    const tooltipFormatter = d3.format("$,.2f");

    svg.selectAll(".interaction-rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.date))
        .attr("y", 0)
        .attr("width", x.bandwidth())
        .attr("height", height)
        .attr("fill", "transparent")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
                <strong>${d3.timeFormat("%B %Y")(d.date)}</strong>
                <hr>
                Month Sale: 
                <span style="color: var(--highlight-color);">
                  ${tooltipFormatter(d.monthly_sales)}
                </span>
                <br>
                Accuumlated: 
                <span style="color: #ffc107;">
                  ${tooltipFormatter(d.cumulative_sales)}
                </span>
            `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");

            const date = d.date; 
            d3.selectAll(".bar").filter(b => b.date === date).style("opacity", 1);
            d3.selectAll(".dot").filter(b => b.date === date).attr("r", 7).style("fill", "#fff");

        })
        .on("mouseout", (event, d) => {
            tooltip.transition().duration(500).style("opacity", 0);
            const date = d.date;
            d3.selectAll(".bar").filter(b => b.date === date).style("opacity", 0.7);
            d3.selectAll(".dot").filter(b => b.date === date).attr("r", 5).style("fill", "#ffc107");
        });
}