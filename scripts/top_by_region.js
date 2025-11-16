function renderTopByRegion(data, selector) {
    d3.select(selector).html(""); 

    const margin = {top: 50, right: 20, bottom: 20, left: 50};
    
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


    const regions = [...new Set(data.map(d => d.region))];
    const ranks = [...new Set(data.map(d => d.rank))].sort((a,b) => a - b);

    data.forEach(d => {
        d.total_quantity = +d.total_quantity;
    });

    const xScale = d3.scaleBand()
        .domain(regions)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(ranks)
        .range([0, height])
        .padding(0.1);

    const colorOpacityScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.total_quantity)) 
        .range([0.2, 1]); 

    svg.append("g")
        .attr("class", "axis axis-x")
        .call(d3.axisTop(xScale).tickSize(0)) 
        .select(".domain").remove(); 
        
    svg.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(10))
        .select(".domain").remove();

    svg.selectAll(".axis-x .tick text").attr("class", "matrix-axis-label");
    svg.selectAll(".axis-y .tick text").attr("class", "matrix-axis-label")
       .text(d => `Rank ${d}`); 

    const cells = svg.selectAll(".cell")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "matrix-cell")
        .attr("transform", d => `translate(${xScale(d.region)}, ${yScale(d.rank)})`);

    cells.append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("rx", 8) 
        .attr("fill", "var(--highlight-color)")
        .attr("fill-opacity", d => colorOpacityScale(d.total_quantity))
        .style("stroke", "var(--highlight-color)")
        .style("stroke-opacity", 0.5);

    cells.append("text")
        .attr("class", "matrix-text-product")
        .attr("x", xScale.bandwidth() / 2) 
        .attr("y", yScale.bandwidth() / 2 - 5) 
        .attr("text-anchor", "middle")
        .text(d => d.product_name);

    cells.append("text")
        .attr("class", "matrix-text-quantity")
        .attr("x", xScale.bandwidth() / 2) 
        .attr("y", yScale.bandwidth() / 2 + 15) 
        .attr("text-anchor", "middle")
        .text(d => `${d3.format(",")(d.total_quantity)} units`); 

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Top 5 Products by Region");

    cells
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget).select("rect")
                .style("stroke-width", 2)
                .style("stroke-opacity", 1);
        })
        .on("mouseout", (event, d) => {
            d3.select(event.currentTarget).select("rect")
                .style("stroke-width", 0)
                .style("stroke-opacity", 0.5);
        });
}