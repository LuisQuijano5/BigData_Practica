function renderKPIs(data) {
    const totalSales = d3.sum(data, d => d.total_sales);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const avgProfitMargin = d3.mean(data, d => d.avg_profit_margin);

    
    d3.select("#kpi-1")
        .html(`
            <h2>${formatter.format(totalSales)}</h2>
            <p>TOTAL SALES</p>
        `);
        
    d3.select("#kpi-2")
        .html(`
            <h2>${(avgProfitMargin * 100).toFixed(2)}%</h2>
            <p>AVERAGE PROFITS</p>
        `);
}