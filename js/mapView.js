/*
 * Constructor for MapView
 */
var MapView = function() {
  this.name = ko.observable("Map");
  var mapViewSelf = this;

  mapViewSelf.currentMarker = ko.observable();
  mapViewSelf.setCurrentMarker = function(marker) {
    mapViewSelf.currentMarker(marker);
  };

  /*
   * This array is necessary to delegate the event from the
   * location link element to the marker element event.
   */

  mapViewSelf.markerTitleToMarkerInstanceMap = [];
  mapViewSelf.delegateToMarker = function() {
    // Get the marker instance and fire a click event
    // to open the streetview panorama
    var theMarker = mapViewSelf.markerTitleToMarkerInstanceMap[this.name];
    google.maps.event.trigger(theMarker, 'click');
  };

  mapViewSelf.marketTitleToYelpObject = [];

  mapViewSelf.query = ko.observable('');

  /** The points observable array holds the location data
   *  to support the google map and panorama API
   */

  mapViewSelf.points = ko.observableArray([{
    name: "Grand Staircase",
    lat: 37.281927,
    lng: -121.856255,
    method: mapViewSelf.showMarker,
    heading: 330,
    pitch: 0,
    func: mapViewSelf.delegateToMarker
  }, {
    name: "Vieira Park",
    lat: 37.287020,
    lng: -121.861426,
    method: mapViewSelf.showMarker,
    heading: 135,
    pitch: 0,
    func: mapViewSelf.delegateToMarker
  }, {
    name: "Communications Hill Trail",
    lat: 37.286008,
    lng: -121.861894,
    method: mapViewSelf.showMarker,
    heading: 160,
    pitch: 15,
    func: mapViewSelf.delegateToMarker
  }]);

  /**
   * The google map api is put in the knockout context
   * so it can used in the data-bind attributes.
   * the getPointsArrayFromMakerTitle method is used
   * to pass some data to that.
   */
  mapViewSelf.getPointsArrayFromMarkerTitle = function(title) {
    var retobj = null;
    var pointsLen = mapViewSelf.points().length;
    for (var i = 0; i < pointsLen; i++) {
      if (mapViewSelf.points()[i].name === title) {
        retobj = mapViewSelf.points()[i];
        break;
      }
    }
    return retobj;
  };

  /** Filter method per project requirements
   */

  mapViewSelf.search = ko.computed(function() {
    var matches = [];
    return ko.utils.arrayFilter(mapViewSelf.points(), function(point) {
      var retval = point.name.toLowerCase().indexOf(mapViewSelf.query().toLowerCase()) >= 0;


      if (retval === true) {
        matches.push(point.name);
      }
      /*
       * Hide or show markers based on the search results
       */
      for (var key in mapViewSelf.markerTitleToMarkerInstanceMap) {
        if (mapViewSelf.markerTitleToMarkerInstanceMap.hasOwnProperty(key)) {
          var found = $.inArray(key, matches) > -1;
          if (found) {

            mapViewSelf.markerTitleToMarkerInstanceMap[key].setVisible(true);
          } else {

            mapViewSelf.markerTitleToMarkerInstanceMap[key].setVisible(false);
          }


        }
      }

      return retval;
    });
  });




  /** YELP API
   *
   */
  mapViewSelf.YelpApiFailure = true;


  mapViewSelf.markerTitleYelpReviewMap = [];

  var auth = {
    //
    // Update with your auth tokens.
    //
    consumerKey: "z9UpnZkXudM4U8L7bJ2OCA",
    consumerSecret: "WT8KJx3gGjGyDPce8P6D6Ipdng0",
    accessToken: "StQXcW2XMfNYdh9AwmOqJIiqlbu540_3",

    accessTokenSecret: "X2jx2__xJleIqbyhameg--afIEc",
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };

  var term = "Communications Hill";
  var near = 'San+Jose';

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };


  parameters = [];
  parameters.push(['term', term]);
  parameters.push(['location', near]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
  };



  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);


  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      mapViewSelf.YelpApiFailure = false;

      for (var i = 0; i < data.businesses.length; i++) {
        /* check for a match for each marker with
         * the business name.  If there is a match,
         * put it in the map so it can be shown
         * in the info window.
         */
        for (var p = 0; p < mapViewSelf.points().length; p++) {
          var entityName = mapViewSelf.points()[p].name;

          if (data.businesses[i].name.toLowerCase().indexOf(entityName.toLowerCase()) != -1) {
            mapViewSelf.marketTitleToYelpObject[entityName] = data.businesses[i];
          }


        }

      }
    }
  }).error(mapViewSelf.YelpApiFailure = true);




  // Map constructor
  mapViewSelf.myMap = ko.observable({
    // center 37.286008, lng:-121.861894
    lat: ko.observable(37.284008),
    lng: ko.observable(-121.859544),
    markers: ko.observable(mapViewSelf.points),
    // put the view object reference in the context yo

    objectRef: mapViewSelf
  });

};




/**
 * Put the custom binding in the map context
 * so the 'map' property name can be used with Knockout's name/value
 * context in the view.
 */