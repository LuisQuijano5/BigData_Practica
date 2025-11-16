function renderTotalByRegion(data, selector) {
    d3.select(selector).html("");

    const margin = {top: 50, right: 30, bottom: 40, left: 80}; 
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

    const regionQty = d3.rollups(data, 
        v => d3.sum(v, d => d.total_quantity), 
        d => d.region
    );
    
    regionQty.sort((a, b) => a[1] - b[1]);
    
    const regions = regionQty.map(d => d[0]);
    const maxQty = d3.max(regionQty, d => d[1]);

    const x = d3.scaleLinear() 
        .domain([0, maxQty])
        .range([0, width])
        .nice();

    const y = d3.scaleBand() 
        .domain(regions)
        .range([height, 0]) 
        .padding(0.2);

    svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(","))); 

    svg.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
        .select(".domain").remove(); 

    svg.selectAll(".bar")
        .data(regionQty)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d[0])) 
        .attr("x", 0)  
        .attr("height", y.bandwidth())
        .attr("width", d => x(d[1]))
        .attr("fill", "var(--highlight-color)")
        .attr("opacity", 0.8);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Total Quantity Sold by Region");

    svg.selectAll(".bar")
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget).attr("opacity", 1);
        })
        .on("mouseout", (event, d) => {
            d3.select(event.currentTarget).attr("opacity", 0.8);
        });
}