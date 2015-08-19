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
   * the getPointsArrayFromMakerTitle method is used
   * to pass some data to that.
   */
  mapViewSelf.getPointsArrayFromMarkerTitle = function(title) {
	var retobj = null;
  var pointsLen = mapViewSelf.points().length;
	for (var i=0;i<pointsLen;i++) {
	    if (mapViewSelf.points()[i].name===title) {
          retobj=mapViewSelf.points()[i];
          break;
	    }
	}
	return retobj;
  };

  /** Filter method per project requirements
   */

  mapViewSelf.search = ko.computed(function(){
    var matches = new Array();
    return ko.utils.arrayFilter(mapViewSelf.points(), function(point){
    var retval = point.name.toLowerCase().indexOf(mapViewSelf.query().toLowerCase()) >= 0;


    if (retval==true) {
      matches.push(point.name);
    }

    for ( var key in mapViewSelf.markerTitleToMarkerInstanceMap) {
      if (mapViewSelf.markerTitleToMarkerInstanceMap.hasOwnProperty(key)) {
        var found = $.inArray(key, matches) > -1;
        if (found) {

          mapViewSelf.markerTitleToMarkerInstanceMap[key].setVisible(true);
        } else {

           mapViewSelf.markerTitleToMarkerInstanceMap[key].setVisible(false);
        }

       // console.log(key + " -> " + mapViewSelf.markerTitleToMarkerInstanceMap[key]);
      }
    }

    return retval;
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
 * so the 'map' property name can be used with Knockout's name/value
 * context in the view.
 */