// Initialize and add the map
function initMap() {
    // The location of State College
    const state_college = { lat: 40.799672, lng: -77.862339 };
    // The map, centered state College
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: state_college,
    });
    d3.csv("data/PSU_ReportedCrimes.csv").then((data) => {
        for (var i = 0; i < data.length; i++) {
            var point = {lat: Number(data[i].Latitude), lng: Number(data[i].Longitude)};
            var marker = new google.maps.Marker({
                position: point,
                map: map,

            });

            const contentString =
                "<b>Date</b>: " + data[i].Date + '<br><br>'+
                "<b>From</b>: " + data[i].From + '<br><br>'+
                "<b>To</b>: " + data[i].To + '<br><br>'+
                "<b>Content</b>: " + data[i].Content + '<br><br>'+
                "<b>Offenses</b>: " + data[i].Offenses + '<br><br>'+
                "<b>Location</b>: " + data[i].Location + '<br><br>'+
                "<b>Latitude</b>: " + data[i].Latitude + '<br><br>'+
                "<b>Longitude</b>: " + data[i].Longitude;

            const infowindow = new google.maps.InfoWindow({content: contentString});

            //creates an infowindow 'key' in the marker.
            marker.infowindow = infowindow;

            //finally call the explicit infowindow object
            marker.addListener('click', function() {
                return this.infowindow.open(map, this);
            })

            // Alternate way of adding infowindow listeners
            google.maps.event.addListener(marker, 'click', function() {
                this.infowindow.open(map, this);
            });


        }
    });
}