
var NUM_FLAMETHROWERS = 5;
var NUM_TRAPDOORS = 10;
var NUM_WAYPOINTS = 3;
var NUM_LASERS = 3;
var NUM_ENEMIES = 3;

//enum
var WAYPOINT = 0;
var FLAMETHROWER = 1;
var TRAPDOOR = 2;
var LASER = 3;
var ENEMY = 4;

hideTools();
$(document.body).append('<div id="gameEditGUI"></div>')
$('#gameEditGUI').dialog({
	title:'Edit Game Board',
	autoOpen:true,
	position:[50,100],
	height:'auto',
	width:400
});

$(document.body).append('<link rel="stylesheet" type="text/css" href="/vwfdatamanager.svc/datafile/XAPIGame/styles.css">')

$('#gameEditGUI').parent().find('.ui-dialog-titlebar button').css('display','none');
$('#gameEditGUI').append('<div id="undoButton">Undo</div>');
$('#gameEditGUI').append('<div id="clearButton">Clear</div>');
$('#undoButton').button();
$('#undoButton').click(function()
	{
		_UndoManager.undo();
		var lastAction = undoStack.pop();
		if(lastAction == TRAPDOOR)
			$($('.createDoor:hidden')[0]).css('display','inline-block');
		if(lastAction == FLAMETHROWER)
			$($('.createFire:hidden')[0]).css('display','inline-block');
		if(lastAction == WAYPOINT)
			$($('.createWaypoint:hidden')[0]).css('display','inline-block');
		if(lastAction == LASER)
			$($('.createLaser:hidden')[0]).css('display','inline-block');
		if(lastAction == ENEMY)
			$($('.createEnemy:hidden')[0]).css('display','inline-block');

		$('#index-vwf').focus();
	});
$('#clearButton').button();
$('#clearButton').click(function()
	{
		var objects = vwf.models.object.objects;
		$('.createWaypoint').css('display','inline-block');
		$('.createFire').css('display','inline-block');
		$('.createDoor').css('display','inline-block');
		$('.createLaser').css('display','inline-block');
		$('.createEnemy').css('display','inline-block');

		for(var i in objects)
		{
			var gameType = vwf.getProperty(i,'GameType');
			if(gameType == 'TrapDoor' || gameType == 'FlameThrower' || gameType == 'WayPoint' || gameType == 'Laser' || gameType == 'Enemy' )
			{
				vwf_view.kernel.deleteNode(i);
			}
		}
		$('#index-vwf').focus();
	});

$('#gameEditGUI').append('<div id="fireBlocks" class="blockTray" style=""></div>');
$('#gameEditGUI').append('<div id="doorBlocks" class="blockTray" style=""></div>');
$('#gameEditGUI').append('<div id="waypointBlocks" class="blockTray" style=""></div>');
$('#gameEditGUI').append('<div id="laserBlocks" class="blockTray" style=""></div>');
$('#gameEditGUI').append('<div id="enemyBlocks" class="blockTray" style=""></div>');

for(var i =0; i < NUM_FLAMETHROWERS; i++)
	$('#fireBlocks').append('<div class="gameObject createFire"  draggable="true" style="">Flame Thrower</div>');

for(var i =0; i < NUM_TRAPDOORS; i++)
	$('#doorBlocks').append('<div class="gameObject createDoor"  draggable="true" style="">Trap Door</div>');

for(var i =0; i < NUM_WAYPOINTS; i++)
	$('#waypointBlocks').append('<div class="gameObject createWaypoint"  draggable="true" style="">Way Point</div>');

for(var i =0; i < NUM_LASERS; i++)
	$('#laserBlocks').append('<div class="gameObject createLaser"  draggable="true" style="">Laser</div>');

for(var i =0; i < NUM_ENEMIES; i++)
	$('#enemyBlocks').append('<div class="gameObject createEnemy"  draggable="true" style="">Enemy</div>');



ADL.XAPIWrapper.changeConfig(
    {
        endpoint: 'https://lrs.adlnet.gov/xapi/',
        user: 'IFestGame',
        password: 'UQw9Sw*FcZlM'
    });

function postCreateEvent(Type,Name,Position)
{
	var statement = new ADL.XAPIStatement(
	    {
	        'homePage': 'http://vwf.adlnet.gov',
	        'name': _UserManager.GetCurrentUserName()
	    },
        ADL.verbs.imported,
        "http://vwf.adlnet.gov/xapi/" + _DataManager.getCurrentSession()
    );
   	statement.context = {};
    statement.context.extensions = 
    {
        "ext://vwf.adlnet.gov/IFestGame/GameType": Type,
        "ext://vwf.adlnet.gov/IFestGame/Name": Name,
        "ext://vwf.adlnet.gov/IFestGame/Position": Position
    };
	ADL.XAPIWrapper.sendStatement(statement);
}


$(document).on('setstatecomplete')
{

		var objects = vwf.models.object.objects;
		$('.createWaypoint').css('display','inline-block');
		$('.createFire').css('display','inline-block');
		$('.createDoor').css('display','inline-block');

		for(var i in objects)
		{
			var gameType = vwf.getProperty(i,'GameType');
			if(gameType == 'TrapDoor') 
			{
				$($('.createDoor:visible')[0]).css('display','none');
			}
			if(gameType == 'FlameThrower') 
			{
				$($('.createFire:visible')[0]).css('display','none');
			}
			if(gameType == 'WayPoint') 
			{
				$($('.createWaypoint:visible')[0]).css('display','none');
			}
			if(gameType == 'Laser') 
			{
				$($('.createLaser:visible')[0]).css('display','none');
			}
			if(gameType == 'Enemy') 
			{
				$($('.createEnemy:visible')[0]).css('display','none');
			}


		}
		$('#index-vwf').focus();

}

var dragElement = null;
var undoStack = [];
for(var i =0; i < $('.createFire').length; i ++)
$('.createFire')[i].ondragstart = function(){

	dragElement = this;
	$('#index-vwf')[0].ondrop = dropFire;
	return true;
}
for(var i =0; i < $('.createWaypoint').length; i ++)
$('.createWaypoint')[i].ondragstart = function(){

	dragElement = this;
	$('#index-vwf')[0].ondrop = dropWaypoint;
	return true;
}
for(var i =0; i < $('.createDoor').length; i ++)
$('.createDoor')[i].ondragstart = function(){

	dragElement = this;
	$('#index-vwf')[0].ondrop = dropDoor;
	return true;
}

for(var i =0; i < $('.createLaser').length; i ++)
$('.createLaser')[i].ondragstart = function(){

	dragElement = this;
	$('#index-vwf')[0].ondrop = dropLaser;
	return true;
}

for(var i =0; i < $('.createEnemy').length; i ++)
$('.createEnemy')[i].ondragstart = function(){

	dragElement = this;
	$('#index-vwf')[0].ondrop = dropEnemy;
	return true;
}

var fireTrap = {
  "extends": "cone2.vwf",
  "source": "vwf/model/threejs/cone.js",
  "type": "subDriver/threejs",
  "properties": {
    "GameType": "FlameThrower",
    "transform": [
      1,
      0,
      0,
      0,
      0,
      7.363584586528304E-8,
      -0.9999998211860657,
      0,
      0,
      0.9999998211860657,
      7.363584586528304E-8,
      0,
      -4.87399959564209,
      -5.999998569488525,
      0.5040001273155212,
      1
    ],
    "materialDef": {
      "shininess": 15,
      "alpha": 1,
      "ambient": {
        "r": 0.5803921568627451,
        "g": 0.03529411764705882,
        "b": 0.03529411764705882
      },
      "color": {
        "r": 0.5803921568627451,
        "g": 0.03529411764705882,
        "b": 0.03529411764705882,
        "a": 1
      },
      "emit": {
        "r": 1,
        "g": 0,
        "b": 0
      },
      "reflect": 0.8,
      "shadeless": false,
      "shadow": true,
      "specularColor": {
        "r": 0.5773502691896258,
        "g": 0.5773502691896258,
        "b": 0.5773502691896258
      },
      "specularLevel": 1,
      "layers": [],
      "morphTargets": false,
      "skinning": false,
      "type": "phong"
    },
    "size": [
      0.5,
      1,
      0.5
    ],
    "translation": [
      -4.87399959564209,
      -5.999998569488525,
      0.5040001273155212
    ],
    "scale": [
      1,
      0.9999998211860657,
      0.9999998211860657
    ],
    "rotation": [
      -1,
      0,
      0,
      89.99999237060547
    ],
    "owner": "Rob",
    "texture": "checker.jpg",
    "type": "Primitive",
    "tempid": "",
    "DisplayName": "cone1",
    "quaternion": [
      -0.7071067690849304,
      0,
      0,
      0.7071068286895752
    ],
    "height": 0.16,
    "radius": 0.1
  },
  "children": {
    "be1fabc2-1784-b4e8-ea76-c326bcc5600e": {
      "extends": "SandboxParticleSystem.vwf",
      "properties": {
        "owner": "Rob",
        "type": "ParticleSystem",
        "DisplayName": "ParticleSystem1",
        "transform": [
          0.9999998807907104,
          3.0720584801339438E-15,
          4.1719598442568895E-8,
          0,
          1.321999049130624E-15,
          1.000000238418579,
          -8.121186567677796E-8,
          0,
          -4.171959133714154E-8,
          8.12118585713506E-8,
          1.0000001192092896,
          0,
          0.015921633690595627,
          0.017000118270516396,
          -0.09707215428352356,
          1
        ],
        "minVelocity": [
          0.004,
          0.004,
          0.064
        ],
        "maxVelocity": [
          -0.007,
          -0.007,
          0.084
        ],
        "image": "/adl/sandbox/DnNE31e3uvYptRYw//vwfDataManager.svc/texture?UID=fire.png",
        "depthTest": false,
        "additive": true,
        "startSize": 0.18,
        "minLifeTime": 48,
        "maxLifeTime": 91,
        "endSize": 0.46,
        "counter": 293654,
        "visible": false,
        "minAcceleration": [
          0,
          0,
          -0.001
        ],
        "maxAcceleration": [
          0,
          0,
          -0.001
        ],
        "minOrientation": -17.9,
        "maxOrientation": 13.4,
        "endColor": [
          0,
          0,
          0,
          0.6
        ],
        "endAlpha": 0.6,
        "solver": "AnalyticShader"
      },
      "methods": {
        "makeFlameSound": {
          "body": "  this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/XAPIGame/flame.mp3\");\n        this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/XAPIGame/flame.mp3\", false, 100);\n",
          "parameters": []
        },
        "tick": {
          "body": " if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n     var localPlayer = this.transformAPI.globalToLocal(this.Scene.children_by_name.Player.transformAPI.getPosition());\n\n                                                                            if (Math.abs(localPlayer[0]) < 1.5 && Math.abs(localPlayer[1]) < 1.5 && localPlayer[2] > -1 && localPlayer[2] < 6)\n                                                                            {\n                                                                                this.counter++;\n                                                                                if (Math.sin(this.counter / 10) > 0)\n                                                                                {\n                                                                                    if (this.visible == false)\n                                                                                        this.makeFlameSound();\n                                                                                    this.visible = true;\n                                                                                }\n                                                                                else\n                                                                                    this.visible = false;\n                                                                            }\n                                                                            else\n                                                                                this.visible = false;\n\n                                                                            if (Math.abs(localPlayer[0]) < .4 && Math.abs(localPlayer[1]) < .4 && localPlayer[2] > -.2 && localPlayer[2] < 3.5 && this.visible === true)\n                                                                            {\n                                                                                this.Scene.children_by_name.GameCode.postDeath(this.DisplayName);\n                                                                                this.Scene.children_by_name.Player.Die();\n                                                                       }\n",
          "parameters": []
        }
      }
    }
  }
}
var doorTrap = {"extends":"box2.vwf","source":"vwf/model/threejs/box.js","type":"subDriver/threejs","properties":{"GameType":"TrapDoor","materialDef":{"shininess":15,"alpha":1,"ambient":{"r":0.5882352941176471,"g":0.5882352941176471,"b":0.5882352941176471},"color":{"r":0.5882352941176471,"g":0.5882352941176471,"b":0.5882352941176471,"a":1},"emit":{"r":0,"g":0,"b":0},"reflect":0.8,"shadeless":false,"shadow":true,"specularColor":{"r":0.5773502691896258,"g":0.5773502691896258,"b":0.5773502691896258},"specularLevel":1,"layers":[{"offsetx":0,"offsety":0,"scalex":1,"scaley":1,"rot":0,"blendMode":0,"mapTo":1,"mapInput":0,"alpha":1,"src":"/adl/sandbox/DnNE31e3uvYptRYw//vwfDataManager.svc/texture?UID=\\wests_textures\\paneling.png"}],"morphTargets":false,"skinning":false,"type":"phong"},"size":[1,1,1],"translation":[-1.4959990978240967,-4.681999683380127,1.4999926090240479],"scale":[1.0000001192092896,1.0000001192092896,1],"rotation":[0,0,1,180],"owner":"Rob","texture":"checker.jpg","type":"Primitive","tempid":"","DisplayName":"box1","transform":[-1.0000001192092896,4.023245381290508e-8,0,0,-4.023245381290508e-8,-1.0000001192092896,0,0,0,0,1,0,-1.4959990978240967,-4.681999683380127,1.4999926090240479,1],"quaternion":[0,0,1,0],"width":0.98,"_length":0.12,"counter":35178},"methods":{"makeGateSound":{"body":"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n                                                                                                                          this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/XAPIGame.boochch.mp3\");\n                                                                                                                              this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/XAPIGame/boochch.mp3\", false, 100);\n","parameters":[]},"tick":{"body":"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n                                                                                                            if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n                                                                                                                if (Vec3.distance(this.transformAPI.getPosition(), this.Scene.children_by_name.Player.transformAPI.getPosition()) < 1.5)\n                                                                                                                {\n                                                                                                                    this.counter += 1;\n                                                                                                                    this.translation[2] = .5 + (Math.sin(this.counter / 3) + 1) / 2;\n                                                                                                                    if (this.translation[2] > .5 && this.translation[2] < .505)\n                                                                                                                        this.makeGateSound();\n                                                                                                                    if (Vec3.distance(this.transformAPI.getPosition(), this.Scene.children_by_name.Player.transformAPI.getPosition()) < .35)\n                                                                                                                    {\n                                                                                                                        this.Scene.children_by_name.Player.Die();\n                                                                                                                        this.Scene.children_by_name.GameCode.postDeath(this.parent.DisplayName);\n                                                                                                                    }\n                                                                                                                }\n","parameters":[]}}}
var wayPoint = {"extends":"cylinder2.vwf","source":"vwf/model/threejs/cylinder.js","type":"subDriver/threejs","properties":{"GameType":"WayPoint","materialDef":{"shininess":15,"alpha":1,"ambient":{"r":0,"g":0.7176470588235294,"b":1},"color":{"r":0,"g":0.7176470588235294,"b":1,"a":1},"emit":{"r":0,"g":0,"b":0},"reflect":0.8,"shadeless":false,"shadow":true,"specularColor":{"r":0.5773502691896258,"g":0.5773502691896258,"b":0.5773502691896258},"specularLevel":1,"layers":[],"morphTargets":false,"skinning":false,"type":"phong"},"size":[1,0.5,0.5],"translation":[-0.8829997181892395,-0.7439999580383301,0.0010000000474974513],"scale":[1,1,1],"rotation":[1,0,0,0],"owner":"Rob","texture":"checker.jpg","type":"Primitive","tempid":"","DisplayName":"cylinder4","transform":[1,0,0,0,0,1,0,0,0,0,1,0,-0.8829997181892395,-0.7439999580383301,0.0010000000474974513,1],"quaternion":[0,0,0,1],"radius":0.35,"height":0.24},"children":{"4e6cce62-76ff-92a-4018-f3a66dc43733":{"extends":"SandboxParticleSystem.vwf","properties":{"owner":"Rob","type":"ParticleSystem","DisplayName":"ParticleSystem4","transform":[-4.171958423171418e-8,-0.9999998807907104,7.915092599354231e-15,0,0.999919056892395,-4.1716212706433e-8,-0.012740704230964184,0,0.012740678153932095,-5.315541895534182e-10,0.9999189972877502,0,0.0068735480308532715,-0.012549042701721191,0.7300000786781311,1],"minVelocity":[0.027,0.03,0.012],"maxVelocity":[-0.033,-0.037,0.012],"image":"/adl/sandbox/1OimhGKL2jk8Fdh4//vwfDataManager.svc/datafile/XAPIGame/spark.jpg","depthTest":false,"additive":true,"startSize":0.16,"minLifeTime":38,"maxLifeTime":40,"endSize":0.46,"counter":298728,"visible":false,"minAcceleration":[0,0,-0.001],"maxAcceleration":[0,0,-0.001],"minOrientation":-17.9,"maxOrientation":13.4,"endColor":[0,0,0,0.6],"endAlpha":0.6,"solver":"AnalyticShader","startColor":[0.2549019607843137,0.4,0.9803921568627451,0.45],"startColor_noAplha":[0.2549019607843137,0.4,0.9803921568627451],"active":true,"startAlpha":0.45,"alphaTest":0.255},"methods":{"makeRingSound":{"body":"\n\n\n\n\n\n              this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/XAPIGame/ring.mp3\");\n                    this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/XAPIGame/ring.mp3\", false, 100);\n","parameters":[]},"reset":{"body":"\n\n\n\n        this.active = true;\n            this.visible = false;\n","parameters":[]},"tick":{"body":"\n  if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n      var localPlayer = this.transformAPI.globalToLocal(this.Scene.children_by_name.Player.transformAPI.getPosition());\n\n      if (Vec3.magnitude(localPlayer) < .5)\n      {\n          if (this.visible == false)\n          {\n              this.active = false;\n              this.Scene.children_by_name.GameCode.postWaypoint(this.parent.DisplayName); this.makeRingSound();\n          }\n          this.visible = true;\n      }\n","parameters":[]}}}}}
var laserTrap = {"extends": "cone2.vwf", "source": "vwf/model/threejs/cone.js", "type": "subDriver/threejs", "properties": {"GameType": "FlameThrower", "transform": [-3.58659268950845E-10, 0, 1, 0, -0.79181307554245, -0.6097365021705627, -2.839905255402897E-10, 0, 0.6091272234916687, -0.7926051616668701, 2.1846846554041122E-10, 0, 0.15271449089050293, 0.9135131239891052, 0.5, 1 ], "materialDef": {"shininess": 15, "alpha": 1, "ambient": {"r": 0.34509803921568627, "g": 0.0392156862745098, "b": 1 }, "color": {"r": 0.34509803921568627, "g": 0.0392156862745098, "b": 1, "a": 1 }, "emit": {"r": 0.17647058823529413, "g": 0.0392156862745098, "b": 0.9686274509803922 }, "reflect": 0.8, "shadeless": false, "shadow": true, "specularColor": {"r": 0.5773502691896258, "g": 0.5773502691896258, "b": 0.5773502691896258 }, "specularLevel": 1, "layers": [], "morphTargets": false, "skinning": false, "type": "phong", "metal": false, "blendMode": 1 }, "size": [0.5, 1, 0.5 ], "translation": [0.15271449089050293, 0.9135131239891052, 0.5 ], "scale": [1, 0.9993730783462524, 0.9996293783187866 ], "rotation": [0.6678335666656494, -0.3286285400390625, 0.6678335666656494, 143.61599731445312 ], "owner": "Rob", "texture": "checker.jpg", "type": "Primitive", "tempid": "", "DisplayName": "Laser", "quaternion": [0.6344523429870605, -0.3122022747993469, 0.6344523429870605, 0.3122022747993469 ], "height": 0.53, "radius": 0.1 }, "children": {"df6a4edc-23a7-e944-48b4-b93e76c34889": {"extends": "SandboxParticleSystem.vwf", "properties": {"owner": "Rob", "type": "ParticleSystem", "DisplayName": "ParticleSystem1", "transform": [0.9999998807907104, 3.0720584801339438E-15, 4.1719598442568895E-8, 0, 1.321999049130624E-15, 1.000000238418579, -8.121186567677796E-8, 0, -4.171959133714154E-8, 8.12118585713506E-8, 1.0000001192092896, 0, 0.015921633690595627, 0.017000118270516396, -0.09707215428352356, 1 ], "minVelocity": [0, 0, 0.064 ], "maxVelocity": [0, 0, 0.084 ], "image": "/adl/sandbox/DnNE31e3uvYptRYw//vwfDataManager.svc/datafile/XAPIGame/spark.jpg", "depthTest": false, "additive": true, "startSize": 0.18, "minLifeTime": 23, "maxLifeTime": 23, "endSize": 0.19, "counter": 294588, "visible": true, "minAcceleration": [0, 0, 0 ], "maxAcceleration": [0, 0, 0 ], "minOrientation": -30, "maxOrientation": -30, "endColor": [0.058823529411764705, 0.058823529411764705, 1, 0.6 ], "endAlpha": 0.6, "solver": "AnalyticShader", "alphaTest": 0, "endColor_noAplha": [0.058823529411764705, 0.058823529411764705, 1 ], "textureTiles": 1, "emitterType": "sphere", "emitterSize": [1, 1, 0 ], "startColor": [0.49019607843137253, 0, 0.9490196078431372, 1 ], "startColor_noAplha": [0.49019607843137253, 0, 0.9490196078431372 ] }, "methods": {"makeFlameSound": {"body": "\n    this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/XAPIGame/flame.mp3\");\n          this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/XAPIGame/flame.mp3\", false, 100);\n", "parameters": [] }, "tick": {"body": "\n  if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n      var localPlayer = this.transformAPI.globalToLocal(this.Scene.children_by_name.Player.transformAPI.getPosition());\n\n      if (Math.abs(localPlayer[0]) < .1 && Math.abs(localPlayer[1]) < .1 && localPlayer[2] > -.2 && localPlayer[2] < 3 && this.visible === true)\n      {\n          this.Scene.children_by_name.GameCode.postDeath(this.DisplayName);\n          this.Scene.children_by_name.Player.Die();\n      }\n", "parameters": [] } } }, "9c06dc7f-f09f-82b9-1a30-60a3da102b01": {"extends": "rotator.vwf", "properties": {"owner": "Rob", "type": "behavior", "DisplayName": "rotator3", "Local": true, "Axis": "Y", "Active": true } } } }
var Enemy = {
  "extends": "sphere2.vwf",
  "source": "vwf/model/threejs/sphere.js",
  "type": "subDriver/threejs",
  "properties": {
    "materialDef": {
      "shininess": 15,
      "alpha": 1,
      "ambient": {
        "r": 0.9411764705882353,
        "g": 0.07450980392156863,
        "b": 0.07450980392156863
      },
      "color": {
        "r": 0.9411764705882353,
        "g": 0.07450980392156863,
        "b": 0.07450980392156863,
        "a": 1
      },
      "emit": {
        "r": 0,
        "g": 0,
        "b": 0
      },
      "reflect": 0.8,
      "shadeless": false,
      "shadow": true,
      "specularColor": {
        "r": 0.5773502691896258,
        "g": 0.5773502691896258,
        "b": 0.5773502691896258
      },
      "specularLevel": 1,
      "layers": [],
      "morphTargets": false,
      "skinning": false,
      "type": "phong"
    },
    "size": [
      0.5,
      1,
      1
    ],
    "translation": [
      2.4216508865356445,
      -0.5853449106216431,
      0.6010000109672546
    ],
    "scale": [
      1,
      1,
      1
    ],
    "rotation": [
      1,
      0,
      0,
      0
    ],
    "owner": "Rob",
    "texture": "checker.jpg",
    "type": "Primitive",
    "tempid": "",
    "DisplayName": "sphere2",
    "transform": [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      2.4216508865356445,
      -0.5853449106216431,
      0.6010000109672546,
      1
    ],
    "quaternion": [
      0,
      0,
      0,
      1
    ],
    "radius": 0.42,
    "GameType": "Enemy"
  },
  "methods": {
    "tryMove": {
      "body": "\n\n    if (Vec3.magnitude(dir) == 0) return false;\n\n        var transform = this.translation.internal_val;\n        var newpos = Vec3.add(transform, dir, []);\n        var hits = _SceneManager.SphereCast(newpos, .3,\n        {\n            OneHitPerMesh: true,\n            ignore: [_dSky, _Editor.findviewnode(this.id)]\n        });\n\n        if (hits && hits.length)\n        {\n\n            return false;\n        }\n        return true;\n",
      "parameters": [
        "dir"
      ]
    },
    "reset": {
      "body": "\n\n    if(this.startingLocation)\n        {\n            this.transformAPI.setPosition(this.startingLocation);   \n        }\n",
      "parameters": []
    },
    "tick": {
      "body": "\n  if (this.Scene.children_by_name.GameCode.paused === true) return;\n      //This function was created for you by the system. \n      //The tick function is called 20 times every second. \n      // Write code here to animate over time\n      var toPlayer = Vec3.subtract(this.Scene.children_by_name.Player.transformAPI.getPosition(), this.transformAPI.getPosition(), []);\n      var hits = this.Scene.traceAPI.rayCast(this.transformAPI.getPosition(), toPlayer,\n      {\n          ignore: [this.id]\n      });\n      if (!this.sign)\n          this.sign = function(num)\n          {\n              return num > 0 ? 1 : -1;\n      }\n     \n      if (Vec3.distance(this.transformAPI.getPosition(), this.Scene.children_by_name.Player.transformAPI.getPosition()) < .74)\n      {\n\n          if (hits.node == this.Scene.children_by_name.Player)\n             { this.Scene.children_by_name.Player.Die();\n this.Scene.children_by_name.GameCode.postDeath(this.DisplayName);  }    }\n      else if (Vec3.distance(this.transformAPI.getPosition(), this.Scene.children_by_name.Player.transformAPI.getPosition()) < 4)\n      {\n          var max = Math.max(Math.abs(toPlayer[0]), Math.abs(toPlayer[1]), Math.abs(toPlayer[2]));\n          if (max == Math.abs(toPlayer[0]))\n              if (this.tryMove([this.sign(toPlayer[0]) / 10, 0, 0]))\n                  this.transformAPI.move(this.sign(toPlayer[0]) / 10, 0, 0);\n              else if (this.tryMove([0, this.sign(toPlayer[1]) / 10, 0]))\n              this.transformAPI.move(0, this.sign(toPlayer[1]) / 10, 0);\n          if (max == Math.abs(toPlayer[1]))\n              if (this.tryMove([0, this.sign(toPlayer[1]) / 10, 0]))\n                  this.transformAPI.move(0, this.sign(toPlayer[1]) / 10, 0);\n              else if (this.tryMove([this.sign(toPlayer[0]) / 10, 0, 0]))\n              this.transformAPI.move(this.sign(toPlayer[0]) / 10, 0, 0);\n\n      }\n",
      "parameters": []
    }
  }
}

function dropFire(e)
{

	undoStack.push(FLAMETHROWER);
	console.log(e);
	var insetpoint = _Editor.GetInsertPoint(e);
	insetpoint[2] = .5;
	var campos = _Editor.getCameraPosition();
	
	var ray;
	ray = _Editor.GetWorldPickRay(e);
	var dxy2 = _Editor.intersectLinePlane(ray, campos, [0, 0, .5], [0, 0, 1]);
	var newintersectxy2 = MATH.addVec3(campos, MATH.scaleVec3(ray, dxy2));
	
	var left = _SceneManager.CPUPick(insetpoint,[0,1,0],{ignore:[_dSky]});
	var right = _SceneManager.CPUPick(insetpoint,[0,-1,0],{ignore:[_dSky]});
	var bottom = _SceneManager.CPUPick(insetpoint,[1,0,0],{ignore:[_dSky]});
	var top = _SceneManager.CPUPick(insetpoint,[-1,0,0],{ignore:[_dSky]});

	var min = left || right || bottom || top;;
	if(left && left.distance < min.distance)
		min = left
	if(right && right.distance < min.distance)
		min = right
	if(bottom && bottom.distance < min.distance)
		min = bottom
	if(top && top.distance < min.distance)
		min = top

	console.log(min);
	if(!min) return;

	var norm = min.norm;
	var up = [0,0,1];
	var cross = Vec3.cross(up,norm,[]);
	

	fireTrap.properties.transform[0] = cross[0];
	fireTrap.properties.transform[1] = cross[1];
	fireTrap.properties.transform[2] = cross[2];

	fireTrap.properties.transform[4] = up[0];
	fireTrap.properties.transform[5] = up[1];
	fireTrap.properties.transform[6] = up[2];

	fireTrap.properties.transform[8] = norm[0];
	fireTrap.properties.transform[9] =  norm[1];
	fireTrap.properties.transform[10] =  norm[2];

	fireTrap.properties.transform[12] = min.point[0] + norm[0]/10;
	fireTrap.properties.transform[13] = min.point[1] + norm[1]/10;
	fireTrap.properties.transform[14] = min.point[2] + norm[2]/10;

	fireTrap.properties.translation[0] = fireTrap.properties.transform[12];
	fireTrap.properties.translation[1] = fireTrap.properties.transform[13];
	fireTrap.properties.translation[2] = fireTrap.properties.transform[14];

	fireTrap.properties.owner = _UserManager.GetCurrentUserName();
	fireTrap.properties.DisplayName = _Editor.GetUniqueName('FlameThrower');
	_Editor.createChild('index-vwf',GUID(),_DataManager.getCleanNodePrototype(fireTrap));
	$(dragElement).css('display','none');
	$('#index-vwf').focus();
	postCreateEvent('fireTrap',fireTrap.properties.DisplayName,fireTrap.properties.translation);
	return true;

}

function dropLaser(e)
{

	undoStack.push(LASER);
	console.log(e);
	var insetpoint = _Editor.GetInsertPoint(e);
	insetpoint[2] = .5;
	var campos = _Editor.getCameraPosition();
	
	var ray;
	ray = _Editor.GetWorldPickRay(e);
	var dxy2 = _Editor.intersectLinePlane(ray, campos, [0, 0, .5], [0, 0, 1]);
	var newintersectxy2 = MATH.addVec3(campos, MATH.scaleVec3(ray, dxy2));
	
	var left = _SceneManager.CPUPick(insetpoint,[0,1,0],{ignore:[_dSky]});
	var right = _SceneManager.CPUPick(insetpoint,[0,-1,0],{ignore:[_dSky]});
	var bottom = _SceneManager.CPUPick(insetpoint,[1,0,0],{ignore:[_dSky]});
	var top = _SceneManager.CPUPick(insetpoint,[-1,0,0],{ignore:[_dSky]});

	var min = left || right || bottom || top;;
	if(left && left.distance < min.distance)
		min = left
	if(right && right.distance < min.distance)
		min = right
	if(bottom && bottom.distance < min.distance)
		min = bottom
	if(top && top.distance < min.distance)
		min = top

	console.log(min);
	if(!min) return;

	var norm = min.norm;
	var up = [0,0,1];
	var cross = Vec3.cross(up,norm,[]);
	

	laserTrap.properties.transform[0] = cross[0];
	laserTrap.properties.transform[1] = cross[1];
	laserTrap.properties.transform[2] = cross[2];

	laserTrap.properties.transform[4] = up[0];
	laserTrap.properties.transform[5] = up[1];
	laserTrap.properties.transform[6] = up[2];

	laserTrap.properties.transform[8] = norm[0];
	laserTrap.properties.transform[9] =  norm[1];
	laserTrap.properties.transform[10] =  norm[2];

	laserTrap.properties.transform[12] = min.point[0] - norm[0]/10;
	laserTrap.properties.transform[13] = min.point[1] - norm[1]/10;
	laserTrap.properties.transform[14] = min.point[2] - norm[2]/10;

	laserTrap.properties.translation[0] = laserTrap.properties.transform[12];
	laserTrap.properties.translation[1] = laserTrap.properties.transform[13];
	laserTrap.properties.translation[2] = laserTrap.properties.transform[14];

	laserTrap.properties.owner = _UserManager.GetCurrentUserName();
	laserTrap.properties.DisplayName = _Editor.GetUniqueName('FlameThrower');
	_Editor.createChild('index-vwf',GUID(),_DataManager.getCleanNodePrototype(laserTrap));
	$(dragElement).css('display','none');
	$('#index-vwf').focus();
	postCreateEvent('laserTrap',laserTrap.properties.DisplayName,laserTrap.properties.translation);
	return true;

}

function dropDoor(e)
{

	undoStack.push(TRAPDOOR);
	console.log(e);
	var insetpoint = _Editor.GetInsertPoint(e);
	insetpoint[2] = .5;
	var campos = _Editor.getCameraPosition();
	
	var ray;
	ray = _Editor.GetWorldPickRay(e);
	var dxy2 = _Editor.intersectLinePlane(ray, campos, [0, 0, .5], [0, 0, 1]);
	var newintersectxy2 = MATH.addVec3(campos, MATH.scaleVec3(ray, dxy2));
	
	var left = _SceneManager.CPUPick(insetpoint,[0,1,0],{ignore:[_dSky]});
	var right = _SceneManager.CPUPick(insetpoint,[0,-1,0],{ignore:[_dSky]});
	var bottom = _SceneManager.CPUPick(insetpoint,[1,0,0],{ignore:[_dSky]});
	var top = _SceneManager.CPUPick(insetpoint,[-1,0,0],{ignore:[_dSky]});

	var min = left || right || bottom || top;;
	if(left && left.distance < min.distance)
		min = left
	if(right && right.distance < min.distance)
		min = right
	if(bottom && bottom.distance < min.distance)
		min = bottom
	if(top && top.distance < min.distance)
		min = top

	console.log(min);
	if(!min) return;

	var norm = min.norm;
	var up = [0,0,1];
	var cross = Vec3.cross(up,norm,[]);
	

	doorTrap.properties.transform[0] = -cross[0];
	doorTrap.properties.transform[1] = -cross[1];
	doorTrap.properties.transform[2] = -cross[2];

	doorTrap.properties.transform[8] = up[0];
	doorTrap.properties.transform[9] = up[1];
	doorTrap.properties.transform[10] = up[2];

	doorTrap.properties.transform[4] = norm[0];
	doorTrap.properties.transform[5] =  norm[1];
	doorTrap.properties.transform[6] =  norm[2];

	doorTrap.properties.transform[12] = min.point[0] + norm[0] * .49;
	doorTrap.properties.transform[13] = min.point[1] + norm[1] * .49;
	doorTrap.properties.transform[14] = min.point[2] + norm[2] * .49;

	doorTrap.properties.translation[0] = doorTrap.properties.transform[12];
	doorTrap.properties.translation[1] = doorTrap.properties.transform[13];
	doorTrap.properties.translation[2] = doorTrap.properties.transform[14];

	doorTrap.properties.owner = _UserManager.GetCurrentUserName();
	doorTrap.properties.DisplayName = _Editor.GetUniqueName('Trapdoor');
	_Editor.createChild('index-vwf',GUID(),_DataManager.getCleanNodePrototype(doorTrap));
	$('#index-vwf').focus();
	$(dragElement).css('display','none');
	postCreateEvent('Trapdoor',doorTrap.properties.DisplayName,doorTrap.properties.translation);
	return true;

}

function dropWaypoint(e)
{

	undoStack.push(WAYPOINT);
	console.log(e);
	var insetpoint = _Editor.GetInsertPoint(e);
	insetpoint[2] = .15;
	var campos = _Editor.getCameraPosition();
	
	var ray;
	ray = _Editor.GetWorldPickRay(e);
	var dxy2 = _Editor.intersectLinePlane(ray, campos, [0, 0, .15], [0, 0, 1]);
	var newintersectxy2 = MATH.addVec3(campos, MATH.scaleVec3(ray, dxy2));
	
	var left = _SceneManager.CPUPick(insetpoint,[0,1,0],{ignore:[_dSky]});
	var right = _SceneManager.CPUPick(insetpoint,[0,-1,0],{ignore:[_dSky]});
	var bottom = _SceneManager.CPUPick(insetpoint,[1,0,0],{ignore:[_dSky]});
	var top = _SceneManager.CPUPick(insetpoint,[-1,0,0],{ignore:[_dSky]});

	var min = left || right || bottom || top;;
	if(left && left.distance < min.distance)
		min = left
	if(right && right.distance < min.distance)
		min = right
	if(bottom && bottom.distance < min.distance)
		min = bottom
	if(top && top.distance < min.distance)
		min = top

	console.log(min);
	if(!min) return;

	var norm = min.norm;

	wayPoint.properties.transform[12] = min.point[0] + norm[0] * .49;
	wayPoint.properties.transform[13] = min.point[1] + norm[1] * .49;
	wayPoint.properties.transform[14] = min.point[2] + norm[2] * .49;

	wayPoint.properties.translation[0] = wayPoint.properties.transform[12];
	wayPoint.properties.translation[1] = wayPoint.properties.transform[13];
	wayPoint.properties.translation[2] = wayPoint.properties.transform[14];

	wayPoint.properties.owner = _UserManager.GetCurrentUserName();
	wayPoint.properties.DisplayName = _Editor.GetUniqueName('WayPoint');
	_Editor.createChild('index-vwf',GUID(),_DataManager.getCleanNodePrototype(wayPoint));
	$('#index-vwf').focus();
	$(dragElement).css('display','none');
	postCreateEvent('WayPoint',wayPoint.properties.DisplayName,wayPoint.properties.translation);
	return true;

}


function dropEnemy(e)
{

	undoStack.push(ENEMY);
	console.log(e);
	var insetpoint = _Editor.GetInsertPoint(e);
	insetpoint[2] = .15;
	var campos = _Editor.getCameraPosition();
	
	var ray;
	ray = _Editor.GetWorldPickRay(e);
	var dxy2 = _Editor.intersectLinePlane(ray, campos, [0, 0, .15], [0, 0, 1]);
	var newintersectxy2 = MATH.addVec3(campos, MATH.scaleVec3(ray, dxy2));
	
	var left = _SceneManager.CPUPick(insetpoint,[0,1,0],{ignore:[_dSky]});
	var right = _SceneManager.CPUPick(insetpoint,[0,-1,0],{ignore:[_dSky]});
	var bottom = _SceneManager.CPUPick(insetpoint,[1,0,0],{ignore:[_dSky]});
	var top = _SceneManager.CPUPick(insetpoint,[-1,0,0],{ignore:[_dSky]});

	var min = left || right || bottom || top;;
	if(left && left.distance < min.distance)
		min = left
	if(right && right.distance < min.distance)
		min = right
	if(bottom && bottom.distance < min.distance)
		min = bottom
	if(top && top.distance < min.distance)
		min = top

	console.log(min);
	if(!min) return;

	var norm = min.norm;

	Enemy.properties.transform[12] = min.point[0] + norm[0] * .49;
	Enemy.properties.transform[13] = min.point[1] + norm[1] * .49;
	Enemy.properties.transform[14] = .55;

	Enemy.properties.translation[0] = Enemy.properties.transform[12];
	Enemy.properties.translation[1] = Enemy.properties.transform[13];
	Enemy.properties.translation[2] = .55;

	Enemy.properties.owner = _UserManager.GetCurrentUserName();
	Enemy.properties.DisplayName = _Editor.GetUniqueName('Enemy');
	Enemy.properties.startingLocation = Enemy.properties.translation;
	_Editor.createChild('index-vwf',GUID(),_DataManager.getCleanNodePrototype(Enemy));
	$('#index-vwf').focus();
	$(dragElement).css('display','none');
	postCreateEvent('Enemy',Enemy.properties.DisplayName,Enemy.properties.startingLocation);
	return true;

}