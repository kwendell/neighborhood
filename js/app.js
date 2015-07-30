
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
  this.content=ko.observable("Hiding in plain sight of Silicon Valley is the Communications Hill neigborhood.  The neighborhood "+
    "boasts a walking trail, a park, a popular exercise area and a vineyard.  Communications Hill is steeped the history of "+
    "the valley's golden agricultural age.");
  this.content2=ko.observable("Tree lined streets beckon 'come hither' summoning the feelings of Old Tuscany.  The trees, these great "+
    "harbingers of seasons, providing a respite from the elements and the urgencies of life.");

  this.name=ko.observable("Home");

    var cityValue="San Jose CA";
    var articlesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+cityValue+"&sort=newest&api-key="+api_key;
     var $nytHeaderElem = $('#nytimes-articles');
    $.getJSON(articlesURL,function(data)  {

        $nytHeaderElem.text("NY Articles About "+cityValue);
        var articles = data.response.docs;alert("articles.length: "+articles.length);
        for (var i=0;i<articles.length;i++)  {
            var article = articles[i];
            $nytHeaderElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'
                               +'<p>'+article.snippet+'</p>'+'</li>');
        }
    }).error(function() {alert("error")} );


};

ko.applyBindings(new ViewModel());
