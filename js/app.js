
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
      /*
      self.viewList.push({name:homeView.name,obj:homeView,content:homeView.content});
      self.viewList.push({name:historyView.name,obj:historyView,content:"historyContent"});
      self.viewList.push({name:mapView.name,obj:mapView,content:"mapContent"});
      */
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

       console.log(clickedView.name());
      self.currentView(clickedView);


   };

};

var HistoryView  = function() {
   this.name = ko.observable("History");



};

var MapView  = function() {
   this.name = ko.observable("Map");


};


var HomeView = function() {
  this.content=ko.observable("Hiding in plain sight of Silicon Valley is the Communications Hill neigborhood.  Tree lined"+
    " streets beckon 'come hither' summoning the feelings of Old Tuscany.");

  this.name=ko.observable("Home");

};

ko.applyBindings(new ViewModel());
