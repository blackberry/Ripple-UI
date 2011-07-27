//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// Wii Opera SDK - 3D Math Class v2.7.22 2008-12-14                         //
// (c) 2007-2008 Daniel Gump. All Rights Reserved.                          //
// http://wiioperasdk.com, http://hullbreachonline.com                      //
// hullbreach@hullbreachonline.com                                          //
//                                                                          //
//  Wii is a trademark of Nintendo Co., Ltd.                                //
//  Opera is a trademark of Opera, ASA.                                     //
//  This software package is not associated with either company             //
//  but was created to support users of both.  Its alternative name         //
//  when supporting other products is the HULLBREACH SDK.                   //
//                                                                          //
//  Redistribution and use in source and binary forms, with or without      //
//  modification, are permitted provided that the following conditions      //
//  are met:                                                                //
//    * Redistributions of source code must retain the above copyright      //
//      notice, this list of conditions and the following disclaimer.       //
//    * Redistributions in binary form must reproduce the above copyright   //
//      notice, this list of conditions and the following disclaimer in     //
//      the documentation and/or other materials provided with the          //
//      distribution.                                                       //
//    * Neither the names HULLBREACH ONLINE nor WII OPERA SDK nor the names //
//      of its contributors may be used to endorse or promote products      //
//      derived from this software without specific prior written           //
//      permission.                                                         //
//    * If the explicit purpose of the software is not to support the       //
//      Nintendo Wii or the Opera Web browser, then the names of such must  //
//      not be used in any derived product. The name shall be the           //
//      HULLBREACH SDK with a reference link to http://hullbreachonline.    //
//                                                                          //
//  THIS SOFTWARE IS PROVIDED BY Daniel Gump ''AS IS'' AND ANY EXPRESS OR   //
//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED          //
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE  //
//  DISCLAIMED. IN NO EVENT SHALL Daniel Gump BE LIABLE FOR ANY DIRECT,     //
//  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES      //
//  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR      //
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)      //
//  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,     //
//  STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING   //
//  IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE      //
//  POSSIBILITY OF SUCH DAMAGE.                                             //
//////////////////////////////////////////////////////////////////////////////

function ThreeD(){
	POLYMESH = new Array();

	CENTERX = 400; CENTERY = 240;
	LIGHTX = -1000; LIGHTY = -1000; LIGHTZ = -1000;
	ORIGINX = 0; ORIGINY = 0; ORIGINZ = 0;
	ANGLEX = 0; ANGLEY = 0; ANGLEZ = 0;
}

ThreeD.prototype.setPoints = function(Points){
	POLYMESH = [];
	for(var value=Points.length;--value>=0;) POLYMESH[value] = Points[value].slice();
}
ThreeD.prototype.loadMesh = function(array){
	if(POLYMESH = array.split(";")) for(i=POLYMESH.length;--i>=0;) POLYMESH[i] = POLYMESH[i].split(",");
}
ThreeD.prototype.getPoints = function(){ return POLYMESH; }

ThreeD.prototype.setCenter = function(x,y){ CENTERX = x|0; CENTERY = y|0; }
ThreeD.prototype.setLight = function(x,y,z){ LIGHTX = x|0; LIGHTY = y|0; LIGHTZ = z|0; }

ThreeD.prototype.explode = function(z){
	var x1, y1, z1, x2, y2, z2;
	var normali, normalj, normalk, magNormal;

	for(var value=POLYMESH.length;--value>=0;){
		x1 = POLYMESH[value][3]-POLYMESH[value][0]; y1 = POLYMESH[value][4]-POLYMESH[value][1]; z1 = POLYMESH[value][5]-POLYMESH[value][2]; 
		x2 = POLYMESH[value][6]-POLYMESH[value][0]; y2 = POLYMESH[value][7]-POLYMESH[value][1]; z2 = POLYMESH[value][8]-POLYMESH[value][2]; 

		normali = y2*z1-y1*z2; normalj = x1*z2-x2*z1; normalk = x2*y1-x1*y2;
		magNormal = z/Math.sqrt(normali*normali+normalj*normalj+normalk*normalk);

		var movex = -normali*magNormal|0;
		var movey = -normalj*magNormal|0;
		var movez = -normalk*magNormal|0;

		POLYMESH[value][0] += movex; POLYMESH[value][1] += movey; POLYMESH[value][2] += movez;
		POLYMESH[value][3] += movex; POLYMESH[value][4] += movey; POLYMESH[value][5] += movez;
		POLYMESH[value][6] += movex; POLYMESH[value][7] += movey; POLYMESH[value][8] += movez;
	}
}
ThreeD.prototype.normalMap = function(normalMap){
	var x1, y1, z1, x2, y2, z2;
	var normali, normalj, normalk, magNormal;

	for(var value=POLYMESH.length;--value>=0;){
		x1 = POLYMESH[value][3]-POLYMESH[value][0]; y1 = POLYMESH[value][4]-POLYMESH[value][1]; z1 = POLYMESH[value][5]-POLYMESH[value][2]; 
		x2 = POLYMESH[value][6]-POLYMESH[value][0]; y2 = POLYMESH[value][7]-POLYMESH[value][1]; z2 = POLYMESH[value][8]-POLYMESH[value][2]; 

		normali = y2*z1-y1*z2; normalj = x1*z2-x2*z1; normalk = x2*y1-x1*y2;
		normal = 1/Math.sqrt(normali*normali+normalj*normalj+normalk*normalk);
		
		for(index2=0; index2<4; index2++){
			for(index=0; index<=index2; index++){
				magNormal = normalMap[index][index2]*normal|0;

				var movex = -normali*magNormal;
				var movey = -normalj*magNormal;
				var movez = -normalk*magNormal;
				
				POLYMESH[POLYMESH.length] = new Array(POLYMESH[value][0]+movex,POLYMESH[value][1]+movey,POLYMESH[value][2]+movez,
							POLYMESH[value][3]+movex,POLYMESH[value][4]+movey,POLYMESH[value][7]+movez,
							POLYMESH[value][6]+movex,POLYMESH[value][7]+movey,POLYMESH[value][8]+movez,
							POLYMESH[value][9],POLYMESH[value][10],POLYMESH[value][11],
							POLYMESH[value][12],POLYMESH[value][13], true, index, index2);
			}
		}
	}
}
ThreeD.prototype.move = function(x,y,z){
	for(var value=POLYMESH.length;--value>=0;)
		for(var point=-1;++point<3;){
			POLYMESH[value][point*3+2] += z;
			POLYMESH[value][point*3+1] += y;
			POLYMESH[value][point*3] += x;
		}
}
ThreeD.prototype.rotate = function(anglex,angley,anglez){
	var cosx = Math.cos(anglex*0.01745329); var sinx = Math.sin(anglex*0.01745329);
	var cosy = Math.cos(angley*0.01745329); var siny = Math.sin(angley*0.01745329);
	var cosz = Math.cos(anglez*0.01745329); var sinz = Math.sin(anglez*0.01745329);

	for(var value=POLYMESH.length;--value>=0;)
		for(var point=-1;++point<3;){
			var tempz = sinx*POLYMESH[value][point*3+1]+cosx*POLYMESH[value][point*3+2];
			var tempy = cosx*POLYMESH[value][point*3+1]-sinx*POLYMESH[value][point*3+2];
			var tempx = cosy*POLYMESH[value][point*3]+siny*tempz;
			POLYMESH[value][point*3+2] = cosy*tempz-siny*POLYMESH[value][point*3];
			POLYMESH[value][point*3+1] = sinz*tempx+cosz*tempy;
			POLYMESH[value][point*3] = cosz*tempx-sinz*tempy;
		}
}
ThreeD.prototype.scale = function(scalex,scaley,scalez){
	for(var value=POLYMESH.length;--value>=0;)
		for(var point=-1;++point<3;){
			POLYMESH[value][point*3+2] *= scalex;
			POLYMESH[value][point*3+1] *= scaley;
			POLYMESH[value][point*3] *= scalez;
		}
}

ThreeD.prototype.backface = function(){
	for(var value=POLYMESH.length, newvalue=0, TempPOLYMESH = [];--value>=0;)
		if((POLYMESH[value][3]-POLYMESH[value][0])*(POLYMESH[value][7]-POLYMESH[value][1])-(POLYMESH[value][6]-POLYMESH[value][0])*(POLYMESH[value][4]-POLYMESH[value][1])>0){
			TempPOLYMESH[newvalue++] = POLYMESH[value].slice();
		}
	POLYMESH = TempPOLYMESH;
}
ThreeD.prototype.zSort = function(){ POLYMESH.sort(function(b,a){return b[2]+b[5]+b[8]-a[2]-a[5]-a[8]}); }

ThreeD.prototype.fade = function(bright){
	for(var value=POLYMESH.length;--value>=0;) POLYMESH[value][13] += bright;
}
ThreeD.prototype.shade = function(){
	var x1, y1, z1, x2, y2, z2;
	var normali, normalj, normalk, magNormal;
	var lighti, lightj, lightk, magLight;

	for(var value=POLYMESH.length;--value>=0;){
		x1 = POLYMESH[value][3]-POLYMESH[value][0]; y1 = POLYMESH[value][4]-POLYMESH[value][1]; z1 = POLYMESH[value][5]-POLYMESH[value][2]; 
		x2 = POLYMESH[value][6]-POLYMESH[value][0]; y2 = POLYMESH[value][7]-POLYMESH[value][1]; z2 = POLYMESH[value][8]-POLYMESH[value][2]; 

		normali = y1*z2-y2*z1; normalj = x2*z1-x1*z2; normalk = x1*y2-x2*y1;

		lighti = LIGHTX-(POLYMESH[value][0]+POLYMESH[value][3]+POLYMESH[value][6])*0.33333333333333333;
		lightj = LIGHTY-(POLYMESH[value][1]+POLYMESH[value][4]+POLYMESH[value][7])*0.33333333333333333;
		lightk = LIGHTZ-(POLYMESH[value][2]+POLYMESH[value][5]+POLYMESH[value][8])*0.33333333333333333;

		POLYMESH[value][13] = 2*(normali*lighti + normalj*lightj + normalk*lightk)/Math.sqrt((normali*normali+normalj*normalj+normalk*normalk)*(lighti*lighti+lightj*lightj+lightk*lightk))-1;
	}
}
ThreeD.prototype.reColor = function(r,g,b){
	r=r>255?255:(r<0?0:r|0);
	g=g>255?255:(g<0?0:g|0);
	b=b>255?255:(b<0?0:b|0);
	for(var value=POLYMESH.length;--value>=0;){
		POLYMESH[value][9]=r;
		POLYMESH[value][10]=g;
		POLYMESH[value][11]=b;
	}
}
ThreeD.prototype.shadow = function(){
	rayorigins = []; 
	raynormals = [];
	edge1 = [];
	edge2 = [];

	for(var value=0, normali, normalj, normalk, magNormal;value<POLYMESH.length;value++){
		edge1[value] = new Array(POLYMESH[value][3]-POLYMESH[value][0], POLYMESH[value][4]-POLYMESH[value][1], POLYMESH[value][5]-POLYMESH[value][2]);
		edge2[value] = new Array(POLYMESH[value][6]-POLYMESH[value][0], POLYMESH[value][7]-POLYMESH[value][1], POLYMESH[value][8]-POLYMESH[value][2]);

		rayorigins[value] = new Array((POLYMESH[value][0]+POLYMESH[value][3]+POLYMESH[value][6])*0.33333333333333333, (POLYMESH[value][1]+POLYMESH[value][4]+POLYMESH[value][7])*0.33333333333333333, (POLYMESH[value][2]+POLYMESH[value][5]+POLYMESH[value][8])*0.33333333333333333);

		normali = LIGHTX-rayorigins[value][0];
		normalj = LIGHTY-rayorigins[value][1];
		normalk = LIGHTZ-rayorigins[value][2];
		magNormal = 1/Math.sqrt(normali*normali+normalj*normalj+normalk*normalk);
		raynormals[value] = new Array(normali*magNormal, normalj*magNormal, normalk*magNormal);
	}

	for(var value=POLYMESH.length;--value>=0;){
		for(var value2=POLYMESH.length;--value2>=0;){
			if(value2!=value){
				var pvecti = raynormals[value][1]*edge2[value2][2]-edge2[value2][1]*raynormals[value][2];
				var pvectj = edge2[value2][0]*raynormals[value][2]-raynormals[value][0]*edge2[value2][2];
				var pvectk = raynormals[value][0]*edge2[value2][1]-edge2[value2][0]*raynormals[value][1];

				if((det = edge1[value2][0]*pvecti+edge1[value2][1]*pvectj+edge1[value2][2]*pvectk)<0){
					det=1/det;

					var tvecti = rayorigins[value][0]-POLYMESH[value2][0];
					var tvectj = rayorigins[value][1]-POLYMESH[value2][1];
					var tvectk = rayorigins[value][2]-POLYMESH[value2][2];

					if((u = (pvecti*tvecti+pvectj*tvectj+pvectk*tvectk) * det)>=0 && u<=1){
						if((v = (raynormals[value][0]*(tvectj*edge1[value2][2]-edge1[value2][1]*tvectk)+raynormals[value][1]*(edge1[value2][0]*tvectk-tvecti*edge1[value2][2])+raynormals[value][2]*(tvecti*edge1[value2][1]-edge1[value2][0]*tvectj)) * det)>=0 && u+v<=1){
							POLYMESH[value][13] -=.5;
							break;
						}
					}
				}
				
			}
		}
	}
}

ThreeD.prototype.getTranslation = function(){
	for(var value=POLYMESH.length,newvalue=0,TransPOLYMESH = [];--value>=0;){
		var POLYMESH2=5000/(5000-POLYMESH[value][2]), POLYMESH5=5000/(5000-POLYMESH[value][5]), POLYMESH8=5000/(5000-POLYMESH[value][8]);
		TransPOLYMESH[newvalue++] = new Array((CENTERX+POLYMESH[value][0]*POLYMESH2),(CENTERY+POLYMESH[value][1]*POLYMESH2),
									(CENTERX+POLYMESH[value][3]*POLYMESH5),(CENTERY+POLYMESH[value][4]*POLYMESH5),
									(CENTERX+POLYMESH[value][6]*POLYMESH8),(CENTERY+POLYMESH[value][7]*POLYMESH8),
									POLYMESH[value][9]|0,POLYMESH[value][10]|0,POLYMESH[value][11]|0,POLYMESH[value][12]|0,POLYMESH[value][13]);
	}
	return TransPOLYMESH;
}

ThreeDee = new ThreeD();