import * as d3 from 'https://unpkg.com/d3?module'
// data is from https://www.kaggle.com/datasets/sudheerp2147234/salary-dataset-based-on-country-and-race?resource=download

// 1. Access Data
async function drawScatter() {
    const data = await d3.csv("salary_Data.csv");
    console.log(data);

    const xAccessor = d => +d['Years of Experience']
    const yAccessor = d => +d.Salary
    console.log(Math.max(yAccessor))
    const colorAccessor = d => d['Education Level']
    const filteredData = data.filter(d => d.Salary && d.Salary !== 0)
    // console.log(colorAccessor(data[1]))

// 2. Create chart dimensions 

    const width = d3.min([
        window.innerWidth*0.90, 
        window.innerHeight*0.90,
    ])

    const dimensions = {
        width, 
        height: width, 
        margins: {
            top: 10, 
            right: 10, 
            left: 80, 
            bottom: 50,
        }
    }

    dimensions.boundedWidth = dimensions.width
    - dimensions.margins.right - dimensions.margins.left

    dimensions.boundedHeight= dimensions.height
    - dimensions.margins.top - dimensions.margins.bottom

// 3. Draw canvas

    const wrapper = d3.select("#wrapper")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
    // console.log(wrapper)
        
    const bounds = wrapper.append("g")
        .style("transform", `translate(${
        dimensions.margins.left
        }px, ${
        dimensions.margins.top
        }px)`)
        console.log(bounds)

//4. Create scales
    
    const xScale= d3.scaleLinear()
        .domain(d3.extent(data,xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice();

    const yScale= d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice();
        

    const educationLevels = [...new Set(data.map((d) => colorAccessor))]
    const colorScale = d3.scaleOrdinal()
        .domain(educationLevels)
        .range(["#f72585","#4361ee","#fb8b24"]);
    
//5. Draw data 
    const dots = bounds.selectAll("circle")
        .data(filteredData)
        .enter().append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5)
        .attr("fill", d=> colorScale(colorAccessor(d)))
        .attr("stroke", "none")

//6. Draw peripherals
    const xAxisGenerator = d3.axisBottom() 
        .scale(xScale)
    
    const xAxis= bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${
        dimensions.boundedHeight
         }px)`)
        .style("font-family","Red Hat Mono")

    const xAxisLabel = xAxis.append("text")
         .attr("x", dimensions.boundedWidth / 2)
         .attr("y", dimensions.margins.bottom - 10)
         .html("Years of Experience")
         .attr("fill", "white")
         .style("font-size", "1.4em")

    const yAxisGenerator = d3.axisLeft() 
        .scale(yScale)
        
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
        .style("font-family","Red Hat Mono")

    const yAxisLabel = yAxis.append("text")
         .attr("fill","white")
         .html("Salary")
         .attr("x", -dimensions.boundedHeight / 2)
         .attr("y", -dimensions.margins.left +10)
         .style("transform", "rotate(-90deg)")
         .style("font-size", "1.4em")
         .style("text-anchor", "middle")

         

  
        

}

drawScatter()