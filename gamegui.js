hideTools();
$(document.body).append('<div id="gameEditGUI"></div>')
$('#gameEditGUI').dialog({
	title:'Edit Game Board',
	autoOpen:true,
	position:[50,100],
	height:400,
	width:100
});

$('#gameEditGUI').parent().find('.ui-dialog-titlebar button').css('display','none');
$('#gameEditGUI').append('<div id="undoButton">Undo</div>');
$('#gameEditGUI').append('<div id="clearButton">Clear</div>');
$('#undoButton').button();
$('#undoButton').click(function()
	{
		_UndoManager.undo();
	});
$('#clearButton').button();
$('#clearButton').click(function()
	{
		var objects = vwf.models.object.objects;
		for(var i in objects)
		{
			var gameType = vwf.getProperty(i,'GameType');
			if(gameType == 'TrapDoor' || gameType == 'FlameThrower' || gameType == 'WayPoint')
			{
				vwf_view.kernel.deleteNode(i);
			}
		}
	});
$('#gameEditGUI').append('<div id="createFire"  draggable="true" style="width: 50px;height: 50px;background: black;color:white;margin: auto;">Flame Thrower</div>');
$('#gameEditGUI').append('<div id="createDoor"  draggable="true" style="width: 50px;height: 50px;background: black;color:white;margin: auto;">Trap Door</div>');
$('#gameEditGUI').append('<div id="createWaypoint"  draggable="true" style="width: 50px;height: 50px;background: black;color:white;margin: auto;">Way Point</div>');
$('#createFire')[0].ondragstart = function(){

	console.log('here');
	$('#index-vwf')[0].ondrop = dropFire;
	return true;
}
$('#createWaypoint')[0].ondragstart = function(){

	console.log('here');
	$('#index-vwf')[0].ondrop = dropWaypoint;
	return true;
}

$('#createDoor')[0].ondragstart = function(){

	console.log('here');
	$('#index-vwf')[0].ondrop = dropDoor;
	return true;
}

var fireTrap = {"extends": "cone2.vwf", "source": "vwf/model/threejs/cone.js", "type": "subDriver/threejs", "properties": {"GameType":"FlameThrower","transform": [1, 0, 0, 0, 0, 7.363584586528304E-8, -0.9999998211860657, 0, 0, 0.9999998211860657, 7.363584586528304E-8, 0, -4.87399959564209, -5.999998569488525, 0.5040001273155212, 1 ], "materialDef": {"shininess": 15, "alpha": 1, "ambient": {"r": 0.5803921568627451, "g": 0.03529411764705882, "b": 0.03529411764705882 }, "color": {"r": 0.5803921568627451, "g": 0.03529411764705882, "b": 0.03529411764705882, "a": 1 }, "emit": {"r": 1, "g": 0, "b": 0 }, "reflect": 0.8, "shadeless": false, "shadow": true, "specularColor": {"r": 0.5773502691896258, "g": 0.5773502691896258, "b": 0.5773502691896258 }, "specularLevel": 1, "layers": [], "morphTargets": false, "skinning": false, "type": "phong"}, "size": [0.5, 1, 0.5 ], "translation": [-4.87399959564209, -5.999998569488525, 0.5040001273155212 ], "scale": [1, 0.9999998211860657, 0.9999998211860657 ], "rotation": [-1, 0, 0, 89.99999237060547 ], "owner": "Rob", "texture": "checker.jpg", "type": "Primitive", "tempid": "", "DisplayName": "cone1", "quaternion": [-0.7071067690849304, 0, 0, 0.7071068286895752 ], "height": 0.16, "radius": 0.1 }, "children": {"be1fabc2-1784-b4e8-ea76-c326bcc5600e": {"extends": "SandboxParticleSystem.vwf", "properties": {"owner": "Rob", "type": "ParticleSystem", "DisplayName": "ParticleSystem1", "transform": [0.9999998807907104, 3.0720584801339438E-15, 4.1719598442568895E-8, 0, 1.321999049130624E-15, 1.000000238418579, -8.121186567677796E-8, 0, -4.171959133714154E-8, 8.12118585713506E-8, 1.0000001192092896, 0, 0.015921633690595627, 0.017000118270516396, -0.09707215428352356, 1 ], "minVelocity": [0.004, 0.004, 0.064 ], "maxVelocity": [-0.007, -0.007, 0.084 ], "image": "/adl/sandbox/DnNE31e3uvYptRYw//vwfDataManager.svc/texture?UID=fire.png", "depthTest": false, "additive": true, "startSize": 0.18, "minLifeTime": 48, "maxLifeTime": 91, "endSize": 0.46, "counter": 293654, "visible": false, "minAcceleration": [0, 0, -0.001 ], "maxAcceleration": [0, 0, -0.001 ], "minOrientation": -17.9, "maxOrientation": 13.4, "endColor": [0, 0, 0, 0.6 ], "endAlpha": 0.6, "solver": "AnalyticShader"}, "methods": {"makeFlameSound": {"body": "  this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/flame.mp3\");\n        this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/flame.mp3\", false, 100);\n", "parameters": [] }, "tick": {"body": " if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n     var localPlayer = this.transformAPI.globalToLocal(this.Scene.children_by_name.Player.transformAPI.getPosition());\n\n                                                                            if (Math.abs(localPlayer[0]) < 1.5 && Math.abs(localPlayer[1]) < 1.5 && localPlayer[2] > -1 && localPlayer[2] < 6)\n                                                                            {\n                                                                                this.counter++;\n                                                                                if (Math.sin(this.counter / 10) > 0)\n                                                                                {\n                                                                                    if (this.visible == false)\n                                                                                        this.makeFlameSound();\n                                                                                    this.visible = true;\n                                                                                }\n                                                                                else\n                                                                                    this.visible = false;\n                                                                            }\n                                                                            else\n                                                                                this.visible = false;\n\n                                                                            if (Math.abs(localPlayer[0]) < .4 && Math.abs(localPlayer[1]) < .4 && localPlayer[2] > -.2 && localPlayer[2] < 3.5 && this.visible === true)\n                                                                            {\n                                                                                this.Scene.children_by_name.GameCode.postDeath(this.DisplayName);\n                                                                                this.Scene.children_by_name.Player.Die();\n                                                                            }\n", "parameters": [] } } } } }
var doorTrap = {"extends":"box2.vwf","source":"vwf/model/threejs/box.js","type":"subDriver/threejs","properties":{"GameType":"TrapDoor","materialDef":{"shininess":15,"alpha":1,"ambient":{"r":0.5882352941176471,"g":0.5882352941176471,"b":0.5882352941176471},"color":{"r":0.5882352941176471,"g":0.5882352941176471,"b":0.5882352941176471,"a":1},"emit":{"r":0,"g":0,"b":0},"reflect":0.8,"shadeless":false,"shadow":true,"specularColor":{"r":0.5773502691896258,"g":0.5773502691896258,"b":0.5773502691896258},"specularLevel":1,"layers":[{"offsetx":0,"offsety":0,"scalex":1,"scaley":1,"rot":0,"blendMode":0,"mapTo":1,"mapInput":0,"alpha":1,"src":"/adl/sandbox/DnNE31e3uvYptRYw//vwfDataManager.svc/texture?UID=\\wests_textures\\paneling.png"}],"morphTargets":false,"skinning":false,"type":"phong"},"size":[1,1,1],"translation":[-1.4959990978240967,-4.681999683380127,1.4999926090240479],"scale":[1.0000001192092896,1.0000001192092896,1],"rotation":[0,0,1,180],"owner":"Rob","texture":"checker.jpg","type":"Primitive","tempid":"","DisplayName":"box1","transform":[-1.0000001192092896,4.023245381290508e-8,0,0,-4.023245381290508e-8,-1.0000001192092896,0,0,0,0,1,0,-1.4959990978240967,-4.681999683380127,1.4999926090240479,1],"quaternion":[0,0,1,0],"width":0.98,"_length":0.12,"counter":35178},"methods":{"makeGateSound":{"body":"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n                                                                                                                          this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/boochch.mp3\");\n                                                                                                                              this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/boochch.mp3\", false, 100);\n","parameters":[]},"tick":{"body":"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n                                                                                                            if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n                                                                                                                if (Vec3.distance(this.transformAPI.getPosition(), this.Scene.children_by_name.Player.transformAPI.getPosition()) < 1.5)\n                                                                                                                {\n                                                                                                                    this.counter += 1;\n                                                                                                                    this.translation[2] = .5 + (Math.sin(this.counter / 3) + 1) / 2;\n                                                                                                                    if (this.translation[2] > .5 && this.translation[2] < .505)\n                                                                                                                        this.makeGateSound();\n                                                                                                                    if (Vec3.distance(this.transformAPI.getPosition(), this.Scene.children_by_name.Player.transformAPI.getPosition()) < .35)\n                                                                                                                    {\n                                                                                                                        this.Scene.children_by_name.Player.Die();\n                                                                                                                        this.Scene.children_by_name.GameCode.postDeath(this.parent.DisplayName);\n                                                                                                                    }\n                                                                                                                }\n","parameters":[]}}}
var wayPoint = {"extends":"cylinder2.vwf","source":"vwf/model/threejs/cylinder.js","type":"subDriver/threejs","properties":{"GameType":"WayPoint","materialDef":{"shininess":15,"alpha":1,"ambient":{"r":0,"g":0.7176470588235294,"b":1},"color":{"r":0,"g":0.7176470588235294,"b":1,"a":1},"emit":{"r":0,"g":0,"b":0},"reflect":0.8,"shadeless":false,"shadow":true,"specularColor":{"r":0.5773502691896258,"g":0.5773502691896258,"b":0.5773502691896258},"specularLevel":1,"layers":[],"morphTargets":false,"skinning":false,"type":"phong"},"size":[1,0.5,0.5],"translation":[-0.8829997181892395,-0.7439999580383301,0.0010000000474974513],"scale":[1,1,1],"rotation":[1,0,0,0],"owner":"Rob","texture":"checker.jpg","type":"Primitive","tempid":"","DisplayName":"cylinder4","transform":[1,0,0,0,0,1,0,0,0,0,1,0,-0.8829997181892395,-0.7439999580383301,0.0010000000474974513,1],"quaternion":[0,0,0,1],"radius":0.35,"height":0.24},"children":{"4e6cce62-76ff-92a-4018-f3a66dc43733":{"extends":"SandboxParticleSystem.vwf","properties":{"owner":"Rob","type":"ParticleSystem","DisplayName":"ParticleSystem4","transform":[-4.171958423171418e-8,-0.9999998807907104,7.915092599354231e-15,0,0.999919056892395,-4.1716212706433e-8,-0.012740704230964184,0,0.012740678153932095,-5.315541895534182e-10,0.9999189972877502,0,0.0068735480308532715,-0.012549042701721191,0.7300000786781311,1],"minVelocity":[0.027,0.03,0.012],"maxVelocity":[-0.033,-0.037,0.012],"image":"/adl/sandbox/1OimhGKL2jk8Fdh4//vwfDataManager.svc/texture?UID=\\Particles\\spark.jpg","depthTest":false,"additive":true,"startSize":0.16,"minLifeTime":38,"maxLifeTime":40,"endSize":0.46,"counter":298728,"visible":false,"minAcceleration":[0,0,-0.001],"maxAcceleration":[0,0,-0.001],"minOrientation":-17.9,"maxOrientation":13.4,"endColor":[0,0,0,0.6],"endAlpha":0.6,"solver":"AnalyticShader","startColor":[0.2549019607843137,0.4,0.9803921568627451,0.45],"startColor_noAplha":[0.2549019607843137,0.4,0.9803921568627451],"active":true,"startAlpha":0.45,"alphaTest":0.255},"methods":{"makeRingSound":{"body":"\n\n\n\n\n\n              this.audioAPI.stopSound(\"./vwfdatamanager.svc/datafile/ring.mp3\");\n                    this.audioAPI.playSound(\"./vwfdatamanager.svc/datafile/ring.mp3\", false, 100);\n","parameters":[]},"reset":{"body":"\n\n\n\n        this.active = true;\n            this.visible = false;\n","parameters":[]},"tick":{"body":"\n  if (this.Scene.children_by_name.GameCode.paused === true) return;\n\n      var localPlayer = this.transformAPI.globalToLocal(this.Scene.children_by_name.Player.transformAPI.getPosition());\n\n      if (Vec3.magnitude(localPlayer) < .5)\n      {\n          if (this.visible == false)\n          {\n              this.active = false;\n              this.Scene.children_by_name.GameCode.postWaypoint(this.parent.DisplayName); this.makeRingSound();\n          }\n          this.visible = true;\n      }\n","parameters":[]}}}}}
function dropFire(e)
{


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
	return true;

}

function dropDoor(e)
{


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
	fireTrap.properties.DisplayName = _Editor.GetUniqueName('Trapdoor');
	_Editor.createChild('index-vwf',GUID(),_DataManager.getCleanNodePrototype(doorTrap));
	return true;

}

function dropWaypoint(e)
{


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
	return true;

}