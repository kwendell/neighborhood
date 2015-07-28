var ViewModel = function() {


   var viewData = [
    {name:'Home'},
    {name:'History'},
    {name:'Map/Places of Interest'},
    {name:'other'},


   ];

   var self = this;
   this.viewList = ko.observableArray([]);

  // viewData.forEach(function() {
       var homeView = new HomeView();
       var view = new View();
      // Push objects with keys onto the array.
      /*
      self.viewList[homeView.name()]=homeView;
      self.viewList[view.name()]=view;
      */
      //var homeViewInstance = {homeView.name:homeView};
      self.viewList.push({name:homeView.name,obj:homeView});
      self.viewList.push({name:view.name,obj:view});
  // });

   this.currentView = ko.observable(this.viewList()[0]);



   this.setView = function(clickedView) {

      self.currentView(clickedView);

   };

};

var View  = function(data) {
   this.name = ko.observable("View");

};

var HomeView = function(data) {
   var api_key = "c76fa576c8399b0b88d14111dce6e3e8:18:72432843";
  this.name=ko.observable("Home");
  this.articlesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+"San Jose CA"+"&sort=newest&api-key="+api_key;
  this.text = "Hiding in plain view of the Silicon Valley is Communications Hill.   Communications Hill is a San Jose neighborhood" +
  " SouthEast of Willow Glen, North of Santa Teresa.";

};

ko.applyBindings(new ViewModel());
