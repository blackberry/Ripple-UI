//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// Wii Opera SDK - Drawing Class v2.6.16 2008-12-14                         //
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

function Drawing(){
	this.WIREFRAME = 1; this.FILL = 2;
	ZOOM = 1;
	CANVAS = null;
	TEXTURES = null;
}
Drawing.prototype.initialize = function(canvas){
	CANVAS = canvas.getContext("2d");
	CANVAS.lineJoin = "round";
	CANVAS.lineWidth = 1;
}
Drawing.prototype.loadTextures = function(textures){ TEXTURES = textures; }
Drawing.prototype.setFillColor = function(r,g,b){ CANVAS.fillStyle = "rgb("+(r>255?255:(r<0?0:r|0))+", "+(g>255?255:(g<0?0:g|0))+", "+(b>255?255:(b<0?0:b|0))+")"; }
Drawing.prototype.setFillColorA = function(r,g,b,a){ CANVAS.fillStyle = "rgba("+(r>255?255:(r<0?0:r|0))+", "+(g>255?255:(g<0?0:g|0))+", "+(b>255?255:(b<0?0:b|0))+", "+(a>255?1:(a<0?0:a/255))+")"; }
Drawing.prototype.setLineColor = function(r,g,b){ CANVAS.strokeStyle = "rgb("+(r>255?255:(r<0?0:r|0))+", "+(g>255?255:(g<0?0:g|0))+", "+(b>255?255:(b<0?0:b|0))+")"; }
Drawing.prototype.setLineColorA = function(r,g,b,a){ CANVAS.strokeStyle = "rgba("+(r>255?255:(r<0?0:r|0))+", "+(g>255?255:(g<0?0:g|0))+", "+(b>255?255:(b<0?0:b|0))+", "+(a>255?1:(a<0?0:a/255))+")"; }
Drawing.prototype.clipCircle = function(centerx,centery,radius){ CANVAS.beginPath(); CANVAS.arc(centerx,centery,radius,0,6.28318531,false); CANVAS.clip(); }
Drawing.prototype.clipRectangle = function(x1,y1,x2,y2){ CANVAS.beginPath(); CANVAS.strokeRect(x1,y1,x2-x1,y2-y1); CANVAS.clip(); }
Drawing.prototype.drawCircle = function(centerx,centery,radius,style){
	CANVAS.beginPath();
	CANVAS.arc(centerx, centery, radius, 0, Math.PI*2, false);
	if(style & this.FILL) CANVAS.fill();
	if(style & this.WIREFRAME) CANVAS.stroke();
}
Drawing.prototype.drawImage = function(x1,y1,x2,y2,img,angle){
	if(img.complete){
		x1|=0;
		y1|=0;
		x2|=0;
		y2|=0;
		if(x2<x1) x2=x1+1;
		if(y2<y1) y2=y1+1;
		var centerx = (x1+x2)>>1;
		var centery = (y1+y2)>>1;

		CANVAS.save();
		CANVAS.translate(centerx, centery);
		if(angle) CANVAS.rotate(angle*0.01745329);
		CANVAS.drawImage(img, x1-centerx, y1-centery, x2-x1, y2-y1);
		CANVAS.restore();
	}
}
Drawing.prototype.drawLine = function(x1, y1, x2, y2){ CANVAS.beginPath(); CANVAS.moveTo(x1|0, y1|0); CANVAS.lineTo(x2|0, y2|0); CANVAS.stroke(); }
Drawing.prototype.drawRectangle = function(x1, y1, x2, y2, style, angle){
	x1|=0;
	y1|=0;
	x2|=0;
	y2|=0;
	
	if(!angle){
		if(style & this.FILL) CANVAS.fillRect(x1, y1, x2-x1, y2-y1);
		if(style & this.WIREFRAME) CANVAS.strokeRect(x1, y1, x2-x1, y2-y1);
	}else{
		var centerx = (x1+x2)>>1; var centery = (y1+y2)>>1;

		CANVAS.save();
		CANVAS.translate(centerx, centery);
		CANVAS.rotate(angle*DEGTORAD);
		if(style & this.FILL) CANVAS.fillRect(x1-centerx, y1-centery, x2-x1, y2-y1);
		if(style & this.WIREFRAME) CANVAS.strokeRect(x1-centerx, y1-centery, x2-x1, y2-y1);
		CANVAS.restore();
	}
}
Drawing.prototype.drawScene = function(array,style){
	var piOver2 = 1.570796326794897;
	var piOver4 = 0.785398163397448;
	var sqrt2half = 1.414213562373095;

	for(tri=array.length;--tri>=0;){
		var x1 = array[tri][0];
		var y1 = array[tri][1];
		var x2 = array[tri][2];
		var y2 = array[tri][3];
		var x3 = array[tri][4];
		var y3 = array[tri][5];
		shade=array[tri][10];

		if(TEXTURES && array[tri][9]>=0){
			CANVAS.save();

			var u = (x2-x3)*(x2-x3)+(y2-y3)*(y2-y3);
			var v = (x1-x3)*(x1-x3)+(y1-y3)*(y1-y3);
			var w = (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);

			var canvasRot = 0.5*Math.acos((w+v-u)/(2*Math.sqrt(w*v)));
			var scale = Math.cos(canvasRot)*sqrt2half;

			CANVAS.translate(x1,y1);
			CANVAS.rotate(Math.atan2(y2-y1,x2-x1)-piOver2+canvasRot);
			CANVAS.scale(Math.tan(canvasRot),1);
			CANVAS.rotate(piOver4);
			CANVAS.scale(Math.sqrt(w)*scale,Math.sqrt(v)*scale);
			//CANVAS.transform(x2-x1,y2-y1,x3-x1,y3-y1, x1,y1);
			CANVAS.drawImage((canvasimg = TEXTURES[array[tri][9]]), 0,0, canvasimg.width,canvasimg.height, 0,0, 1,1);
			CANVAS.restore();

			if(shade!=0){
				CANVAS.beginPath();
				CANVAS.moveTo(x1,y1);
				CANVAS.lineTo(x2,y2);
				CANVAS.lineTo(x3,y3);
				CANVAS.lineTo(x1,y1);
				if(shade>0){
					if(shade>1) shade=1;
					CANVAS.fillStyle = "rgba(255,255,255,"+(shade)+")";
					CANVAS.strokeStyle = "rgba(255,255,255,"+(shade*.5)+")";
				}else if(shade<0){
					if(shade<-1) shade=-1;
					CANVAS.fillStyle = "rgba(0,0,0,"+(-shade)+")";
					CANVAS.strokeStyle = "rgba(0,0,0,"+(-shade*.5)+")";
				}
				if(style & this.FILL) CANVAS.fill();
				if(style & this.WIREFRAME) CANVAS.stroke();
			}
		}else{
			var red = array[tri][6];
			var green = array[tri][7];
			var blue = array[tri][8];
			if(shade!=0){
				red=(red*=++shade)>255?255:(red<0?0:red);
				green=(green*=shade)>255?255:(green<0?0:green);
				blue=(blue*=shade)>255?255:(blue<0?0:blue);
			}
			var color = "rgb("+(red|0)+","+(green|0)+","+(blue|0)+")";
			CANVAS.beginPath();
			CANVAS.moveTo(x1,y1);
			CANVAS.lineTo(x2,y2);
			CANVAS.lineTo(x3,y3);
			CANVAS.lineTo(x1,y1);
			if(style & this.FILL){ CANVAS.fillStyle = color; CANVAS.fill(); }
			if(style & this.WIREFRAME){ CANVAS.strokeStyle = color; CANVAS.stroke(); }
		}
	}
}

Drawing.prototype.drawFloor = function(x1,x2,y1,x3,x4,y2,img){
	if((x2|=0)==(x1|=0)) x2++;
	if((y2|=0)==(y1|=0)) y2++;
	if((x4|=0)==(x3|=0)) x4++;
	var absdy=(dy = y2-y1)<0?-dy:dy;

	var sourceD = img.width-1, sourceY = (img.height-1)*(dx2 = x4-x3)/dy;
	var destX = (x3-x1)/dy;
	var tempY = 0;
	var destW2 = (dx1 = x2-x1);

	var absscale = (fullscale = 1.5*(dy>>31?-1:1)+dy/img.height)>>31?-(fullscale-1):(fullscale+1);
	var destwfullscale = fullscale*(dx2-dx1+1)/dy;

	while(tempY<0?-tempY:tempY<=absdy){
		CANVAS.drawImage(img, 0, sourceY*tempY/destW2, sourceD, 1, x1+destX*tempY, tempY+y1, destW2, absscale);
		tempY+=fullscale;
		destW2+=destwfullscale;
	}	
}
Drawing.prototype.drawWall = function(x1,y1,y2,x2,y3,y4,img){
	if(x2==x1) x2++;
	if(y2==y1) y2++;
	if(y4==y3) y4++;
	var dx = x2-x1, dy1 = y2-y1, dy2 = y4-y3;
	var absdx=dx<0?-dx:dx;

	var sourceH = img.height-1, sourceX = (img.width-1)*dy2/dx;
	var destY = (y3-y1)/dx;
	var tempX = 0;

	var fullscale = 1.5*(dx<0?-1:1)+dx/img.width;
	var absscale = fullscale<0?(-fullscale-1):(fullscale+1);
	var desthfullscale = fullscale*(dy2-dy1+1)/dx;

	while(tempX<0?-tempX:tempX<=absdx){
		CANVAS.drawImage(img, sourceX*tempX/dy1, 0, 1, sourceH, tempX+x1, y1+destY*tempX, absscale, dy1);
		tempX+=fullscale;
		dy1+=desthfullscale;
	}	
}
Drawing.prototype.zoom = function(zoom,width,height){
	ZOOM = zoom;
	CANVAS.translate(width>>1, height>>1);
	CANVAS.scale(ZOOM, ZOOM);
	CANVAS.translate(-width>>1, -height>>1);
}
Drawing.prototype.unZoom = function(width,height){
	CANVAS.translate(width>>1, height>>1);
	CANVAS.scale(1/ZOOM, 1/ZOOM);
	CANVAS.translate(-width>>1, -height>>1);
	ZOOM = 1;
}
Drawing.prototype.clear = function(x1, y1, x2, y2){ CANVAS.clearRect(x1, y1, x2-x1, y2-y1); }

Draw = new Drawing();