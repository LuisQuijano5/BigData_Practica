function renderProfitByCat(data, selector) {
    d3.select(selector).html("");

    const margin = {top: 50, right: 30, bottom: 60, left: 80};
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

    const profitMargin = d3.rollups(data, 
        v => d3.mean(v, d => d.avg_profit_margin), 
        d => d.category
    );
    
    profitMargin.sort((a, b) => b[1] - a[1]);
    
    const categories = profitMargin.map(d => d[0]);
    const maxMargin = d3.max(profitMargin, d => d[1]);

    const x = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, maxMargin]) 
        .range([height, 0])
        .nice();

    const xAxis = svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
        
    if (categories.length > 4) {
        xAxis.selectAll("text")
            .attr("transform", "rotate(-30)")
            .attr("text-anchor", "end");
    }

    svg.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".1%"))); 

    svg.selectAll(".bar")
        .data(profitMargin)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[1]))
        .attr("fill", "#ffc107") 
        .attr("opacity", 0.8);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Average Profit Margin by Category");


    svg.selectAll(".bar")
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget).attr("opacity", 1);
        })
        .on("mouseout", (event, d) => {
            d3.select(event.currentTarget).attr("opacity", 0.8);
        });
}