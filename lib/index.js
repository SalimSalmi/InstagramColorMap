const fs = require("fs");
const getColors = require("get-image-colors");
const chroma = require("chroma-js"); // http://gka.github.io/chroma.js/#chroma-average
const csvWriter = require('csv-write-stream')
const writer = csvWriter({headers: ["city", "url", "Filter", "Created_Time", "Longitude", "Latitude", "Likes", "Comments", "color1", "color2", "color3", "color4", "color5"]})

var dataset = require("../data/unparsed-data");
writer.pipe(fs.createWriteStream('data/parsed-data3.csv'));

loopDataset(0);

// getting the the required data from the dataset and writing it out in a csv file
function loopDataset(index){
  for(let i = index; i < index+1000; i++){
    if(!dataset[i].Location) {
      continue;
    }

    getColors(dataset[i].Images.Thumbnail.Url, function(err, colors){
      if (err) {
        return;
      }

      let e = dataset[i];
      var result = [];
      
      result.push(e.city);
      result.push(e.Images.Thumbnail.Url);
      result.push(e.Filter);
      result.push(e.Created_Time);
      result.push(e.Location.Longitude);
      result.push(e.Location.Latitude);
      result.push(e.Likes.Count);
      result.push(e.Comments.Count);
      result.push(colors[0]);
      result.push(colors[1]);
      result.push(colors[2]);
      result.push(colors[3]);
      result.push(colors[4]);

      writer.write(result);
    });
  }

  // processing only 1000 data each 15 seconds , because of the request being blocked if there are too many at once
  setTimeout(function(){
    if(index === dataset.length) {
      writer.end();
    } else {
      index = index += 1000;
      if(index > dataset.length) {index = dataset.length;}
      loopDataset(index);
    }
  }, 15000);
}
