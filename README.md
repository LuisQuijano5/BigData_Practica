# Practica Competencia 2

**Alumno:** *[Luis Angel Quijano Guerrero]*  
**Materia:** *[BigData]*  
**Fecha:** *[15/11/2025]*  

---

## Descripción General

Esta practica implementa un flujo completo **ETL** utilizando servicios de AWS, con el objetivo de procesar datos de ventas, generar transformaciones analíticas y exponer la información mediante una **API REST** y un **Dashboard web** construido con D3.js.

El flujo incluye:

- Extracción del dataset original desde **Amazon S3**
- Uso de **AWS Glue Crawler**
- Transformaciones con **AWS Glue ETL (Notebooks)**
- Carga a **tablas DynamoDB**
- Exposición de datos mediante **AWS Lambda + API Gateway**
- Visualización usando **un Dashboard interactivo con D3.js**

---

## Arquitectura General

1. **S3 (Raw Layer)**  
   Se almacena el archivo `sales_data.csv` en la carpeta `/raw/`.

2. **AWS Glue**  
   - Crawler genera la base de datos `salesdb`.
   - Notebook PySpark ejecuta transformaciones:
     - Limpieza y enriquecimiento del dataset.
     - Tabla agregada: `sales_summary`.
     - Top 5 productos por región.
     - Ventas mensuales.
     - KPIs básicos.

3. **DynamoDB**  
   Se generan las siguientes tablas:
   - `sales_summary`
   - `top_products_by_region`
   - `monthly_sales`

4. **API REST (AWS Lambda + API Gateway)**  
   - Endpoints GET para consultar cada tabla.

5. **Dashboard Web (D3.js)**  
   Visualizaciones:
   - Total de ventas por categoría.
   - Promedio de margen de ganancia por categoría.
   - Cantidad total vendida por región.
   - Top 5 productos por región.
   - Ventas mensuales.
   - KPIs clave.

---

## Transformaciones Clave (ETL)

El Glue Notebook ejecuta:

- **Limpieza y estandarización**:
  - Campos en mayúsculas/minúsculas.
  - Eliminación de nulos.

- **Campos derivados**:
  - `total_revenue`
  - `profit_margin`

- **Agregación principal** → tabla `sales_summary`
  - Ventas totales
  - Promedio de margen
  - Cantidad vendida
  - Número de ventas únicas

- **Top 5 productos por región** → tabla `top_products_by_region`

- **Ventas mensuales** → tabla `monthly_sales`

- **KPIs**:
  - `total_sales_amount`
  - `avg_sale_amount`

---

## API REST (Lambda + API Gateway)

Se implementaron 4 Lambdas:

- `/sales-summary`
- `/top-products`
- `/monthly-sales`
- `/kpi`

---

## Dashboard (D3.js)

El dashboard muestra de forma dinámica:

- Barras -> ventas por categoría  
- Barras -> margen de ganancia promedio  
- Barras -> ventas por región  
- Tabla -> top 5 productos por región  
- Acumuladas -> ventas mensuales  
- KPIs 

---

## Requisitos

- AWS Academy o cuenta AWS
- Servicios usados:
  - S3
  - Glue
  - Lambda
  - DynamoDB
  - API Gateway
- HTML/JS para el dashboard

---


