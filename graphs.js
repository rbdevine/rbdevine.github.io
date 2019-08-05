window.addEventListener( "load", loadFirstScene );
document.addEventListener("DOMContentLoaded",function(e) {
   var tabs = document.getElementsByClassName('scenelink');
   console.log("blah")
   console.log(tabs)
   console.log(tabs.length)
   for (var i = 0; i < tabs.length; i++) {
      console.log("adding click for:")
      console.log(tabs[i])
      tabs[i].addEventListener('click', openScene, false);
   }
});

async function makeTempGraph() {
   console.log("makeTempGraph()")
   const data = await d3.csv('epa-earth-temp.csv')
   const yfield = "Earth's surface (land and ocean)"
   var minYear = d3.min(data, function(d) { return +d.Year; });
   var maxYear = d3.max(data, function(d) { return +d.Year; }) + 8;
   var minC02 = d3.min(data, function(d) { return +d[yfield]; });
   var maxC02 = d3.max(data, function(d) { return +d[yfield]; });
   console.log("MAX YEAR: " + maxYear)
   console.log(minC02)
   console.log(maxC02)
   var margin = {top: 50, right: 50, bottom: 50, left: 100}
   var svg = d3.select("#Graph")
   svg.attr("class","tempSVG")
   const width = parseInt(svg.style("width")) - margin.top - margin.bottom
   const height = parseInt(svg.style("height")) - margin.left - margin.right
   var x = d3.scaleLinear().domain([minYear,maxYear]).range([0,width])
   var y = d3.scaleLinear().domain([minC02,maxC02]).range([height,0])

   svg.append("g").attr("class", "y axis")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .call(d3.axisLeft(y).tickFormat(function(d){return d }))

   svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+(margin.left)+","+((margin.top)+height)+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))

   // text label for the y axis
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (margin.left/2))
      .attr("x", -(margin.top + height/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yfield + " (ºC)");

   // text label for the x axis
   svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + margin.left) + " ," + 
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Year");
   
   line = d3.line()
      .x(function(d,i) { return x(d.Year); })
      .y(function(d) { return y(d[yfield]);})
      .curve(d3.curveMonotoneX);

   /* draw line */
   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .attr("d", line);

   var div = d3.select("body").append("div")	
       .attr("class", "tooltip")				
       .style("opacity", 0);

   svg.append("g")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .selectAll().data(data).enter().append("circle")
      .attr("cx",function(d){return x(d.Year);})
      .attr("cy",function(d){return y(d[yfield]);})
      .attr("r",3)
      .on("mouseover", function(d) {		
	 div.transition()		
	    .duration(200)		
            .style("opacity", .9);
	 div.html(d[yfield] + " &#8451;</br>" + d.Year)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
      })			
      .on("mouseout", function(d) {		
         div.transition()		
            .duration(500)		
            .style("opacity", 0);	
      });


   const annotations = [
      {
	 note: {
	    label: "Nature's capacity to absorb CO2 exceeded",
	    lineType:"none",
 	    orientation:"leftRight",
	    "align":"top"
	 },
	 className: "co2annotate",
	 type: d3.annotationCalloutCircle,
	 subject: { radius: 15 },
	 data: { x: 1974, y: -0.126 },
	 dy: -120
	 }
      ]

   // Add annotation to the chart
   const makeAnnotations = d3.annotation()
	 .accessors({
	    x: function(d){ return x(d.x) + margin.left },
	    y: function(d){ return y(d.y) + margin.top }
	 })
	 .annotations(annotations)
    
   d3.select("#Graph").append("g")
      .call(makeAnnotations)
}

async function makeGlacierGraph() {
   const yfield = "Mean cumulative mass balance"
   const data = await d3.csv('epa-glacier-mass.csv')
   const minYear = d3.min(data, function(d) { return +d.Year; });
   const maxYear = d3.max(data, function(d) { return +d.Year; }) + 2;
   const minMass = d3.min(data, function(d) { return +d[yfield]; });
   const maxMass = d3.max(data, function(d) { return +d[yfield]; });
   const margin = {top: 50, right: 50, bottom: 50, left: 100}
   //, width = window.innerWidth - margin.left - margin.right // Use the window's width
   //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
   var svg = d3.select("#Graph")
   svg.attr("class","glacierSVG")
   const width = parseInt(svg.style("width")) - margin.top - margin.bottom
   const height = parseInt(svg.style("height")) - margin.left - margin.right
   var x = d3.scaleLinear().domain([minYear,maxYear]).range([0,width])
   var y = d3.scaleLinear().domain([minMass,maxMass]).range([height,0])

   svg.append("g").attr("class", "y axis")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .call(d3.axisLeft(y).tickFormat(function(d){return d }))

   svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+(margin.left)+","+((margin.top)+height)+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))

   // text label for the y axis
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (margin.left/2 - 10))
      .attr("x", -(margin.top + height/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Mean cumulative mass balance (meters)");

   // text label for the x axis
   svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + margin.left) + " ," + 
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Year");


   line = d3.line()
      .x(function(d,i) { return x(d.Year); })
      .y(function(d) { return y(d[yfield]);})
      .curve(d3.curveMonotoneX);

   /* draw line */
   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .attr("d", line);

   var div = d3.select("body").append("div")	
       .attr("class", "tooltip")				
       .style("opacity", 0);

   svg.append("g")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .selectAll().data(data).enter().append("circle")
      .attr("cx",function(d){return x(d.Year);})
      .attr("cy",function(d){return y(d[yfield]);})
      .attr("r",3)
      .on("mouseover", function(d) {		
	 div.transition()		
	    .duration(200)		
            .style("opacity", .9);
	 div.html(d[yfield] + "</br>" + d.Year)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
      })			
      .on("mouseout", function(d) {		
         div.transition()		
            .duration(500)		
            .style("opacity", 0);	
      });
}

async function makeSeaLevelGraph() {
   const data = await d3.csv('epa-sea-level.csv')
   const yfield = "CSIRO - Adjusted sea level (inches)";
   const minYear = d3.min(data, function(d) { return +d.Year; });
   const maxYear = d3.max(data, function(d) { return +d.Year; }) + 3;
   const minMass = d3.min(data, function(d) { return +d[yfield]; });
   const maxMass = d3.max(data, function(d) { return +d[yfield]; });
   const margin = {top: 50, right: 50, bottom: 50, left: 100}
   //, width = window.innerWidth - margin.left - margin.right // Use the window's width
   //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
   var svg = d3.select("#Graph")
   svg.attr("class","sealevelSVG")
   const width = parseInt(svg.style("width")) - margin.top - margin.bottom
   const height = parseInt(svg.style("height")) - margin.left - margin.right
   var x = d3.scaleLinear().domain([minYear,maxYear]).range([0,width])
   var y = d3.scaleLinear().domain([minMass,maxMass]).range([height,0])

   svg.append("g").attr("class", "y axis")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .call(d3.axisLeft(y).tickFormat(function(d){return d }))

   svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+(margin.left)+","+((margin.top)+height)+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))

   // text label for the y axis
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (margin.left/2 - 10))
      .attr("x", -(margin.top + height/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yfield);

   // text label for the x axis
   svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + margin.left) + " ," + 
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Year");

   line = d3.line()
      .x(function(d,i) { return x(d.Year); })
      .y(function(d) { return y(d[yfield]);})
      .curve(d3.curveMonotoneX);

   /* draw line */
   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .attr("d", line);

   var div = d3.select("body").append("div")	
       .attr("class", "tooltip")				
       .style("opacity", 0);

   var format2dec = d3.format(".2f")
   
   svg.append("g")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .selectAll().data(data).enter().append("circle")
      .attr("cx",function(d){return x(d.Year);})
      .attr("cy",function(d){return y(d[yfield]);})
      .attr("r",2)
      .on("mouseover", function(d) {		
	 div.transition()		
	    .duration(200)		
            .style("opacity", .9);
	 div.html(format2dec(d[yfield]) + " inches</br>" + d.Year)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
      })			
      .on("mouseout", function(d) {		
         div.transition()		
            .duration(500)		
            .style("opacity", 0);	
      });
}

function loadFirstScene(e) {
   openSelectedScene("Scene1")
}

function openSelectedScene(sceneName) {
   console.log("loading " + sceneName )
   var i, divs, links;

   divs = document.getElementsByClassName("scenetext");
   for (i = 0; i < divs.length; i++) {
      divs[i].style.display = "none";
   }

   links = document.getElementsByClassName("scenelink");
   for (i = 0; i < links.length; i++) {
      links[i].className = links[i].className.replace(" active", "");
   }

   document.getElementById(sceneName+"Content").style.display = "block";
   d3.selectAll("#Graph > *").remove()
   document.getElementById(sceneName).className += " active";

   switch(sceneName) {
   case "Scene1":
      makeC02Graph(false)
      break;
   case "Scene2":
      makeC02Graph(true)
      break;
   case "Scene3":
      makeTempGraph()
      break;
   case "Scene4":
      makeGlacierGraph()
      break;
   case "Scene5":
      makeSeaLevelGraph()
      break;
   case "Scene6":
      break;
   }
}

function openScene(e) {
   const sceneName = e.currentTarget.id
   openSelectedScene(sceneName)
}

async function makeC02Graph(annotate) {
   const data = await d3.csv('energy-use-C02-world.csv')
   const yfield = "CO2 (kt)"
   const minYear = d3.min(data, function(d) { return +d.Year; });
   const maxYear = d3.max(data, function(d) { return +d.Year; })+2;
   const minC02 = d3.min(data, function(d) { return +d[yfield]; });
   const maxC02 = d3.max(data, function(d) { return +d[yfield]; });
   const margin = {top: 50, right: 50, bottom: 50, left: 100}
   //, width = window.innerWidth - margin.left - margin.right // Use the window's width
   //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
   var svg = d3.select("#Graph")
   svg.attr("class","co2SVG")
   const width = parseInt(svg.style("width")) - margin.top - margin.bottom
   const height = parseInt(svg.style("height")) - margin.left - margin.right
   var x = d3.scaleLinear().domain([minYear,maxYear]).range([0,width])
   var y = d3.scaleLinear().domain([minC02,maxC02]).range([height,0])

   svg.append("g").attr("class", "y axis")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .call(d3.axisLeft(y).tickFormat(function(d){return d/1000000 }))

   svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+(margin.left)+","+((margin.top)+height)+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
   
   // text label for the y axis
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (margin.left/2))
      .attr("x", -(margin.top + height/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Total CO2 Emissions (Gigaton)");

   // text label for the x axis
   svg.append("text")             
      .attr("transform",
            "translate(" + (width/2 + margin.left) + " ," + 
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Year");

   var div = d3.select("body").append("div")	
       .attr("class", "tooltip")				
       .style("opacity", 0);

   svg.append("g")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .selectAll().data(data).enter().append("circle")
      .attr("cx",function(d){return x(d.Year);})
      .attr("cy",function(d){return y(d[yfield]);})
      .attr("r",3)
      .on("mouseover", function(d) {		
	 div.transition()		
	    .duration(200)		
            .style("opacity", .9);
	 div.html(parseInt(d[yfield]/1000000) + " Gigaton </br>" + d.Year)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
      })					
      .on("mouseout", function(d) {		
         div.transition()		
            .duration(500)		
            .style("opacity", 0);	
      });;
   
   line = d3.line()
      .x(function(d,i) { return x(d.Year); })
      .y(function(d) { return y(d["CO2 (kt)"]);})
      .curve(d3.curveMonotoneX);

   /* draw line */
   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
      .attr("d", line);

   if( annotate ) {
      co2allowance = d3.line()
	 .x(function(d,i) { return x(d.Year); })
	 .y(function(d) { return y(17000000);})
	 .curve(d3.curveMonotoneX);

      svg.append("path")
	 .datum(data)
	 .attr("class", "co2allowanceline")
	 .attr("transform","translate("+(margin.left)+","+(margin.top)+")")
	 .attr("d", co2allowance);

      const annotations = [
	 {
	    note: {
	       label: "Nature's capacity to absorb CO2 exceeded",
	       lineType:"none",
	       orientation:"leftRight",
	       "align":"top"
	    },
	    className: "co2annotate",
	    type: d3.annotationCalloutCircle,
	    subject: { radius: 15 },
	    data: { x: 1975.3, y: 17000000 },
	    dy: -100
	 }
      ]

      // Add annotation to the chart
      const makeAnnotations = d3.annotation()
	    .accessors({
	       x: function(d){ return x(d.x) + margin.left },
	       y: function(d){ return y(d.y) + margin.top }
	    })
	    .annotations(annotations)
    
      d3.select("#Graph").append("g")
	 .call(makeAnnotations)
   }
}
