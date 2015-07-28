
 var api_key = "c76fa576c8399b0b88d14111dce6e3e8:18:72432843";
var ViewModel = function() {




   var self = this;
   this.viewList = ko.observableArray([]);

  // viewData.forEach(function() {
       var homeView = new HomeView();
       var historyView = new HistoryView();
       var mapView = new MapView();
      // Push objects with keys onto the array.
      /*
      self.viewList[homeView.name()]=homeView;
      self.viewList[view.name()]=view;
      */
      //var homeViewInstance = {homeView.name:homeView};
      self.viewList.push({name:homeView.name,obj:homeView});
      self.viewList.push({name:historyView.name,obj:historyView});
      self.viewList.push({name:mapView.name,obj:mapView});
  // });
   this.viewList()[0].isShowing=true;
   this.currentView = ko.observable(this.viewList()[0]);


  this.isHome =  ko.computed(function() {var retval = "Home"==self.currentView().name();return retval;});
  this.isHistory =  ko.computed(function() {var retval = "History"==self.currentView().name();return retval;});
  this.isMap =  ko.computed(function() {var retval = "Map"==self.currentView().name();return retval;});


   this.setView = function(clickedView) {

      self.currentView(clickedView);


   };

};

var HistoryView  = function(data) {
   this.name = ko.observable("History");


};

var MapView  = function(data) {
   this.name = ko.observable("Map");


};


var HomeView = function(data) {

  this.name=ko.observable("Home");
  this.articlesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+"San Jose CA"+"&sort=newest&api-key="+api_key;


  this.text = "Hiding in plain view of the Silicon Valley is Communications Hill.   Communications Hill is a San Jose neighborhood" +
  " between Willow Glen and Santa Teresa.  The area boasts a park, a walking trail, a vineyard and a popular " +
  "public exercise area known as the Grand Staircase.  The neighborhood is steeped in a rich history of the valley's golden age of agriculture.";

};

ko.applyBindings(new ViewModel());
