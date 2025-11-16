document.addEventListener("DOMContentLoaded", () => {
    
    const BASE_API_URL = "https://ta5msscv98.execute-api.us-east-1.amazonaws.com/prod/";
    const API_ENDPOINTS = {
        kpi: `${BASE_API_URL}kpi`,
        monthlySales: `${BASE_API_URL}monthly-sales`,
        summary: `${BASE_API_URL}summary`,
        topProducts: `${BASE_API_URL}top-products`
    };

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");
    console.log("Dashboard cargado. Obteniendo datos...");

    const promises = [
        d3.json(API_ENDPOINTS.kpi),
        d3.json(API_ENDPOINTS.monthlySales),
        d3.json(API_ENDPOINTS.summary),
        d3.json(API_ENDPOINTS.topProducts)
    ];

    Promise.all(promises)
        .then(results => {
            const kpiData = results[0].kpis;
            const monthlySalesData = JSON.parse(results[1].body);
            const summaryData = JSON.parse(results[2].body);
            const topProductsData = JSON.parse(results[3].body);

            console.log("Datos de KPI:", kpiData);
            console.log("Datos de Ventas Mensuales:", monthlySalesData);
            console.log("Datos de Resumen:", summaryData);
            console.log("Datos de Top Productos:", topProductsData);
            
            renderKPIs(kpiData);
            renderTotalByRegion(summaryData, "#chart-1");
            renderTotalByCat(summaryData, "#chart-2");
            renderTopByRegion(topProductsData, "#chart-3");
            renderProfitByCat(summaryData, "#chart-4");
            renderMonthlySales(monthlySalesData, "#chart-5");
            renderHeatMap(summaryData, "#chart-6");

        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
            document.querySelector(".dashboard-container").innerHTML = 
                `<h2 style="color: red; text-align: center;">Error al cargar datos.</h2>`;
        }).finally(() => {
            console.log("Carga finalizada. Ocultando spinner.");
            loader.classList.add("hidden");
        });
});