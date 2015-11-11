/**
 *
 *  Dondrey Taylor <dondrey.taylor@gmail.com>
 *
 *
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *  Assets Credit
 *
 *  ### UFO Spaceship ###
 *  Author: Alucard
 *  Source: http://opengameart.org/content/spaceship-2d
 *
 * ### Fighter1 ###
 *  Authoer: MillionthVector 
 * Source: http://millionthvector.blogspot.com/p/free-sprites_12.html
 */



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///										//
///			HELPER FUNCTIONS 				//
///										//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
* @param {Any} o Any
* @param {Any} l Any
*
* Fore more details visit:
* http://jsfromhell.com/geral/hittest [rev. #2]
* By: Jonas Raoni Soares Silva
*/
var testForHit = function(o, l)
{
	function getOffset(o)
	{
	    for(var r = {l: o.offsetLeft, t: o.offsetTop, r: o.offsetWidth, b: o.offsetHeight};
	        o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
	    return r.r += r.l, r.b += r.t, r;
	}

	var a = arguments, 
	j = a.length;
	j > 2 && (o = {offsetLeft: o, offsetTop: l, offsetWidth: j == 5 ? a[2] : 0,
	offsetHeight: j == 5 ? a[3] : 0, offsetParent: null}, l = a[j - 1]);
	for(var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
	b = getOffset(l[--i]), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
	&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
	return j ? !!r.length : r;
};


/**
*
*  Calculates random number between the 
*  two argument provided
*  
* @param {int} min The lower limit
* @param { int} max The upper limit
*
*/
function getRandom(min, max) 
{
  return Math.random() * (max - min) + min;
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///										//
///			GAME ENEMY						//
///										//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
*
*  Represents an enemy in the game.
*  
* @param {jquery element} $attachment JQuery dom refrence to element containing element (e.g. $('platform') )
* @param {string} asset String of the relative path of the asset to be used
* @param {int} x The horizontal position
* @param {int} y The Vertical position
* @param {int} width The width of the enemy
* @param {int} height The height of the enemy
* @param {int} pixelsPerIterationX The amount of horizontal position to move the enemy
* @param {int} pixelsPerIterationY The amount of vertical position to move the enemy
* @param {function} hitTestFn This functions tests to see if the enemy hit another game object
*
*/
var Enemy = function($attachment, asset, x, y, width, height, pixelsPerIterationX, pixelsPerIterationY, hitTestFn)
{
	this.pixelsPerIterationX = pixelsPerIterationX
	this.pixelsPerIterationY = pixelsPerIterationY
	this.$element = $("<div class='enemy' style='background-image: url("+asset+"); left: "+x+"px; top: "+y+"px; width: "+width+"px; height: "+height+"px;'></div>");
	this.$attachment = $attachment;
	this.$attachment.append(this.$element);
	
	if (typeof hitTestFn === "function") 
	{ 
		this.hitTest = hitTestFn
	}
};


Enemy.prototype.wasRemoved = false
Enemy.prototype.pixelsPerIterationX = 3;
Enemy.prototype.pixelsPerIterationY = 0;
Enemy.prototype.$element = $("<div></div>");
Enemy.prototype.$attachment = $("<div></div>"); 
Enemy.prototype.render = function()  
{ 
	this.$attachment.append($attachment); 
}; 
Enemy.prototype.update = function()
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
Enemy.prototype.hitTest = function()
{
	return false
};
Enemy.prototype.hitAnimation = function()
{
	this.$element.fadeOut(200, function()
	{
		$(this).detach();
		this.wasRemoved = true	
	})
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///										//
///			PROJECTILE						//
///										//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
*
*  Represents an projectile in the game.
*  
* @param {jquery element} $attachment JQuery dom refrence to element containing element (e.g. $('platform') )
* @param {string} asset String of the relative path of the asset to be used
* @param {int} x The horizontal position
* @param {int} y The Vertical position
* @param {int} width The width of the projectile
* @param {int} height The height of the projectile
* @param {int} pixelsPerIterationX The amount of horizontal position to move the projectile
* @param {int} pixelsPerIterationY The amount of vertical position to move the projectile
* @param {function} hitTestFn This functions tests to see if the projectile hit another game object
*
*/
var Projectile = function($attachment, asset, x, y, width, height, pixelsPerIterationX, pixelsPerIterationY, hitTestFn)
{
	this.pixelsPerIterationX = pixelsPerIterationX
	this.pixelsPerIterationY = pixelsPerIterationY
	this.$element = $("<div class='projectile' style='background-image: url("+asset+"); left: "+x+"px; top: "+y+"px; width: "+width+"px; height: "+height+"px;'></div>");
	this.$attachment = $attachment;
	this.$attachment.append(this.$element);
	
	if (typeof hitTestFn === "function") 
	{ 
		this.hitTest = hitTestFn
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
		$(this).detach();
		this.wasRemoved = true	
	})
};




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///										//
///			GAME HANDLER					//
///										//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Game = {};
Game.projectiles = [];
Game.enemies = [];

////// STATIC GAME ASSETS /////////
Game.assets = {};
Game.assets.background = "./assets/space.jpg" ;
Game.assets.ship = "./assets/ship.png";
Game.assets.shipBeam = "./assets/beam.png"
Game.assets.shipEnemy1 = "./assets/spaceship.png"

////// DOM CACHING /////////
Game.DOM = {}; 
Game.DOM.$game = $("game");
Game.DOM.$score = $('score');
Game.DOM.$platform = $("platform");
Game.DOM.$background = $("background");
Game.DOM.$window = $(window);
Game.DOM.$ship = $("<div class='ship' style='background-image: url("+Game.assets.ship+")'></div>");
Game.DOM.$shipDamage = $('damage');

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
	setInterval(Game.ui.spanEnemy,2000);
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
	for (var index in Game.enemies) Game.enemies[index].update(); 
	setTimeout(Game.ui.eventloop);
	return this;
};
Game.ui.calculatePositionOfShip = function(priorValue, keyCode1, keyCode2, isX) 
{
	var value = parseInt(priorValue, 10) - (Game.log.keysPressed[keyCode1] ? 10 : 0) + (Game.log.keysPressed[keyCode2] ? 10 : 0);
	value = value < 0 ? 0 : value > Game.ui.bounds[isX ? "width" : "height"] ? Game.ui.bounds[isX ? "width" : "height"]  : value; 
	return value;  
 }; 
Game.ui.spanEnemy = function()
{
	Game.enemies.push( (new Enemy(Game.DOM.$platform, Game.assets.shipEnemy1, Game.DOM.$platform.width()-50, getRandom(100, Game.DOM.$platform.height()-100), 80, 80, -10, 0, function()
	{
		if ( this.wasRemoved  ) { 
			return true
		}

		if ( testForHit(this.$element.get(0), Game.DOM.$ship.get(0)) ) 
		{
			Game.indicateShipDamage();
			this.hitAnimation();
			return true;
		}

		for (var index in Game.projectiles)
		{
			if ( testForHit(Game.projectiles[index].$element.get(0), this.$element.get(0)) ) 
			{
				Game.DOM.$score.children('span').html ( parseInt(Game.DOM.$score.children('span').html()) + 1) 
				this.hitAnimation();
				Game.projectiles[index].hitAnimation();
				return true;
			}
		}

		return false	
	})) );	
};
Game.indicateShipDamage =function()
{
	setTimeout(function() { Game.DOM.$shipDamage.css('opacity', 1); });
	setTimeout(function() { Game.DOM.$shipDamage.css('opacity', 0); },200);
	setTimeout(function() { Game.DOM.$shipDamage.css('opacity', 1); },300);
	setTimeout(function() { Game.DOM.$shipDamage.css('opacity', 0); },400);
}

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

/// INITIATES GAME PLAY ///
Game.actions.start();








