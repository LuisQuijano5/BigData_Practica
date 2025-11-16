function renderHeatMap(data, selector) {
    d3.select(selector).html(""); 

    const margin = {top: 80, right: 20, bottom: 20, left: 80}; 
    
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

    const regions = [...new Set(data.map(d => d.region))].sort();
    const categories = [...new Set(data.map(d => d.category))].sort(); 
    
    data.forEach(d => {
        d.total_sales = +d.total_sales;
    });

    const xScale = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(regions)
        .range([0, height])
        .padding(0.1);

    const colorRange = [
        "#2a2a4e", 
        "#1a525a", 
        "#00a086", 
        "#00ffc6"  
    ];

    const colorScale = d3.scaleQuantile()
        .domain(data.map(d => d.total_sales)) 
        .range(colorRange);

    const xAxis = svg.append("g")
        .attr("class", "axis axis-x heatmap-axis-x")
        .call(d3.axisTop(xScale).tickSize(0))
        .select(".domain").remove();
    
    xAxis.selectAll("text")
        .attr("transform", "rotate(-30)")
        .attr("text-anchor", "start");

    svg.append("g")
        .attr("class", "axis axis-y heatmap-axis-y")
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(10))
        .select(".domain").remove();

    svg.selectAll(".heatmap-axis-x .tick text").attr("class", "matrix-axis-label");
    svg.selectAll(".heatmap-axis-y .tick text").attr("class", "matrix-axis-label");

    const cells = svg.selectAll(".heatmap-cell-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "heatmap-cell-group")
        .attr("transform", d => `translate(${xScale(d.category)}, ${yScale(d.region)})`);

    cells.append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("rx", 8) 
        .attr("fill", d => colorScale(d.total_sales)) 
        .style("stroke", "var(--bg-color)") 
        .style("stroke-width", 2);


    cells.append("text")
        .attr("class", "heatmap-value-text")
        .attr("x", xScale.bandwidth() / 2)
        .attr("y", yScale.bandwidth() / 2) 
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d => d3.format("$,.0f")(d.total_sales / 1000) + "k"); 

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top + 20)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Total Sales by Region and Category");

    let tooltip = d3.select("body").select(".d3-tooltip");
    const tooltipFormatter = d3.format("$,.2f");

    cells
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
                <strong>${d.region} - ${d.category}</strong>
                <hr>
                Total Sales: 
                <span style="color: #fff;">
                  ${tooltipFormatter(d.total_sales)}
                </span>
            `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");

            d3.select(event.currentTarget).select("rect")
                .style("stroke-width", 3)
                .style("stroke", "#fff");
        })
        .on("mouseout", (event, d) => {
            tooltip.transition().duration(500).style("opacity", 0);
            d3.select(event.currentTarget).select("rect")
                .style("stroke-width", 2)
                .style("stroke", "var(--bg-color)");
        });
}