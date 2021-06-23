// Find our map id
var map = L.map("map", { editable: true });


//buildings
var buildingsData;
var url_buildings = "http://localhost:3010/api/v1/buildings";
async function getBuildings() {
  var res = await fetch(url_buildings);
  buildingsData = await res.json();
  console.log('building',buildingsData);
  L.geoJson(buildingsData, {
    style: buildingsStyle,
    onEachFeature: buildingOnEachFeature,
  }).addTo(map);
}

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 3,
    color: "black",
    fillColor: "red",
    fillOpacity: 0.2,
  });
}

//reset highlight
function resetHighlight(e) {
  buildingsData.resetStyle(e.target);
}

//onEachFeature
function buildingOnEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

//Colors for Field
function buildingsStyle(feature) {
  return {
    fillColor: "green",
    color: "white",
    weight: 3,
    opacity: 1,
    dashArray: 3,
    fillOpacity: 0.7,
  };
}
//roads
var roadsData;
var url_roads = "http://localhost:3010/api/v1/roads";
async function getRoads() {
  var res = await fetch(url_roads);
  var roadsData = await res.json();
  console.log('roads',roadsData);
  L.geoJson(roadsData).addTo(map);
}

function roadsStyle(feature) {
  return {
    fillColor: "maroon",
    color: "blacy",
    weight: 3,
    opacity: 1,
    dashArray: 3,
    fillOpacity: 0.7,
  };
}

//crimes
var crimeData;
var url_crime = "http://localhost:3010/api/v1/crimes";
async function getCrimeData() {
  var results = await fetch(url_crime);
  var crimeData = await results.json();
  console.log('crime',crimeData);

  L.geoJson(crimeData).addTo(map);
}



// Set open openstreetmap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
// Set our initial location and zoomlevel
map.setView([-6.67028, 146.99512], 16);


getRoads();
getBuildings();
getCrimeData();


//click events
var popup = L.popup();
function onMapClick(e) {
  const url="http://localhost:3010/api/v1/crimes";
  let data={latitude:e.latlng.lat,longitude:e.latlng.lng}
  
 const options={
  method:"POST",
  headers:{
      "Content-Type":"application/json"
  },
  body:JSON.stringify(data)
}

 console.log(data)

 fetch(url,options)
  popup
    .setLatLng(e.latlng)
    .setContent("<h2>I am here at</h2>" + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

//controls for the editable plugin
L.EditControl = L.Control.extend({
  options: {
    position: "topleft",
    callback: null,
    kind: "",
    html: "",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-control leaflet-bar"),
      link = L.DomUtil.create("a", "", container);

    link.href = "#";
    link.title = "Create a new " + this.options.kind;
    link.innerHTML = this.options.html;
    L.DomEvent.on(link, "click", L.DomEvent.stop).on(
      link,
      "click",
      function () {
        window.LAYER = this.options.callback.call(map.editTools);
      },
      this
    );

    return container;
  },
});

L.NewLineControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startPolyline,
    kind: "line",
    html: "\\/\\",
  },
});

L.NewPolygonControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startPolygon,
    kind: "polygon",
    html: "▰",
  },
});

L.NewMarkerControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startMarker,
    //kind: 'marker',
    kind: "Add Crime Location",
    html: "🖈",
  },
});

L.NewRectangleControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startRectangle,
    kind: "rectangle",
    html: "⬛",
  },
});

L.NewCircleControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startCircle,
    kind: "circle",
    html: "⬤",
  },
});

map.addControl(new L.NewMarkerControl());
map.addControl(new L.NewLineControl());
map.addControl(new L.NewPolygonControl());
map.addControl(new L.NewRectangleControl());
map.addControl(new L.NewCircleControl());











//test circle
// var circle = L.circle([-6.677, 146.999], {
//   color: "red",
//   fillColor: "#f03",
//   fillOpacity: 0.5,
//   radius: 500,
// }).addTo(map);

// circle.enableEdit();
// circle.on("dblclick", L.DomEvent.stop).on("dblclick", circle.toggleEdit);

// L.marker([-6.669941, 146.99552])
//   .addTo(map)
//   .bindPopup("Security Base.<br> in the campus.")
//   .openPopup();