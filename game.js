////////////////////////////////
/// PROJECTILE   ///
////////////////////////////////
var Projectile = function($attachment, asset, x, y, width, height, pixelsPerIterationX, pixelsPerIterationY, hitTestFn)
{
	this.pixelsPerIterationX = pixelsPerIterationX
	this.pixelsPerIterationY = pixelsPerIterationY
	this.$element = $("<div class='projectile' style='background-image: url("+asset+"); left: "+x+"px; top: "+y+"px; width: "+width+"px; height: "+height+"px;'></div>");
	this.$attachment = $attachment;
	this.$attachment.append(this.$element);
	
	if (typeof hitTest === "function") 
	{ 
		hitTest = hitTestFn
	}
};

Projectile.prototype.wasRemoved = false
Projectile.prototype.pixelsPerIterationX = 3;
Projectile.prototype.pixelsPerIterationY = 0;
Projectile.prototype.$element = $("<div></div>");
Projectile.prototype.$attachment = $("<div></div>"); 
Projectile.prototype.render = function()  
{ 
	this.$attachment.append($attachment); 
}; 
Projectile.prototype.update = function()
{
	if (!this.wasRemoved)
	{
		if (!this.hitTest() && this.$element.position().left > 0 && this.$element.position().left < this.$attachment.width() && this.$element.position().top > 0 && this.$element.position().top < this.$attachment.height()) {
			this.$element.css({
				left: '+=' + this.pixelsPerIterationX,
				top: '+=' + this.pixelsPerIterationY
			});
		}
		else { 
			this.wasRemoved = true
			this.$element.detach();
		}
	}
};
Projectile.prototype.hitTest = function()
{
	return false
};

Projectile.prototype.hitAnimation = function()
{
	this.$element.fadeOut(200, function()
	{
		this.$element.detach();	
	})
};



/////////////////////////////////
///  GAME LOGIC  ///
////////////////////////////////
var Game = {};
Game.projectiles = [];
Game.enemies = []

////// STATIC GAME ASSETS /////////
Game.assets = {};
Game.assets.background = "./assets/space.jpg" ;
Game.assets.ship = "./assets/ship.png";
Game.assets.shipBeam = "./assets/beam.png"


////// DOM CACHING /////////
Game.DOM = {}; 
Game.DOM.$game = $("game");
Game.DOM.$platform = $("platform");
Game.DOM.$background = $("background");
Game.DOM.$window = $(window);
Game.DOM.$ship = $("<div class='ship' style='background-image: url("+Game.assets.ship+")'></div>");



////// EVENT LOGGING /////////
Game.log = {}; 
Game.log.keysPressed = {};


////// UI HANDLER ////////
Game.ui = {};
Game.ui.bounds = {};
Game.ui.bounds.width = $(window).width();
Game.ui.bounds.height = $(window).height();
Game.ui.bgposition = 0
Game.ui.init = function()
{
	Game.DOM.$platform.append(Game.DOM.$ship)
	Game.DOM.$background.append($("<div class='background' style='background-image: url("+Game.assets.background+")'></div>"))
	return this;
}; 
Game.ui.eventloop = function()
{
	Game.DOM.$ship.css({
		left: function(index ,oldValue) {
			return Game.ui.calculatePositionOfShip(oldValue, 37, 39, true);
		},
		top: function(index, oldValue) {
			return Game.ui.calculatePositionOfShip(oldValue, 38, 40, false);
		}
	});

	Game.DOM.$background.children().eq(0).css('background-position',  --Game.ui.bgposition + 'px 0');
	for (var index in Game.projectiles) Game.projectiles[index].update();
	setTimeout(Game.ui.eventloop);
	return this;
};
Game.ui.calculatePositionOfShip = function(priorValue, keyCode1, keyCode2, isX) 
{
	var value = parseInt(priorValue, 10) - (Game.log.keysPressed[keyCode1] ? 3 : 0) + (Game.log.keysPressed[keyCode2] ? 3 : 0);
	value = value < 0 ? 0 : value > Game.ui.bounds[isX ? "width" : "height"] ? Game.ui.bounds[isX ? "width" : "height"]  : value; 
	return value;
}; 


////// KEYBOARD CONTROLS /////////
Game.controls = {};
Game.controls.init = function()
{
	Game.DOM.$window.keydown(function(event) { Game.log.keysPressed[event.which] = true; });
	Game.DOM.$window.keyup(function(event) { Game.log.keysPressed[event.which] = false; });
	Game.DOM.$window.on('keypress', function(event)
	{
			if (event.which) 
			{
				 Game.projectiles.push( (new Projectile(Game.DOM.$platform, Game.assets.shipBeam, Game.DOM.$ship.position().left, Game.DOM.$ship.position().top, 50, 15, 20, 0)) );
			}
	});
}; 



////// ACTIONS /////////
Game.actions = {};
Game.actions.start = function()
{
	Game.ui.init().eventloop();
	Game.controls.init();
}; 



Game.actions.start();








