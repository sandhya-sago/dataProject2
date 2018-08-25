
var allTimePlayback = "/allTimePlaymetadata/";
d3.json(allTimePlayback).then(function(response) {
console.log(response)
var Trace1 = 
  {
    x: response.Genre,
    y: response.allTimePlays,
    hovertext: response.allTimePlays,
    type: 'bar',
    //opacity: 0.5,
    marker: {
      color: 'rgba(222,45,38,0.8)'}
  }; 
var layout = {
  title: 'SoundCloud All Time Play Trends',
  paper_bgcolor: "rgba(0,0,0,0)",
  bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor : "rgba(0,0,0,0)",
  yaxis: {
    type: 'log',
    autorange: true
  }
};
Plotly.newPlot('myDiv', [Trace1], layout);
})

var weeklyPlayback = "/weeklyPlaymetadata/";
d3.json(weeklyPlayback).then(function(response) {
console.log(response)
var Trace2 = 
  {
    x: response.Genre,
    y: response.weeklyPlays,
    hovertext: response.weeklyPlays,
    type: 'bar',
//    opacity: 0.5,
    marker: {
      color: 'rgba(58,200,225,.8)'}
  };
  var layout = {
    title: 'SoundCloud Weekly Play Trends',
    paper_bgcolor: "rgba(0,0,0,0)",
    bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor : "rgba(0,0,0,0)",
    yaxis: {
      type: 'log',
      autorange: true
    }
  };  
  Plotly.newPlot('myDiv2', [Trace2], layout);
});
