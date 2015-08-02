
 var api_key = "c76fa576c8399b0b88d14111dce6e3e8:18:72432843";
var ViewModel = function() {




   var self = this;
   this.viewList = ko.observableArray([]);

  // viewData.forEach(function() {
       var homeView = new HomeView();

       var historyView = new HistoryView();
       var mapView = new MapView();


      self.viewList.push(homeView);
      self.viewList.push(historyView);
      self.viewList.push(mapView);
  // });

   this.homeView = homeView;
   this.mapView =mapView;
   this.historyView=historyView;

   this.currentView = ko.observable(this.viewList()[0]);


  this.isHome =  ko.computed(function() {var retval = "Home"==self.currentView().name();return retval;});
  this.isHistory =  ko.computed(function() {var retval = "History"==self.currentView().name();return retval;});
  this.isMap =  ko.computed(function() {var retval = "Map"==self.currentView().name();return retval;});


   this.setView = function(clickedView) {

      // console.log(clickedView.name());
      self.currentView(clickedView);
      console.log(self.currentView().name());


   };

};

var HistoryView  = function() {
   this.name = ko.observable("History");



};

var MapView  = function() {
    this.name = ko.observable("Map");

  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

   map = new google.maps.Map(document.querySelector('#mapDiv'), mapOptions);
   // add a location
   var locations = ["3001 Mary Helen Lane San Jose, CA 95136"];
   locations.push(locations[0]);

   //verity the location, set callback on success.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {

      // the search request object
      var request = {
        query: locations[place]
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, function() {alert("Here's the callback");});
    }

   // end verify
};


var HomeView = function() {
  this.content=ko.observable("Hiding in plain sight of Silicon Valley is the Communications Hill neigborhood.  The neighborhood "+
    "boasts a walking trail, a park, a popular exercise area and a vineyard.  Communications Hill is at at once steeped the history of "+
    "the valley's agricultural age and today's tech oriented lifestyle.");
  this.content2=ko.observable("Tree lined streets beckon 'come hither' summoning remembrances of Old Tuscany.  These "+
    "harbingers of season provide a respite from the elements and the urgencies of life.");
  var self = this;
  this.name=ko.observable("Home");
  this.commHill_ratings=ko.observableArray([]);


    // constructYelpUrl();




 //this.constructYelpUrl = function() {
 var auth = {
                //
                // Update with your auth tokens.
                //
                consumerKey : "z9UpnZkXudM4U8L7bJ2OCA",
                consumerSecret : "WT8KJx3gGjGyDPce8P6D6Ipdng0",
                accessToken : "StQXcW2XMfNYdh9AwmOqJIiqlbu540_3",
                // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
                // You wouldn't actually want to expose your access token secret like this in a real application.
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

            //http://api.yelp.com/v2/search?term=food&location=San+Francisco
             $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'cache': true,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'success' : function(data, textStats, XMLHttpRequest) {
                    console.log(data);
                    for (var i =0 ; i < data.businesses.length; i++)  {
                       //console.log(data.businesses[i].rating+"  "+data.businesses[i].snippet_text);
                       self.commHill_ratings.push(data.businesses[i]);
                    }
                    //$("body").append(output);
                }
            });
             };

 //};


ko.applyBindings(new ViewModel());
