/*
 * Constructor for MapView
 */
var MapView  = function() {
  this.name = ko.observable("Map");
  var mapViewSelf = this;

  mapViewSelf.currentMarker = ko.observable();
  mapViewSelf.setCurrentMarker = function(marker) {mapViewSelf.currentMarker(marker)};

  /*
   * This array is necessary to delegate the event from the
   * location link element to the marker element event.
   */

  mapViewSelf.markerTitleToMarkerInstanceMap = new Array();
  mapViewSelf.delegateToMarker = function() {
   // Get the marker instance and fire a click event
   // to open the streetview panorama
   var theMarker = mapViewSelf.markerTitleToMarkerInstanceMap[this.name];
  google.maps.event.trigger(theMarker, 'click');
  };

  mapViewSelf.query = ko.observable('');

  /** The points observable array holds the location data
   *  to support the google map and panorama API
   */

  mapViewSelf.points = ko.observableArray([
    {name:"Grand Staircase",lat:37.281927, lng:-121.856255,method:mapViewSelf.showMarker,heading:330,pitch:0,func:mapViewSelf.delegateToMarker},
    {name:"Vieira Park",lat:37.287020, lng:-121.861426,method:mapViewSelf.showMarker,heading:135,pitch:0,func:mapViewSelf.delegateToMarker},
  {name:"Communications Hill Trail",lat:37.286008, lng:-121.861894,method:mapViewSelf.showMarker,heading:160,pitch:15,func:mapViewSelf.delegateToMarker}]);

  /**
   * The google map api is put in the knockout context
   * so it can used in the data-bind attributes.
   * the getPointsArrayFromMakerTitle is used
   * to pass some data to that.
   */
  mapViewSelf.getPointsArrayFromMarkerTitle = function(title) {
  var retobj = null;
  for (var i=0;i<mapViewSelf.points().length;i++) {
      if (mapViewSelf.points()[i].name===title) {
          retobj=mapViewSelf.points()[i];
          break;
      }
  }
  return retobj;
  };



  mapViewSelf.search = ko.computed(function(){
    return ko.utils.arrayFilter(mapViewSelf.points(), function(point){

     return point.name.toLowerCase().indexOf(mapViewSelf.query().toLowerCase()) >= 0;

    });
  });


  // Map constructor
  mapViewSelf.myMap = ko.observable({
  // center 37.286008, lng:-121.861894
    lat: ko.observable(37.286008),
    lng: ko.observable(-121.861894),
    markers: ko.observable(mapViewSelf.points),
    // put the view object reference in the context yo

    objectRef :mapViewSelf
  });



};




/**
 * Put the custom binding in the map context
 */

ko.bindingHandlers.map = {

  init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
    var mapObj = ko.utils.unwrapObservable(valueAccessor());
    var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));

  var theMapView =     ko.utils.unwrapObservable(mapObj.objectRef);


    var mapOptions = { center: latLng,
                          zoom: 15,
                          mapTypeId: google.maps.MapTypeId.ROADMAP};
    mapObj.googleMap = new google.maps.Map(element, mapOptions);

    var pointsArray = ko.toJS(mapObj.markers);


    for (var i = 0 ; i < pointsArray.length; i++)  {

      var currentLatlng = new google.maps.LatLng(pointsArray[i].lat,pointsArray[i].lng);
      var marker = new google.maps.Marker({
        position: currentLatlng,
        map: mapObj.googleMap,
        title: pointsArray[i].name
      });
    /*
     * place the marker instance in the title to
     * instance map
     */
     theMapView.markerTitleToMarkerInstanceMap[marker.title]=marker;

      var content = document.createElement("div");
      var title = document.createElement("div");
      title.innerHTML = pointsArray[i].name;
      content.appendChild(title);
      var streetview = document.createElement("div");
      streetview.style.width = "200px";
      streetview.style.height = "200px";
      content.appendChild(streetview);

      var infowindow = new google.maps.InfoWindow({
        content: content
      });



    google.maps.event.addListener(marker, 'click', function() {

        theMapView.setCurrentMarker(this);


    infowindow.open(mapObj.googleMap,this);
    });

         // Handle the DOM ready event to create the StreetView panorama

    google.maps.event.addListener(infowindow, "domready", function() {
        var pointsRecord = theMapView.getPointsArrayFromMarkerTitle(theMapView.currentMarker().title);
    title.innerHTML=theMapView.currentMarker().title;
    // streetview is the div element reference for the panorama content destination.
        var panorama = new google.maps.StreetViewPanorama(streetview, {
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            visible: true,
      pov: {
               heading: pointsRecord.heading,
               pitch: pointsRecord.pitch
            },
            position: theMapView.currentMarker().getPosition()
        });
    });



    }


    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.282002,-121.861894),
      new google.maps.LatLng(37.286790,-121.860046));

   // mapObj.googleMap.fitBounds(defaultBounds);



    }
  };