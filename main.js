
(function (){
  let busIcon = L.icon({iconUrl: 'bus-icon.png', iconSize: [60,60],iconAnchor:[30,30]});
  let map = L.map('theMap').setView([44.650627, -63.597140], 14);
  busLayer = L.geoJSON (null, {pointToLayer: function (feature, latlng){
    return L.marker(latlng,
      {
        icon: busIcon,
        rotationAngle : feature.properties.bearing
      }).bindPopup(`<b>Bus:${feature.properties.busRoute}<b>`).openPopup();
  }}).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
  }).addTo(map);
  setInterval (moment,3000,map);

})();



  function generateGeoFromLatLong (lat,long,bearing,vehicleId,busId)
  {
    return({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [long,lat]
      },
      'properties': {
        'name': 'NSCC IT',
        'vehicle': vehicleId,
        'bearing': bearing,
        'busRoute': busId      
    }
  })
}

  function moment(map)
  {

    fetch('http://hrmbusapi.herokuapp.com')
    .then(res=>res.json())
    .then(json=>{
      busLayer.clearLayers();
      json.entity.filter(x=>x.vehicle.trip.routeId<11).map(el=>{
        const lat = el.vehicle.position.latitude;
        const long = el.vehicle.position.longitude;
        const bearing = el.vehicle.position.bearing;
        const vehicleId = el.vehicle.id;
        const busId = el.vehicle.trip.routeId;
        busLayer.addData(generateGeoFromLatLong(lat,long,bearing,vehicleId,busId));
      })
    })
  }
