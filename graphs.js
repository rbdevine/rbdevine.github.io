window.addEventListener( "load", makeC02Graph );
window.addEventListener( "load", makeTempGraph );
document.addEventListener("DOMContentLoaded",function(e) {
   var tabs = document.getElementsByClassName('tablinks');
   console.log("blah")
   console.log(tabs)
   console.log(tabs.length)
   for (var i = 0; i < tabs.length; i++) {
      console.log("adding click for:")
      console.log(tabs[i])
      tabs[i].addEventListener('click', openScene, false);
   }
});

async function makeC02Graph() {
   const data = await d3.csv('energy-use-C02-world.csv')
   const minYear = d3.min(data, function(d) { return d.Year; });
   const maxYear = d3.max(data, function(d) { return d.Year; });
   const minC02 = d3.min(data, function(d) { return d["CO2 (kt)"]; });
   const maxC02 = d3.max(data, function(d) { return d["CO2 (kt)"]; });
   //var margin = {top: 100, right: 100, bottom: 100, left: 100}
   //, width = window.innerWidth - margin.left - margin.right // Use the window's width
   //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
   const margin = 100
   const width = 400
   const height = 200
   var svg = d3.select("#Scene1SVG")
   
   var x = d3.scaleLinear().domain([minYear,maxYear]).range([0,width])
   var y = d3.scaleLinear().domain([minC02,maxC02]).range([height,0])

   //d3.select("#TokyoSVG").append("g").attr("class", "y axis")
   svg.append("g").attr("class", "y axis")
      .attr("transform","translate("+margin+","+margin+")")
      .call(d3.axisLeft(y).tickFormat(function(d){return d/1000000 }))

   svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+margin+","+300+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))

   /*
   svg.append("g")
      .attr("transform","translate("+margin+","+margin+")")
      .selectAll().data(data).enter().append("circle")
      .attr("cx",function(d){return x(d.Year);})
      .attr("cy",function(d){return y(d["CO2 (kt)"]);})
      .attr("r",1)}
*/

   line = d3.line()
      .x(function(d,i) { return x(d.Year); })
      .y(function(d) { return y(d["CO2 (kt)"]);})
      .curve(d3.curveMonotoneX);

   /* draw line */
   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform","translate("+margin+","+margin+")")
      .attr("d", line);

   // Features of the annotation
   const annotations = [
      {
	 note: {
	    label: "Here is the annotation label",
	    title: "Annotation title"
	 },
	 x: 200,
	 y: 200,
	 dy: 100,
	 dx: 100
      }
   ]

   // Add annotation to the chart
   const makeAnnotations = d3.annotation()
	 .annotations(annotations)

   //d3.select("#General")
   //svg.append("g")
   //   .call(makeAnnotations)      
}

async function makeTempGraph() {
   console.log("makeTempGraph()")
   const data = await d3.csv('epa-earth-temp.csv')
   var minYear = d3.min(data, function(d) { return d.Year; });
   var maxYear = d3.max(data, function(d) { return d.Year; });
   var minC02 = d3.min(data, function(d) { return +d["Earth's surface (land and ocean)"]; });
   var maxC02 = d3.max(data, function(d) { return +d["Earth's surface (land and ocean)"]; });
   console.log(minC02)
   console.log(maxC02)
   //var margin = {top: 100, right: 100, bottom: 100, left: 100}
   //, width = window.innerWidth - margin.left - margin.right // Use the window's width
   //, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
   margin = 100
   var width = 400
   var height = 200
   var x = d3.scaleLinear().domain([minYear,maxYear]).range([0,width])
   var y = d3.scaleLinear().domain([minC02,maxC02]).range([height,0])

   var svg = d3.select("#Scene2SVG")

   svg.append("g").attr("class", "y axis")
      .attr("transform","translate("+margin+","+margin+")")
      .call(d3.axisLeft(y).tickFormat(function(d){return d }))

   svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+margin+","+300+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))

   line = d3.line()
      .x(function(d,i) { return x(d.Year); })
      .y(function(d) { return y(d["Earth's surface (land and ocean)"]);})
      .curve(d3.curveMonotoneX);

   /* draw line */
   svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("transform","translate("+margin+","+margin+")")
      .attr("d", line);
}

function openScene(e) {
  const sceneName = e.currentTarget.id
   //this.id
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
   document.getElementById(sceneName+"Content").style.display = "block";
   e.currentTarget.className += " active";
  //evt.currentTarget.className += " active";
} 
