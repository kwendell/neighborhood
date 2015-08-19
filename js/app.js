
/* Constructor for knockout.js ViewModel
 */
  var ViewModel = function() {

  var self = this;
  // Use observable array to hold the views, Home, Map and History
  this.viewList = ko.observableArray([]);
  this.area_reviews = ko.observable("Communications Hill Area Reviews");
  // Constructor invocations for each of the constituent views Home,
  // Map and History.
  var homeView = new HomeView();
  var historyView = new HistoryView();
  var mapView = new MapView();

  self.viewList.push(homeView);
  self.viewList.push(historyView);
  self.viewList.push(mapView);

  this.homeView = homeView;
  this.mapView =mapView;
  this.historyView=historyView;

  // Initialize the current view to the Home view.
  this.currentView = ko.observable(this.viewList()[0]);

  // Set up computed observables to switch to the views
  // from the nav selection.
  this.isHome =  ko.computed(function() {var retval = "Home"==self.currentView().name();return retval;});
  this.isHistory =  ko.computed(function() {var retval = "History"==self.currentView().name();return retval;});
  this.isMap =  ko.computed(function() {var retval = "Map"==self.currentView().name();return retval;});


  // method to keep track of currently selected view.
  this.setView = function(clickedView) {
    self.currentView(clickedView);
  }
};



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
	   * instance map so the markers can be looked
     * up from the view name.  This will be used
     * to delegate a click event to a marker
     * click event.
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
	//	this.setAnimation(google.maps.Animation.BOUNCE);
		
		// stop all other markers from bounding
		  for ( var key in theMapView.markerTitleToMarkerInstanceMap) {
              var aMarker = theMapView.markerTitleToMarkerInstanceMap[key];
			  if (key===this.title) {
			     this.setAnimation(google.maps.Animation.BOUNCE);  
			  } else {
			    theMapView.markerTitleToMarkerInstanceMap[key].setAnimation(null);
			  }
			
		  }
		


		    infowindow.open(mapObj.googleMap,this);
      });

         // Handle the DOM ready event to create the StreetView panorama
      google.maps.event.addListener(infowindow, 'closeclick', function() {
	    theMapView.currentMarker().setAnimation(null);}
	  );
	  
	  

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
    }
  };
ko.applyBindings(new ViewModel());
