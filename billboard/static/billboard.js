var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


class DrawAxes {
  constructor (generes) {
    // Select body, append SVG area to it, and set the dimensions
    var svg = d3.select("body")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    this.chartGroup = svg.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);  
    var barSpacing = 10; // desired space between each bar
    var scaleY = 40; // 10x scale on rect height

    this.yBandScale = d3.scaleBand()
      .domain(generes)
      .range([chartMargin.bottom, chartHeight])
      .padding(0.1);

    // Create a linear scale for the vertical axis.
    this.xLinearScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0,chartWidth]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var leftAxis = d3.axisLeft(this.yBandScale);
    var bottomAxis = d3.axisBottom(this.xLinearScale).ticks(10);

    this.chartGroup.append("g")
      .call(leftAxis);

    this.chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    //this.barGroup = this.chartGroup.selectAll("#chart");
    this.barGroup = this.chartGroup.selectAll("#chart").data(generes).enter()
    .append("rect")
    .classed("bar", true)
    .attr("x",0)
    .attr("height",this.yBandScale.bandwidth())
    .attr("y",  (g, j) => this.yBandScale(g))
    this.label1 = this.chartGroup.append("g").append("text").attr("x", 400).attr("y",300);
    this.label2 = this.chartGroup.append("g").append("text").attr("x", 350).attr("y",320);

    //return [chartGroup, xLinearScale, yBandScale];
  }// end constructor
} // end class draw_axes

function plot_one_year (index, all_data, axes, delay=0){
  axes.barGroup.exit().remove();
  axes.barGroup
  .transition().delay(function (c,j) {return index*delay}).duration(100)
  .attr("width", (g,j)=>axes.xLinearScale(all_data.all_counts[index][j]));
  axes.label1.transition().delay(function (c,j) {return index*delay})
  .text( all_data.all_years[index] );
  axes.label2.transition().delay(function (c,j) {return index*delay})
  .text( " Number of songs : " + all_data.num_songs[index]);
}// end plot_one_year


class  MusicData {
  constructor (billboard, generes) {
    this.all_counts = [];
    this.all_years = [];
    this.num_songs = [];
    billboard.forEach((data) => {
      var counts = {};
      var num_songs = 0;
      generes.forEach((tag)=>{counts[tag]=0});
      data["songs"].forEach((song)=>{
        num_songs++;
        if (song["tags"].length == 0) {
          counts["Unknown"] ++;
        }
        song["tags"].forEach((tag)=>{
          counts[tag] += 1;
        }); // for each tag
      }); //for each song
      var counts_array = generes.map(tag=>counts[tag])
      this.all_counts.push(counts_array);
      this.all_years.push(data["year"])
      this.num_songs.push(num_songs)
    }); // for each year
  }
} // end Class MusicData


function successfunction (billboard){
  //console.log("Billboard data: ", billboard);
  //billboard.forEach(process_year);
  d3.json("../aggregate_genres.json").then ((genere_data) => {
    generes = ["Unknown"];
    genere_data.forEach((d)=>{
      generes.push(Object.keys(d));
    });
    all_data = new MusicData(billboard, generes);
    axes = new DrawAxes(generes);
    console.log("Summary of billboard data:", all_data);
    auto_play();
  });
}

function auto_play() {
  // Globals!
  var delay =1000;
  axes.barGroup.interrupt();
  for (var i=0;i<all_data.all_counts.length;i++){
    plot_one_year(i, all_data, axes, 1000);
  }
}

function errorfunction(error){
  console.error("Cannot read json : ", error);
}


function draw_slider () {
  //from https://bl.ocks.org/mbostock/6452972
  var slider_width=960, slider_height=50;
  var svg = d3.select("#slider")
    .append("svg")
    .attr("height", slider_height)
    .attr("width", slider_width);
  var margin = {right: 50, left: 50},
    width = slider_width - margin.left - margin.right,
    height = slider_height;

  var x = d3.scaleLinear()
      .domain([1950, 2015])
      .range([0, width])
      .clamp(true);

  var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

  slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() { hue(x.invert(d3.event.x)); }));

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter().append("text")
      .attr("x", x)
      .attr("text-anchor", "middle")
      .text((d)=>d);

  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  function hue(h) {
    handle.attr("cx", x(h));
    var year = Math.trunc( h) 
    //svg.style("background-color", d3.hsl(h, 0.8, 0.8));
    var index = 0;
    for (var i=0; i<all_data.all_years.length; i++){
      if (all_data.all_years[i] == year) {
        index = i;
        break;
      }
    }
    axes.barGroup.interrupt();
    plot_one_year(index, all_data, axes);
    console.log("User selected : ", year);
  }
}
d3.json("../data.json").then(successfunction, errorfunction);
draw_slider();

