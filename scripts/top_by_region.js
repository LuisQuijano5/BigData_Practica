function renderTopByRegion(data, selector) {

    

    const container = d3.select(selector);

    const svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 400 350"); 

    svg.append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("class", "placeholder-text") 
        .text("Gráfica 1");
}