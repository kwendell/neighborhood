var ViewModel = function() {

   var viewData = [
    {name:'Home'},
    {name:'History'},
    {name:'Map/Places of Interest'},
    {name:'other'},


   ];

   var self = this;
   this.viewList = ko.observableArray([]);

   viewData.forEach(function(viewItem) {

      self.viewList.push(new View(viewItem));
   });

   this.currentView = ko.observable(this.viewList()[0]);



   this.setView = function(clickedView) {

      self.currentView(clickedView);

   };

};

var View  = function(data) {
   this.name = ko.observable(data.name);



};



ko.applyBindings(new ViewModel());
