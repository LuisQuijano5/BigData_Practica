document.addEventListener("DOMContentLoaded", () => {
    
    const BASE_API_URL = "https://ta5msscv98.execute-api.us-east-1.amazonaws.com/prod/";
    const LIVE_ENDPOINTS = {
        kpi: `${BASE_API_URL}kpi`,
        monthlySales: `${BASE_API_URL}monthly-sales`,
        summary: `${BASE_API_URL}summary`,
        topProducts: `${BASE_API_URL}top-products`
    };

    const LOCAL_ENDPOINTS = {
        kpi: "./static_data/kpi.json",
        monthlySales: "./static_data/monthly-sales.json",
        summary: "./static_data/summary.json",
        topProducts: "./static_data/top-products.json"
    };

    function processAndRender(results, isLiveData = false) {
        let kpiData, monthlySalesData, summaryData, topProductsData;

        try {
            if (isLiveData) {
                kpiData = results[0].kpis;
                monthlySalesData = JSON.parse(results[1].body);
                summaryData = JSON.parse(results[2].body);
                topProductsData = JSON.parse(results[3].body);
            } else {
                kpiData = results[0];
                monthlySalesData = results[1];
                summaryData = results[2];
                topProductsData = results[3];
            }

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

        } catch (parseError) {
            console.error("Error al parsear los datos:", parseError, results);
            showFatalError("Error al procesar los datos.");
        }
    }

    function showFatalError(message) {
        document.querySelector(".dashboard-container").innerHTML = 
            `<h2 style="color: red; text-align: center;">${message}</h2>`;
    }

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");
    console.log("Dashboard cargado. Obteniendo datos...");

    const livePromises = [
        d3.json(LIVE_ENDPOINTS.kpi),
        d3.json(LIVE_ENDPOINTS.monthlySales),
        d3.json(LIVE_ENDPOINTS.summary),
        d3.json(LIVE_ENDPOINTS.topProducts)
    ];

    Promise.all(livePromises)
        .then(liveResults => {
            console.log("Datos cargados desde la API en vivo.");
            processAndRender(liveResults, true)

        })
        .catch(apiError => {
            console.warn("Falló la API en vivo. Intentando fallback local.", apiError);
            
            alert("No se pudo conectar a la API de Learners Lab. Se cargarán datos de demostración estáticos.");

            const localPromises = [
                d3.json(LOCAL_ENDPOINTS.kpi),
                d3.json(LOCAL_ENDPOINTS.monthlySales),
                d3.json(LOCAL_ENDPOINTS.summary),
                d3.json(LOCAL_ENDPOINTS.topProducts)
            ];

            Promise.all(localPromises)
                .then(localResults => {
                    console.log("Datos cargados desde archivos estáticos locales.");
                    processAndRender(localResults, false); 
                })
                .catch(localError => {
                    console.error("Error fatal: Falló la API y también los archivos locales.", localError);
                    showFatalError("Error: No se pudieron cargar los datos.");
                });
        })
        .finally(() => {
            console.log("Carga finalizada. Ocultando spinner.");
            loader.classList.add("hidden");
        });
});