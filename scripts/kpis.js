function renderKPIs(data) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    d3.select("#kpi-1")
        .html(`
            <h2>${data.total_sales}</h2>
            <p>TOTAL SALES</p>
        `);
        
    d3.select("#kpi-2")
        .html(`
            <h2>${formatter.format((data.avg_sale_amount).toFixed(2))}</h2>
            <p>AVERAGE PROFITS</p>
        `);
}