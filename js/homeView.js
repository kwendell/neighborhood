var HomeView = function() {
  this.content=ko.observable("Hiding in plain sight of Silicon Valley is the Communications Hill neighborhood.  The "+
    "neighborhood boasts a walking trail, a park, a popular exercise area and a vineyard.  Communications Hill is at at once steeped the history of "+
    "the valley's agricultural age and today's tech lifestyle.");
  this.content2=ko.observable("Tree lined streets beckon 'come hither' summoning remembrances of Old Tuscany. The trees -these "+
    "harbingers of season- provide a respite from the elements and the urgencies of life.  There are stunning views " +
	"from the walking trail and other vantage points.");
  this.content3=ko.observable("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut "+
  " labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea "+
  " commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "+
  " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
  this.content4=ko.observable( "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, "+
    "totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim "+
    " ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem "+
    "sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam "+
    " eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem "+
    "ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate "+
    "velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"

);
  var self = this;
  this.title=ko.observable("Communications Hill");
  this.name=ko.observable("Home");

}