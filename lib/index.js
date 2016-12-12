
const getColors = require("get-image-colors");
const chroma = require("chroma-js"); // http://gka.github.io/chroma.js/#chroma-average

var dataset = require("../data/unparsed-data");


var cityNames = {};
for(let i = 0; i < dataset.length; i++){
  if(!cityNames.hasOwnProperty(dataset[i].city)) {
    cityNames[dataset[i].city] = {
      Longitude: dataset[i].Location.Longitude,
      Latitude: dataset[i].Location.Latitude
    }
  }
}
console.log(cityNames);

getColors(dataset[0].Images.Thumbnail.Url, function(err, colors){

  if (err) {
    console.error(err);
  }

  console.log(dataset[0].Images.Thumbnail.Url);
  console.log(colors);

  console.log(colors.map(color => color.hex()));
  console.log(chroma.average(colors).hex());
})
