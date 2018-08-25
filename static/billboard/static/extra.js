/*d3.json("../aggregate_genres.json").then ((genere_data) => {
  generes = ["Unknown"];
  genere_map = {};
  genere_data.forEach((d)=>{
    tag = Object.keys(d)[0];
    generes.push(tag);
    Object.values(d).forEach((sublist)=> {
      sublist.forEach((s)=>{genere_map[s] = tag});
    }); 
  });
  //console.log("Reverse genere map: ", genere_map);
  all_data = new YearlyMusicData();
  for (y=1950;y<2016;y++) {
    file = "data/years/"+ y +'.json';
    d3.json(file).then((year_data)=>{
      all_data.update(year_data, y, genere_map, generes);
    }, errorfunction);
  } // for each file
  axes = new DrawAxes(generes);
  auto_play();
  generes_line(all_data, generes);
  console.log("All billboard data:", all_data);
});*/

class  YearlyMusicData {
    constructor() {
      this.all_counts = [];
      this.all_years = [];
      this.num_songs = [];
    }
    update(year_data, year, genere_map, generes) {
      var counts = {};
      var num_songs = 0;
      generes.forEach((tag)=>{counts[tag]=0});
      year_data.forEach((song) => {
          num_songs++;
          song["tags"].forEach((subtag)=>{
            if (genere_map[subtag]) {
              counts[genere_map[subtag]] ++;
            } else {
              //console.log("No genere mapping found for: ", subtag);
            }
          }); // for each subtag
          if (d3.sum(Object.values(counts)) == 0 ){
            // Could not identify even one tag
            counts["Unknown"] ++;
          }
        }); //for each song
        var counts_array = generes.map(tag=>counts[tag])
        this.all_counts.push(counts_array);
        this.all_years.push(year);
        this.num_songs.push(num_songs);
    } // end update
  } // end Class MusicData
  