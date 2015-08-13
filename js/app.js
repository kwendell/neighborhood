
  var api_key = "c76fa576c8399b0b88d14111dce6e3e8:18:72432843";
  var ViewModel = function() {
  var title = ko.observable("Communications Hill");
  var self = this;
  this.viewList = ko.observableArray([]);
  this.area_reviews = ko.observable("Communications Hill Area Reviews");

  var homeView = new HomeView();
  var historyView = new HistoryView();
  var mapView = new MapView();

  self.viewList.push(homeView);
  self.viewList.push(historyView);
  self.viewList.push(mapView);

  this.homeView = homeView;
  this.mapView =mapView;
  this.historyView=historyView;

  this.currentView = ko.observable(this.viewList()[0]);


  this.isHome =  ko.computed(function() {var retval = "Home"==self.currentView().name();return retval;});
  this.isHistory =  ko.computed(function() {var retval = "History"==self.currentView().name();return retval;});
  this.isMap =  ko.computed(function() {var retval = "Map"==self.currentView().name();return retval;});



  this.setView = function(clickedView) {
    self.currentView(clickedView);
  }
};

var HistoryView  = function() {
   this.name = ko.observable("History");
};


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
  mapViewSelf.points = ko.observableArray([
    {name:"Grand Staircase",lat:37.281927, lng:-121.856255,method:mapViewSelf.showMarker,heading:330,pitch:0,func:mapViewSelf.delegateToMarker},
    {name:"Vieira Park",lat:37.287020, lng:-121.861426,method:mapViewSelf.showMarker,heading:135,pitch:0,func:mapViewSelf.delegateToMarker},
	{name:"Communications Hill Trail",lat:37.286008, lng:-121.861894,method:mapViewSelf.showMarker,heading:160,pitch:15,func:mapViewSelf.delegateToMarker}]);
  
  
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
    lat: ko.observable(37.285790),
    lng: ko.observable(-121.860046),
	  markers: ko.observable(mapViewSelf.points),
    // put the object refernce in the context
    // yo to keep the showMarker method
    // in the MapView
    objectRef :mapViewSelf
  });



};


var HomeView = function() {
  this.content=ko.observable("Hiding in plain sight of Silicon Valley is the Communications Hill neighborhood.  The "+
    "neighborhood boasts a walking trail, a park, a popular exercise area and a vineyard.  Communications Hill is at at once steeped the history of "+
    "the valley's agricultural age and today's tech lifestyle.");
  this.content2=ko.observable("Tree lined streets beckon 'come hither' summoning remembrances of Old Tuscany.  These "+
    "harbingers of season provide a respite from the elements and the urgencies of life.  There are stunning views " +
	"from the walking trail and other vantage points.");
  var self = this;
  this.name=ko.observable("Home");
  this.commHill_ratings=ko.observableArray([]);

  var auth = {
                //
                // Update with your auth tokens.
                //
    consumerKey : "z9UpnZkXudM4U8L7bJ2OCA",
    consumerSecret : "WT8KJx3gGjGyDPce8P6D6Ipdng0",
    accessToken : "StQXcW2XMfNYdh9AwmOqJIiqlbu540_3",

    accessTokenSecret : "X2jx2__xJleIqbyhameg--afIEc",
    serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
    }
  };

  var terms = 'Communications+Hill';
  var near = 'San+Jose';

  var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
  };


  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);

           
  $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'cache': true,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'success' : function(data, textStats, XMLHttpRequest) {

                    for (var i =0 ; i < data.businesses.length; i++)  {
                    
                       self.commHill_ratings.push(data.businesses[i]);
                    }
                  
                }
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

	var theMapView =		 ko.utils.unwrapObservable(mapObj.objectRef);


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
ko.applyBindings(new ViewModel());
