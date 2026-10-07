(()=>{var Xg=Object.defineProperty;var Qg=(n,e)=>{for(var t in e)Xg(n,t,{get:e[t],enumerable:!0})};var T0=0,Iu=1,w0=2;var Zo=1,C0=2,Lr=3,ns=0,vn=1,Tn=2,mi=0,is=1,Bs=2,Du=3,Lu=4,R0=5;var Us=100,P0=101,I0=102,D0=103,L0=104,F0=200,O0=201,N0=202,B0=203,Fu=204,Ou=205,U0=206,G0=207,z0=208,H0=209,k0=210,V0=211,W0=212,X0=213,Q0=214,bl=0,_l=1,Ml=2,_r=3,Al=4,El=5,Tl=6,wl=7,Nu=0,K0=1,q0=2,Zn=0,Bu=1,Uu=2,Gu=3,zu=4,Hu=5,ku=6,Vu=7;var Wu=300,ss=301,Gs=302,ac=303,lc=304,$o=306,Cl=1e3,oi=1001,Rl=1002,rn=1003,J0=1004;var ea=1005;var Gt=1006,cc=1007;var rs=1008;var yn=1009,Xu=1010,Qu=1011,Fr=1012,hc=1013,$n=1014,Gn=1015,Ln=1016,uc=1017,fc=1018,Or=1020,Ku=35902,qu=35899,Ju=1021,ju=1022,wn=1023,li=1026,os=1027,dc=1028,pc=1029,as=1030,mc=1031;var gc=1033,ta=33776,na=33777,ia=33778,sa=33779,xc=35840,vc=35841,yc=35842,Sc=35843,bc=36196,_c=37492,Mc=37496,Ac=37488,Ec=37489,ra=37490,Tc=37491,wc=37808,Cc=37809,Rc=37810,Pc=37811,Ic=37812,Dc=37813,Lc=37814,Fc=37815,Oc=37816,Nc=37817,Bc=37818,Uc=37819,Gc=37820,zc=37821,Hc=36492,kc=36494,Vc=36495,Wc=36283,Xc=36284,oa=36285,Qc=36286;var Mo=2300,Pl=2301,vl=2302,bu=2303,_u=2400,Mu=2401,Au=2402;var j0=3200;var Yu=0,Y0=1,Cn="",In="srgb",Rs="srgb-linear",Ao="linear",Mt="srgb";var yl=7680;var Z0=519,$0=512,ep=513,tp=514,Kc=515,np=516,ip=517,qc=518,sp=519,rp=35044;var Zu="300 es",Jn=2e3,Eo=2001;function Kg(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function qg(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function To(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function op(){let n=To("canvas");return n.style.display="block",n}var Kd={},Mr=null;function $u(...n){let e="THREE."+n.shift();Mr?Mr("log",e,...n):console.log(e,...n)}function ap(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ke(...n){n=ap(n);let e="THREE."+n.shift();if(Mr)Mr("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ye(...n){n=ap(n);let e="THREE."+n.shift();if(Mr)Mr("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Cs(...n){let e=n.join(" ");e in Kd||(Kd[e]=!0,Ke(...n))}function lp(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var cp={[bl]:_l,[Ml]:Tl,[Al]:wl,[_r]:El,[_l]:bl,[Tl]:Ml,[wl]:Al,[El]:_r},ci=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Sl=Math.PI/180,Il=180/Math.PI;function Nr(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]+"-"+un[e&255]+un[e>>8&255]+"-"+un[e>>16&15|64]+un[e>>24&255]+"-"+un[t&63|128]+un[t>>8&255]+"-"+un[t>>16&255]+un[t>>24&255]+un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]).toLowerCase()}function ht(n,e,t){return Math.max(e,Math.min(t,n))}function Jg(n,e){return(n%e+e)%e}function Jh(n,e,t){return(1-t)*n+t*e}function uo(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function An(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var of=class of{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};of.prototype.isVector2=!0;var ae=of,hi=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],l=i[s+1],h=i[s+2],d=i[s+3],u=r[o+0],f=r[o+1],g=r[o+2],S=r[o+3];if(d!==S||c!==u||l!==f||h!==g){let m=c*u+l*f+h*g+d*S;m<0&&(u=-u,f=-f,g=-g,S=-S,m=-m);let p=1-a;if(m<.9995){let v=Math.acos(m),M=Math.sin(v);p=Math.sin(p*v)/M,a=Math.sin(a*v)/M,c=c*p+u*a,l=l*p+f*a,h=h*p+g*a,d=d*p+S*a}else{c=c*p+u*a,l=l*p+f*a,h=h*p+g*a,d=d*p+S*a;let v=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=v,l*=v,h*=v,d*=v}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],h=i[s+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-a*f,e[t+2]=l*g+h*f+a*u-c*d,e[t+3]=h*g-a*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(s/2),d=a(r/2),u=c(i/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:Ke("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=i+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=i*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-i*l,this._z=r*h+o*l+i*c-s*a,this._w=o*h-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},af=class af{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*i),h=2*(a*t-r*s),d=2*(r*i-o*t);return this.x=t+c*l+o*d-a*h,this.y=i+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return jh.copy(this).projectOnVector(e),this.sub(jh)}reflect(e){return this.sub(jh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};af.prototype.isVector3=!0;var L=af,jh=new L,qd=new hi,lf=class lf{constructor(e,t,i,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l)}set(e,t,i,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],d=i[7],u=i[2],f=i[5],g=i[8],S=s[0],m=s[3],p=s[6],v=s[1],M=s[4],y=s[7],_=s[2],b=s[5],A=s[8];return r[0]=o*S+a*v+c*_,r[3]=o*m+a*M+c*b,r[6]=o*p+a*y+c*A,r[1]=l*S+h*v+d*_,r[4]=l*m+h*M+d*b,r[7]=l*p+h*y+d*A,r[2]=u*S+f*v+g*_,r[5]=u*m+f*M+g*b,r[8]=u*p+f*y+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-i*r*h+i*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,u=a*c-h*r,f=l*r-o*c,g=t*d+i*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/g;return e[0]=d*S,e[1]=(s*l-h*i)*S,e[2]=(a*i-s*o)*S,e[3]=u*S,e[4]=(h*t-s*c)*S,e[5]=(s*r-a*t)*S,e[6]=f*S,e[7]=(i*c-l*t)*S,e[8]=(o*t-i*r)*S,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return Cs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Yh.makeScale(e,t)),this}rotate(e){return Cs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Yh.makeRotation(-e)),this}translate(e,t){return Cs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Yh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};lf.prototype.isMatrix3=!0;var et=lf,Yh=new et,Jd=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),jd=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function jg(){let n={enabled:!0,workingColorSpace:Rs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Mt&&(s.r=Ii(s.r),s.g=Ii(s.g),s.b=Ii(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Mt&&(s.r=br(s.r),s.g=br(s.g),s.b=br(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Cn?Ao:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Cs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Cs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Rs]:{primaries:e,whitePoint:i,transfer:Ao,toXYZ:Jd,fromXYZ:jd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:In},outputColorSpaceConfig:{drawingBufferColorSpace:In}},[In]:{primaries:e,whitePoint:i,transfer:Mt,toXYZ:Jd,fromXYZ:jd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:In}}}),n}var ot=jg();function Ii(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function br(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var ar,Dl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ar===void 0&&(ar=To("canvas")),ar.width=e.width,ar.height=e.height;let s=ar.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ar}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=To("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ii(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ii(t[i]/255)*255):t[i]=Ii(t[i]);return{data:t,width:e.width,height:e.height}}else return Ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Yg=0,Ar=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Yg++}),this.uuid=Nr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Zh(s[o].image)):r.push(Zh(s[o]))}else r=Zh(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Zh(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Dl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ke("Texture: Unable to serialize Texture."),{})}var Zg=0,$h=new L,gn=class n extends ci{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=oi,s=oi,r=Gt,o=rs,a=wn,c=yn,l=n.DEFAULT_ANISOTROPY,h=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zg++}),this.uuid=Nr(),this.name="",this.source=new Ar(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize($h).x}get height(){return this.source.getSize($h).y}get depth(){return this.source.getSize($h).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ke(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cl:e.x=e.x-Math.floor(e.x);break;case oi:e.x=e.x<0?0:1;break;case Rl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Cl:e.y=e.y-Math.floor(e.y);break;case oi:e.y=e.y<0?0:1;break;case Rl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};gn.DEFAULT_IMAGE=null;gn.DEFAULT_MAPPING=Wu;gn.DEFAULT_ANISOTROPY=1;var cf=class cf{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],S=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-S)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+S)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(l+1)/2,y=(f+1)/2,_=(p+1)/2,b=(h+u)/4,A=(d+S)/4,x=(g+m)/4;return M>y&&M>_?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=b/i,r=A/i):y>_?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=b/s,r=x/s):_<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(_),i=A/r,s=x/r),this.set(i,s,r,t),this}let v=Math.sqrt((m-g)*(m-g)+(d-S)*(d-S)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-S)/v,this.z=(u-h)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};cf.prototype.isVector4=!0;var Ot=cf,Ll=class extends ci{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:i.depth},r=new gn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Gt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ar(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},dn=class extends Ll{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},wo=class extends gn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fl=class extends gn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var oc=class oc{constructor(e,t,i,s,r,o,a,c,l,h,d,u,f,g,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l,h,d,u,f,g,S,m)}set(e,t,i,s,r,o,a,c,l,h,d,u,f,g,S,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=S,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oc().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,s=1/lr.setFromMatrixColumn(e,0).length(),r=1/lr.setFromMatrixColumn(e,1).length(),o=1/lr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=o*h,f=o*d,g=a*h,S=a*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-S*l,t[9]=-a*c,t[2]=S-u*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){let u=c*h,f=c*d,g=l*h,S=l*d;t[0]=u+S*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=S+u*a,t[10]=o*c}else if(e.order==="ZXY"){let u=c*h,f=c*d,g=l*h,S=l*d;t[0]=u-S*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=S-u*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let u=o*h,f=o*d,g=a*h,S=a*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+S,t[1]=c*d,t[5]=S*l+u,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let u=o*c,f=o*l,g=a*c,S=a*l;t[0]=c*h,t[4]=S-u*d,t[8]=g*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-S*d}else if(e.order==="XZY"){let u=o*c,f=o*l,g=a*c,S=a*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+S,t[5]=o*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*h,t[10]=S*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($g,e,e1)}lookAt(e,t,i){let s=this.elements;return Rn.subVectors(e,t),Rn.lengthSq()===0&&(Rn.z=1),Rn.normalize(),Qi.crossVectors(i,Rn),Qi.lengthSq()===0&&(Math.abs(i.z)===1?Rn.x+=1e-4:Rn.z+=1e-4,Rn.normalize(),Qi.crossVectors(i,Rn)),Qi.normalize(),Va.crossVectors(Rn,Qi),s[0]=Qi.x,s[4]=Va.x,s[8]=Rn.x,s[1]=Qi.y,s[5]=Va.y,s[9]=Rn.y,s[2]=Qi.z,s[6]=Va.z,s[10]=Rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],d=i[5],u=i[9],f=i[13],g=i[2],S=i[6],m=i[10],p=i[14],v=i[3],M=i[7],y=i[11],_=i[15],b=s[0],A=s[4],x=s[8],E=s[12],w=s[1],R=s[5],I=s[9],N=s[13],D=s[2],U=s[6],W=s[10],k=s[14],re=s[3],q=s[7],Z=s[11],ee=s[15];return r[0]=o*b+a*w+c*D+l*re,r[4]=o*A+a*R+c*U+l*q,r[8]=o*x+a*I+c*W+l*Z,r[12]=o*E+a*N+c*k+l*ee,r[1]=h*b+d*w+u*D+f*re,r[5]=h*A+d*R+u*U+f*q,r[9]=h*x+d*I+u*W+f*Z,r[13]=h*E+d*N+u*k+f*ee,r[2]=g*b+S*w+m*D+p*re,r[6]=g*A+S*R+m*U+p*q,r[10]=g*x+S*I+m*W+p*Z,r[14]=g*E+S*N+m*k+p*ee,r[3]=v*b+M*w+y*D+_*re,r[7]=v*A+M*R+y*U+_*q,r[11]=v*x+M*I+y*W+_*Z,r[15]=v*E+M*N+y*k+_*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],S=e[7],m=e[11],p=e[15],v=c*f-l*u,M=a*f-l*d,y=a*u-c*d,_=o*f-l*h,b=o*u-c*h,A=o*d-a*h;return t*(S*v-m*M+p*y)-i*(g*v-m*_+p*b)+s*(g*M-S*_+p*A)-r*(g*y-S*b+m*A)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],h=e[10];return t*(o*h-a*l)-i*(r*h-a*c)+s*(r*l-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],S=e[13],m=e[14],p=e[15],v=t*a-i*o,M=t*c-s*o,y=t*l-r*o,_=i*c-s*a,b=i*l-r*a,A=s*l-r*c,x=h*S-d*g,E=h*m-u*g,w=h*p-f*g,R=d*m-u*S,I=d*p-f*S,N=u*p-f*m,D=v*N-M*I+y*R+_*w-b*E+A*x;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/D;return e[0]=(a*N-c*I+l*R)*U,e[1]=(s*I-i*N-r*R)*U,e[2]=(S*A-m*b+p*_)*U,e[3]=(u*b-d*A-f*_)*U,e[4]=(c*w-o*N-l*E)*U,e[5]=(t*N-s*w+r*E)*U,e[6]=(m*y-g*A-p*M)*U,e[7]=(h*A-u*y+f*M)*U,e[8]=(o*I-a*w+l*x)*U,e[9]=(i*w-t*I-r*x)*U,e[10]=(g*b-S*y+p*v)*U,e[11]=(d*y-h*b-f*v)*U,e[12]=(a*E-o*R-c*x)*U,e[13]=(t*R-i*E+s*x)*U,e[14]=(S*M-g*_-m*v)*U,e[15]=(h*_-d*M+u*v)*U,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+i,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,d=a+a,u=r*l,f=r*h,g=r*d,S=o*h,m=o*d,p=a*d,v=c*l,M=c*h,y=c*d,_=i.x,b=i.y,A=i.z;return s[0]=(1-(S+p))*_,s[1]=(f+y)*_,s[2]=(g-M)*_,s[3]=0,s[4]=(f-y)*b,s[5]=(1-(u+p))*b,s[6]=(m+v)*b,s[7]=0,s[8]=(g+M)*A,s[9]=(m-v)*A,s[10]=(1-(u+S))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let o=lr.set(s[0],s[1],s[2]).length(),a=lr.set(s[4],s[5],s[6]).length(),c=lr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Xn.copy(this);let l=1/o,h=1/a,d=1/c;return Xn.elements[0]*=l,Xn.elements[1]*=l,Xn.elements[2]*=l,Xn.elements[4]*=h,Xn.elements[5]*=h,Xn.elements[6]*=h,Xn.elements[8]*=d,Xn.elements[9]*=d,Xn.elements[10]*=d,t.setFromRotationMatrix(Xn),i.x=o,i.y=a,i.z=c,this}makePerspective(e,t,i,s,r,o,a=Jn,c=!1){let l=this.elements,h=2*r/(t-e),d=2*r/(i-s),u=(t+e)/(t-e),f=(i+s)/(i-s),g,S;if(c)g=r/(o-r),S=o*r/(o-r);else if(a===Jn)g=-(o+r)/(o-r),S=-2*o*r/(o-r);else if(a===Eo)g=-o/(o-r),S=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Jn,c=!1){let l=this.elements,h=2/(t-e),d=2/(i-s),u=-(t+e)/(t-e),f=-(i+s)/(i-s),g,S;if(c)g=1/(o-r),S=o/(o-r);else if(a===Jn)g=-2/(o-r),S=-(o+r)/(o-r);else if(a===Eo)g=-1/(o-r),S=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};oc.prototype.isMatrix4=!0;var yt=oc,lr=new L,Xn=new yt,$g=new L(0,0,0),e1=new L(1,1,1),Qi=new L,Va=new L,Rn=new L,Yd=new yt,Zd=new hi,Yi=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ht(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Yd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Yd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Zd.setFromEuler(this),this.setFromQuaternion(Zd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yi.DEFAULT_ORDER="XYZ";var Co=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},t1=0,$d=new L,cr=new hi,Ai=new yt,Wa=new L,fo=new L,n1=new L,i1=new hi,e0=new L(1,0,0),t0=new L(0,1,0),n0=new L(0,0,1),i0={type:"added"},s1={type:"removed"},hr={type:"childadded",child:null},eu={type:"childremoved",child:null},En=class n extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:t1++}),this.uuid=Nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new L,t=new Yi,i=new hi,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new et}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Co,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return cr.setFromAxisAngle(e,t),this.quaternion.multiply(cr),this}rotateOnWorldAxis(e,t){return cr.setFromAxisAngle(e,t),this.quaternion.premultiply(cr),this}rotateX(e){return this.rotateOnAxis(e0,e)}rotateY(e){return this.rotateOnAxis(t0,e)}rotateZ(e){return this.rotateOnAxis(n0,e)}translateOnAxis(e,t){return $d.copy(e).applyQuaternion(this.quaternion),this.position.add($d.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(e0,e)}translateY(e){return this.translateOnAxis(t0,e)}translateZ(e){return this.translateOnAxis(n0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Wa.copy(e):Wa.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(fo,Wa,this.up):Ai.lookAt(Wa,fo,this.up),this.quaternion.setFromRotationMatrix(Ai),s&&(Ai.extractRotation(s.matrixWorld),cr.setFromRotationMatrix(Ai),this.quaternion.premultiply(cr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ye("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(i0),hr.child=e,this.dispatchEvent(hr),hr.child=null):Ye("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(s1),eu.child=e,this.dispatchEvent(eu),eu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(i0),hr.child=e,this.dispatchEvent(hr),hr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,e,n1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,i1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};En.DEFAULT_UP=new L(0,1,0);En.DEFAULT_MATRIX_AUTO_UPDATE=!0;En.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Pi=class extends En{constructor(){super(),this.isGroup=!0,this.type="Group"}},r1={type:"move"},Er=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let S of e.hand.values()){let m=t.getJointPose(S,i),p=this._getHandJoint(l,S);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(r1)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Pi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},hp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ki={h:0,s:0,l:0},Xa={h:0,s:0,l:0};function tu(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ae=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=In){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=ot.workingColorSpace){return this.r=e,this.g=t,this.b=i,ot.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=ot.workingColorSpace){if(e=Jg(e,1),t=ht(t,0,1),i=ht(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=tu(o,r,e+1/3),this.g=tu(o,r,e),this.b=tu(o,r,e-1/3)}return ot.colorSpaceToWorking(this,s),this}setStyle(e,t=In){function i(r){r!==void 0&&parseFloat(r)<1&&Ke("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ke("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=In){let i=hp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}copyLinearToSRGB(e){return this.r=br(e.r),this.g=br(e.g),this.b=br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=In){return ot.workingToColorSpace(fn.copy(this),e),Math.round(ht(fn.r*255,0,255))*65536+Math.round(ht(fn.g*255,0,255))*256+Math.round(ht(fn.b*255,0,255))}getHexString(e=In){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(fn.copy(this),t);let i=fn.r,s=fn.g,r=fn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case i:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-i)/d+2;break;case r:c=(i-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(fn.copy(this),t),e.r=fn.r,e.g=fn.g,e.b=fn.b,e}getStyle(e=In){ot.workingToColorSpace(fn.copy(this),e);let t=fn.r,i=fn.g,s=fn.b;return e!==In?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Ki),this.setHSL(Ki.h+e,Ki.s+t,Ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ki),e.getHSL(Xa);let i=Jh(Ki.h,Xa.h,t),s=Jh(Ki.s,Xa.s,t),r=Jh(Ki.l,Xa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fn=new Ae;Ae.NAMES=hp;var Di=class extends En{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yi,this.environmentIntensity=1,this.environmentRotation=new Yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Qn=new L,Ei=new L,nu=new L,Ti=new L,ur=new L,fr=new L,s0=new L,iu=new L,su=new L,ru=new L,ou=new Ot,au=new Ot,lu=new Ot,Ri=class n{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Qn.subVectors(e,t),s.cross(Qn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Qn.subVectors(s,t),Ei.subVectors(i,t),nu.subVectors(e,t);let o=Qn.dot(Qn),a=Qn.dot(Ei),c=Qn.dot(nu),l=Ei.dot(Ei),h=Ei.dot(nu),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(l*c-a*h)*u,g=(o*h-a*c)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,Ti)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Ti.x),c.addScaledVector(o,Ti.y),c.addScaledVector(a,Ti.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return ou.setScalar(0),au.setScalar(0),lu.setScalar(0),ou.fromBufferAttribute(e,t),au.fromBufferAttribute(e,i),lu.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ou,r.x),o.addScaledVector(au,r.y),o.addScaledVector(lu,r.z),o}static isFrontFacing(e,t,i,s){return Qn.subVectors(i,t),Ei.subVectors(e,t),Qn.cross(Ei).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Qn.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),Qn.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;ur.subVectors(s,i),fr.subVectors(r,i),iu.subVectors(e,i);let c=ur.dot(iu),l=fr.dot(iu);if(c<=0&&l<=0)return t.copy(i);su.subVectors(e,s);let h=ur.dot(su),d=fr.dot(su);if(h>=0&&d<=h)return t.copy(s);let u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(i).addScaledVector(ur,o);ru.subVectors(e,r);let f=ur.dot(ru),g=fr.dot(ru);if(g>=0&&f<=g)return t.copy(r);let S=f*l-c*g;if(S<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(fr,a);let m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return s0.subVectors(r,s),a=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(s0,a);let p=1/(m+S+u);return o=S*p,a=u*p,t.copy(i).addScaledVector(ur,o).addScaledVector(fr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ui=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Kn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Kn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Kn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Kn):Kn.fromBufferAttribute(r,o),Kn.applyMatrix4(e.matrixWorld),this.expandByPoint(Kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Qa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Qa.copy(i.boundingBox)),Qa.applyMatrix4(e.matrixWorld),this.union(Qa)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Kn),Kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(po),Ka.subVectors(this.max,po),dr.subVectors(e.a,po),pr.subVectors(e.b,po),mr.subVectors(e.c,po),qi.subVectors(pr,dr),Ji.subVectors(mr,pr),As.subVectors(dr,mr);let t=[0,-qi.z,qi.y,0,-Ji.z,Ji.y,0,-As.z,As.y,qi.z,0,-qi.x,Ji.z,0,-Ji.x,As.z,0,-As.x,-qi.y,qi.x,0,-Ji.y,Ji.x,0,-As.y,As.x,0];return!cu(t,dr,pr,mr,Ka)||(t=[1,0,0,0,1,0,0,0,1],!cu(t,dr,pr,mr,Ka))?!1:(qa.crossVectors(qi,Ji),t=[qa.x,qa.y,qa.z],cu(t,dr,pr,mr,Ka))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},wi=[new L,new L,new L,new L,new L,new L,new L,new L],Kn=new L,Qa=new ui,dr=new L,pr=new L,mr=new L,qi=new L,Ji=new L,As=new L,po=new L,Ka=new L,qa=new L,Es=new L;function cu(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Es.fromArray(n,r);let a=s.x*Math.abs(Es.x)+s.y*Math.abs(Es.y)+s.z*Math.abs(Es.z),c=e.dot(Es),l=t.dot(Es),h=i.dot(Es);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var $t=new L,Ja=new ae,o1=0,Kt=class extends ci{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:o1++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=rp,this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ja.fromBufferAttribute(this,t),Ja.applyMatrix3(e),this.setXY(t,Ja.x,Ja.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix3(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=uo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=An(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=uo(t,this.array)),t}setX(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=uo(t,this.array)),t}setY(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=uo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=uo(t,this.array)),t}setW(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=An(t,this.array),i=An(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=An(t,this.array),i=An(i,this.array),s=An(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=An(t,this.array),i=An(i,this.array),s=An(s,this.array),r=An(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Ro=class extends Kt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Po=class extends Kt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var gt=class extends Kt{constructor(e,t,i){super(new Float32Array(e),t,i)}},a1=new ui,mo=new L,hu=new L,fi=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):a1.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mo.subVectors(e,this.center);let t=mo.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(mo,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mo.copy(e.center).add(hu)),this.expandByPoint(mo.copy(e.center).sub(hu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},l1=0,Un=new yt,uu=new En,gr=new L,Pn=new ui,go=new ui,nn=new L,Rt=class n extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:l1++}),this.uuid=Nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kg(e)?Po:Ro)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new et().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,t,i){return Un.makeTranslation(e,t,i),this.applyMatrix4(Un),this}scale(e,t,i){return Un.makeScale(e,t,i),this.applyMatrix4(Un),this}lookAt(e){return uu.lookAt(e),uu.updateMatrix(),this.applyMatrix4(uu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gr).negate(),this.translate(gr.x,gr.y,gr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new gt(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];Pn.setFromBufferAttribute(r),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,Pn.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,Pn.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(Pn.min),this.boundingBox.expandByPoint(Pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ye('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let i=this.boundingSphere.center;if(Pn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];go.setFromBufferAttribute(a),this.morphTargetsRelative?(nn.addVectors(Pn.min,go.min),Pn.expandByPoint(nn),nn.addVectors(Pn.max,go.max),Pn.expandByPoint(nn)):(Pn.expandByPoint(go.min),Pn.expandByPoint(go.max))}Pn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)nn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(nn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)nn.fromBufferAttribute(a,l),c&&(gr.fromBufferAttribute(e,l),nn.add(gr)),s=Math.max(s,i.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ye('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ye("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Kt(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],c=[];for(let x=0;x<i.count;x++)a[x]=new L,c[x]=new L;let l=new L,h=new L,d=new L,u=new ae,f=new ae,g=new ae,S=new L,m=new L;function p(x,E,w){l.fromBufferAttribute(i,x),h.fromBufferAttribute(i,E),d.fromBufferAttribute(i,w),u.fromBufferAttribute(r,x),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,w),h.sub(l),d.sub(l),f.sub(u),g.sub(u);let R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(S.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(R),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(R),a[x].add(S),a[E].add(S),a[w].add(S),c[x].add(m),c[E].add(m),c[w].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let x=0,E=v.length;x<E;++x){let w=v[x],R=w.start,I=w.count;for(let N=R,D=R+I;N<D;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let M=new L,y=new L,_=new L,b=new L;function A(x){_.fromBufferAttribute(s,x),b.copy(_);let E=a[x];M.copy(E),M.sub(_.multiplyScalar(_.dot(E))).normalize(),y.crossVectors(b,E);let R=y.dot(c[x])<0?-1:1;o.setXYZW(x,M.x,M.y,M.z,R)}for(let x=0,E=v.length;x<E;++x){let w=v[x],R=w.start,I=w.count;for(let N=R,D=R+I;N<D;N+=3)A(e.getX(N+0)),A(e.getX(N+1)),A(e.getX(N+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Kt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);let s=new L,r=new L,o=new L,a=new L,c=new L,l=new L,h=new L,d=new L;if(e)for(let u=0,f=e.count;u<f;u+=3){let g=e.getX(u+0),S=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,S),o.fromBufferAttribute(t,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,S),l.fromBufferAttribute(i,m),a.add(h),c.add(h),l.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(S,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,d=a.normalized,u=new l.constructor(c.length*h),f=0,g=0;for(let S=0,m=c.length;S<m;S++){a.isInterleavedBufferAttribute?f=c[S]*a.data.stride+a.offset:f=c[S]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new Kt(u,h,d)}if(this.index===null)return Ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,i);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){let u=l[h],f=e(u,i);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let l=i[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){let f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var fu=new L,c1=new L,h1=new et,qn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=fu.subVectors(i,t).cross(c1.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(fu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||h1.getNormalMatrix(e),s=this.coplanarPoint(fu).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},u1=0,Li=class extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:u1++}),this.uuid=Nr(),this.name="",this.type="Material",this.blending=is,this.side=ns,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fu,this.blendDst=Ou,this.blendEquation=Us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=_r,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Z0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=yl,this.stencilZFail=yl,this.stencilZPass=yl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Ke(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ae().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new qn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ae().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ae().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Ci=new L,du=new L,ja=new L,Ya=new L,Tr=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ci.copy(this.origin).addScaledVector(this.direction,t),Ci.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){du.copy(e).add(t).multiplyScalar(.5),ja.copy(t).sub(e).normalize(),Ya.copy(this.origin).sub(du);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ja),a=Ya.dot(this.direction),c=-Ya.dot(ja),l=Ya.lengthSq(),h=Math.abs(1-o*o),d,u,f,g;if(h>0)if(d=o*c-a,u=o*a-c,g=r*h,d>=0)if(u>=-g)if(u<=g){let S=1/h;d*=S,u*=S,f=d*(d+o*u+2*a)+u*(o*d+u+2*c)+l}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(du).addScaledVector(ja,u),f}intersectSphere(e,t){if(e.radius<0)return null;Ci.subVectors(e.center,this.origin);let i=Ci.dot(this.direction),s=Ci.dot(Ci)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ci)!==null}intersectTriangle(e,t,i,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,h=a.z,d=e.x-o.x,u=e.y-o.y,f=e.z-o.z,g=t.x-o.x,S=t.y-o.y,m=t.z-o.z,p=i.x-o.x,v=i.y-o.y,M=i.z-o.z,y=Math.abs(c),_=Math.abs(l),b=Math.abs(h),A,x,E,w,R,I,N,D,U,W,k,re;if(y>=_&&y>=b?(E=c,I=d,U=g,re=p,c>=0?(A=l,x=h,w=u,R=f,N=S,D=m,W=v,k=M):(A=h,x=l,w=f,R=u,N=m,D=S,W=M,k=v)):_>=b?(E=l,I=u,U=S,re=v,l>=0?(A=h,x=c,w=f,R=d,N=m,D=g,W=M,k=p):(A=c,x=h,w=d,R=f,N=g,D=m,W=p,k=M)):(E=h,I=f,U=m,re=M,h>=0?(A=c,x=l,w=d,R=u,N=g,D=S,W=p,k=v):(A=l,x=c,w=u,R=d,N=S,D=g,W=v,k=p)),E===0)return null;let q=A/E,Z=x/E,ee=1/E,Ge=w-q*I,Le=R-Z*I,dt=N-q*U,rt=D-Z*U,pt=W-q*re,Y=k-Z*re,ne=pt*rt-Y*dt,we=Ge*Y-Le*pt,je=dt*Le-rt*Ge;if(s){if(ne<0||we<0||je<0)return null}else if((ne<0||we<0||je<0)&&(ne>0||we>0||je>0))return null;let De=ne+we+je;if(De===0)return null;let Ze=ee*(ne*I+we*U+je*re);return(De>0?Ze<0:Ze>0)?null:this.at(Ze/De,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ps=class extends Li{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=Nu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},r0=new yt,Ts=new Tr,Za=new fi,o0=new L,$a=new L,el=new L,tl=new L,pu=new L,nl=new L,a0=new L,il=new L,zt=class extends En{constructor(e=new Rt,t=new Ps){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){nl.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],d=r[c];h!==0&&(pu.fromBufferAttribute(d,e),o?nl.addScaledVector(pu,h):nl.addScaledVector(pu.sub(t),h))}t.add(nl)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Za.copy(i.boundingSphere),Za.applyMatrix4(r),Ts.copy(e.ray).recast(e.near),!(Za.containsPoint(Ts.origin)===!1&&(Ts.intersectSphere(Za,o0)===null||Ts.origin.distanceToSquared(o0)>(e.far-e.near)**2))&&(r0.copy(r).invert(),Ts.copy(e.ray).applyMatrix4(r0),!(i.boundingBox!==null&&Ts.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ts)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,S=u.length;g<S;g++){let m=u[g],p=o[m.materialIndex],v=Math.max(m.start,f.start),M=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,_=M;y<_;y+=3){let b=a.getX(y),A=a.getX(y+1),x=a.getX(y+2);s=sl(this,p,e,i,l,h,d,b,A,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),S=Math.min(a.count,f.start+f.count);for(let m=g,p=S;m<p;m+=3){let v=a.getX(m),M=a.getX(m+1),y=a.getX(m+2);s=sl(this,o,e,i,l,h,d,v,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,S=u.length;g<S;g++){let m=u[g],p=o[m.materialIndex],v=Math.max(m.start,f.start),M=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,_=M;y<_;y+=3){let b=y,A=y+1,x=y+2;s=sl(this,p,e,i,l,h,d,b,A,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),S=Math.min(c.count,f.start+f.count);for(let m=g,p=S;m<p;m+=3){let v=m,M=m+1,y=m+2;s=sl(this,o,e,i,l,h,d,v,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function f1(n,e,t,i,s,r,o,a){let c;if(e.side===vn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===ns,a),c===null)return null;il.copy(a),il.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(il);return l<t.near||l>t.far?null:{distance:l,point:il.clone(),object:n}}function sl(n,e,t,i,s,r,o,a,c,l){n.getVertexPosition(a,$a),n.getVertexPosition(c,el),n.getVertexPosition(l,tl);let h=f1(n,e,t,i,$a,el,tl,a0);if(h){let d=new L;Ri.getBarycoord(a0,$a,el,tl,d),s&&(h.uv=Ri.getInterpolatedAttribute(s,a,c,l,d,new ae)),r&&(h.uv1=Ri.getInterpolatedAttribute(r,a,c,l,d,new ae)),o&&(h.normal=Ri.getInterpolatedAttribute(o,a,c,l,d,new L),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:c,c:l,normal:new L,materialIndex:0};Ri.getNormal($a,el,tl,u.normal),h.face=u,h.barycoord=d}return h}var Io=class extends gn{constructor(e=null,t=1,i=1,s,r,o,a,c,l=rn,h=rn,d,u){super(null,o,a,c,l,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var jn=class extends Kt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},xr=new yt,l0=new yt,rl=[],c0=new ui,d1=new yt,xo=new zt,vo=new fi,wr=class extends zt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new jn(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,d1)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,xr),c0.copy(e.boundingBox).applyMatrix4(xr),this.boundingBox.union(c0)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new fi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,xr),vo.copy(e.boundingSphere).applyMatrix4(xr),this.boundingSphere.union(vo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(xo.geometry=this.geometry,xo.material=this.material,xo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vo.copy(this.boundingSphere),vo.applyMatrix4(i),e.ray.intersectsSphere(vo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,xr),l0.multiplyMatrices(i,xr),xo.matrixWorld=l0,xo.raycast(e,rl);for(let o=0,a=rl.length;o<a;o++){let c=rl[o];c.instanceId=r,c.object=this,t.push(c)}rl.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new jn(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Io(new Float32Array(s*this.count),s,this.count,dc,Gn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<i.length;l++)o+=i[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(i,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ws=new fi,p1=new ae(.5,.5),ol=new L,Do=class{constructor(e=new qn,t=new qn,i=new qn,s=new qn,r=new qn,o=new qn){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Jn,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],S=r[9],m=r[10],p=r[11],v=r[12],M=r[13],y=r[14],_=r[15];if(s[0].setComponents(l-o,f-h,p-g,_-v).normalize(),s[1].setComponents(l+o,f+h,p+g,_+v).normalize(),s[2].setComponents(l+a,f+d,p+S,_+M).normalize(),s[3].setComponents(l-a,f-d,p-S,_-M).normalize(),i)s[4].setComponents(c,u,m,y).normalize(),s[5].setComponents(l-c,f-u,p-m,_-y).normalize();else if(s[4].setComponents(l-c,f-u,p-m,_-y).normalize(),t===Jn)s[5].setComponents(l+c,f+u,p+m,_+y).normalize();else if(t===Eo)s[5].setComponents(c,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ws.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(e){ws.center.set(0,0,0);let t=p1.distanceTo(e.center);return ws.radius=.7071067811865476+t,ws.applyMatrix4(e.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(ol.x=s.normal.x>0?e.max.x:e.min.x,ol.y=s.normal.y>0?e.max.y:e.min.y,ol.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ol)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Cr=class extends Li{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ol=new L,Nl=new L,h0=new yt,yo=new Tr,al=new fi,mu=new L,u0=new L,Rr=class extends En{constructor(e=new Rt,t=new Cr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Ol.fromBufferAttribute(t,s-1),Nl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Ol.distanceTo(Nl);e.setAttribute("lineDistance",new gt(i,1))}else Ke("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),al.copy(i.boundingSphere),al.applyMatrix4(s),al.radius+=r,e.ray.intersectsSphere(al)===!1)return;h0.copy(s).invert(),yo.copy(e.ray).applyMatrix4(h0);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let S=f,m=g-1;S<m;S+=l){let p=h.getX(S),v=h.getX(S+1),M=ll(this,e,yo,c,p,v,S);M&&t.push(M)}if(this.isLineLoop){let S=h.getX(g-1),m=h.getX(f),p=ll(this,e,yo,c,S,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let S=f,m=g-1;S<m;S+=l){let p=ll(this,e,yo,c,S,S+1,S);p&&t.push(p)}if(this.isLineLoop){let S=ll(this,e,yo,c,g-1,f,g-1);S&&t.push(S)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ll(n,e,t,i,s,r,o){let a=n.geometry.attributes.position;if(Ol.fromBufferAttribute(a,s),Nl.fromBufferAttribute(a,r),t.distanceSqToSegment(Ol,Nl,mu,u0)>i)return;mu.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(mu);if(!(l<e.near||l>e.far))return{distance:l,point:u0.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var f0=new L,d0=new L,Lo=class extends Rr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)f0.fromBufferAttribute(t,s),d0.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+f0.distanceTo(d0);e.setAttribute("lineDistance",new gt(i,1))}else Ke("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Bl=class extends Li{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},p0=new yt,Eu=new Tr,cl=new fi,hl=new L,Is=class extends En{constructor(e=new Rt,t=new Bl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cl.copy(i.boundingSphere),cl.applyMatrix4(s),cl.radius+=r,e.ray.intersectsSphere(cl)===!1)return;p0.copy(s).invert(),Eu.copy(e.ray).applyMatrix4(p0);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,d=i.attributes.position;if(l!==null){let u=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let g=u,S=f;g<S;g++){let m=l.getX(g);hl.fromBufferAttribute(d,m),m0(hl,m,c,s,e,t,this)}}else{let u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=u,S=f;g<S;g++)hl.fromBufferAttribute(d,g),m0(hl,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function m0(n,e,t,i,s,r,o){let a=Eu.distanceSqToPoint(n);if(a<t){let c=new L;Eu.closestPointToPoint(n,c),c.applyMatrix4(i);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Fo=class extends gn{constructor(e=[],t=ss,i,s,r,o,a,c,l,h){super(e,t,i,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ds=class extends gn{constructor(e,t,i,s,r,o,a,c,l){super(e,t,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Zi=class extends gn{constructor(e,t,i=$n,s,r,o,a=rn,c=rn,l,h=li,d=1){if(h!==li&&h!==os)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,o,a,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ar(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ul=class extends Zi{constructor(e,t=$n,i=ss,s,r,o=rn,a=rn,c,l=li){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,i,s,r,o,a,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Oo=class extends gn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},di=class n extends Rt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],d=[],u=0,f=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(h,3)),this.setAttribute("uv",new gt(d,2));function g(S,m,p,v,M,y,_,b,A,x,E){let w=y/A,R=_/x,I=y/2,N=_/2,D=b/2,U=A+1,W=x+1,k=0,re=0,q=new L;for(let Z=0;Z<W;Z++){let ee=Z*R-N;for(let Ge=0;Ge<U;Ge++){let Le=Ge*w-I;q[S]=Le*v,q[m]=ee*M,q[p]=D,l.push(q.x,q.y,q.z),q[S]=0,q[m]=0,q[p]=b>0?1:-1,h.push(q.x,q.y,q.z),d.push(Ge/A),d.push(1-Z/x),k+=1}}for(let Z=0;Z<x;Z++)for(let ee=0;ee<A;ee++){let Ge=u+ee+U*Z,Le=u+ee+U*(Z+1),dt=u+(ee+1)+U*(Z+1),rt=u+(ee+1)+U*Z;c.push(Ge,Le,rt),c.push(Le,dt,rt),re+=6}a.addGroup(f,re,E),f+=re,u+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var No=class n extends Rt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],l=new L,h=new ae;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){let f=i+d/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[u]/e+1)/2,h.y=(o[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new gt(o,3)),this.setAttribute("normal",new gt(a,3)),this.setAttribute("uv",new gt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Bo=class n extends Rt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],g=0,S=[],m=i/2,p=0;v(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new gt(d,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(f,2));function v(){let y=new L,_=new L,b=0,A=(t-e)/i;for(let x=0;x<=r;x++){let E=[],w=x/r,R=w*(t-e)+e;for(let I=0;I<=s;I++){let N=I/s,D=N*c+a,U=Math.sin(D),W=Math.cos(D);_.x=R*U,_.y=-w*i+m,_.z=R*W,d.push(_.x,_.y,_.z),y.set(U,A,W).normalize(),u.push(y.x,y.y,y.z),f.push(N,1-w),E.push(g++)}S.push(E)}for(let x=0;x<s;x++)for(let E=0;E<r;E++){let w=S[E][x],R=S[E+1][x],I=S[E+1][x+1],N=S[E][x+1];(e>0||E!==0)&&(h.push(w,R,N),b+=3),(t>0||E!==r-1)&&(h.push(R,I,N),b+=3)}l.addGroup(p,b,0),p+=b}function M(y){let _=g,b=new ae,A=new L,x=0,E=y===!0?e:t,w=y===!0?1:-1;for(let I=1;I<=s;I++)d.push(0,m*w,0),u.push(0,w,0),f.push(.5,.5),g++;let R=g;for(let I=0;I<=s;I++){let D=I/s*c+a,U=Math.cos(D),W=Math.sin(D);A.x=E*W,A.y=m*w,A.z=E*U,d.push(A.x,A.y,A.z),u.push(0,w,0),b.x=U*.5+.5,b.y=W*.5*w+.5,f.push(b.x,b.y),g++}for(let I=0;I<s;I++){let N=_+I,D=R+I;y===!0?h.push(D,D+1,N):h.push(D+1,D,N),x+=3}l.addGroup(p,x,y===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var ul=new L,fl=new L,gu=new L,dl=new Ri,Uo=class extends Rt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(Sl*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],d=new Array(3),u={},f=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);let{a:S,b:m,c:p}=dl;if(S.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),dl.getNormal(gu),d[0]=`${Math.round(S.x*s)},${Math.round(S.y*s)},${Math.round(S.z*s)}`,d[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,d[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let v=0;v<3;v++){let M=(v+1)%3,y=d[v],_=d[M],b=dl[h[v]],A=dl[h[M]],x=`${y}_${_}`,E=`${_}_${y}`;E in u&&u[E]?(gu.dot(u[E].normal)<=r&&(f.push(b.x,b.y,b.z),f.push(A.x,A.y,A.z)),u[E]=null):x in u||(u[x]={index0:l[v],index1:l[M],normal:gu.clone()})}}for(let g in u)if(u[g]){let{index0:S,index1:m}=u[g];ul.fromBufferAttribute(a,S),fl.fromBufferAttribute(a,m),f.push(ul.x,ul.y,ul.z),f.push(fl.x,fl.y,fl.z)}this.setAttribute("position",new gt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ke("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=i[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);let h=i[s],u=i[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new ae:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new L,s=[],r=[],o=[],a=new L,c=new yt;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),d<=l&&(l=d,i.set(0,1,0)),u<=l&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ht(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(ht(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Pr=class extends xn{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new ae){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Gl=class extends Pr{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function ef(){let n=0,e=0,t=0,i=0;function s(r,o,a,c){n=r,e=a,t=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,d){let u=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+d)+(c-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var g0=new L,x0=new L,xu=new ef,vu=new ef,yu=new ef,zl=class extends xn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(x0.subVectors(s[0],s[1]).add(s[0]),l=x0);let d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(g0.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=g0),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(d),f),S=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);S<1e-4&&(S=1),g<1e-4&&(g=S),m<1e-4&&(m=S),xu.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,S,m),vu.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,S,m),yu.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,S,m)}else this.curveType==="catmullrom"&&(xu.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),vu.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),yu.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return i.set(xu.calc(c),vu.calc(c),yu.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function v0(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,c=n*a;return(2*t-2*i+r+o)*c+(-3*t+3*i-2*r-o)*a+r*n+t}function m1(n,e){let t=1-n;return t*t*e}function g1(n,e){return 2*(1-n)*n*e}function x1(n,e){return n*n*e}function bo(n,e,t,i){return m1(n,e)+g1(n,t)+x1(n,i)}function v1(n,e){let t=1-n;return t*t*t*e}function y1(n,e){let t=1-n;return 3*t*t*n*e}function S1(n,e){return 3*(1-n)*n*n*e}function b1(n,e){return n*n*n*e}function _o(n,e,t,i,s){return v1(n,e)+y1(n,t)+S1(n,i)+b1(n,s)}var Go=class extends xn{constructor(e=new ae,t=new ae,i=new ae,s=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new ae){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(_o(e,s.x,r.x,o.x,a.x),_o(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Hl=class extends xn{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(_o(e,s.x,r.x,o.x,a.x),_o(e,s.y,r.y,o.y,a.y),_o(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zo=class extends xn{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},kl=class extends xn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ho=class extends xn{constructor(e=new ae,t=new ae,i=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ae){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(bo(e,s.x,r.x,o.x),bo(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ko=class extends xn{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(bo(e,s.x,r.x,o.x),bo(e,s.y,r.y,o.y),bo(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Vo=class extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return i.set(v0(a,c.x,l.x,h.x,d.x),v0(a,c.y,l.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new ae().fromArray(s))}return this}},Vl=Object.freeze({__proto__:null,ArcCurve:Gl,CatmullRomCurve3:zl,CubicBezierCurve:Go,CubicBezierCurve3:Hl,EllipseCurve:Pr,LineCurve:zo,LineCurve3:kl,QuadraticBezierCurve:Ho,QuadraticBezierCurve3:ko,SplineCurve:Vo}),Wl=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Vl[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new Vl[s.type]().fromJSON(s))}return this}},Ls=class extends Wl{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new zo(this.currentPoint.clone(),new ae(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let r=new Ho(this.currentPoint.clone(),new ae(e,t),new ae(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,o){let a=new Go(this.currentPoint.clone(),new ae(e,t),new ae(i,s),new ae(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Vo(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,i,s,r,o),this}absarc(e,t,i,s,r,o){return this.absellipse(e,t,i,i,s,r,o),this}ellipse(e,t,i,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,i,s,r,o,a,c),this}absellipse(e,t,i,s,r,o,a,c){let l=new Pr(e,t,i,s,r,o,a,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},pi=class extends Ls{constructor(e){super(e),this.uuid=Nr(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(new Ls().fromJSON(s))}return this}};function _1(n,e,t=2){let i=e&&e.length,s=i?e[0]*t:n.length,r=up(n,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(i&&(r=w1(n,e,r,t)),n.length>80*t){a=n[0],c=n[1];let h=a,d=c;for(let u=t;u<s;u+=t){let f=n[u],g=n[u+1];f<a&&(a=f),g<c&&(c=g),f>h&&(h=f),g>d&&(d=g)}l=Math.max(h-a,d-c),l=l!==0?32767/l:0}return Wo(r,o,t,a,c,l,0),o}function up(n,e,t,i,s){let r;if(s===U1(n,e,t,i)>0)for(let o=e;o<t;o+=i)r=y0(o/i|0,n[o],n[o+1],r);else for(let o=t-i;o>=e;o-=i)r=y0(o/i|0,n[o],n[o+1],r);return r&&Ir(r,r.next)&&(Qo(r),r=r.next),r}function Fs(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Ir(t,t.next)||Wt(t.prev,t,t.next)===0)){if(Qo(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Wo(n,e,t,i,s,r,o){if(!n)return;!o&&r&&D1(n,i,s,r);let a=n;for(;n.prev!==n.next;){let c=n.prev,l=n.next;if(r?A1(n,i,s,r):M1(n)){e.push(c.i,n.i,l.i),Qo(n),n=l.next,a=l.next;continue}if(n=l,n===a){o?o===1?(n=E1(Fs(n),e),Wo(n,e,t,i,s,r,2)):o===2&&T1(n,e,t,i,s,r):Wo(Fs(n),e,t,i,s,r,1);break}}}function M1(n){let e=n.prev,t=n,i=n.next;if(Wt(e,t,i)>=0)return!1;let s=e.x,r=t.x,o=i.x,a=e.y,c=t.y,l=i.y,h=Math.min(s,r,o),d=Math.min(a,c,l),u=Math.max(s,r,o),f=Math.max(a,c,l),g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&So(s,a,r,c,o,l,g.x,g.y)&&Wt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function A1(n,e,t,i){let s=n.prev,r=n,o=n.next;if(Wt(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,d=r.y,u=o.y,f=Math.min(a,c,l),g=Math.min(h,d,u),S=Math.max(a,c,l),m=Math.max(h,d,u),p=Tu(f,g,e,t,i),v=Tu(S,m,e,t,i),M=n.prevZ,y=n.nextZ;for(;M&&M.z>=p&&y&&y.z<=v;){if(M.x>=f&&M.x<=S&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&So(a,h,c,d,l,u,M.x,M.y)&&Wt(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=f&&y.x<=S&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&So(a,h,c,d,l,u,y.x,y.y)&&Wt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=p;){if(M.x>=f&&M.x<=S&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&So(a,h,c,d,l,u,M.x,M.y)&&Wt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=S&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&So(a,h,c,d,l,u,y.x,y.y)&&Wt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function E1(n,e){let t=n;do{let i=t.prev,s=t.next.next;!Ir(i,s)&&dp(i,t,t.next,s)&&Xo(i,s)&&Xo(s,i)&&(e.push(i.i,t.i,s.i),Qo(t),Qo(t.next),t=n=s),t=t.next}while(t!==n);return Fs(t)}function T1(n,e,t,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&O1(o,a)){let c=pp(o,a);o=Fs(o,o.next),c=Fs(c,c.next),Wo(o,e,t,i,s,r,0),Wo(c,e,t,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function w1(n,e,t,i){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*i,c=r<o-1?e[r+1]*i:n.length,l=up(n,a,c,i,!1);l===l.next&&(l.steiner=!0),s.push(F1(l))}s.sort(C1);for(let r=0;r<s.length;r++)t=R1(s[r],t);return t}function C1(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function R1(n,e){let t=P1(n,e);if(!t)return e;let i=pp(t,n);return Fs(i,i.next),Fs(t,t.next)}function P1(n,e){let t=e,i=n.x,s=n.y,r=-1/0,o;if(Ir(n,t))return t;do{if(Ir(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=i&&d>r&&(r=d,o=t.x<t.next.x?t:t.next,d===i))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,c=o.x,l=o.y,h=1/0;t=o;do{if(i>=t.x&&t.x>=c&&i!==t.x&&fp(s<l?i:r,s,c,l,s<l?r:i,s,t.x,t.y)){let d=Math.abs(s-t.y)/(i-t.x);Xo(t,n)&&(d<h||d===h&&(t.x>o.x||t.x===o.x&&I1(o,t)))&&(o=t,h=d)}t=t.next}while(t!==a);return o}function I1(n,e){return Wt(n.prev,n,e.prev)<0&&Wt(e.next,n,n.next)<0}function D1(n,e,t,i){let s=n;do s.z===0&&(s.z=Tu(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,L1(s)}function L1(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let o=i,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=o}r.nextZ=null,t*=2}while(e>1);return n}function Tu(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function F1(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function fp(n,e,t,i,s,r,o,a){return(s-o)*(e-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(i-a)}function So(n,e,t,i,s,r,o,a){return!(n===o&&e===a)&&fp(n,e,t,i,s,r,o,a)}function O1(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!N1(n,e)&&(Xo(n,e)&&Xo(e,n)&&B1(n,e)&&(Wt(n.prev,n,e.prev)||Wt(n,e.prev,e))||Ir(n,e)&&Wt(n.prev,n,n.next)>0&&Wt(e.prev,e,e.next)>0)}function Wt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Ir(n,e){return n.x===e.x&&n.y===e.y}function dp(n,e,t,i){let s=ml(Wt(n,e,t)),r=ml(Wt(n,e,i)),o=ml(Wt(t,i,n)),a=ml(Wt(t,i,e));return!!(s!==r&&o!==a||s===0&&pl(n,t,e)||r===0&&pl(n,i,e)||o===0&&pl(t,n,i)||a===0&&pl(t,e,i))}function pl(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function ml(n){return n>0?1:n<0?-1:0}function N1(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&dp(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Xo(n,e){return Wt(n.prev,n,n.next)<0?Wt(n,e,n.next)>=0&&Wt(n,n.prev,e)>=0:Wt(n,e,n.prev)<0||Wt(n,n.next,e)<0}function B1(n,e){let t=n,i=!1,s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function pp(n,e){let t=wu(n.i,n.x,n.y),i=wu(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function y0(n,e,t,i){let s=wu(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Qo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function wu(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function U1(n,e,t,i){let s=0;for(let r=e,o=t-i;r<t;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Cu=class{static triangulate(e,t,i=2){return _1(e,t,i)}},ai=class n{static area(e){let t=e.length,i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],s=[],r=[];S0(e),b0(i,e);let o=e.length;t.forEach(S0);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,b0(i,t[c]);let a=Cu.triangulate(i,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function S0(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function b0(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}var Dr=class n extends Rt{constructor(e=new pi([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new gt(s,3)),this.setAttribute("uv",new gt(r,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,S=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:G1,M,y=!1,_,b,A,x;if(p){M=p.getSpacedPoints(h),y=!0,u=!1;let ie=p.isCatmullRomCurve3?p.closed:!1;_=p.computeFrenetFrames(h,ie),b=new L,A=new L,x=new L}u||(m=0,f=0,g=0,S=0);let E=a.extractPoints(l),w=E.shape,R=E.holes;if(!ai.isClockWise(w)){w=w.reverse();for(let ie=0,le=R.length;ie<le;ie++){let ue=R[ie];ai.isClockWise(ue)&&(R[ie]=ue.reverse())}}function N(ie){let ue=10000000000000001e-36,fe=ie[0];for(let me=1;me<=ie.length;me++){let qe=me%ie.length,Xe=ie[qe],$e=Xe.x-fe.x,tt=Xe.y-fe.y,F=$e*$e+tt*tt,St=Math.max(Math.abs(Xe.x),Math.abs(Xe.y),Math.abs(fe.x),Math.abs(fe.y)),lt=ue*St*St;if(F<=lt){ie.splice(qe,1),me--;continue}fe=Xe}}N(w),R.forEach(N);let D=R.length,U=w;for(let ie=0;ie<D;ie++){let le=R[ie];w=w.concat(le)}function W(ie,le,ue){return le||Ye("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(le,ue)}let k=w.length;function re(ie,le,ue){let fe,me,qe,Xe=ie.x-le.x,$e=ie.y-le.y,tt=ue.x-ie.x,F=ue.y-ie.y,St=Xe*Xe+$e*$e,lt=Xe*F-$e*tt;if(Math.abs(lt)>Number.EPSILON){let P=Math.sqrt(St),T=Math.sqrt(tt*tt+F*F),G=le.x-$e/P,V=le.y+Xe/P,J=ue.x-F/T,de=ue.y+tt/T,pe=((J-G)*F-(de-V)*tt)/(Xe*F-$e*tt);fe=G+Xe*pe-ie.x,me=V+$e*pe-ie.y;let j=fe*fe+me*me;if(j<=2)return new ae(fe,me);qe=Math.sqrt(j/2)}else{let P=!1;Xe>Number.EPSILON?tt>Number.EPSILON&&(P=!0):Xe<-Number.EPSILON?tt<-Number.EPSILON&&(P=!0):Math.sign($e)===Math.sign(F)&&(P=!0),P?(fe=-$e,me=Xe,qe=Math.sqrt(St)):(fe=Xe,me=$e,qe=Math.sqrt(St/2))}return new ae(fe/qe,me/qe)}let q=[];for(let ie=0,le=U.length,ue=le-1,fe=ie+1;ie<le;ie++,ue++,fe++)ue===le&&(ue=0),fe===le&&(fe=0),q[ie]=re(U[ie],U[ue],U[fe]);let Z=[],ee,Ge=q.concat();for(let ie=0,le=D;ie<le;ie++){let ue=R[ie];ee=[];for(let fe=0,me=ue.length,qe=me-1,Xe=fe+1;fe<me;fe++,qe++,Xe++)qe===me&&(qe=0),Xe===me&&(Xe=0),ee[fe]=re(ue[fe],ue[qe],ue[Xe]);Z.push(ee),Ge=Ge.concat(ee)}let Le;if(m===0)Le=ai.triangulateShape(U,R);else{let ie=[],le=[];for(let ue=0;ue<m;ue++){let fe=ue/m,me=f*Math.cos(fe*Math.PI/2),qe=g*Math.sin(fe*Math.PI/2)+S;for(let Xe=0,$e=U.length;Xe<$e;Xe++){let tt=W(U[Xe],q[Xe],qe);we(tt.x,tt.y,-me),fe===0&&ie.push(tt)}for(let Xe=0,$e=D;Xe<$e;Xe++){let tt=R[Xe];ee=Z[Xe];let F=[];for(let St=0,lt=tt.length;St<lt;St++){let P=W(tt[St],ee[St],qe);we(P.x,P.y,-me),fe===0&&F.push(P)}fe===0&&le.push(F)}}Le=ai.triangulateShape(ie,le)}let dt=Le.length,rt=g+S;for(let ie=0;ie<k;ie++){let le=u?W(w[ie],Ge[ie],rt):w[ie];y?(A.copy(_.normals[0]).multiplyScalar(le.x),b.copy(_.binormals[0]).multiplyScalar(le.y),x.copy(M[0]).add(A).add(b),we(x.x,x.y,x.z)):we(le.x,le.y,0)}for(let ie=1;ie<=h;ie++)for(let le=0;le<k;le++){let ue=u?W(w[le],Ge[le],rt):w[le];y?(A.copy(_.normals[ie]).multiplyScalar(ue.x),b.copy(_.binormals[ie]).multiplyScalar(ue.y),x.copy(M[ie]).add(A).add(b),we(x.x,x.y,x.z)):we(ue.x,ue.y,d/h*ie)}for(let ie=m-1;ie>=0;ie--){let le=ie/m,ue=f*Math.cos(le*Math.PI/2),fe=g*Math.sin(le*Math.PI/2)+S;for(let me=0,qe=U.length;me<qe;me++){let Xe=W(U[me],q[me],fe);we(Xe.x,Xe.y,d+ue)}for(let me=0,qe=R.length;me<qe;me++){let Xe=R[me];ee=Z[me];for(let $e=0,tt=Xe.length;$e<tt;$e++){let F=W(Xe[$e],ee[$e],fe);y?we(F.x,F.y+M[h-1].y,M[h-1].x+ue):we(F.x,F.y,d+ue)}}}pt(),Y();function pt(){let ie=s.length/3;if(u){let le=0,ue=k*le;for(let fe=0;fe<dt;fe++){let me=Le[fe];je(me[2]+ue,me[1]+ue,me[0]+ue)}le=h+m*2,ue=k*le;for(let fe=0;fe<dt;fe++){let me=Le[fe];je(me[0]+ue,me[1]+ue,me[2]+ue)}}else{for(let le=0;le<dt;le++){let ue=Le[le];je(ue[2],ue[1],ue[0])}for(let le=0;le<dt;le++){let ue=Le[le];je(ue[0]+k*h,ue[1]+k*h,ue[2]+k*h)}}i.addGroup(ie,s.length/3-ie,0)}function Y(){let ie=s.length/3,le=0;ne(U,le),le+=U.length;for(let ue=0,fe=R.length;ue<fe;ue++){let me=R[ue];ne(me,le),le+=me.length}i.addGroup(ie,s.length/3-ie,1)}function ne(ie,le){let ue=ie.length;for(;--ue>=0;){let fe=ue,me=ue-1;me<0&&(me=ie.length-1);for(let qe=0,Xe=h+m*2;qe<Xe;qe++){let $e=k*qe,tt=k*(qe+1),F=le+fe+$e,St=le+me+$e,lt=le+me+tt,P=le+fe+tt;De(F,St,lt,P)}}}function we(ie,le,ue){c.push(ie),c.push(le),c.push(ue)}function je(ie,le,ue){Ze(ie),Ze(le),Ze(ue);let fe=s.length/3,me=v.generateTopUV(i,s,fe-3,fe-2,fe-1);At(me[0]),At(me[1]),At(me[2])}function De(ie,le,ue,fe){Ze(ie),Ze(le),Ze(fe),Ze(le),Ze(ue),Ze(fe);let me=s.length/3,qe=v.generateSideWallUV(i,s,me-6,me-3,me-2,me-1);At(qe[0]),At(qe[1]),At(qe[3]),At(qe[1]),At(qe[2]),At(qe[3])}function Ze(ie){s.push(c[ie*3+0]),s.push(c[ie*3+1]),s.push(c[ie*3+2])}function At(ie){r.push(ie.x),r.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return z1(t,i,e)}static fromJSON(e,t){let i=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];i.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Vl[s.type]().fromJSON(s)),new n(i,e.options)}},G1={generateTopUV:function(n,e,t,i,s){let r=e[t*3],o=e[t*3+1],a=e[i*3],c=e[i*3+1],l=e[s*3],h=e[s*3+1];return[new ae(r,o),new ae(a,c),new ae(l,h)]},generateSideWallUV:function(n,e,t,i,s,r){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[i*3],h=e[i*3+1],d=e[i*3+2],u=e[s*3],f=e[s*3+1],g=e[s*3+2],S=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new ae(o,1-c),new ae(l,1-d),new ae(u,1-g),new ae(S,1-p)]:[new ae(a,1-c),new ae(h,1-d),new ae(f,1-g),new ae(m,1-p)]}};function z1(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Yn=class n extends Rt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),l=a+1,h=c+1,d=e/a,u=t/c,f=[],g=[],S=[],m=[];for(let p=0;p<h;p++){let v=p*u-o;for(let M=0;M<l;M++){let y=M*d-r;g.push(y,-v,0),S.push(0,0,1),m.push(M/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<a;v++){let M=v+l*p,y=v+l*(p+1),_=v+1+l*(p+1),b=v+1+l*p;f.push(M,y,b),f.push(y,_,b)}this.setIndex(f),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(S,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Ko=class n extends Rt{constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],c=[],l=[],h=[],d=e,u=(t-e)/s,f=new L,g=new ae;for(let S=0;S<=s;S++){for(let m=0;m<=i;m++){let p=r+m/i*o;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let S=0;S<s;S++){let m=S*(i+1);for(let p=0;p<i;p++){let v=p+m,M=v,y=v+i+1,_=v+i+2,b=v+1;a.push(M,y,b),a.push(y,_,b)}}this.setIndex(a),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(l,3)),this.setAttribute("uv",new gt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},qo=class n extends Rt{constructor(e=new pi([new ae(0,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],s=[],r=[],o=[],a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(i),this.setAttribute("position",new gt(s,3)),this.setAttribute("normal",new gt(r,3)),this.setAttribute("uv",new gt(o,2));function l(h){let d=s.length/3,u=h.extractPoints(t),f=u.shape,g=u.holes;ai.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let v=g[m];ai.isClockWise(v)===!0&&(g[m]=v.reverse())}let S=ai.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let v=g[m];f=f.concat(v)}for(let m=0,p=f.length;m<p;m++){let v=f[m];s.push(v.x,v.y,0),r.push(0,0,1),o.push(v.x,v.y)}for(let m=0,p=S.length;m<p;m++){let v=S[m],M=v[0]+d,y=v[1]+d,_=v[2]+d;i.push(M,y,_),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return H1(t,e)}static fromJSON(e,t){let i=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];i.push(o)}return new n(i,e.curveSegments)}};function H1(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){let s=n[t];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e}var Jo=class n extends Rt{constructor(e=new ko(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new L,c=new L,l=new ae,h=new L,d=[],u=[],f=[],g=[];S(),this.setIndex(g),this.setAttribute("position",new gt(d,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(f,2));function S(){for(let M=0;M<t;M++)m(M);m(r===!1?t:0),v(),p()}function m(M){h=e.getPointAt(M/t,h);let y=o.normals[M],_=o.binormals[M];for(let b=0;b<=s;b++){let A=b/s*Math.PI*2,x=Math.sin(A),E=-Math.cos(A);c.x=E*y.x+x*_.x,c.y=E*y.y+x*_.y,c.z=E*y.z+x*_.z,c.normalize(),u.push(c.x,c.y,c.z),a.x=h.x+i*c.x,a.y=h.y+i*c.y,a.z=h.z+i*c.z,d.push(a.x,a.y,a.z)}}function p(){for(let M=1;M<=t;M++)for(let y=1;y<=s;y++){let _=(s+1)*(M-1)+(y-1),b=(s+1)*M+(y-1),A=(s+1)*M+y,x=(s+1)*(M-1)+y;g.push(_,b,x),g.push(b,A,x)}}function v(){for(let M=0;M<=t;M++)for(let y=0;y<=s;y++)l.x=M/t,l.y=y/s,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new Vl[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function zs(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(_0(s))s.isRenderTargetTexture?(Ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(_0(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function pn(n){let e={};for(let t=0;t<n.length;t++){let i=zs(n[t]);for(let s in i)e[s]=i[s]}return e}function _0(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function k1(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function tf(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}var mp={clone:zs,merge:pn},V1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,W1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Et=class extends Li{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=V1,this.fragmentShader=W1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zs(e.uniforms),this.uniformsGroups=k1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Ae().setHex(s.value);break;case"v2":this.uniforms[i].value=new ae().fromArray(s.value);break;case"v3":this.uniforms[i].value=new L().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ot().fromArray(s.value);break;case"m3":this.uniforms[i].value=new et().fromArray(s.value);break;case"m4":this.uniforms[i].value=new yt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Xl=class extends Et{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Ql=class extends Li{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=j0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Kl=class extends Li{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function vr(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Su(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var $i=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ql=class extends $i{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_u,endingEnd:_u}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Mu:r=e,a=2*t-i;break;case Au:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Mu:o=e,c=2*i-t;break;case Au:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let l=(i-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(i-t)/(s-t),S=g*g,m=S*g,p=-u*m+2*u*S-u*g,v=(1+u)*m+(-1.5-2*u)*S+(-.5+u)*g+1,M=(-1-f)*m+(1.5+f)*S+.5*g,y=f*m-f*S;for(let _=0;_!==a;++_)r[_]=p*o[h+_]+v*o[l+_]+M*o[c+_]+y*o[d+_];return r}},Jl=class extends $i{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(i-t)/(s-t),d=1-h;for(let u=0;u!==a;++u)r[u]=o[l+u]*d+o[c+u]*h;return r}},jl=class extends $i{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Yl=class extends $i{interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(i-t)/(s-t),S=1-g;for(let m=0;m!==a;++m)r[m]=o[l+m]*S+o[c+m]*g;return r}let u=a*2,f=e-1;for(let g=0;g!==a;++g){let S=o[l+g],m=o[c+g],p=f*u+g*2,v=d[p],M=d[p+1],y=e*u+g*2,_=h[y],b=h[y+1],A=Q1(i,t,v,_,s);r[g]=gp(A,S,M,b,m)}return r}};function gp(n,e,t,i,s){let r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function X1(n,e,t,i,s){let r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function Q1(n,e,t,i,s){let r=(n-e)/(s-e);for(let o=0;o<8;o++){let a=gp(r,e,t,i,s)-n;if(Math.abs(a)<1e-10)break;let c=X1(r,e,t,i,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}var Dn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=vr(t,this.TimeBufferType),this.values=vr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:vr(e.times,Array),values:vr(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),Su(e.settings)&&(i.settings={inTangents:vr(e.settings.inTangents,Array),outTangents:vr(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new jl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Jl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ql(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Yl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Mo:t=this.InterpolantFactoryMethodDiscrete;break;case Pl:t=this.InterpolantFactoryMethodLinear;break;case vl:t=this.InterpolantFactoryMethodSmooth;break;case bu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ke("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Mo;case this.InterpolantFactoryMethodLinear:return Pl;case this.InterpolantFactoryMethodSmooth:return vl;case this.InterpolantFactoryMethodBezier:return bu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;Su(this.settings)&&(M0(this.settings.inTangents,e),M0(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ye("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Ye("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){Ye("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){Ye("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&qg(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){Ye("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===vl,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let d=a*i,u=d-i,f=d+i;for(let g=0;g!==i;++g){let S=t[d+g];if(S!==t[u+g]||S!==t[f+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*i,u=o*i;for(let f=0;f!==i;++f)t[u+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,Su(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function M0(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}Dn.prototype.ValueTypeName="";Dn.prototype.TimeBufferType=Float32Array;Dn.prototype.ValueBufferType=Float32Array;Dn.prototype.DefaultInterpolation=Pl;var es=class extends Dn{constructor(e,t,i){super(e,t,i)}};es.prototype.ValueTypeName="bool";es.prototype.ValueBufferType=Array;es.prototype.DefaultInterpolation=Mo;es.prototype.InterpolantFactoryMethodLinear=void 0;es.prototype.InterpolantFactoryMethodSmooth=void 0;var Zl=class extends Dn{constructor(e,t,i,s){super(e,t,i,s)}};Zl.prototype.ValueTypeName="color";var $l=class extends Dn{constructor(e,t,i,s){super(e,t,i,s)}};$l.prototype.ValueTypeName="number";var ec=class extends $i{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)hi.slerpFlat(r,0,o,l-a,o,l,c);return r}},jo=class extends Dn{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new ec(this.times,this.values,this.getValueSize(),e)}};jo.prototype.ValueTypeName="quaternion";jo.prototype.InterpolantFactoryMethodSmooth=void 0;var ts=class extends Dn{constructor(e,t,i){super(e,t,i)}};ts.prototype.ValueTypeName="string";ts.prototype.ValueBufferType=Array;ts.prototype.DefaultInterpolation=Mo;ts.prototype.InterpolantFactoryMethodLinear=void 0;ts.prototype.InterpolantFactoryMethodSmooth=void 0;var tc=class extends Dn{constructor(e,t,i,s){super(e,t,i,s)}};tc.prototype.ValueTypeName="vector";var nc=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){let f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},xp=new nc,ic=class{constructor(e){this.manager=e!==void 0?e:xp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ic.DEFAULT_MATERIAL_NAME="__DEFAULT";var gl=new L,xl=new hi,ri=new L,Yo=class extends En{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(gl,xl,ri),ri.x===1&&ri.y===1&&ri.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(gl,xl,ri.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(gl,xl,ri),ri.x===1&&ri.y===1&&ri.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(gl,xl,ri.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ji=new L,A0=new ae,E0=new ae,sn=class extends Yo{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Il*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Sl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Il*2*Math.atan(Math.tan(Sl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ji.x,ji.y).multiplyScalar(-e/ji.z),ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ji.x,ji.y).multiplyScalar(-e/ji.z)}getViewSize(e,t){return this.getViewBounds(e,A0,E0),t.subVectors(E0,A0)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Sl*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Os=class extends Yo{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var Ns=class extends Rt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var yr=-90,Sr=1,sc=class extends En{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new sn(yr,Sr,e,t);s.layers=this.layers,this.add(s);let r=new sn(yr,Sr,e,t);r.layers=this.layers,this.add(r);let o=new sn(yr,Sr,e,t);o.layers=this.layers,this.add(o);let a=new sn(yr,Sr,e,t);a.layers=this.layers,this.add(a);let c=new sn(yr,Sr,e,t);c.layers=this.layers,this.add(c);let l=new sn(yr,Sr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===Jn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Eo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},rc=class extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var nf="\\[\\]\\.:\\/",K1=new RegExp("["+nf+"]","g"),sf="[^"+nf+"]",q1="[^"+nf.replace("\\.","")+"]",J1=/((?:WC+[\/:])*)/.source.replace("WC",sf),j1=/(WCOD+)?/.source.replace("WCOD",q1),Y1=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sf),Z1=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sf),$1=new RegExp("^"+J1+j1+Y1+Z1+"$"),ex=["material","materials","bones","map"],Ru=class{constructor(e,t,i){let s=i||Ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Ut=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(K1,"")}static parseTrackName(e){let t=$1.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);ex.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ye("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ye("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ye("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ye("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){Ye("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;Ye("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ut.Composite=Ru;Ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ut.prototype.GetterByBindingType=[Ut.prototype._getValue_direct,Ut.prototype._getValue_array,Ut.prototype._getValue_arrayElement,Ut.prototype._getValue_toArray];Ut.prototype.SetterByBindingTypeAndVersioning=[[Ut.prototype._setValue_direct,Ut.prototype._setValue_direct_setNeedsUpdate,Ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ut.prototype._setValue_array,Ut.prototype._setValue_array_setNeedsUpdate,Ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ut.prototype._setValue_arrayElement,Ut.prototype._setValue_arrayElement_setNeedsUpdate,Ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ut.prototype._setValue_fromArray,Ut.prototype._setValue_fromArray_setNeedsUpdate,Ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var y_=new Float32Array(1);var hf=class hf{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};hf.prototype.isMatrix2=!0;var Pu=hf;function rf(n,e,t,i){let s=tx(i);switch(t){case Ju:return n*e;case dc:return n*e/s.components*s.byteLength;case pc:return n*e/s.components*s.byteLength;case as:return n*e*2/s.components*s.byteLength;case mc:return n*e*2/s.components*s.byteLength;case ju:return n*e*3/s.components*s.byteLength;case wn:return n*e*4/s.components*s.byteLength;case gc:return n*e*4/s.components*s.byteLength;case ta:case na:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ia:case sa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vc:case Sc:return Math.max(n,16)*Math.max(e,8)/4;case xc:case yc:return Math.max(n,8)*Math.max(e,8)/2;case bc:case _c:case Ac:case Ec:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Mc:case ra:case Tc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case wc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Cc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Rc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Pc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ic:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Dc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Lc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Fc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Oc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Nc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Bc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Uc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Gc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case zc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Hc:case kc:case Vc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Wc:case Xc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case oa:case Qc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function tx(n){switch(n){case yn:case Xu:return{byteLength:1,components:1};case Fr:case Qu:case Ln:return{byteLength:2,components:1};case uc:case fc:return{byteLength:2,components:4};case $n:case hc:case Gn:return{byteLength:4,components:1};case Ku:case qu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Gp(){let n=null,e=!1,t=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function lx(n){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,d=l.byteLength,u=n.createBuffer();n.bindBuffer(c,u),n.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,c,l){let h=c.array,d=c.updateRanges;if(n.bindBuffer(l,a),d.length===0)n.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){let g=d[u],S=d[f];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++u,d[u]=S)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){let S=d[f];n.bufferSubData(l,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var cx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ux=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,px=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,vx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_x=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ax=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Rx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Px=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ix=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Dx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Lx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Ox=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ux=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gx="gl_FragColor = linearToOutputTexel( gl_FragColor );",zx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,kx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Vx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Wx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$x=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ev=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,tv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,nv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,iv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ov=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,av=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,hv=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uv=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,fv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_v=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Av=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ev=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Tv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Iv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Dv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ov=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Uv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Gv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Qv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Kv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,qv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Jv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Yv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$v=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ey=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ty=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ny=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,iy=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,sy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ry=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,oy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ay=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ly=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,cy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fy=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,py=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,my=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gy=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,xy=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,yy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,by=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_y=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,My=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ay=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ey=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ty=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ry=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Py=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Iy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ly=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Fy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Oy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ny=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,By=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Uy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ky=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,st={alphahash_fragment:cx,alphahash_pars_fragment:hx,alphamap_fragment:ux,alphamap_pars_fragment:fx,alphatest_fragment:dx,alphatest_pars_fragment:px,aomap_fragment:mx,aomap_pars_fragment:gx,batching_pars_vertex:xx,batching_vertex:vx,begin_vertex:yx,beginnormal_vertex:Sx,bsdfs:bx,iridescence_fragment:_x,bumpmap_pars_fragment:Mx,clipping_planes_fragment:Ax,clipping_planes_pars_fragment:Ex,clipping_planes_pars_vertex:Tx,clipping_planes_vertex:wx,color_fragment:Cx,color_pars_fragment:Rx,color_pars_vertex:Px,color_vertex:Ix,common:Dx,cube_uv_reflection_fragment:Lx,defaultnormal_vertex:Fx,displacementmap_pars_vertex:Ox,displacementmap_vertex:Nx,emissivemap_fragment:Bx,emissivemap_pars_fragment:Ux,colorspace_fragment:Gx,colorspace_pars_fragment:zx,envmap_fragment:Hx,envmap_common_pars_fragment:kx,envmap_pars_fragment:Vx,envmap_pars_vertex:Wx,envmap_physical_pars_fragment:tv,envmap_vertex:Xx,fog_vertex:Qx,fog_pars_vertex:Kx,fog_fragment:qx,fog_pars_fragment:Jx,gradientmap_pars_fragment:jx,lightmap_pars_fragment:Yx,lights_lambert_fragment:Zx,lights_lambert_pars_fragment:$x,lights_pars_begin:ev,lights_toon_fragment:nv,lights_toon_pars_fragment:iv,lights_phong_fragment:sv,lights_phong_pars_fragment:rv,lights_physical_fragment:ov,lights_physical_pars_fragment:av,lights_fragment_begin:lv,lights_fragment_maps:cv,lights_fragment_end:hv,lightprobes_pars_fragment:uv,logdepthbuf_fragment:fv,logdepthbuf_pars_fragment:dv,logdepthbuf_pars_vertex:pv,logdepthbuf_vertex:mv,map_fragment:gv,map_pars_fragment:xv,map_particle_fragment:vv,map_particle_pars_fragment:yv,metalnessmap_fragment:Sv,metalnessmap_pars_fragment:bv,morphinstance_vertex:_v,morphcolor_vertex:Mv,morphnormal_vertex:Av,morphtarget_pars_vertex:Ev,morphtarget_vertex:Tv,normal_fragment_begin:wv,normal_fragment_maps:Cv,normal_pars_fragment:Rv,normal_pars_vertex:Pv,normal_vertex:Iv,normalmap_pars_fragment:Dv,clearcoat_normal_fragment_begin:Lv,clearcoat_normal_fragment_maps:Fv,clearcoat_pars_fragment:Ov,iridescence_pars_fragment:Nv,opaque_fragment:Bv,packing:Uv,premultiplied_alpha_fragment:Gv,project_vertex:zv,dithering_fragment:Hv,dithering_pars_fragment:kv,roughnessmap_fragment:Vv,roughnessmap_pars_fragment:Wv,shadowmap_pars_fragment:Xv,shadowmap_pars_vertex:Qv,shadowmap_vertex:Kv,shadowmask_pars_fragment:qv,skinbase_vertex:Jv,skinning_pars_vertex:jv,skinning_vertex:Yv,skinnormal_vertex:Zv,specularmap_fragment:$v,specularmap_pars_fragment:ey,tonemapping_fragment:ty,tonemapping_pars_fragment:ny,transmission_fragment:iy,transmission_pars_fragment:sy,uv_pars_fragment:ry,uv_pars_vertex:oy,uv_vertex:ay,worldpos_vertex:ly,background_vert:cy,background_frag:hy,backgroundCube_vert:uy,backgroundCube_frag:fy,cube_vert:dy,cube_frag:py,depth_vert:my,depth_frag:gy,distance_vert:xy,distance_frag:vy,equirect_vert:yy,equirect_frag:Sy,linedashed_vert:by,linedashed_frag:_y,meshbasic_vert:My,meshbasic_frag:Ay,meshlambert_vert:Ey,meshlambert_frag:Ty,meshmatcap_vert:wy,meshmatcap_frag:Cy,meshnormal_vert:Ry,meshnormal_frag:Py,meshphong_vert:Iy,meshphong_frag:Dy,meshphysical_vert:Ly,meshphysical_frag:Fy,meshtoon_vert:Oy,meshtoon_frag:Ny,points_vert:By,points_frag:Uy,shadow_vert:Gy,shadow_frag:zy,sprite_vert:Hy,sprite_frag:ky},Ee={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},xi={basic:{uniforms:pn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.fog]),vertexShader:st.meshbasic_vert,fragmentShader:st.meshbasic_frag},lambert:{uniforms:pn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)},envMapIntensity:{value:1}}]),vertexShader:st.meshlambert_vert,fragmentShader:st.meshlambert_frag},phong:{uniforms:pn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:st.meshphong_vert,fragmentShader:st.meshphong_frag},standard:{uniforms:pn([Ee.common,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.roughnessmap,Ee.metalnessmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag},toon:{uniforms:pn([Ee.common,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.gradientmap,Ee.fog,Ee.lights,{emissive:{value:new Ae(0)}}]),vertexShader:st.meshtoon_vert,fragmentShader:st.meshtoon_frag},matcap:{uniforms:pn([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,{matcap:{value:null}}]),vertexShader:st.meshmatcap_vert,fragmentShader:st.meshmatcap_frag},points:{uniforms:pn([Ee.points,Ee.fog]),vertexShader:st.points_vert,fragmentShader:st.points_frag},dashed:{uniforms:pn([Ee.common,Ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:st.linedashed_vert,fragmentShader:st.linedashed_frag},depth:{uniforms:pn([Ee.common,Ee.displacementmap]),vertexShader:st.depth_vert,fragmentShader:st.depth_frag},normal:{uniforms:pn([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,{opacity:{value:1}}]),vertexShader:st.meshnormal_vert,fragmentShader:st.meshnormal_frag},sprite:{uniforms:pn([Ee.sprite,Ee.fog]),vertexShader:st.sprite_vert,fragmentShader:st.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:st.background_vert,fragmentShader:st.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:st.backgroundCube_vert,fragmentShader:st.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:st.cube_vert,fragmentShader:st.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:st.equirect_vert,fragmentShader:st.equirect_frag},distance:{uniforms:pn([Ee.common,Ee.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:st.distance_vert,fragmentShader:st.distance_frag},shadow:{uniforms:pn([Ee.lights,Ee.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:st.shadow_vert,fragmentShader:st.shadow_frag}};xi.physical={uniforms:pn([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag};var Jc={r:0,b:0,g:0},Vy=new yt,zp=new et;zp.set(-1,0,0,0,1,0,0,0,1);function Wy(n,e,t,i,s,r){let o=new Ae(0),a=s===!0?0:1,c,l,h=null,d=0,u=null;function f(v){let M=v.isScene===!0?v.background:null;if(M&&M.isTexture){let y=v.backgroundBlurriness>0;M=e.get(M,y)}return M}function g(v){let M=!1,y=f(v);y===null?m(o,a):y&&y.isColor&&(m(y,1),M=!0);let _=n.xr.getEnvironmentBlendMode();_==="additive"?t.buffers.color.setClear(0,0,0,1,r):_==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function S(v,M){let y=f(M);y&&(y.isCubeTexture||y.mapping===$o)?(l===void 0&&(l=new zt(new di(1,1,1),new Et({name:"BackgroundCubeMaterial",uniforms:zs(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(_,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Vy.makeRotationFromEuler(M.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(zp),l.material.toneMapped=ot.getTransfer(y.colorSpace)!==Mt,(h!==y||d!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new zt(new Yn(2,2),new Et({name:"BackgroundMaterial",uniforms:zs(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:ns,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=ot.getTransfer(y.colorSpace)!==Mt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,M){v.getRGB(Jc,tf(n)),t.buffers.color.setClear(Jc.r,Jc.g,Jc.b,M,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,M=1){o.set(v),a=M,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,m(o,a)},render:g,addToRenderList:S,dispose:p}}function Xy(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,o=!1;function a(R,I,N,D,U){let W=!1,k=d(R,D,N,I);r!==k&&(r=k,l(r.object)),W=f(R,D,N,U),W&&g(R,D,N,U),U!==null&&e.update(U,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,y(R,I,N,D),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function c(){return n.createVertexArray()}function l(R){return n.bindVertexArray(R)}function h(R){return n.deleteVertexArray(R)}function d(R,I,N,D){let U=D.wireframe===!0,W=i[I.id];W===void 0&&(W={},i[I.id]=W);let k=R.isInstancedMesh===!0?R.id:0,re=W[k];re===void 0&&(re={},W[k]=re);let q=re[N.id];q===void 0&&(q={},re[N.id]=q);let Z=q[U];return Z===void 0&&(Z=u(c()),q[U]=Z),Z}function u(R){let I=[],N=[],D=[];for(let U=0;U<t;U++)I[U]=0,N[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:N,attributeDivisors:D,object:R,attributes:{},index:null}}function f(R,I,N,D){let U=r.attributes,W=I.attributes,k=0,re=N.getAttributes();for(let q in re)if(re[q].location>=0){let ee=U[q],Ge=W[q];if(Ge===void 0&&(q==="instanceMatrix"&&R.instanceMatrix&&(Ge=R.instanceMatrix),q==="instanceColor"&&R.instanceColor&&(Ge=R.instanceColor)),ee===void 0||ee.attribute!==Ge||Ge&&ee.data!==Ge.data)return!0;k++}return r.attributesNum!==k||r.index!==D}function g(R,I,N,D){let U={},W=I.attributes,k=0,re=N.getAttributes();for(let q in re)if(re[q].location>=0){let ee=W[q];ee===void 0&&(q==="instanceMatrix"&&R.instanceMatrix&&(ee=R.instanceMatrix),q==="instanceColor"&&R.instanceColor&&(ee=R.instanceColor));let Ge={};Ge.attribute=ee,ee&&ee.data&&(Ge.data=ee.data),U[q]=Ge,k++}r.attributes=U,r.attributesNum=k,r.index=D}function S(){let R=r.newAttributes;for(let I=0,N=R.length;I<N;I++)R[I]=0}function m(R){p(R,0)}function p(R,I){let N=r.newAttributes,D=r.enabledAttributes,U=r.attributeDivisors;N[R]=1,D[R]===0&&(n.enableVertexAttribArray(R),D[R]=1),U[R]!==I&&(n.vertexAttribDivisor(R,I),U[R]=I)}function v(){let R=r.newAttributes,I=r.enabledAttributes;for(let N=0,D=I.length;N<D;N++)I[N]!==R[N]&&(n.disableVertexAttribArray(N),I[N]=0)}function M(R,I,N,D,U,W,k){k===!0?n.vertexAttribIPointer(R,I,N,U,W):n.vertexAttribPointer(R,I,N,D,U,W)}function y(R,I,N,D){S();let U=D.attributes,W=N.getAttributes(),k=I.defaultAttributeValues;for(let re in W){let q=W[re];if(q.location>=0){let Z=U[re];if(Z===void 0&&(re==="instanceMatrix"&&R.instanceMatrix&&(Z=R.instanceMatrix),re==="instanceColor"&&R.instanceColor&&(Z=R.instanceColor)),Z!==void 0){let ee=Z.normalized,Ge=Z.itemSize,Le=e.get(Z);if(Le===void 0)continue;let dt=Le.buffer,rt=Le.type,pt=Le.bytesPerElement,Y=rt===n.INT||rt===n.UNSIGNED_INT||Z.gpuType===hc;if(Z.isInterleavedBufferAttribute){let ne=Z.data,we=ne.stride,je=Z.offset;if(ne.isInstancedInterleavedBuffer){for(let De=0;De<q.locationSize;De++)p(q.location+De,ne.meshPerAttribute);R.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let De=0;De<q.locationSize;De++)m(q.location+De);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let De=0;De<q.locationSize;De++)M(q.location+De,Ge/q.locationSize,rt,ee,we*pt,(je+Ge/q.locationSize*De)*pt,Y)}else{if(Z.isInstancedBufferAttribute){for(let ne=0;ne<q.locationSize;ne++)p(q.location+ne,Z.meshPerAttribute);R.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ne=0;ne<q.locationSize;ne++)m(q.location+ne);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let ne=0;ne<q.locationSize;ne++)M(q.location+ne,Ge/q.locationSize,rt,ee,Ge*pt,Ge/q.locationSize*ne*pt,Y)}}else if(k!==void 0){let ee=k[re];if(ee!==void 0)switch(ee.length){case 2:n.vertexAttrib2fv(q.location,ee);break;case 3:n.vertexAttrib3fv(q.location,ee);break;case 4:n.vertexAttrib4fv(q.location,ee);break;default:n.vertexAttrib1fv(q.location,ee)}}}}v()}function _(){E();for(let R in i){let I=i[R];for(let N in I){let D=I[N];for(let U in D){let W=D[U];for(let k in W)h(W[k].object),delete W[k];delete D[U]}}delete i[R]}}function b(R){if(i[R.id]===void 0)return;let I=i[R.id];for(let N in I){let D=I[N];for(let U in D){let W=D[U];for(let k in W)h(W[k].object),delete W[k];delete D[U]}}delete i[R.id]}function A(R){for(let I in i){let N=i[I];for(let D in N){let U=N[D];if(U[R.id]===void 0)continue;let W=U[R.id];for(let k in W)h(W[k].object),delete W[k];delete U[R.id]}}}function x(R){for(let I in i){let N=i[I],D=R.isInstancedMesh===!0?R.id:0,U=N[D];if(U!==void 0){for(let W in U){let k=U[W];for(let re in k)h(k[re].object),delete k[re];delete U[W]}delete N[D],Object.keys(N).length===0&&delete i[I]}}}function E(){w(),o=!0,r!==s&&(r=s,l(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:E,resetDefaultState:w,dispose:_,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:A,initAttributes:S,enableAttribute:m,disableUnusedAttributes:v}}function Qy(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function o(c,l,h){h!==0&&(n.drawArraysInstanced(i,c,l,h),t.update(l,i,h))}function a(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Ky(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==wn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let x=A===Ln&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==yn&&A!==Gn&&!x&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(Ke("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),_=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:y,maxSamples:_,samples:b}}function qy(n){let e=this,t=null,i=0,s=!1,r=!1,o=new qn,a=new et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||i!==0||s;return s=u,i=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){let g=d.clippingPlanes,S=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let v=r?0:i,M=v*4,y=p.clippingState||null;c.value=y,y=h(g,u,M,f);for(let _=0;_!==M;++_)y[_]=t[_];p.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,f,g){let S=d!==null?d.length:0,m=null;if(S!==0){if(m=c.value,g!==!0||m===null){let p=f+S*4,v=u.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,y=f;M!==S;++M,y+=4)o.copy(d[M]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,m}}var Ur=4,Jy=6,jy=20,Yy=256,aa=new Os,vp=new Ae,uf=null,ff=0,df=0,pf=!1,Zy=new L,Hs=new L,Yc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=Zy}=r;uf=this._renderer.getRenderTarget(),ff=this._renderer.getActiveCubeFace(),df=this._renderer.getActiveMipmapLevel(),pf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=bp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(uf,ff,df),this._renderer.xr.enabled=pf,e.scissorTest=!1,Br(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ss||e.mapping===Gs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),uf=this._renderer.getRenderTarget(),ff=this._renderer.getActiveCubeFace(),df=this._renderer.getActiveMipmapLevel(),pf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:Ln,format:wn,colorSpace:Rs,depthBuffer:!1},s=yp(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yp(e,t,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=$y(r)),this._blurMaterial=t2(r,e,t),this._ggxMaterial=e2(r,e,t)}return s}_compileMaterial(e){let t=new zt(new Rt,e);this._renderer.compile(t,aa)}_sceneToCubeUV(e,t,i,s,r){let c=new sn(90,1,t,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(vp),d.toneMapping=Zn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new zt(new di,new Ps({name:"PMREM.Background",side:vn,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,m=S.material,p=!1,v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,p=!0):(m.color.copy(vp),p=!0);for(let M=0;M<6;M++){let y=M%3;y===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[M],r.y,r.z)):y===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[M]));let _=this._cubeSize;Br(s,y*_,M>2?_:0,_,_),d.setRenderTarget(s),p&&d.render(S,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=v}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===ss||e.mapping===Gs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=bp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sp());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Br(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,aa)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let c=o.uniforms,l=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=l*1.25,f=d*u,{_lodMax:g}=this,S=this._sizeLods[i],m=3*S*(i>g-Ur?i-g+Ur:0),p=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,Br(r,m,p,3*S,2*S),s.setRenderTarget(r),s.render(a,aa),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,Br(e,m,p,3*S,2*S),s.setRenderTarget(e),s.render(a,aa)}_blur(e,t,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,o),this._blurPass(r,e,i,i,o)}_blurPass(e,t,i,s,r){let o=this._renderer,a=this._blurMaterial,c=this._lodMeshes[s];c.material=a;let l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Ur?s-this._lodMax+Ur:0),u=4*(this._cubeSize-h);Br(t,d,u,3*h,2*h),o.setRenderTarget(t),o.render(c,aa)}};function $y(n){let e=[],t=[],i=n,s=n-Ur+1+Jy;for(let r=0;r<s;r++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),c=-a,l=1+a,h=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,u=6,f=3,g=new Float32Array(f*u*d),S=new Float32Array(f*u*d);for(let p=0;p<d;p++){let v=p%3*2/3-1,M=p>2?0:-1,y=[v,M,0,v+2/3,M,0,v+2/3,M+1,0,v,M,0,v+2/3,M+1,0,v,M+1,0];g.set(y,f*u*p);for(let _=0;_<u;_++){let b=h[_*2]*2-1,A=h[_*2+1]*2-1;p===0?Hs.set(1,A,b):p===1?Hs.set(-b,1,-A):p===2?Hs.set(-b,A,1):p===3?Hs.set(-1,A,-b):p===4?Hs.set(-b,-1,A):Hs.set(b,A,-1),Hs.toArray(S,(p*u+_)*f)}}let m=new Rt;m.setAttribute("position",new Kt(g,f)),m.setAttribute("outputDirection",new Kt(S,f)),t.push(new zt(m,null)),i>Ur&&i--}return{lodMeshes:t,sizeLods:e}}function yp(n,e,t){let i=new dn(n,e,t);return i.texture.mapping=$o,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Br(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function e2(n,e,t){return new Et({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Yy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:eh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function t2(n,e,t){return new Et({name:"SphericalGaussianBlur",defines:{SAMPLES:jy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:eh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Sp(){return new Et({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function bp(){return new Et({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function eh(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Zc=class extends dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Fo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new di(5,5,5),r=new Et({name:"CubemapFromEquirect",uniforms:zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:vn,blending:mi});r.uniforms.tEquirect.value=t;let o=new zt(s,r),a=t.minFilter;return t.minFilter===rs&&(t.minFilter=Gt),new sc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}};function n2(n){let e=new WeakMap,t=new WeakMap,i=null;function s(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===ac||f===lc)if(e.has(u)){let g=e.get(u).texture;return a(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let S=new Zc(g.height);return S.fromEquirectangularTexture(n,u),e.set(u,S),u.addEventListener("dispose",l),a(S.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let f=u.mapping,g=f===ac||f===lc,S=f===ss||f===Gs;if(g||S){let m=t.get(u),p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new Yc(n)),m=g?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{let v=u.image;return g&&v&&v.height>0||S&&v&&c(v)?(i===null&&(i=new Yc(n)),m=g?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function a(u,f){return f===ac?u.mapping=ss:f===lc&&(u.mapping=Gs),u}function c(u){let f=0,g=6;for(let S=0;S<g;S++)u[S]!==void 0&&f++;return f===g}function l(u){let f=u.target;f.removeEventListener("dispose",l);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function i2(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Cs("WebGLRenderer: "+i+" extension not supported."),s}}}function s2(n,e,t,i){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];let f=r.get(u);f&&(e.remove(f),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,t.memory.geometries++),u}function c(d){let u=d.attributes;for(let f in u)e.update(u[f],n.ARRAY_BUFFER)}function l(d){let u=[],f=d.index,g=d.attributes.position,S=0;if(g===void 0)return;if(f!==null){let v=f.array;S=f.version;for(let M=0,y=v.length;M<y;M+=3){let _=v[M+0],b=v[M+1],A=v[M+2];u.push(_,b,b,A,A,_)}}else{let v=g.array;S=g.version;for(let M=0,y=v.length/3-1;M<y;M+=3){let _=M+0,b=M+1,A=M+2;u.push(_,b,b,A,A,_)}}let m=new(g.count>=65535?Po:Ro)(u,1);m.version=S;let p=r.get(d);p&&e.remove(p),r.set(d,m)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function r2(n,e,t){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,u){n.drawElements(i,u,r,d*o),t.update(u,i,1)}function l(d,u,f){f!==0&&(n.drawElementsInstanced(i,u,r,d*o,f),t.update(u,i,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,d,0,f);let S=0;for(let m=0;m<f;m++)S+=u[m];t.update(S,i,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function o2(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:Ye("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function a2(n,e,t){let i=new WeakMap,s=new Ot;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=i.get(a);if(u===void 0||u.count!==d){let E=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,S=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],M=0;f===!0&&(M=1),g===!0&&(M=2),S===!0&&(M=3);let y=a.attributes.position.count*M,_=1;y>e.maxTextureSize&&(_=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let b=new Float32Array(y*_*4*d),A=new wo(b,y,_,d);A.type=Gn,A.needsUpdate=!0;let x=M*4;for(let w=0;w<d;w++){let R=m[w],I=p[w],N=v[w],D=y*_*4*w;for(let U=0;U<R.count;U++){let W=U*x;f===!0&&(s.fromBufferAttribute(R,U),b[D+W+0]=s.x,b[D+W+1]=s.y,b[D+W+2]=s.z,b[D+W+3]=0),g===!0&&(s.fromBufferAttribute(I,U),b[D+W+4]=s.x,b[D+W+5]=s.y,b[D+W+6]=s.z,b[D+W+7]=0),S===!0&&(s.fromBufferAttribute(N,U),b[D+W+8]=s.x,b[D+W+9]=s.y,b[D+W+10]=s.z,b[D+W+11]=N.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new ae(y,_)},i.set(a,u),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let S=0;S<l.length;S++)f+=l[S];let g=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function l2(n,e,t,i,s){let r=new WeakMap;function o(l){let h=s.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function c(l){let h=l.target;h.removeEventListener("dispose",c),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var c2={[Bu]:"LINEAR_TONE_MAPPING",[Uu]:"REINHARD_TONE_MAPPING",[Gu]:"CINEON_TONE_MAPPING",[zu]:"ACES_FILMIC_TONE_MAPPING",[ku]:"AGX_TONE_MAPPING",[Vu]:"NEUTRAL_TONE_MAPPING",[Hu]:"CUSTOM_TONE_MAPPING"};function h2(n,e,t,i,s,r){let o=new dn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=new Rt;l.setAttribute("position",new gt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new gt([0,2,0,0,2,0],2));let h=new Xl({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new zt(l,h),u=new Os(-1,1,1,-1,0,1),f=null,g=null,S=!1,m,p=null,v=[],M=!1;this.setSize=function(y,_){o.setSize(y,_),a!==null&&a.setSize(y,_),c!==null&&c.setSize(y,_);for(let b=0;b<v.length;b++){let A=v[b];A.setSize&&A.setSize(y,_)}},this.setEffects=function(y){v=y,M=v.length>0&&v[0].isRenderPass===!0;let _=o.width,b=o.height;v.length>0&&a===null&&(a=new dn(_,b,{type:Ln,depthBuffer:!1,stencilBuffer:!1}),c=new dn(_,b,{type:Ln,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<v.length;A++){let x=v[A];x.setSize&&x.setSize(_,b)}},this.begin=function(y,_){if(S||y.toneMapping===Zn&&v.length===0)return!1;if(p=_,_!==null){let b=_.width,A=_.height;(o.width!==b||o.height!==A)&&this.setSize(b,A)}return M===!1&&y.setRenderTarget(o),m=y.toneMapping,y.toneMapping=Zn,!0},this.hasRenderPass=function(){return M},this.end=function(y,_){y.toneMapping=m,S=!0;let b=o,A=a;for(let x=0;x<v.length;x++){let E=v[x];E.enabled!==!1&&(E.render(y,A,b,_),E.needsSwap!==!1&&(b=A,A=A===a?c:a))}if(f!==y.outputColorSpace||g!==y.toneMapping){f=y.outputColorSpace,g=y.toneMapping,h.defines={},ot.getTransfer(f)===Mt&&(h.defines.SRGB_TRANSFER="");let x=c2[g];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,y.setRenderTarget(p),y.render(d,u),p=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}var Hp=new gn,xf=new Zi(1,1),kp=new wo,Vp=new Fl,Wp=new Fo,_p=[],Mp=[],Ap=new Float32Array(16),Ep=new Float32Array(9),Tp=new Float32Array(4);function zr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=_p[s];if(r===void 0&&(r=new Float32Array(s),_p[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function en(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function tn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function th(n,e){let t=Mp[e];t===void 0&&(t=new Int32Array(e),Mp[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function u2(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function f2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;n.uniform2fv(this.addr,e),tn(t,e)}}function d2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(en(t,e))return;n.uniform3fv(this.addr,e),tn(t,e)}}function p2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;n.uniform4fv(this.addr,e),tn(t,e)}}function m2(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(en(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),tn(t,e)}else{if(en(t,i))return;Tp.set(i),n.uniformMatrix2fv(this.addr,!1,Tp),tn(t,i)}}function g2(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(en(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),tn(t,e)}else{if(en(t,i))return;Ep.set(i),n.uniformMatrix3fv(this.addr,!1,Ep),tn(t,i)}}function x2(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(en(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),tn(t,e)}else{if(en(t,i))return;Ap.set(i),n.uniformMatrix4fv(this.addr,!1,Ap),tn(t,i)}}function v2(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function y2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;n.uniform2iv(this.addr,e),tn(t,e)}}function S2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(en(t,e))return;n.uniform3iv(this.addr,e),tn(t,e)}}function b2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;n.uniform4iv(this.addr,e),tn(t,e)}}function _2(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function M2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;n.uniform2uiv(this.addr,e),tn(t,e)}}function A2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(en(t,e))return;n.uniform3uiv(this.addr,e),tn(t,e)}}function E2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;n.uniform4uiv(this.addr,e),tn(t,e)}}function T2(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(xf.compareFunction=t.isReversedDepthBuffer()?qc:Kc,r=xf):r=Hp,t.setTexture2D(e||r,s)}function w2(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Vp,s)}function C2(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Wp,s)}function R2(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||kp,s)}function P2(n){switch(n){case 5126:return u2;case 35664:return f2;case 35665:return d2;case 35666:return p2;case 35674:return m2;case 35675:return g2;case 35676:return x2;case 5124:case 35670:return v2;case 35667:case 35671:return y2;case 35668:case 35672:return S2;case 35669:case 35673:return b2;case 5125:return _2;case 36294:return M2;case 36295:return A2;case 36296:return E2;case 35678:case 36198:case 36298:case 36306:case 35682:return T2;case 35679:case 36299:case 36307:return w2;case 35680:case 36300:case 36308:case 36293:return C2;case 36289:case 36303:case 36311:case 36292:return R2}}function I2(n,e){n.uniform1fv(this.addr,e)}function D2(n,e){let t=zr(e,this.size,2);n.uniform2fv(this.addr,t)}function L2(n,e){let t=zr(e,this.size,3);n.uniform3fv(this.addr,t)}function F2(n,e){let t=zr(e,this.size,4);n.uniform4fv(this.addr,t)}function O2(n,e){let t=zr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function N2(n,e){let t=zr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function B2(n,e){let t=zr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function U2(n,e){n.uniform1iv(this.addr,e)}function G2(n,e){n.uniform2iv(this.addr,e)}function z2(n,e){n.uniform3iv(this.addr,e)}function H2(n,e){n.uniform4iv(this.addr,e)}function k2(n,e){n.uniform1uiv(this.addr,e)}function V2(n,e){n.uniform2uiv(this.addr,e)}function W2(n,e){n.uniform3uiv(this.addr,e)}function X2(n,e){n.uniform4uiv(this.addr,e)}function Q2(n,e,t){let i=this.cache,s=e.length,r=th(t,s);en(i,r)||(n.uniform1iv(this.addr,r),tn(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=xf:o=Hp;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function K2(n,e,t){let i=this.cache,s=e.length,r=th(t,s);en(i,r)||(n.uniform1iv(this.addr,r),tn(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Vp,r[o])}function q2(n,e,t){let i=this.cache,s=e.length,r=th(t,s);en(i,r)||(n.uniform1iv(this.addr,r),tn(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Wp,r[o])}function J2(n,e,t){let i=this.cache,s=e.length,r=th(t,s);en(i,r)||(n.uniform1iv(this.addr,r),tn(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||kp,r[o])}function j2(n){switch(n){case 5126:return I2;case 35664:return D2;case 35665:return L2;case 35666:return F2;case 35674:return O2;case 35675:return N2;case 35676:return B2;case 5124:case 35670:return U2;case 35667:case 35671:return G2;case 35668:case 35672:return z2;case 35669:case 35673:return H2;case 5125:return k2;case 36294:return V2;case 36295:return W2;case 36296:return X2;case 35678:case 36198:case 36298:case 36306:case 35682:return Q2;case 35679:case 36299:case 36307:return K2;case 35680:case 36300:case 36308:case 36293:return q2;case 36289:case 36303:case 36311:case 36292:return J2}}var vf=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=P2(t.type)}},yf=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=j2(t.type)}},Sf=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},mf=/(\w+)(\])?(\[|\.)?/g;function wp(n,e){n.seq.push(e),n.map[e.id]=e}function Y2(n,e,t){let i=n.name,s=i.length;for(mf.lastIndex=0;;){let r=mf.exec(i),o=mf.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){wp(t,l===void 0?new vf(a,n,e):new yf(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new Sf(a),wp(t,d)),t=d}}}var Gr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);Y2(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Cp(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var Z2=37297,$2=0;function e3(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Rp=new et;function t3(n){ot._getMatrix(Rp,ot.workingColorSpace,n);let e=`mat3( ${Rp.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(n)){case Ao:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return Ke("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Pp(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+e3(n.getShaderSource(e),a)}else return r}function n3(n,e){let t=t3(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var i3={[Bu]:"Linear",[Uu]:"Reinhard",[Gu]:"Cineon",[zu]:"ACESFilmic",[ku]:"AgX",[Vu]:"Neutral",[Hu]:"Custom"};function s3(n,e){let t=i3[e];return t===void 0?(Ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jc=new L;function r3(){ot.getLuminanceCoefficients(jc);let n=jc.x.toFixed(4),e=jc.y.toFixed(4),t=jc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function o3(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ca).join(`
`)}function a3(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function l3(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function ca(n){return n!==""}function Ip(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Dp(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var c3=/^[ \t]*#include +<([\w\d./]+)>/gm;function bf(n){return n.replace(c3,u3)}var h3=new Map;function u3(n,e){let t=st[e];if(t===void 0){let i=h3.get(e);if(i!==void 0)t=st[i],Ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return bf(t)}var f3=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lp(n){return n.replace(f3,d3)}function d3(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Fp(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var p3={[Zo]:"SHADOWMAP_TYPE_PCF",[Lr]:"SHADOWMAP_TYPE_VSM"};function m3(n){return p3[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var g3={[ss]:"ENVMAP_TYPE_CUBE",[Gs]:"ENVMAP_TYPE_CUBE",[$o]:"ENVMAP_TYPE_CUBE_UV"};function x3(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":g3[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var v3={[Gs]:"ENVMAP_MODE_REFRACTION"};function y3(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":v3[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var S3={[Nu]:"ENVMAP_BLENDING_MULTIPLY",[K0]:"ENVMAP_BLENDING_MIX",[q0]:"ENVMAP_BLENDING_ADD"};function b3(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":S3[n.combine]||"ENVMAP_BLENDING_NONE"}function _3(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function M3(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=m3(t),l=x3(t),h=y3(t),d=b3(t),u=_3(t),f=o3(t),g=a3(r),S=s.createProgram(),m,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ca).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ca).join(`
`),p.length>0&&(p+=`
`)):(m=[Fp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ca).join(`
`),p=[Fp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zn?"#define TONE_MAPPING":"",t.toneMapping!==Zn?st.tonemapping_pars_fragment:"",t.toneMapping!==Zn?s3("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",st.colorspace_pars_fragment,n3("linearToOutputTexel",t.outputColorSpace),r3(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ca).join(`
`)),o=bf(o),o=Ip(o,t),o=Dp(o,t),a=bf(a),a=Ip(a,t),a=Dp(a,t),o=Lp(o),a=Lp(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Zu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Zu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=v+m+o,y=v+p+a,_=Cp(s,s.VERTEX_SHADER,M),b=Cp(s,s.FRAGMENT_SHADER,y);s.attachShader(S,_),s.attachShader(S,b),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function A(R){if(n.debug.checkShaderErrors){let I=s.getProgramInfoLog(S)||"",N=s.getShaderInfoLog(_)||"",D=s.getShaderInfoLog(b)||"",U=I.trim(),W=N.trim(),k=D.trim(),re=!0,q=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(re=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,S,_,b);else{let Z=Pp(s,_,"vertex"),ee=Pp(s,b,"fragment");Ye("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+U+`
`+Z+`
`+ee)}else U!==""?Ke("WebGLProgram: Program Info Log:",U):(W===""||k==="")&&(q=!1);q&&(R.diagnostics={runnable:re,programLog:U,vertexShader:{log:W,prefix:m},fragmentShader:{log:k,prefix:p}})}s.deleteShader(_),s.deleteShader(b),x=new Gr(s,S),E=l3(s,S)}let x;this.getUniforms=function(){return x===void 0&&A(this),x};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=s.getProgramParameter(S,Z2)),w},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$2++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=_,this.fragmentShader=b,this}var A3=0,_f=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Mf(e),t.set(e,i)),i}},Mf=class{constructor(e){this.id=A3++,this.code=e,this.usedTimes=0}};function E3(n){return n===as||n===ra||n===oa}function T3(n,e,t,i,s,r){let o=new Co,a=new _f,c=new Set,l=[],h=new Map,d=i.logarithmicDepthBuffer,u=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function S(x,E,w,R,I,N){let D=R.fog,U=I.geometry,W=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,k=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,re=e.get(x.envMap||W,k),q=re&&re.mapping===$o?re.image.height:null,Z=f[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&Ke("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));let ee=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Ge=ee!==void 0?ee.length:0,Le=0;U.morphAttributes.position!==void 0&&(Le=1),U.morphAttributes.normal!==void 0&&(Le=2),U.morphAttributes.color!==void 0&&(Le=3);let dt,rt,pt,Y;if(Z){let Lt=xi[Z];dt=Lt.vertexShader,rt=Lt.fragmentShader}else{dt=x.vertexShader,rt=x.fragmentShader;let Lt=a.getVertexShaderStage(x),bt=a.getFragmentShaderStage(x);a.update(x,Lt,bt),pt=Lt.id,Y=bt.id}let ne=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),je=I.isInstancedMesh===!0,De=I.isBatchedMesh===!0,Ze=!!x.map,At=!!x.matcap,ie=!!re,le=!!x.aoMap,ue=!!x.lightMap,fe=!!x.bumpMap&&x.wireframe===!1,me=!!x.normalMap,qe=!!x.displacementMap,Xe=!!x.emissiveMap,$e=!!x.metalnessMap,tt=!!x.roughnessMap,F=x.anisotropy>0,St=x.clearcoat>0,lt=x.dispersion>0,P=x.retroreflectivity>0,T=x.iridescence>0,G=x.sheen>0,V=x.transmission>0,J=F&&!!x.anisotropyMap,de=St&&!!x.clearcoatMap,pe=St&&!!x.clearcoatNormalMap,j=St&&!!x.clearcoatRoughnessMap,te=T&&!!x.iridescenceMap,xe=T&&!!x.iridescenceThicknessMap,ke=G&&!!x.sheenColorMap,Me=G&&!!x.sheenRoughnessMap,ve=!!x.specularMap,Ve=!!x.specularColorMap,Je=!!x.specularIntensityMap,nt=V&&!!x.transmissionMap,B=V&&!!x.thicknessMap,ye=!!x.gradientMap,$=!!x.alphaMap,Se=x.alphaTest>0,Pe=!!x.alphaHash,oe=!!x.extensions,We=Zn;x.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(We=n.toneMapping);let ze={shaderID:Z,shaderType:x.type,shaderName:x.name,vertexShader:dt,fragmentShader:rt,defines:x.defines,customVertexShaderID:pt,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:De,batchingColor:De&&I._colorsTexture!==null,instancing:je,instancingColor:je&&I.instanceColor!==null,instancingMorph:je&&I.morphTexture!==null,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ze,matcap:At,envMap:ie,envMapMode:ie&&re.mapping,envMapCubeUVHeight:q,aoMap:le,lightMap:ue,bumpMap:fe,normalMap:me,displacementMap:qe,emissiveMap:Xe,normalMapObjectSpace:me&&x.normalMapType===Y0,normalMapTangentSpace:me&&x.normalMapType===Yu,packedNormalMap:me&&x.normalMapType===Yu&&E3(x.normalMap.format),metalnessMap:$e,roughnessMap:tt,anisotropy:F,anisotropyMap:J,clearcoat:St,clearcoatMap:de,clearcoatNormalMap:pe,clearcoatRoughnessMap:j,dispersion:lt,retroreflection:P,iridescence:T,iridescenceMap:te,iridescenceThicknessMap:xe,sheen:G,sheenColorMap:ke,sheenRoughnessMap:Me,specularMap:ve,specularColorMap:Ve,specularIntensityMap:Je,transmission:V,transmissionMap:nt,thicknessMap:B,gradientMap:ye,opaque:x.transparent===!1&&x.blending===is&&x.alphaToCoverage===!1,alphaMap:$,alphaTest:Se,alphaHash:Pe,combine:x.combine,mapUv:Ze&&g(x.map.channel),aoMapUv:le&&g(x.aoMap.channel),lightMapUv:ue&&g(x.lightMap.channel),bumpMapUv:fe&&g(x.bumpMap.channel),normalMapUv:me&&g(x.normalMap.channel),displacementMapUv:qe&&g(x.displacementMap.channel),emissiveMapUv:Xe&&g(x.emissiveMap.channel),metalnessMapUv:$e&&g(x.metalnessMap.channel),roughnessMapUv:tt&&g(x.roughnessMap.channel),anisotropyMapUv:J&&g(x.anisotropyMap.channel),clearcoatMapUv:de&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:pe&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Me&&g(x.sheenRoughnessMap.channel),specularMapUv:ve&&g(x.specularMap.channel),specularColorMapUv:Ve&&g(x.specularColorMap.channel),specularIntensityMapUv:Je&&g(x.specularIntensityMap.channel),transmissionMapUv:nt&&g(x.transmissionMap.channel),thicknessMapUv:B&&g(x.thicknessMap.channel),alphaMapUv:$&&g(x.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(me||F),vertexNormals:!!U.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!U.attributes.uv&&(Ze||$),fog:!!D,useFog:x.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||U.attributes.normal===void 0&&me===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:we,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Ge,morphTextureStride:Le,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&w.length>0,shadowMapType:n.shadowMap.type,toneMapping:We,decodeVideoTexture:Ze&&x.map.isVideoTexture===!0&&ot.getTransfer(x.map.colorSpace)===Mt,decodeVideoTextureEmissive:Xe&&x.emissiveMap.isVideoTexture===!0&&ot.getTransfer(x.emissiveMap.colorSpace)===Mt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Tn,flipSided:x.side===vn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:oe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&x.extensions.multiDraw===!0||De)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function m(x){let E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(let w in x.defines)E.push(w),E.push(x.defines[w]);return x.isRawShaderMaterial===!1&&(p(E,x),v(E,x),E.push(n.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function p(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numSunLights),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numSunLightShadows),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function v(x,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function M(x){let E=f[x.type],w;if(E){let R=xi[E];w=mp.clone(R.uniforms)}else w=x.uniforms;return w}function y(x,E){let w=h.get(E);return w!==void 0?++w.usedTimes:(w=new M3(n,E,x,s),l.push(w),h.set(E,w)),w}function _(x){if(--x.usedTimes===0){let E=l.indexOf(x);l[E]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function b(x){a.remove(x)}function A(){a.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:M,acquireProgram:y,releaseProgram:_,releaseShaderCache:b,programs:l,dispose:A}}function w3(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function C3(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Op(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Np(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,g,S,m,p){let v=n[e];return v===void 0?(v={id:u.id,object:u,geometry:f,material:g,materialVariant:o(u),groupOrder:S,renderOrder:u.renderOrder,z:m,group:p},n[e]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=g,v.materialVariant=o(u),v.groupOrder=S,v.renderOrder=u.renderOrder,v.z=m,v.group=p),e++,v}function c(u,f,g,S,m,p,v){v.reversedDepth===!0&&(m=-m);let M=a(u,f,g,S,m,p);g.transmission>0?i.push(M):g.transparent===!0?s.push(M):t.push(M)}function l(u,f,g,S,m,p){let v=a(u,f,g,S,m,p);g.transmission>0?i.unshift(v):g.transparent===!0?s.unshift(v):t.unshift(v)}function h(u,f){t.length>1&&t.sort(u||C3),i.length>1&&i.sort(f||Op),s.length>1&&s.sort(f||Op)}function d(){for(let u=e,f=n.length;u<f;u++){let g=n[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:d,sort:h}}function R3(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Np,n.set(i,[o])):s>=r.length?(o=new Np,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function P3(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new Ae};break;case"SpotLight":t={position:new L,direction:new L,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function I3(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var D3=0;function L3(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function F3(n){let e=new P3,t=I3(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new L);let s=new L,r=new yt,o=new yt;function a(l){let h=0,d=0,u=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let f=0,g=0,S=0,m=0,p=0,v=0,M=0,y=0,_=0,b=0,A=0,x=0,E=0,w=0;l.sort(L3);for(let I=0,N=l.length;I<N;I++){let D=l[I],U=D.color,W=D.intensity,k=D.distance,re=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===as?re=D.shadow.map.texture:re=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=U.r*W,d+=U.g*W,u+=U.b*W;else if(D.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(D.sh.coefficients[q],W);w++}else if(D.isSunLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Z=D.shadow,ee=t.get(D);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),i.sunShadow[g]=ee,i.sunShadowMap[g]=re;let Ge=Z.getViewportCount();for(let Le=0;Le<Ge;Le++)i.sunShadowMatrix[S+Le]=Z.getMatrix(Le),i.sunShadowCascade[S+Le]=Z._cascadeData[Le];S+=Ge,g++}i.sun[f]=q,f++}else if(D.isDirectionalLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Z=D.shadow,ee=t.get(D);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,i.directionalShadow[m]=ee,i.directionalShadowMap[m]=re,i.directionalShadowMatrix[m]=D.shadow.matrix,_++}i.directional[m]=q,m++}else if(D.isSpotLight){let q=e.get(D);q.position.setFromMatrixPosition(D.matrixWorld),q.color.copy(U).multiplyScalar(W),q.distance=k,q.coneCos=Math.cos(D.angle),q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),q.decay=D.decay,i.spot[v]=q;let Z=D.shadow;if(D.map&&(i.spotLightMap[x]=D.map,x++,Z.updateMatrices(D),D.castShadow&&E++),i.spotLightMatrix[v]=Z.matrix,D.castShadow){let ee=t.get(D);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,i.spotShadow[v]=ee,i.spotShadowMap[v]=re,A++}v++}else if(D.isRectAreaLight){let q=e.get(D);q.color.copy(U).multiplyScalar(W),q.halfWidth.set(D.width*.5,0,0),q.halfHeight.set(0,D.height*.5,0),i.rectArea[M]=q,M++}else if(D.isPointLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),q.distance=D.distance,q.decay=D.decay,D.castShadow){let Z=D.shadow,ee=t.get(D);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,ee.shadowCameraNear=Z.camera.near,ee.shadowCameraFar=Z.camera.far,i.pointShadow[p]=ee,i.pointShadowMap[p]=re,i.pointShadowMatrix[p]=D.shadow.matrix,b++}i.point[p]=q,p++}else if(D.isHemisphereLight){let q=e.get(D);q.skyColor.copy(D.color).multiplyScalar(W),q.groundColor.copy(D.groundColor).multiplyScalar(W),i.hemi[y]=q,y++}}M>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ee.LTC_FLOAT_1,i.rectAreaLTC2=Ee.LTC_FLOAT_2):(i.rectAreaLTC1=Ee.LTC_HALF_1,i.rectAreaLTC2=Ee.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;let R=i.hash;(R.sunLength!==f||R.directionalLength!==m||R.pointLength!==p||R.spotLength!==v||R.rectAreaLength!==M||R.hemiLength!==y||R.numSunShadows!==g||R.numDirectionalShadows!==_||R.numPointShadows!==b||R.numSpotShadows!==A||R.numSpotMaps!==x||R.numLightProbes!==w)&&(i.sun.length=f,i.directional.length=m,i.spot.length=v,i.rectArea.length=M,i.point.length=p,i.hemi.length=y,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.directionalShadowMatrix.length=_,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+x-E,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=w,R.sunLength=f,R.directionalLength=m,R.pointLength=p,R.spotLength=v,R.rectAreaLength=M,R.hemiLength=y,R.numSunShadows=g,R.numDirectionalShadows=_,R.numPointShadows=b,R.numSpotShadows=A,R.numSpotMaps=x,R.numLightProbes=w,i.version=D3++)}function c(l,h){let d=0,u=0,f=0,g=0,S=0,m=0,p=h.matrixWorldInverse;for(let v=0,M=l.length;v<M;v++){let y=l[v];if(y.isSunLight){let _=i.sun[d];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(p),d++}else if(y.isDirectionalLight){let _=i.directional[u];_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(p),u++}else if(y.isSpotLight){let _=i.spot[g];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(p),_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(p),g++}else if(y.isRectAreaLight){let _=i.rectArea[S];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(p),o.identity(),r.copy(y.matrixWorld),r.premultiply(p),o.extractRotation(r),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),S++}else if(y.isPointLight){let _=i.point[f];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){let _=i.hemi[m];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(p),m++}}}return{setup:a,setupView:c,state:i}}function Bp(n){let e=new F3(n),t=[],i=[],s=[];function r(u){d.camera=u,t.length=0,i.length=0,s.length=0}function o(u){t.push(u)}function a(u){i.push(u)}function c(u){s.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}let d={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function O3(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Bp(n),e.set(s,[a])):r>=o.length?(a=new Bp(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var N3=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B3=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,U3=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],G3=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Up=new yt,la=new L,gf=new L;function z3(n,e,t){let i=new Do,s=new ae,r=new ae,o=new Ot,a=new Ql,c=new Kl,l={},h=t.maxTextureSize,d={[ns]:vn,[vn]:ns,[Tn]:Tn},u=new Et({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:N3,fragmentShader:B3}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let g=new Rt;g.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new zt(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Zo;let p=this.type;this.render=function(b,A,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===C0&&(Ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Zo);let E=n.getRenderTarget(),w=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(mi),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let N=p!==this.type;N&&A.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(U=>U.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,U=b.length;D<U;D++){let W=b[D],k=W.shadow;if(k===void 0){Ke("WebGLShadowMap:",W,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let re=k.getFrameExtents();s.multiply(re),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/re.x),s.x=r.x*re.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/re.y),s.y=r.y*re.y,k.mapSize.y=r.y));let q=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=q,k.map===null||N===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Lr){if(W.isPointLight){Ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new dn(s.x,s.y,{format:as,type:Ln,minFilter:Gt,magFilter:Gt,generateMipmaps:!1}),k.map.texture.name=W.name+".shadowMap",k.map.depthTexture=new Zi(s.x,s.y,Gn),k.map.depthTexture.name=W.name+".shadowMapDepth",k.map.depthTexture.format=li,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=rn,k.map.depthTexture.magFilter=rn}else W.isPointLight?(k.map=new Zc(s.x),k.map.depthTexture=new Ul(s.x,$n)):(k.map=new dn(s.x,s.y),k.map.depthTexture=new Zi(s.x,s.y,$n)),k.map.depthTexture.name=W.name+".shadowMap",k.map.depthTexture.format=li,this.type===Zo?(k.map.depthTexture.compareFunction=q?qc:Kc,k.map.depthTexture.minFilter=Gt,k.map.depthTexture.magFilter=Gt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=rn,k.map.depthTexture.magFilter=rn);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==s.x||k.map.height!==s.y)&&k.map.setSize(s.x,s.y);let Z=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();W.isPointLight!==!0&&k.updateMatrices(W,x);for(let ee=0;ee<Z;ee++){let Ge=k.getCamera(ee);if(W.isPointLight){let Le=k.camera,dt=k.matrix,rt=W.distance||Le.far;rt!==Le.far&&(Le.far=rt,Le.updateProjectionMatrix()),la.setFromMatrixPosition(W.matrixWorld),Le.position.copy(la),gf.copy(Le.position),gf.add(U3[ee]),Le.up.copy(G3[ee]),Le.lookAt(gf),Le.updateMatrixWorld(),dt.makeTranslation(-la.x,-la.y,-la.z),Up.multiplyMatrices(Le.projectionMatrix,Le.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Up,Le.coordinateSystem,Le.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,ee),n.clear();else{ee===0&&(n.setRenderTarget(k.map),n.clear());let Le=k.getViewport(ee);o.set(r.x*Le.x,r.y*Le.y,r.x*Le.z,r.y*Le.w),I.viewport(o)}i=k.getFrustum(ee),y(A,x,Ge,W,this.type)}k.isPointLightShadow!==!0&&this.type===Lr&&v(k,x),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,w,R)};function v(b,A){let x=e.update(S);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new dn(s.x,s.y,{format:as,type:Ln}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value.set(b.map.width,b.map.height),u.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(A,null,x,u,S,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(A,null,x,f,S,null)}function M(b,A,x,E){let w=null,R=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)w=R;else if(w=x.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let I=w.uuid,N=A.uuid,D=l[I];D===void 0&&(D={},l[I]=D);let U=D[N];U===void 0&&(U=w.clone(),D[N]=U,A.addEventListener("dispose",_)),w=U}if(w.visible=A.visible,w.wireframe=A.wireframe,E===Lr?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:d[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,x.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let I=n.properties.get(w);I.light=x}return w}function y(b,A,x,E,w){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&w===Lr)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);let N=e.update(b),D=b.material;if(Array.isArray(D)){let U=N.groups;for(let W=0,k=U.length;W<k;W++){let re=U[W],q=D[re.materialIndex];if(q&&q.visible){let Z=M(b,q,E,w);b.onBeforeShadow(n,b,A,x,N,Z,re),n.renderBufferDirect(x,null,N,Z,b,re),b.onAfterShadow(n,b,A,x,N,Z,re)}}}else if(D.visible){let U=M(b,D,E,w);b.onBeforeShadow(n,b,A,x,N,U,null),n.renderBufferDirect(x,null,N,U,b,null),b.onAfterShadow(n,b,A,x,N,U,null)}}let I=b.children;for(let N=0,D=I.length;N<D;N++)y(I[N],A,x,E,w)}function _(b){b.target.removeEventListener("dispose",_);for(let x in l){let E=l[x],w=b.target.uuid;w in E&&(E[w].dispose(),delete E[w])}}}function H3(n,e){function t(){let B=!1,ye=new Ot,$=null,Se=new Ot(0,0,0,0);return{setMask:function(Pe){$!==Pe&&!B&&(n.colorMask(Pe,Pe,Pe,Pe),$=Pe)},setLocked:function(Pe){B=Pe},setClear:function(Pe,oe,We,ze,Lt){Lt===!0&&(Pe*=ze,oe*=ze,We*=ze),ye.set(Pe,oe,We,ze),Se.equals(ye)===!1&&(n.clearColor(Pe,oe,We,ze),Se.copy(ye))},reset:function(){B=!1,$=null,Se.set(-1,0,0,0)}}}function i(){let B=!1,ye=!1,$=null,Se=null,Pe=null;return{setReversed:function(oe){if(ye!==oe){let We=e.get("EXT_clip_control");oe?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),ye=oe;let ze=Pe;Pe=null,this.setClear(ze)}},getReversed:function(){return ye},setTest:function(oe){oe?ne(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(oe){$!==oe&&!B&&(n.depthMask(oe),$=oe)},setFunc:function(oe){if(ye&&(oe=cp[oe]),Se!==oe){switch(oe){case bl:n.depthFunc(n.NEVER);break;case _l:n.depthFunc(n.ALWAYS);break;case Ml:n.depthFunc(n.LESS);break;case _r:n.depthFunc(n.LEQUAL);break;case Al:n.depthFunc(n.EQUAL);break;case El:n.depthFunc(n.GEQUAL);break;case Tl:n.depthFunc(n.GREATER);break;case wl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Se=oe}},setLocked:function(oe){B=oe},setClear:function(oe){Pe!==oe&&(Pe=oe,ye&&(oe=1-oe),n.clearDepth(oe))},reset:function(){B=!1,$=null,Se=null,Pe=null,ye=!1}}}function s(){let B=!1,ye=null,$=null,Se=null,Pe=null,oe=null,We=null,ze=null,Lt=null;return{setTest:function(bt){B||(bt?ne(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(bt){ye!==bt&&!B&&(n.stencilMask(bt),ye=bt)},setFunc:function(bt,Wn,ii){($!==bt||Se!==Wn||Pe!==ii)&&(n.stencilFunc(bt,Wn,ii),$=bt,Se=Wn,Pe=ii)},setOp:function(bt,Wn,ii){(oe!==bt||We!==Wn||ze!==ii)&&(n.stencilOp(bt,Wn,ii),oe=bt,We=Wn,ze=ii)},setLocked:function(bt){B=bt},setClear:function(bt){Lt!==bt&&(n.clearStencil(bt),Lt=bt)},reset:function(){B=!1,ye=null,$=null,Se=null,Pe=null,oe=null,We=null,ze=null,Lt=null}}}let r=new t,o=new i,a=new s,c=new WeakMap,l=new WeakMap,h={},d={},u={},f=new WeakMap,g=[],S=null,m=!1,p=null,v=null,M=null,y=null,_=null,b=null,A=null,x=new Ae(0,0,0),E=0,w=!1,R=null,I=null,N=null,D=null,U=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,re=0,q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(q)[1]),k=re>=1):q.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),k=re>=2);let Z=null,ee={},Ge=n.getParameter(n.SCISSOR_BOX),Le=n.getParameter(n.VIEWPORT),dt=new Ot().fromArray(Ge),rt=new Ot().fromArray(Le);function pt(B,ye,$,Se){let Pe=new Uint8Array(4),oe=n.createTexture();n.bindTexture(B,oe),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let We=0;We<$;We++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(ye,0,n.RGBA,1,1,Se,0,n.RGBA,n.UNSIGNED_BYTE,Pe):n.texImage2D(ye+We,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pe);return oe}let Y={};Y[n.TEXTURE_2D]=pt(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=pt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=pt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=pt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(n.DEPTH_TEST),o.setFunc(_r),fe(!1),me(Iu),ne(n.CULL_FACE),le(mi);function ne(B){h[B]!==!0&&(n.enable(B),h[B]=!0)}function we(B){h[B]!==!1&&(n.disable(B),h[B]=!1)}function je(B,ye){return u[B]!==ye?(n.bindFramebuffer(B,ye),u[B]=ye,B===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ye),B===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ye),!0):!1}function De(B,ye){let $=g,Se=!1;if(B){$=f.get(ye),$===void 0&&($=[],f.set(ye,$));let Pe=B.textures;if($.length!==Pe.length||$[0]!==n.COLOR_ATTACHMENT0){for(let oe=0,We=Pe.length;oe<We;oe++)$[oe]=n.COLOR_ATTACHMENT0+oe;$.length=Pe.length,Se=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,Se=!0);Se&&n.drawBuffers($)}function Ze(B){return S!==B?(n.useProgram(B),S=B,!0):!1}let At={[Us]:n.FUNC_ADD,[P0]:n.FUNC_SUBTRACT,[I0]:n.FUNC_REVERSE_SUBTRACT};At[D0]=n.MIN,At[L0]=n.MAX;let ie={[F0]:n.ZERO,[O0]:n.ONE,[N0]:n.SRC_COLOR,[Fu]:n.SRC_ALPHA,[k0]:n.SRC_ALPHA_SATURATE,[z0]:n.DST_COLOR,[U0]:n.DST_ALPHA,[B0]:n.ONE_MINUS_SRC_COLOR,[Ou]:n.ONE_MINUS_SRC_ALPHA,[H0]:n.ONE_MINUS_DST_COLOR,[G0]:n.ONE_MINUS_DST_ALPHA,[V0]:n.CONSTANT_COLOR,[W0]:n.ONE_MINUS_CONSTANT_COLOR,[X0]:n.CONSTANT_ALPHA,[Q0]:n.ONE_MINUS_CONSTANT_ALPHA};function le(B,ye,$,Se,Pe,oe,We,ze,Lt,bt){if(B===mi){m===!0&&(we(n.BLEND),m=!1);return}if(m===!1&&(ne(n.BLEND),m=!0),B!==R0){if(B!==p||bt!==w){if((v!==Us||_!==Us)&&(n.blendEquation(n.FUNC_ADD),v=Us,_=Us),bt)switch(B){case is:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Bs:n.blendFunc(n.ONE,n.ONE);break;case Du:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Lu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ye("WebGLState: Invalid blending: ",B);break}else switch(B){case is:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Bs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Du:Ye("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lu:Ye("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ye("WebGLState: Invalid blending: ",B);break}M=null,y=null,b=null,A=null,x.set(0,0,0),E=0,p=B,w=bt}return}Pe=Pe||ye,oe=oe||$,We=We||Se,(ye!==v||Pe!==_)&&(n.blendEquationSeparate(At[ye],At[Pe]),v=ye,_=Pe),($!==M||Se!==y||oe!==b||We!==A)&&(n.blendFuncSeparate(ie[$],ie[Se],ie[oe],ie[We]),M=$,y=Se,b=oe,A=We),(ze.equals(x)===!1||Lt!==E)&&(n.blendColor(ze.r,ze.g,ze.b,Lt),x.copy(ze),E=Lt),p=B,w=!1}function ue(B,ye){B.side===Tn?we(n.CULL_FACE):ne(n.CULL_FACE);let $=B.side===vn;ye&&($=!$),fe($),B.blending===is&&B.transparent===!1?le(mi):le(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let Se=B.stencilWrite;a.setTest(Se),Se&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Xe(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function fe(B){R!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),R=B)}function me(B){B!==T0?(ne(n.CULL_FACE),B!==I&&(B===Iu?n.cullFace(n.BACK):B===w0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),I=B}function qe(B){B!==N&&(k&&n.lineWidth(B),N=B)}function Xe(B,ye,$){B?(ne(n.POLYGON_OFFSET_FILL),(D!==ye||U!==$)&&(D=ye,U=$,o.getReversed()&&(ye=-ye),n.polygonOffset(ye,$))):we(n.POLYGON_OFFSET_FILL)}function $e(B){B?ne(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function tt(B){B===void 0&&(B=n.TEXTURE0+W-1),Z!==B&&(n.activeTexture(B),Z=B)}function F(B,ye,$){$===void 0&&(Z===null?$=n.TEXTURE0+W-1:$=Z);let Se=ee[$];Se===void 0&&(Se={type:void 0,texture:void 0},ee[$]=Se),(Se.type!==B||Se.texture!==ye)&&(Z!==$&&(n.activeTexture($),Z=$),n.bindTexture(B,ye||Y[B]),Se.type=B,Se.texture=ye)}function St(){let B=ee[Z];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function lt(){try{n.compressedTexImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function P(){try{n.compressedTexImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function T(){try{n.texSubImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function G(){try{n.texSubImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function V(){try{n.compressedTexSubImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function J(){try{n.compressedTexSubImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function de(){try{n.texStorage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function pe(){try{n.texStorage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function j(){try{n.texImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function te(){try{n.texImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function xe(B){return d[B]!==void 0?d[B]:n.getParameter(B)}function ke(B,ye){d[B]!==ye&&(n.pixelStorei(B,ye),d[B]=ye)}function Me(B){dt.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),dt.copy(B))}function ve(B){rt.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),rt.copy(B))}function Ve(B,ye){let $=l.get(ye);$===void 0&&($=new WeakMap,l.set(ye,$));let Se=$.get(B);Se===void 0&&(Se=n.getUniformBlockIndex(ye,B.name),$.set(B,Se))}function Je(B,ye){let Se=l.get(ye).get(B);c.get(ye)!==Se&&(n.uniformBlockBinding(ye,Se,B.__bindingPointIndex),c.set(ye,Se))}function nt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},d={},Z=null,ee={},u={},f=new WeakMap,g=[],S=null,m=!1,p=null,v=null,M=null,y=null,_=null,b=null,A=null,x=new Ae(0,0,0),E=0,w=!1,R=null,I=null,N=null,D=null,U=null,dt.set(0,0,n.canvas.width,n.canvas.height),rt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ne,disable:we,bindFramebuffer:je,drawBuffers:De,useProgram:Ze,setBlending:le,setMaterial:ue,setFlipSided:fe,setCullFace:me,setLineWidth:qe,setPolygonOffset:Xe,setScissorTest:$e,activeTexture:tt,bindTexture:F,unbindTexture:St,compressedTexImage2D:lt,compressedTexImage3D:P,texImage2D:j,texImage3D:te,pixelStorei:ke,getParameter:xe,updateUBOMapping:Ve,uniformBlockBinding:Je,texStorage2D:de,texStorage3D:pe,texSubImage2D:T,texSubImage3D:G,compressedTexSubImage2D:V,compressedTexSubImage3D:J,scissor:Me,viewport:ve,reset:nt}}function k3(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ae,h=new WeakMap,d=new Set,u,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(P,T){return g?new OffscreenCanvas(P,T):To("canvas")}function m(P,T,G){let V=1,J=lt(P);if((J.width>G||J.height>G)&&(V=G/Math.max(J.width,J.height)),V<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let de=Math.floor(V*J.width),pe=Math.floor(V*J.height);u===void 0&&(u=S(de,pe));let j=T?S(de,pe):u;return j.width=de,j.height=pe,j.getContext("2d").drawImage(P,0,0,de,pe),Ke("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+de+"x"+pe+")."),j}else return"data"in P&&Ke("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),P;return P}function p(P){return P.generateMipmaps}function v(P){n.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(P,T,G,V,J,de=!1){if(P!==null){if(n[P]!==void 0)return n[P];Ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let pe;V&&(pe=e.get("EXT_texture_norm16"),pe||Ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=T;if(T===n.RED&&(G===n.FLOAT&&(j=n.R32F),G===n.HALF_FLOAT&&(j=n.R16F),G===n.UNSIGNED_BYTE&&(j=n.R8),G===n.UNSIGNED_SHORT&&pe&&(j=pe.R16_EXT),G===n.SHORT&&pe&&(j=pe.R16_SNORM_EXT)),T===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(j=n.R8UI),G===n.UNSIGNED_SHORT&&(j=n.R16UI),G===n.UNSIGNED_INT&&(j=n.R32UI),G===n.BYTE&&(j=n.R8I),G===n.SHORT&&(j=n.R16I),G===n.INT&&(j=n.R32I)),T===n.RG&&(G===n.FLOAT&&(j=n.RG32F),G===n.HALF_FLOAT&&(j=n.RG16F),G===n.UNSIGNED_BYTE&&(j=n.RG8),G===n.UNSIGNED_SHORT&&pe&&(j=pe.RG16_EXT),G===n.SHORT&&pe&&(j=pe.RG16_SNORM_EXT)),T===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(j=n.RG8UI),G===n.UNSIGNED_SHORT&&(j=n.RG16UI),G===n.UNSIGNED_INT&&(j=n.RG32UI),G===n.BYTE&&(j=n.RG8I),G===n.SHORT&&(j=n.RG16I),G===n.INT&&(j=n.RG32I)),T===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(j=n.RGB8UI),G===n.UNSIGNED_SHORT&&(j=n.RGB16UI),G===n.UNSIGNED_INT&&(j=n.RGB32UI),G===n.BYTE&&(j=n.RGB8I),G===n.SHORT&&(j=n.RGB16I),G===n.INT&&(j=n.RGB32I)),T===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),G===n.UNSIGNED_INT&&(j=n.RGBA32UI),G===n.BYTE&&(j=n.RGBA8I),G===n.SHORT&&(j=n.RGBA16I),G===n.INT&&(j=n.RGBA32I)),T===n.RGB&&(G===n.UNSIGNED_SHORT&&pe&&(j=pe.RGB16_EXT),G===n.SHORT&&pe&&(j=pe.RGB16_SNORM_EXT),G===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),G===n.UNSIGNED_INT_10F_11F_11F_REV&&(j=n.R11F_G11F_B10F)),T===n.RGBA){let te=de?Ao:ot.getTransfer(J);G===n.FLOAT&&(j=n.RGBA32F),G===n.HALF_FLOAT&&(j=n.RGBA16F),G===n.UNSIGNED_BYTE&&(j=te===Mt?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT&&pe&&(j=pe.RGBA16_EXT),G===n.SHORT&&pe&&(j=pe.RGBA16_SNORM_EXT),G===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function _(P,T){let G;return P?T===null||T===$n||T===Or?G=n.DEPTH24_STENCIL8:T===Gn?G=n.DEPTH32F_STENCIL8:T===Fr&&(G=n.DEPTH24_STENCIL8,Ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===$n||T===Or?G=n.DEPTH_COMPONENT24:T===Gn?G=n.DEPTH_COMPONENT32F:T===Fr&&(G=n.DEPTH_COMPONENT16),G}function b(P,T){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==rn&&P.minFilter!==Gt?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function A(P){let T=P.target;T.removeEventListener("dispose",A),E(T),T.isVideoTexture&&h.delete(T),T.isHTMLTexture&&d.delete(T)}function x(P){let T=P.target;T.removeEventListener("dispose",x),R(T)}function E(P){let T=i.get(P);if(T.__webglInit===void 0)return;let G=P.source,V=f.get(G);if(V){let J=V[T.__cacheKey];J.usedTimes--,J.usedTimes===0&&w(P),Object.keys(V).length===0&&f.delete(G)}i.remove(P)}function w(P){let T=i.get(P);n.deleteTexture(T.__webglTexture);let G=P.source,V=f.get(G);delete V[T.__cacheKey],o.memory.textures--}function R(P){let T=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(T.__webglFramebuffer[V]))for(let J=0;J<T.__webglFramebuffer[V].length;J++)n.deleteFramebuffer(T.__webglFramebuffer[V][J]);else n.deleteFramebuffer(T.__webglFramebuffer[V]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[V])}else{if(Array.isArray(T.__webglFramebuffer))for(let V=0;V<T.__webglFramebuffer.length;V++)n.deleteFramebuffer(T.__webglFramebuffer[V]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let V=0;V<T.__webglColorRenderbuffer.length;V++)T.__webglColorRenderbuffer[V]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[V]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let G=P.textures;for(let V=0,J=G.length;V<J;V++){let de=i.get(G[V]);de.__webglTexture&&(n.deleteTexture(de.__webglTexture),o.memory.textures--),i.remove(G[V])}i.remove(P)}let I=0;function N(){I=0}function D(){return I}function U(P){I=P}function W(){let P=I;return P>=s.maxTextures&&Ke("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+s.maxTextures),I+=1,P}function k(P){let T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function re(P,T){let G=i.get(P);if(P.isVideoTexture&&F(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&G.__version!==P.version){let V=P.image;if(V===null)Ke("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Ke("WebGLRenderer: Texture marked for update but image is incomplete");else{we(G,P,T);return}}else P.isExternalTexture&&(G.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+T)}function q(P,T){let G=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){we(G,P,T);return}else P.isExternalTexture&&(G.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+T)}function Z(P,T){let G=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){we(G,P,T);return}t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+T)}function ee(P,T){let G=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&G.__version!==P.version){je(G,P,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+T)}let Ge={[Cl]:n.REPEAT,[oi]:n.CLAMP_TO_EDGE,[Rl]:n.MIRRORED_REPEAT},Le={[rn]:n.NEAREST,[J0]:n.NEAREST_MIPMAP_NEAREST,[ea]:n.NEAREST_MIPMAP_LINEAR,[Gt]:n.LINEAR,[cc]:n.LINEAR_MIPMAP_NEAREST,[rs]:n.LINEAR_MIPMAP_LINEAR},dt={[$0]:n.NEVER,[sp]:n.ALWAYS,[ep]:n.LESS,[Kc]:n.LEQUAL,[tp]:n.EQUAL,[qc]:n.GEQUAL,[np]:n.GREATER,[ip]:n.NOTEQUAL};function rt(P,T){if(T.type===Gn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Gt||T.magFilter===cc||T.magFilter===ea||T.magFilter===rs||T.minFilter===Gt||T.minFilter===cc||T.minFilter===ea||T.minFilter===rs)&&Ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,Ge[T.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,Ge[T.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,Ge[T.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,Le[T.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,Le[T.minFilter]),T.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,dt[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===rn||T.minFilter!==ea&&T.minFilter!==rs||T.type===Gn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function pt(P,T){let G=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",A));let V=T.source,J=f.get(V);J===void 0&&(J={},f.set(V,J));let de=k(T);if(de!==P.__cacheKey){J[de]===void 0&&(J[de]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,G=!0),J[de].usedTimes++;let pe=J[P.__cacheKey];pe!==void 0&&(J[P.__cacheKey].usedTimes--,pe.usedTimes===0&&w(T)),P.__cacheKey=de,P.__webglTexture=J[de].texture}return G}function Y(P,T,G){return Math.floor(Math.floor(P/G)/T)}function ne(P,T,G,V){let de=P.updateRanges;if(de.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,G,V,T.data);else{de.sort((ke,Me)=>ke.start-Me.start);let pe=0;for(let ke=1;ke<de.length;ke++){let Me=de[pe],ve=de[ke],Ve=Me.start+Me.count,Je=Y(ve.start,T.width,4),nt=Y(Me.start,T.width,4);ve.start<=Ve+1&&Je===nt&&Y(ve.start+ve.count-1,T.width,4)===Je?Me.count=Math.max(Me.count,ve.start+ve.count-Me.start):(++pe,de[pe]=ve)}de.length=pe+1;let j=t.getParameter(n.UNPACK_ROW_LENGTH),te=t.getParameter(n.UNPACK_SKIP_PIXELS),xe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let ke=0,Me=de.length;ke<Me;ke++){let ve=de[ke],Ve=Math.floor(ve.start/4),Je=Math.ceil(ve.count/4),nt=Ve%T.width,B=Math.floor(Ve/T.width),ye=Je,$=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,nt),t.pixelStorei(n.UNPACK_SKIP_ROWS,B),t.texSubImage2D(n.TEXTURE_2D,0,nt,B,ye,$,G,V,T.data)}P.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,j),t.pixelStorei(n.UNPACK_SKIP_PIXELS,te),t.pixelStorei(n.UNPACK_SKIP_ROWS,xe)}}function we(P,T,G){let V=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(V=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(V=n.TEXTURE_3D);let J=pt(P,T),de=T.source;t.bindTexture(V,P.__webglTexture,n.TEXTURE0+G);let pe=i.get(de);if(de.version!==pe.__version||J===!0){if(t.activeTexture(n.TEXTURE0+G),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){let $=ot.getPrimaries(ot.workingColorSpace),Se=T.colorSpace===Cn?null:ot.getPrimaries(T.colorSpace),Pe=T.colorSpace===Cn||$===Se?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe)}t.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment);let te=m(T.image,!1,s.maxTextureSize);te=St(T,te);let xe=r.convert(T.format,T.colorSpace),ke=r.convert(T.type),Me=y(T.internalFormat,xe,ke,T.normalized,T.colorSpace,T.isVideoTexture);rt(V,T);let ve,Ve=T.mipmaps,Je=T.isVideoTexture!==!0,nt=pe.__version===void 0||J===!0,B=de.dataReady,ye=b(T,te);if(T.isDepthTexture)Me=_(T.format===os,T.type),nt&&(Je?t.texStorage2D(n.TEXTURE_2D,1,Me,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,Me,te.width,te.height,0,xe,ke,null));else if(T.isDataTexture)if(Ve.length>0){Je&&nt&&t.texStorage2D(n.TEXTURE_2D,ye,Me,Ve[0].width,Ve[0].height);for(let $=0,Se=Ve.length;$<Se;$++)ve=Ve[$],Je?B&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,xe,ke,ve.data):t.texImage2D(n.TEXTURE_2D,$,Me,ve.width,ve.height,0,xe,ke,ve.data);T.generateMipmaps=!1}else Je?(nt&&t.texStorage2D(n.TEXTURE_2D,ye,Me,te.width,te.height),B&&ne(T,te,xe,ke)):t.texImage2D(n.TEXTURE_2D,0,Me,te.width,te.height,0,xe,ke,te.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Je&&nt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Me,Ve[0].width,Ve[0].height,te.depth);for(let $=0,Se=Ve.length;$<Se;$++)if(ve=Ve[$],T.format!==wn)if(xe!==null)if(Je){if(B)if(T.layerUpdates.size>0){let Pe=rf(ve.width,ve.height,T.format,T.type);for(let oe of T.layerUpdates){let We=ve.data.subarray(oe*Pe/ve.data.BYTES_PER_ELEMENT,(oe+1)*Pe/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,oe,ve.width,ve.height,1,xe,We)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,te.depth,xe,ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,Me,ve.width,ve.height,te.depth,0,ve.data,0,0);else Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Je?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,te.depth,xe,ke,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,Me,ve.width,ve.height,te.depth,0,xe,ke,ve.data);T.layerUpdates.size>0&&T.clearLayerUpdates()}else{Je&&nt&&t.texStorage2D(n.TEXTURE_2D,ye,Me,Ve[0].width,Ve[0].height);for(let $=0,Se=Ve.length;$<Se;$++)ve=Ve[$],T.format!==wn?xe!==null?Je?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,xe,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,$,Me,ve.width,ve.height,0,ve.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?B&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ve.width,ve.height,xe,ke,ve.data):t.texImage2D(n.TEXTURE_2D,$,Me,ve.width,ve.height,0,xe,ke,ve.data)}else if(T.isDataArrayTexture)if(Je){if(nt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Me,te.width,te.height,te.depth),B)if(T.layerUpdates.size>0){let $=rf(te.width,te.height,T.format,T.type);for(let Se of T.layerUpdates){let Pe=te.data.subarray(Se*$/te.data.BYTES_PER_ELEMENT,(Se+1)*$/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Se,te.width,te.height,1,xe,ke,Pe)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,xe,ke,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Me,te.width,te.height,te.depth,0,xe,ke,te.data);else if(T.isData3DTexture)Je?(nt&&t.texStorage3D(n.TEXTURE_3D,ye,Me,te.width,te.height,te.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,xe,ke,te.data)):t.texImage3D(n.TEXTURE_3D,0,Me,te.width,te.height,te.depth,0,xe,ke,te.data);else if(T.isFramebufferTexture){if(nt)if(Je)t.texStorage2D(n.TEXTURE_2D,ye,Me,te.width,te.height);else{let $=te.width,Se=te.height;for(let Pe=0;Pe<ye;Pe++)t.texImage2D(n.TEXTURE_2D,Pe,Me,$,Se,0,xe,ke,null),$>>=1,Se>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in n){let $=n.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),te.parentNode!==$){$.appendChild(te),d.add(T),$.onpaint=Se=>{let Pe=Se.changedElements;for(let oe of d)Pe.includes(oe.image)&&(oe.needsUpdate=!0)},$.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,te);else{let Pe=n.RGBA,oe=n.RGBA,We=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Pe,oe,We,te)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ve.length>0){if(Je&&nt){let $=lt(Ve[0]);t.texStorage2D(n.TEXTURE_2D,ye,Me,$.width,$.height)}for(let $=0,Se=Ve.length;$<Se;$++)ve=Ve[$],Je?B&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,xe,ke,ve):t.texImage2D(n.TEXTURE_2D,$,Me,xe,ke,ve);T.generateMipmaps=!1}else if(Je){if(nt){let $=lt(te);t.texStorage2D(n.TEXTURE_2D,ye,Me,$.width,$.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,xe,ke,te)}else t.texImage2D(n.TEXTURE_2D,0,Me,xe,ke,te);p(T)&&v(V),pe.__version=de.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function je(P,T,G){if(T.image.length!==6)return;let V=pt(P,T),J=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+G);let de=i.get(J);if(J.version!==de.__version||V===!0){t.activeTexture(n.TEXTURE0+G);let pe=ot.getPrimaries(ot.workingColorSpace),j=T.colorSpace===Cn?null:ot.getPrimaries(T.colorSpace),te=T.colorSpace===Cn||pe===j?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let xe=T.isCompressedTexture||T.image[0].isCompressedTexture,ke=T.image[0]&&T.image[0].isDataTexture,Me=[];for(let oe=0;oe<6;oe++)!xe&&!ke?Me[oe]=m(T.image[oe],!0,s.maxCubemapSize):Me[oe]=ke?T.image[oe].image:T.image[oe],Me[oe]=St(T,Me[oe]);let ve=Me[0],Ve=r.convert(T.format,T.colorSpace),Je=r.convert(T.type),nt=y(T.internalFormat,Ve,Je,T.normalized,T.colorSpace),B=T.isVideoTexture!==!0,ye=de.__version===void 0||V===!0,$=J.dataReady,Se=b(T,ve);rt(n.TEXTURE_CUBE_MAP,T);let Pe;if(xe){B&&ye&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,nt,ve.width,ve.height);for(let oe=0;oe<6;oe++){Pe=Me[oe].mipmaps;for(let We=0;We<Pe.length;We++){let ze=Pe[We];T.format!==wn?Ve!==null?B?$&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,0,0,ze.width,ze.height,Ve,ze.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,nt,ze.width,ze.height,0,ze.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,0,0,ze.width,ze.height,Ve,Je,ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We,nt,ze.width,ze.height,0,Ve,Je,ze.data)}}}else{if(Pe=T.mipmaps,B&&ye){Pe.length>0&&Se++;let oe=lt(Me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,nt,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(ke){B?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Me[oe].width,Me[oe].height,Ve,Je,Me[oe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,nt,Me[oe].width,Me[oe].height,0,Ve,Je,Me[oe].data);for(let We=0;We<Pe.length;We++){let Lt=Pe[We].image[oe].image;B?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,0,0,Lt.width,Lt.height,Ve,Je,Lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,nt,Lt.width,Lt.height,0,Ve,Je,Lt.data)}}else{B?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Ve,Je,Me[oe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,nt,Ve,Je,Me[oe]);for(let We=0;We<Pe.length;We++){let ze=Pe[We];B?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,0,0,Ve,Je,ze.image[oe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,We+1,nt,Ve,Je,ze.image[oe])}}}p(T)&&v(n.TEXTURE_CUBE_MAP),de.__version=J.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function De(P,T,G,V,J,de){let pe=r.convert(G.format,G.colorSpace),j=r.convert(G.type),te=y(G.internalFormat,pe,j,G.normalized,G.colorSpace),xe=i.get(T),ke=i.get(G);if(ke.__renderTarget=T,!xe.__hasExternalTextures){let Me=Math.max(1,T.width>>de),ve=Math.max(1,T.height>>de);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,de,te,Me,ve,T.depth,0,pe,j,null):t.texImage2D(J,de,te,Me,ve,0,pe,j,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),tt(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,V,J,ke.__webglTexture,0,$e(T)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,V,J,ke.__webglTexture,de),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ze(P,T,G){if(n.bindRenderbuffer(n.RENDERBUFFER,P),T.depthBuffer){let V=T.depthTexture,J=V&&V.isDepthTexture?V.type:null,de=_(T.stencilBuffer,J),pe=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;tt(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,$e(T),de,T.width,T.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,$e(T),de,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,de,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,pe,n.RENDERBUFFER,P)}else{let V=T.textures;for(let J=0;J<V.length;J++){let de=V[J],pe=r.convert(de.format,de.colorSpace),j=r.convert(de.type),te=y(de.internalFormat,pe,j,de.normalized,de.colorSpace);tt(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,$e(T),te,T.width,T.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,$e(T),te,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,te,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function At(P,T,G){let V=T.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let J=i.get(T.depthTexture);if(J.__renderTarget=T,(!J.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),V){if(J.__webglInit===void 0&&(J.__webglInit=!0,T.depthTexture.addEventListener("dispose",A)),J.__webglTexture===void 0){J.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),rt(n.TEXTURE_CUBE_MAP,T.depthTexture);let xe=r.convert(T.depthTexture.format),ke=r.convert(T.depthTexture.type),Me;T.depthTexture.format===li?Me=n.DEPTH_COMPONENT24:T.depthTexture.format===os&&(Me=n.DEPTH24_STENCIL8);for(let ve=0;ve<6;ve++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,Me,T.width,T.height,0,xe,ke,null)}}else re(T.depthTexture,0);let de=J.__webglTexture,pe=$e(T),j=V?n.TEXTURE_CUBE_MAP_POSITIVE_X+G:n.TEXTURE_2D,te=T.depthTexture.format===os?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(T.depthTexture.format===li)tt(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,te,j,de,0,pe):n.framebufferTexture2D(n.FRAMEBUFFER,te,j,de,0);else if(T.depthTexture.format===os)tt(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,te,j,de,0,pe):n.framebufferTexture2D(n.FRAMEBUFFER,te,j,de,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(P){let T=i.get(P),G=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){let V=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),V){let J=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,V.removeEventListener("dispose",J)};V.addEventListener("dispose",J),T.__depthDisposeCallback=J}T.__boundDepthTexture=V}if(P.depthTexture&&!T.__autoAllocateDepthBuffer)if(G)for(let V=0;V<6;V++)At(T.__webglFramebuffer[V],P,V);else{let V=P.texture.mipmaps;V&&V.length>0?At(T.__webglFramebuffer[0],P,0):At(T.__webglFramebuffer,P,0)}else if(G){T.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[V]),T.__webglDepthbuffer[V]===void 0)T.__webglDepthbuffer[V]=n.createRenderbuffer(),Ze(T.__webglDepthbuffer[V],P,!1);else{let J=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=T.__webglDepthbuffer[V];n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,de)}}else{let V=P.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Ze(T.__webglDepthbuffer,P,!1);else{let J=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,de),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,de)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function le(P,T,G){let V=i.get(P);T!==void 0&&De(V.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&ie(P)}function ue(P){let T=P.texture,G=i.get(P),V=i.get(T);P.addEventListener("dispose",x);let J=P.textures,de=P.isWebGLCubeRenderTarget===!0,pe=J.length>1;if(pe||(V.__webglTexture===void 0&&(V.__webglTexture=n.createTexture()),V.__version=T.version,o.memory.textures++),de){G.__webglFramebuffer=[];for(let j=0;j<6;j++)if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer[j]=[];for(let te=0;te<T.mipmaps.length;te++)G.__webglFramebuffer[j][te]=n.createFramebuffer()}else G.__webglFramebuffer[j]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer=[];for(let j=0;j<T.mipmaps.length;j++)G.__webglFramebuffer[j]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(pe)for(let j=0,te=J.length;j<te;j++){let xe=i.get(J[j]);xe.__webglTexture===void 0&&(xe.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&tt(P)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let j=0;j<J.length;j++){let te=J[j];G.__webglColorRenderbuffer[j]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[j]);let xe=r.convert(te.format,te.colorSpace),ke=r.convert(te.type),Me=y(te.internalFormat,xe,ke,te.normalized,te.colorSpace,P.isXRRenderTarget===!0),ve=$e(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,ve,Me,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,G.__webglColorRenderbuffer[j])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),Ze(G.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(de){t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture),rt(n.TEXTURE_CUBE_MAP,T);for(let j=0;j<6;j++)if(T.mipmaps&&T.mipmaps.length>0)for(let te=0;te<T.mipmaps.length;te++)De(G.__webglFramebuffer[j][te],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,te);else De(G.__webglFramebuffer[j],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);p(T)&&v(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(pe){for(let j=0,te=J.length;j<te;j++){let xe=J[j],ke=i.get(xe),Me=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Me=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Me,ke.__webglTexture),rt(Me,xe),De(G.__webglFramebuffer,P,xe,n.COLOR_ATTACHMENT0+j,Me,0),p(xe)&&v(Me)}t.unbindTexture()}else{let j=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(j=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(j,V.__webglTexture),rt(j,T),T.mipmaps&&T.mipmaps.length>0)for(let te=0;te<T.mipmaps.length;te++)De(G.__webglFramebuffer[te],P,T,n.COLOR_ATTACHMENT0,j,te);else De(G.__webglFramebuffer,P,T,n.COLOR_ATTACHMENT0,j,0);p(T)&&v(j),t.unbindTexture()}P.depthBuffer&&ie(P)}function fe(P){let T=P.textures;for(let G=0,V=T.length;G<V;G++){let J=T[G];if(p(J)){let de=M(P),pe=i.get(J).__webglTexture;t.bindTexture(de,pe),v(de),t.unbindTexture()}}}let me=[],qe=[];function Xe(P){if(P.samples>0){if(tt(P)===!1){let T=P.textures,G=P.width,V=P.height,J=n.COLOR_BUFFER_BIT,de=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,pe=i.get(P),j=T.length>1;if(j)for(let xe=0;xe<T.length;xe++)t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer);let te=P.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let xe=0;xe<T.length;xe++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),j){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,pe.__webglColorRenderbuffer[xe]);let ke=i.get(T[xe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ke,0)}n.blitFramebuffer(0,0,G,V,0,0,G,V,J,n.NEAREST),c===!0&&(me.length=0,qe.length=0,me.push(n.COLOR_ATTACHMENT0+xe),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(me.push(de),qe.push(de),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,qe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,me))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),j)for(let xe=0;xe<T.length;xe++){t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,pe.__webglColorRenderbuffer[xe]);let ke=i.get(T[xe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&c){let T=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function $e(P){return Math.min(s.maxSamples,P.samples)}function tt(P){let T=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function F(P){let T=o.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function St(P,T){let G=P.colorSpace,V=P.format,J=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||G!==Rs&&G!==Cn&&(ot.getTransfer(G)===Mt?(V!==wn||J!==yn)&&Ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ye("WebGLTextures: Unsupported texture color space:",G)),T}function lt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=N,this.getTextureUnits=D,this.setTextureUnits=U,this.setTexture2D=re,this.setTexture2DArray=q,this.setTexture3D=Z,this.setTextureCube=ee,this.rebindTextures=le,this.setupRenderTarget=ue,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=Xe,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=De,this.useMultisampledRTT=tt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function V3(n,e){function t(i,s=Cn){let r,o=ot.getTransfer(s);if(i===yn)return n.UNSIGNED_BYTE;if(i===uc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===fc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ku)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===qu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Xu)return n.BYTE;if(i===Qu)return n.SHORT;if(i===Fr)return n.UNSIGNED_SHORT;if(i===hc)return n.INT;if(i===$n)return n.UNSIGNED_INT;if(i===Gn)return n.FLOAT;if(i===Ln)return n.HALF_FLOAT;if(i===Ju)return n.ALPHA;if(i===ju)return n.RGB;if(i===wn)return n.RGBA;if(i===li)return n.DEPTH_COMPONENT;if(i===os)return n.DEPTH_STENCIL;if(i===dc)return n.RED;if(i===pc)return n.RED_INTEGER;if(i===as)return n.RG;if(i===mc)return n.RG_INTEGER;if(i===gc)return n.RGBA_INTEGER;if(i===ta||i===na||i===ia||i===sa)if(o===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ta)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ta)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===na)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ia)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===sa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xc||i===vc||i===yc||i===Sc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===xc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===yc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Sc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bc||i===_c||i===Mc||i===Ac||i===Ec||i===ra||i===Tc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===bc||i===_c)return o===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Mc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ac)return r.COMPRESSED_R11_EAC;if(i===Ec)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ra)return r.COMPRESSED_RG11_EAC;if(i===Tc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===wc||i===Cc||i===Rc||i===Pc||i===Ic||i===Dc||i===Lc||i===Fc||i===Oc||i===Nc||i===Bc||i===Uc||i===Gc||i===zc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===wc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ic)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Dc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Lc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Fc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Oc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Bc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Uc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Gc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===zc)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Hc||i===kc||i===Vc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Hc)return o===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===kc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wc||i===Xc||i===oa||i===Qc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Wc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Xc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Qc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Or?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var W3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,X3=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Af=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Oo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Et({vertexShader:W3,fragmentShader:X3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zt(new Yn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ef=class extends ci{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null,S=typeof XRWebGLBinding<"u",m=new Af,p={},v=t.getContextAttributes(),M=null,y=null,_=[],b=[],A=new ae,x=null,E=null,w=new sn;w.viewport=new Ot;let R=new sn;R.viewport=new Ot;let I=[w,R],N=new rc,D=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ne=_[Y];return ne===void 0&&(ne=new Er,_[Y]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Y){let ne=_[Y];return ne===void 0&&(ne=new Er,_[Y]=ne),ne.getGripSpace()},this.getHand=function(Y){let ne=_[Y];return ne===void 0&&(ne=new Er,_[Y]=ne),ne.getHandSpace()};function W(Y){let ne=b.indexOf(Y.inputSource);if(ne===-1)return;let we=_[ne];we!==void 0&&(we.update(Y.inputSource,Y.frame,l||o),we.dispatchEvent({type:Y.type,data:Y.inputSource}))}function k(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",re);for(let Y=0;Y<_.length;Y++){let ne=b[Y];ne!==null&&(b[Y]=null,_[Y].disconnect(ne))}D=null,U=null,m.reset();for(let Y in p)delete p[Y];if(e.setRenderTarget(M),f=null,u=null,d=null,s=null,y=null,pt.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(A.width,A.height,!1),E!==null){let Y=E.camera;Y.fov=E.fov,Y.zoom=E.zoom,Y.updateProjectionMatrix(),E=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",k),s.addEventListener("inputsourceschange",re),v.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(A),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,je=null,De=null;v.depth&&(De=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=v.stencil?os:li,je=v.stencil?Or:$n);let Ze={colorFormat:t.RGBA8,depthFormat:De,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ze),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new dn(u.textureWidth,u.textureHeight,{format:wn,type:yn,depthTexture:new Zi(u.textureWidth,u.textureHeight,je,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let we={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new dn(f.framebufferWidth,f.framebufferHeight,{format:wn,type:yn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),pt.setContext(s),pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function re(Y){for(let ne=0;ne<Y.removed.length;ne++){let we=Y.removed[ne],je=b.indexOf(we);je>=0&&(b[je]=null,_[je].disconnect(we))}for(let ne=0;ne<Y.added.length;ne++){let we=Y.added[ne],je=b.indexOf(we);if(je===-1){for(let Ze=0;Ze<_.length;Ze++)if(Ze>=b.length){b.push(we),je=Ze;break}else if(b[Ze]===null){b[Ze]=we,je=Ze;break}if(je===-1)break}let De=_[je];De&&De.connect(we)}}let q=new L,Z=new L;function ee(Y,ne,we){q.setFromMatrixPosition(ne.matrixWorld),Z.setFromMatrixPosition(we.matrixWorld);let je=q.distanceTo(Z),De=ne.projectionMatrix.elements,Ze=we.projectionMatrix.elements,At=De[14]/(De[10]-1),ie=De[14]/(De[10]+1),le=(De[9]+1)/De[5],ue=(De[9]-1)/De[5],fe=(De[8]-1)/De[0],me=(Ze[8]+1)/Ze[0],qe=At*fe,Xe=At*me,$e=je/(-fe+me),tt=$e*-fe;if(ne.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(tt),Y.translateZ($e),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),De[10]===-1)Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let F=At+$e,St=ie+$e,lt=qe-tt,P=Xe+(je-tt),T=le*ie/St*F,G=ue*ie/St*F;Y.projectionMatrix.makePerspective(lt,P,T,G,F,St),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Ge(Y,ne){ne===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ne.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ne=Y.near,we=Y.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(we=m.depthFar)),N.near=R.near=w.near=ne,N.far=R.far=w.far=we,(D!==N.near||U!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),D=N.near,U=N.far),N.layers.mask=Y.layers.mask|6,w.layers.mask=N.layers.mask&-5,R.layers.mask=N.layers.mask&-3;let je=Y.parent,De=N.cameras;Ge(N,je);for(let Ze=0;Ze<De.length;Ze++)Ge(De[Ze],je);De.length===2?ee(N,w,R):N.projectionMatrix.copy(w.projectionMatrix),E===null&&Y.isPerspectiveCamera&&(E={camera:Y,fov:Y.fov,zoom:Y.zoom}),Le(Y,N,je)};function Le(Y,ne,we){we===null?Y.matrix.copy(ne.matrixWorld):(Y.matrix.copy(we.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ne.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Il*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(Y){c=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(Y){return p[Y]};let dt=null;function rt(Y,ne){if(h=ne.getViewerPose(l||o),g=ne,h!==null){let we=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let je=!1;we.length!==N.cameras.length&&(N.cameras.length=0,je=!0);for(let ie=0;ie<we.length;ie++){let le=we[ie],ue=null;if(f!==null)ue=f.getViewport(le);else{let me=d.getViewSubImage(u,le);ue=me.viewport,ie===0&&(e.setRenderTargetTextures(y,me.colorTexture,me.depthStencilTexture),e.setRenderTarget(y))}let fe=I[ie];fe===void 0&&(fe=new sn,fe.layers.enable(ie),fe.viewport=new Ot,I[ie]=fe),fe.matrix.fromArray(le.transform.matrix),fe.matrix.decompose(fe.position,fe.quaternion,fe.scale),fe.projectionMatrix.fromArray(le.projectionMatrix),fe.projectionMatrixInverse.copy(fe.projectionMatrix).invert(),fe.viewport.set(ue.x,ue.y,ue.width,ue.height),ie===0&&(N.matrix.copy(fe.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),je===!0&&N.cameras.push(fe)}let De=s.enabledFeatures;if(De&&De.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){d=i.getBinding();let ie=d.getDepthInformation(we[0]);ie&&ie.isValid&&ie.texture&&m.init(ie,s.renderState)}if(De&&De.includes("camera-access")&&S){e.state.unbindTexture(),d=i.getBinding();for(let ie=0;ie<we.length;ie++){let le=we[ie].camera;if(le){let ue=p[le];ue||(ue=new Oo,p[le]=ue);let fe=d.getCameraImage(le);ue.sourceTexture=fe}}}}for(let we=0;we<_.length;we++){let je=b[we],De=_[we];je!==null&&De!==void 0&&De.update(je,ne,l||o)}dt&&dt(Y,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),g=null}let pt=new Gp;pt.setAnimationLoop(rt),this.setAnimationLoop=function(Y){dt=Y},this.dispose=function(){}}},Q3=new yt,Xp=new et;Xp.set(-1,0,0,0,1,0,0,0,1);function K3(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,tf(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,M,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),S(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,v,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===vn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===vn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let v=e.get(p),M=v.envMap,y=v.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(Q3.makeRotationFromEuler(y)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Xp),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===vn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function S(m,p){let v=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function q3(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,_){let b=_.program;i.uniformBlockBinding(y,b)}function l(y,_){let b=s[y.id];b===void 0&&(m(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",v));let A=_.program;i.updateUBOMapping(y,A);let x=e.render.frame;r[y.id]!==x&&(u(y),r[y.id]=x)}function h(y){let _=d();y.__bindingPointIndex=_;let b=n.createBuffer(),A=y.__size,x=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,A,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,b),b}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return Ye("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let _=s[y.id],b=y.uniforms,A=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let x=0,E=b.length;x<E;x++){let w=b[x];if(Array.isArray(w))for(let R=0,I=w.length;R<I;R++)f(w[R],x,R,A);else f(w,x,0,A)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,_,b,A){if(S(y,_,b,A)===!0){let x=y.__offset,E=y.value;if(Array.isArray(E)){let w=0;for(let R=0;R<E.length;R++){let I=E[R],N=p(I);g(I,y.__data,w),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(w+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,y.__data)}}function g(y,_,b){typeof y=="number"||typeof y=="boolean"?_[0]=y:y.isMatrix3?(_[0]=y.elements[0],_[1]=y.elements[1],_[2]=y.elements[2],_[3]=0,_[4]=y.elements[3],_[5]=y.elements[4],_[6]=y.elements[5],_[7]=0,_[8]=y.elements[6],_[9]=y.elements[7],_[10]=y.elements[8],_[11]=0):ArrayBuffer.isView(y)?_.set(new y.constructor(y.buffer,y.byteOffset,_.length)):y.toArray(_,b)}function S(y,_,b,A){let x=y.value,E=_+"_"+b;if(A[E]===void 0)return typeof x=="number"||typeof x=="boolean"?A[E]=x:ArrayBuffer.isView(x)?A[E]=x.slice():A[E]=x.clone(),!0;{let w=A[E];if(typeof x=="number"||typeof x=="boolean"){if(w!==x)return A[E]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(w.equals(x)===!1)return w.copy(x),!0}}return!1}function m(y){let _=y.uniforms,b=0,A=16;for(let E=0,w=_.length;E<w;E++){let R=Array.isArray(_[E])?_[E]:[_[E]];for(let I=0,N=R.length;I<N;I++){let D=R[I],U=Array.isArray(D.value)?D.value:[D.value];for(let W=0,k=U.length;W<k;W++){let re=U[W],q=p(re),Z=b%A,ee=Z%q.boundary,Ge=Z+ee;b+=ee,Ge!==0&&A-Ge<q.storage&&(b+=A-Ge),D.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=b,b+=q.storage}}}let x=b%A;return x>0&&(b+=A-x),y.__size=b,y.__cache={},this}function p(y){let _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?Ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(_.boundary=16,_.storage=y.byteLength):Ke("WebGLRenderer: Unsupported uniform value type.",y),_}function v(y){let _=y.target;_.removeEventListener("dispose",v);let b=o.indexOf(_.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function M(){for(let y in s)n.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:l,dispose:M}}var J3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),gi=null;function j3(){return gi===null&&(gi=new Io(J3,16,16,as,Ln),gi.name="DFG_LUT",gi.minFilter=Gt,gi.magFilter=Gt,gi.wrapS=oi,gi.wrapT=oi,gi.generateMipmaps=!1,gi.needsUpdate=!0),gi}var $c=class{constructor(e={}){let{canvas:t=op(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=yn}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let S=f,m=new Set([gc,mc,pc]),p=new Set([yn,$n,Fr,Or,uc,fc]),v=new Uint32Array(4),M=new Int32Array(4),y=new L,_=null,b=null,A=[],x=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let w=this,R=!1,I=null,N=null,D=null,U=null;this._outputColorSpace=In;let W=0,k=0,re=null,q=-1,Z=null,ee=new Ot,Ge=new Ot,Le=null,dt=new Ae(0),rt=0,pt=t.width,Y=t.height,ne=1,we=null,je=null,De=new Ot(0,0,pt,Y),Ze=new Ot(0,0,pt,Y),At=!1,ie=new Do,le=!1,ue=!1,fe=new yt,me=new L,qe=new Ot,Xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$e=!1;function tt(){return re===null?ne:1}let F=i;function St(C,O){return t.getContext(C,O)}let lt,P,T,G,V,J,de,pe,j,te,xe,ke,Me,ve,Ve,Je,nt,B,ye,$,Se,Pe,oe;try{let C={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Lt,!1),t.addEventListener("webglcontextrestored",bt,!1),t.addEventListener("webglcontextcreationerror",Wn,!1),F===null){let O="webgl2";if(F=St(O,C),F===null)throw St(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}We()}catch(C){throw t.removeEventListener("webglcontextlost",Lt,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",Wn,!1),Ye("WebGLRenderer: "+C.message),C}function We(){lt=new i2(F),lt.init(),Se=new V3(F,lt),P=new Ky(F,lt,e,Se),T=new H3(F,lt),P.reversedDepthBuffer&&u&&T.buffers.depth.setReversed(!0),N=F.createFramebuffer(),D=F.createFramebuffer(),U=F.createFramebuffer(),G=new o2(F),V=new w3,J=new k3(F,lt,T,V,P,Se,G),de=new n2(w),pe=new lx(F),Pe=new Xy(F,pe),j=new s2(F,pe,G,Pe),te=new l2(F,j,pe,Pe,G),B=new a2(F,P,J),Ve=new qy(V),xe=new T3(w,de,lt,P,Pe,Ve),ke=new K3(w,V),Me=new R3,ve=new O3(lt),nt=new Wy(w,de,T,te,g,c),Je=new z3(w,te,P),oe=new q3(F,G,P,T),ye=new Qy(F,lt,G),$=new r2(F,lt,G),G.programs=xe.programs,w.capabilities=P,w.extensions=lt,w.properties=V,w.renderLists=Me,w.shadowMap=Je,w.state=T,w.info=G}S!==yn&&(E=new h2(S,t.width,t.height,a,s,r));let ze=new Ef(w,F);this.xr=ze,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let C=lt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=lt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(C){C!==void 0&&(ne=C,this.setSize(pt,Y,!1))},this.getSize=function(C){return C.set(pt,Y)},this.setSize=function(C,O,K=!0){if(ze.isPresenting){Ke("WebGLRenderer: Can't change size while VR device is presenting.");return}pt=C,Y=O,t.width=Math.floor(C*ne),t.height=Math.floor(O*ne),K===!0&&(t.style.width=C+"px",t.style.height=O+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,C,O)},this.getDrawingBufferSize=function(C){return C.set(pt*ne,Y*ne).floor()},this.setDrawingBufferSize=function(C,O,K){pt=C,Y=O,ne=K,t.width=Math.floor(C*K),t.height=Math.floor(O*K),this.setViewport(0,0,C,O)},this.setEffects=function(C){if(S===yn){Ye("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let O=0;O<C.length;O++)if(C[O].isOutputPass===!0){Ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(ee)},this.getViewport=function(C){return C.copy(De)},this.setViewport=function(C,O,K,z){C.isVector4?De.set(C.x,C.y,C.z,C.w):De.set(C,O,K,z),T.viewport(ee.copy(De).multiplyScalar(ne).round())},this.getScissor=function(C){return C.copy(Ze)},this.setScissor=function(C,O,K,z){C.isVector4?Ze.set(C.x,C.y,C.z,C.w):Ze.set(C,O,K,z),T.scissor(Ge.copy(Ze).multiplyScalar(ne).round())},this.getScissorTest=function(){return At},this.setScissorTest=function(C){T.setScissorTest(At=C)},this.setOpaqueSort=function(C){we=C},this.setTransparentSort=function(C){je=C},this.getClearColor=function(C){return C.copy(nt.getClearColor())},this.setClearColor=function(){nt.setClearColor(...arguments)},this.getClearAlpha=function(){return nt.getClearAlpha()},this.setClearAlpha=function(){nt.setClearAlpha(...arguments)},this.clear=function(C=!0,O=!0,K=!0){let z=0;if(C){let H=!1;if(re!==null){let Re=re.texture.format;H=m.has(Re)}if(H){let Re=re.texture.type,Ne=p.has(Re),Ce=nt.getClearColor(),Be=nt.getClearAlpha(),He=Ce.r,it=Ce.g,ct=Ce.b;Ne?(v[0]=He,v[1]=it,v[2]=ct,v[3]=Be,F.clearBufferuiv(F.COLOR,0,v)):(M[0]=He,M[1]=it,M[2]=ct,M[3]=Be,F.clearBufferiv(F.COLOR,0,M))}else z|=F.COLOR_BUFFER_BIT}O&&(z|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(z|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&F.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),I=C},this.dispose=function(){t.removeEventListener("webglcontextlost",Lt,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",Wn,!1),nt.dispose(),Me.dispose(),ve.dispose(),V.dispose(),de.dispose(),te.dispose(),Pe.dispose(),oe.dispose(),xe.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",Ud),ze.removeEventListener("sessionend",Gd),Ms.stop()};function Lt(C){C.preventDefault(),$u("WebGLRenderer: Context Lost."),R=!0}function bt(){$u("WebGLRenderer: Context Restored."),R=!1;let C=G.autoReset,O=Je.enabled,K=Je.autoUpdate,z=Je.needsUpdate,H=Je.type;We(),G.autoReset=C,Je.enabled=O,Je.autoUpdate=K,Je.needsUpdate=z,Je.type=H}function Wn(C){Ye("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ii(C){let O=C.target;O.removeEventListener("dispose",ii),Ug(O)}function Ug(C){Gg(C),V.remove(C)}function Gg(C){let O=V.get(C).programs;O!==void 0&&(O.forEach(function(K){xe.releaseProgram(K)}),C.isShaderMaterial&&xe.releaseShaderCache(C))}this.renderBufferDirect=function(C,O,K,z,H,Re){O===null&&(O=Xe);let Ne=H.isMesh&&H.matrixWorld.determinantAffine()<0,Ce=kg(C,O,K,z,H);T.setMaterial(z,Ne);let Be=K.index,He=1;if(z.wireframe===!0){if(Be=j.getWireframeAttribute(K),Be===void 0)return;He=2}let it=K.drawRange,ct=K.attributes.position,Ue=it.start*He,_t=(it.start+it.count)*He;Re!==null&&(Ue=Math.max(Ue,Re.start*He),_t=Math.min(_t,(Re.start+Re.count)*He)),Be!==null?(Ue=Math.max(Ue,0),_t=Math.min(_t,Be.count)):ct!=null&&(Ue=Math.max(Ue,0),_t=Math.min(_t,ct.count));let Zt=_t-Ue;if(Zt<0||Zt===1/0)return;Pe.setup(H,z,Ce,K,Be);let Bt,Pt=ye;if(Be!==null&&(Bt=pe.get(Be),Pt=$,Pt.setIndex(Bt)),H.isMesh)z.wireframe===!0?(T.setLineWidth(z.wireframeLinewidth*tt()),Pt.setMode(F.LINES)):Pt.setMode(F.TRIANGLES);else if(H.isLine){let hn=z.linewidth;hn===void 0&&(hn=1),T.setLineWidth(hn*tt()),H.isLineSegments?Pt.setMode(F.LINES):H.isLineLoop?Pt.setMode(F.LINE_LOOP):Pt.setMode(F.LINE_STRIP)}else H.isPoints?Pt.setMode(F.POINTS):H.isSprite&&Pt.setMode(F.TRIANGLES);if(H.isBatchedMesh)if(lt.get("WEBGL_multi_draw"))Pt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let hn=H._multiDrawStarts,Fe=H._multiDrawCounts,mn=H._multiDrawCount,mt=Be?pe.get(Be).bytesPerElement:1,Bn=V.get(z).currentProgram.getUniforms();for(let si=0;si<mn;si++)Bn.setValue(F,"_gl_DrawID",si),Pt.render(hn[si]/mt,Fe[si])}else if(H.isInstancedMesh)Pt.renderInstances(Ue,Zt,H.count);else if(K.isInstancedBufferGeometry){let hn=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Fe=Math.min(K.instanceCount,hn);Pt.renderInstances(Ue,Zt,Fe)}else Pt.render(Ue,Zt)};function Bd(C,O,K,z){I!==null&&C.isNodeMaterial&&I.setObject(z,C),le===!0&&Ve.setState(C,K,!1),C.transparent===!0&&C.side===Tn&&C.forceSinglePass===!1?(C.side=vn,C.needsUpdate=!0,ka(C,O,z),C.side=ns,C.needsUpdate=!0,ka(C,O,z),C.side=Tn):ka(C,O,z)}this.compile=function(C,O,K=null){K===null&&(K=C),I!==null&&I.renderStart(C,O,K),b=ve.get(K),b.init(O),x.push(b),K.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),C!==K&&C.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),b.setupLights(),I!==null&&I.updateLights(b.state.lightsArray),ue=this.localClippingEnabled,le=Ve.init(this.clippingPlanes,ue),le===!0&&Ve.setGlobalState(this.clippingPlanes,O),I!==null&&Je.render(b.state.shadowsArray,K,O);let z=new Set;return C.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let Re=H.material;if(Re)if(Array.isArray(Re))for(let Ne=0;Ne<Re.length;Ne++){let Ce=Re[Ne];Bd(Ce,K,O,H),z.add(Ce)}else Bd(Re,K,O,H),z.add(Re)}),b=x.pop(),I!==null&&I.renderEnd(),z},this.compileAsync=function(C,O,K=null){let z=this.compile(C,O,K);return new Promise(H=>{function Re(){if(z.forEach(function(Ne){let Be=V.get(Ne).currentProgram;(Be===void 0||Be.isReady())&&z.delete(Ne)}),z.size===0){H(C);return}setTimeout(Re,10)}lt.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let Kh=null;function zg(C){Kh&&Kh(C)}function Ud(){Ms.stop()}function Gd(){Ms.start()}let Ms=new Gp;Ms.setAnimationLoop(zg),typeof self<"u"&&Ms.setContext(self),this.setAnimationLoop=function(C){Kh=C,ze.setAnimationLoop(C),C===null?Ms.stop():Ms.start()},ze.addEventListener("sessionstart",Ud),ze.addEventListener("sessionend",Gd),this.render=function(C,O){if(O!==void 0&&O.isCamera!==!0){Ye("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;I!==null&&I.renderStart(C,O);let K=ze.enabled===!0&&ze.isPresenting===!0,z=E!==null&&(re===null||K)&&E.begin(w,re);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(O),O=ze.getCamera()),C.isScene===!0&&C.onBeforeRender(w,C,O,re),b=ve.get(C,x.length),b.init(O),b.state.textureUnits=J.getTextureUnits(),x.push(b),fe.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ie.setFromProjectionMatrix(fe,Jn,O.reversedDepth),ue=this.localClippingEnabled,le=Ve.init(this.clippingPlanes,ue),_=Me.get(C,A.length),_.init(),A.push(_),ze.enabled===!0&&ze.isPresenting===!0){let Ne=w.xr.getDepthSensingMesh();Ne!==null&&qh(Ne,O,-1/0,w.sortObjects)}qh(C,O,0,w.sortObjects),_.finish(),I!==null&&I.updateLights(b.state.lightsArray),w.sortObjects===!0&&_.sort(we,je),$e=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,$e&&nt.addToRenderList(_,C),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),le===!0&&Ve.beginShadows();let H=b.state.shadowsArray;if(Je.render(H,C,O),le===!0&&Ve.endShadows(),(z&&E.hasRenderPass())===!1){let Ne=_.opaque,Ce=_.transmissive;if(b.setupLights(),O.isArrayCamera){let Be=O.cameras;if(Ce.length>0)for(let He=0,it=Be.length;He<it;He++){let ct=Be[He];Hd(Ne,Ce,C,ct)}$e&&nt.render(C);for(let He=0,it=Be.length;He<it;He++){let ct=Be[He];zd(_,C,ct,ct.viewport)}}else Ce.length>0&&Hd(Ne,Ce,C,O),$e&&nt.render(C),zd(_,C,O)}re!==null&&k===0&&(J.updateMultisampleRenderTarget(re),J.updateRenderTargetMipmap(re)),z&&E.end(w),C.isScene===!0&&C.onAfterRender(w,C,O),Pe.resetDefaultState(),q=-1,Z=null,x.pop(),x.length>0?(b=x[x.length-1],J.setTextureUnits(b.state.textureUnits),le===!0&&Ve.setGlobalState(w.clippingPlanes,b.state.camera)):b=null,A.pop(),A.length>0?_=A[A.length-1]:_=null,I!==null&&I.renderEnd()};function qh(C,O,K,z){if(C.visible===!1)return;if(C.layers.test(O.layers)){if(C.isGroup)K=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(O);else if(C.isLightProbeGrid)b.pushLightProbeGrid(C);else if(C.isLight)b.pushLight(C),C.castShadow&&b.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||C.intersectsFrustum(ie)){z&&qe.setFromMatrixPosition(C.matrixWorld).applyMatrix4(fe);let Ne=te.update(C),Ce=C.material;Ce.visible&&_.push(C,Ne,Ce,K,qe.z,null,O)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||C.intersectsFrustum(ie))){let Ne=te.update(C),Ce=C.material;if(z&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),qe.copy(C.boundingSphere.center)):(Ne.boundingSphere===null&&Ne.computeBoundingSphere(),qe.copy(Ne.boundingSphere.center)),qe.applyMatrix4(C.matrixWorld).applyMatrix4(fe)),Array.isArray(Ce)){let Be=Ne.groups;for(let He=0,it=Be.length;He<it;He++){let ct=Be[He],Ue=Ce[ct.materialIndex];Ue&&Ue.visible&&_.push(C,Ne,Ue,K,qe.z,ct,O)}}else Ce.visible&&_.push(C,Ne,Ce,K,qe.z,null,O)}}let Re=C.children;for(let Ne=0,Ce=Re.length;Ne<Ce;Ne++)qh(Re[Ne],O,K,z)}function zd(C,O,K,z){let{opaque:H,transmissive:Re,transparent:Ne}=C;b.setupLightsView(K),le===!0&&Ve.setGlobalState(w.clippingPlanes,K),z&&T.viewport(ee.copy(z)),H.length>0&&Ha(H,O,K),Re.length>0&&Ha(Re,O,K),Ne.length>0&&Ha(Ne,O,K),T.buffers.depth.setTest(!0),T.buffers.depth.setMask(!0),T.buffers.color.setMask(!0),T.setPolygonOffset(!1)}function Hd(C,O,K,z){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[z.id]===void 0){let Ue=lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[z.id]=new dn(1,1,{generateMipmaps:!0,type:Ue?Ln:yn,minFilter:rs,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ot.workingColorSpace})}let Re=b.state.transmissionRenderTarget[z.id],Ne=z.viewport||ee;Re.setSize(Ne.z*w.transmissionResolutionScale,Ne.w*w.transmissionResolutionScale);let Ce=w.getRenderTarget(),Be=w.getActiveCubeFace(),He=w.getActiveMipmapLevel();w.setRenderTarget(Re),w.getClearColor(dt),rt=w.getClearAlpha(),rt<1&&w.setClearColor(16777215,.5),w.clear(),$e&&nt.render(K);let it=w.toneMapping;w.toneMapping=Zn;let ct=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),b.setupLightsView(z),le===!0&&Ve.setGlobalState(w.clippingPlanes,z),Ha(C,K,z),J.updateMultisampleRenderTarget(Re),J.updateRenderTargetMipmap(Re),lt.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let _t=0,Zt=O.length;_t<Zt;_t++){let Bt=O[_t],{object:Pt,geometry:hn,material:Fe,group:mn}=Bt;if(Fe.side===Tn&&Pt.layers.test(z.layers)){let mt=Fe.side;Fe.side=vn,Fe.needsUpdate=!0,kd(Pt,K,z,hn,Fe,mn),Fe.side=mt,Fe.needsUpdate=!0,Ue=!0}}Ue===!0&&(J.updateMultisampleRenderTarget(Re),J.updateRenderTargetMipmap(Re))}w.setRenderTarget(Ce,Be,He),w.setClearColor(dt,rt),ct!==void 0&&(z.viewport=ct),w.toneMapping=it}function Ha(C,O,K){let z=O.isScene===!0?O.overrideMaterial:null;for(let H=0,Re=C.length;H<Re;H++){let Ne=C[H],{object:Ce,geometry:Be,group:He}=Ne,it=Ne.material;it.allowOverride===!0&&z!==null&&(it=z),Ce.layers.test(K.layers)&&kd(Ce,O,K,Be,it,He)}}function kd(C,O,K,z,H,Re){I!==null&&H.isNodeMaterial&&I.setObject(C,H),C.onBeforeRender(w,O,K,z,H,Re),C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),H.onBeforeRender(w,O,K,z,C,Re),H.transparent===!0&&H.side===Tn&&H.forceSinglePass===!1?(H.side=vn,H.needsUpdate=!0,w.renderBufferDirect(K,O,z,H,C,Re),H.side=ns,H.needsUpdate=!0,w.renderBufferDirect(K,O,z,H,C,Re),H.side=Tn):w.renderBufferDirect(K,O,z,H,C,Re),C.onAfterRender(w,O,K,z,H,Re)}function ka(C,O,K){O.isScene!==!0&&(O=Xe);let z=V.get(C),H=b.state.lights,Re=b.state.shadowsArray,Ne=H.state.version,Ce=xe.getParameters(C,H.state,Re,O,K,b.state.lightProbeGridArray),Be=xe.getProgramCacheKey(Ce),He=z.programs;z.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?O.environment:null,z.fog=O.fog;let it=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;z.envMap=de.get(C.envMap||z.environment,it),z.envMapRotation=z.environment!==null&&C.envMap===null?O.environmentRotation:C.envMapRotation,He===void 0&&(C.addEventListener("dispose",ii),He=new Map,z.programs=He);let ct=He.get(Be);if(ct!==void 0){if(z.currentProgram===ct&&z.lightsStateVersion===Ne)return Wd(C,Ce),ct}else Ce.uniforms=xe.getUniforms(C),I!==null&&C.isNodeMaterial&&I.build(C,K,Ce),C.onBeforeCompile(Ce,w),ct=xe.acquireProgram(Ce,Be),He.set(Be,ct),z.uniforms=Ce.uniforms;let Ue=z.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ue.clippingPlanes=Ve.uniform),Wd(C,Ce),z.needsLights=Wg(C),z.lightsStateVersion=Ne,z.needsLights&&(Ue.ambientLightColor.value=H.state.ambient,Ue.lightProbe.value=H.state.probe,Ue.sunLights.value=H.state.sun,Ue.sunLightShadows.value=H.state.sunShadow,Ue.directionalLights.value=H.state.directional,Ue.directionalLightShadows.value=H.state.directionalShadow,Ue.spotLights.value=H.state.spot,Ue.spotLightShadows.value=H.state.spotShadow,Ue.rectAreaLights.value=H.state.rectArea,Ue.ltc_1.value=H.state.rectAreaLTC1,Ue.ltc_2.value=H.state.rectAreaLTC2,Ue.pointLights.value=H.state.point,Ue.pointLightShadows.value=H.state.pointShadow,Ue.hemisphereLights.value=H.state.hemi,Ue.sunShadowMatrix.value=H.state.sunShadowMatrix,Ue.sunShadowCascade.value=H.state.sunShadowCascade,Ue.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ue.spotLightMatrix.value=H.state.spotLightMatrix,Ue.spotLightMap.value=H.state.spotLightMap,Ue.pointShadowMatrix.value=H.state.pointShadowMatrix),z.lightProbeGrid=b.state.lightProbeGridArray.length>0,z.currentProgram=ct,z.uniformsList=null,ct}function Vd(C){if(C.uniformsList===null){let O=C.currentProgram.getUniforms();C.uniformsList=Gr.seqWithValue(O.seq,C.uniforms)}return C.uniformsList}function Wd(C,O){let K=V.get(C);K.outputColorSpace=O.outputColorSpace,K.batching=O.batching,K.batchingColor=O.batchingColor,K.instancing=O.instancing,K.instancingColor=O.instancingColor,K.instancingMorph=O.instancingMorph,K.skinning=O.skinning,K.morphTargets=O.morphTargets,K.morphNormals=O.morphNormals,K.morphColors=O.morphColors,K.morphTargetsCount=O.morphTargetsCount,K.numClippingPlanes=O.numClippingPlanes,K.numIntersection=O.numClipIntersection,K.vertexAlphas=O.vertexAlphas,K.vertexTangents=O.vertexTangents,K.toneMapping=O.toneMapping}function Hg(C,O){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;y.setFromMatrixPosition(O.matrixWorld);for(let K=0,z=C.length;K<z;K++){let H=C[K];if(H.texture!==null&&H.boundingBox.containsPoint(y))return H}return null}function kg(C,O,K,z,H){O.isScene!==!0&&(O=Xe),J.resetTextureUnits();let Re=O.fog,Ne=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?O.environment:null,Ce=re===null?w.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:ot.workingColorSpace,Be=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,He=de.get(z.envMap||Ne,Be),it=z.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,ct=!!K.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Ue=!!K.morphAttributes.position,_t=!!K.morphAttributes.normal,Zt=!!K.morphAttributes.color,Bt=Zn;z.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(Bt=w.toneMapping);let Pt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,hn=Pt!==void 0?Pt.length:0,Fe=V.get(z),mn=b.state.lights;if(le===!0&&(ue===!0||C!==Z)){let Ft=C===Z&&z.id===q;Ve.setState(z,C,Ft)}let mt=!1;z.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==mn.state.version||Fe.outputColorSpace!==Ce||H.isBatchedMesh&&Fe.batching===!1||!H.isBatchedMesh&&Fe.batching===!0||H.isBatchedMesh&&Fe.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&Fe.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&Fe.instancing===!1||!H.isInstancedMesh&&Fe.instancing===!0||H.isSkinnedMesh&&Fe.skinning===!1||!H.isSkinnedMesh&&Fe.skinning===!0||H.isInstancedMesh&&Fe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Fe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Fe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Fe.instancingMorph===!1&&H.morphTexture!==null||Fe.envMap!==He||z.fog===!0&&Fe.fog!==Re||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==Ve.numPlanes||Fe.numIntersection!==Ve.numIntersection)||Fe.vertexAlphas!==it||Fe.vertexTangents!==ct||Fe.morphTargets!==Ue||Fe.morphNormals!==_t||Fe.morphColors!==Zt||Fe.toneMapping!==Bt||Fe.morphTargetsCount!==hn||!!Fe.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Fe.__version=z.version);let Bn=Fe.currentProgram;mt===!0&&(Bn=ka(z,O,H),I&&z.isNodeMaterial&&I.onUpdateProgram(z,Bn,Fe));let si=!1,Vi=!1,rr=!1,Ct=Bn.getUniforms(),Jt=Fe.uniforms;if(T.useProgram(Bn.program)&&(si=!0,Vi=!0,rr=!0),z.id!==q&&(q=z.id,Vi=!0),Fe.needsLights){let Ft=Hg(b.state.lightProbeGridArray,H);Fe.lightProbeGrid!==Ft&&(Fe.lightProbeGrid=Ft,Vi=!0)}if(si||Z!==C){T.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ct.setValue(F,"projectionMatrix",C.projectionMatrix),Ct.setValue(F,"viewMatrix",C.matrixWorldInverse);let Xi=Ct.map.cameraPosition;Xi!==void 0&&Xi.setValue(F,me.setFromMatrixPosition(C.matrixWorld)),P.logarithmicDepthBuffer&&Ct.setValue(F,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&Ct.setValue(F,"isOrthographic",C.isOrthographicCamera===!0),Z!==C&&(Z=C,Vi=!0,rr=!0)}if(Fe.needsLights&&(mn.state.sunShadowMap.length>0&&Ct.setValue(F,"sunShadowMap",mn.state.sunShadowMap,J),mn.state.directionalShadowMap.length>0&&Ct.setValue(F,"directionalShadowMap",mn.state.directionalShadowMap,J),mn.state.spotShadowMap.length>0&&Ct.setValue(F,"spotShadowMap",mn.state.spotShadowMap,J),mn.state.pointShadowMap.length>0&&Ct.setValue(F,"pointShadowMap",mn.state.pointShadowMap,J)),H.isSkinnedMesh){Ct.setOptional(F,H,"bindMatrix"),Ct.setOptional(F,H,"bindMatrixInverse");let Ft=H.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),Ct.setValue(F,"boneTexture",Ft.boneTexture,J))}H.isBatchedMesh&&(Ct.setOptional(F,H,"batchingTexture"),Ct.setValue(F,"batchingTexture",H._matricesTexture,J),Ct.setOptional(F,H,"batchingIdTexture"),Ct.setValue(F,"batchingIdTexture",H._indirectTexture,J),Ct.setOptional(F,H,"batchingColorTexture"),H._colorsTexture!==null&&Ct.setValue(F,"batchingColorTexture",H._colorsTexture,J));let Wi=K.morphAttributes;if((Wi.position!==void 0||Wi.normal!==void 0||Wi.color!==void 0)&&B.update(H,K,Bn),(Vi||Fe.receiveShadow!==H.receiveShadow)&&(Fe.receiveShadow=H.receiveShadow,Ct.setValue(F,"receiveShadow",H.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&O.environment!==null&&(Jt.envMapIntensity.value=O.environmentIntensity),Jt.dfgLUT!==void 0&&(Jt.dfgLUT.value=j3()),Vi){if(Ct.setValue(F,"toneMappingExposure",w.toneMappingExposure),Fe.needsLights&&Vg(Jt,rr),Re&&z.fog===!0&&ke.refreshFogUniforms(Jt,Re),ke.refreshMaterialUniforms(Jt,z,ne,Y,b.state.transmissionRenderTarget[C.id]),Fe.needsLights&&Fe.lightProbeGrid){let Ft=Fe.lightProbeGrid;Jt.probesSH.value=Ft.texture,Jt.probesMin.value.copy(Ft.boundingBox.min),Jt.probesMax.value.copy(Ft.boundingBox.max),Jt.probesResolution.value.copy(Ft.resolution)}Gr.upload(F,Vd(Fe),Jt,J)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Gr.upload(F,Vd(Fe),Jt,J),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&Ct.setValue(F,"center",H.center),Ct.setValue(F,"modelViewMatrix",H.modelViewMatrix),Ct.setValue(F,"normalMatrix",H.normalMatrix),Ct.setValue(F,"modelMatrix",H.matrixWorld),z.uniformsGroups!==void 0){let Ft=z.uniformsGroups;for(let Xi=0,or=Ft.length;Xi<or;Xi++){let Qd=Ft[Xi];oe.update(Qd,Bn),oe.bind(Qd,Bn)}}return Bn}function Vg(C,O){C.ambientLightColor.needsUpdate=O,C.lightProbe.needsUpdate=O,C.sunLights.needsUpdate=O,C.sunLightShadows.needsUpdate=O,C.directionalLights.needsUpdate=O,C.directionalLightShadows.needsUpdate=O,C.pointLights.needsUpdate=O,C.pointLightShadows.needsUpdate=O,C.spotLights.needsUpdate=O,C.spotLightShadows.needsUpdate=O,C.rectAreaLights.needsUpdate=O,C.hemisphereLights.needsUpdate=O}function Wg(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return re},this.setRenderTargetTextures=function(C,O,K){let z=V.get(C);z.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),V.get(C.texture).__webglTexture=O,V.get(C.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:K,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,O){let K=V.get(C);K.__webglFramebuffer=O,K.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(C,O=0,K=0){re=C,W=O,k=K;let z=null,H=!1,Re=!1;if(C){let Ce=V.get(C);if(Ce.__useDefaultFramebuffer!==void 0){T.bindFramebuffer(F.FRAMEBUFFER,Ce.__webglFramebuffer),ee.copy(C.viewport),Ge.copy(C.scissor),Le=C.scissorTest,T.viewport(ee),T.scissor(Ge),T.setScissorTest(Le),q=-1;return}else if(Ce.__webglFramebuffer===void 0)J.setupRenderTarget(C);else if(Ce.__hasExternalTextures)J.rebindTextures(C,V.get(C.texture).__webglTexture,V.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){let it=C.depthTexture;if(Ce.__boundDepthTexture!==it){if(it!==null&&V.has(it)&&(C.width!==it.image.width||C.height!==it.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(C)}}let Be=C.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(Re=!0);let He=V.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(He[O])?z=He[O][K]:z=He[O],H=!0):C.samples>0&&J.useMultisampledRTT(C)===!1?z=V.get(C).__webglMultisampledFramebuffer:Array.isArray(He)?z=He[K]:z=He,ee.copy(C.viewport),Ge.copy(C.scissor),Le=C.scissorTest}else ee.copy(De).multiplyScalar(ne).floor(),Ge.copy(Ze).multiplyScalar(ne).floor(),Le=At;if(K!==0&&(z=N),T.bindFramebuffer(F.FRAMEBUFFER,z)&&T.drawBuffers(C,z),T.viewport(ee),T.scissor(Ge),T.setScissorTest(Le),H){let Ce=V.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ce.__webglTexture,K)}else if(Re){let Ce=O;for(let Be=0;Be<C.textures.length;Be++){let He=V.get(C.textures[Be]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Be,He.__webglTexture,K,Ce)}}else if(C!==null&&K!==0){let Ce=V.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ce.__webglTexture,K)}q=-1};function Xd(C){let O=V.get(C);return(O.__readFormat!==C.format||O.__readType!==C.type)&&(O.__readFormat=C.format,O.__readType=C.type,O.__formatReadable=P.textureFormatReadable(C.format),O.__typeReadable=P.textureTypeReadable(C.type)),O}this.readRenderTargetPixels=function(C,O,K,z,H,Re,Ne,Ce=0){if(!(C&&C.isWebGLRenderTarget)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Be=V.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ne!==void 0&&(Be=Be[Ne]),Be){T.bindFramebuffer(F.FRAMEBUFFER,Be);try{let He=C.textures[Ce],it=He.format,ct=He.type;C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ce);let Ue=Xd(He);if(Ue.__formatReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ue.__typeReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=C.width-z&&K>=0&&K<=C.height-H&&F.readPixels(O,K,z,H,Se.convert(it),Se.convert(ct),Re)}finally{let He=re!==null?V.get(re).__webglFramebuffer:null;T.bindFramebuffer(F.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(C,O,K,z,H,Re,Ne,Ce=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Be=V.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ne!==void 0&&(Be=Be[Ne]),Be)if(O>=0&&O<=C.width-z&&K>=0&&K<=C.height-H){T.bindFramebuffer(F.FRAMEBUFFER,Be);let He=C.textures[Ce],it=He.format,ct=He.type;C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ce);let Ue=Xd(He);if(Ue.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ue.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let _t=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,_t),F.bufferData(F.PIXEL_PACK_BUFFER,Re.byteLength,F.STREAM_READ),F.readPixels(O,K,z,H,Se.convert(it),Se.convert(ct),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let Zt=re!==null?V.get(re).__webglFramebuffer:null;T.bindFramebuffer(F.FRAMEBUFFER,Zt);let Bt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await lp(F,Bt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,_t),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Re),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(_t),F.deleteSync(Bt),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,O=null,K=0){let z=Math.pow(2,-K),H=Math.floor(C.image.width*z),Re=Math.floor(C.image.height*z),Ne=O!==null?O.x:0,Ce=O!==null?O.y:0;J.setTexture2D(C,0),F.copyTexSubImage2D(F.TEXTURE_2D,K,0,0,Ne,Ce,H,Re),T.unbindTexture()},this.copyTextureToTexture=function(C,O,K=null,z=null,H=0,Re=0){let Ne,Ce,Be,He,it,ct,Ue,_t,Zt,Bt=C.isCompressedTexture?C.mipmaps[Re]:C.image;if(K!==null)Ne=K.max.x-K.min.x,Ce=K.max.y-K.min.y,Be=K.isBox3?K.max.z-K.min.z:1,He=K.min.x,it=K.min.y,ct=K.isBox3?K.min.z:0;else{let Jt=Math.pow(2,-H);Ne=Math.floor(Bt.width*Jt),Ce=Math.floor(Bt.height*Jt),C.isDataArrayTexture?Be=Bt.depth:C.isData3DTexture?Be=Math.floor(Bt.depth*Jt):Be=1,He=0,it=0,ct=0}z!==null?(Ue=z.x,_t=z.y,Zt=z.z):(Ue=0,_t=0,Zt=0);let Pt=Se.convert(O.format),hn=Se.convert(O.type),Fe;O.isData3DTexture?(J.setTexture3D(O,0),Fe=F.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(J.setTexture2DArray(O,0),Fe=F.TEXTURE_2D_ARRAY):(J.setTexture2D(O,0),Fe=F.TEXTURE_2D),T.activeTexture(F.TEXTURE0),T.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,O.flipY),T.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),T.pixelStorei(F.UNPACK_ALIGNMENT,O.unpackAlignment);let mn=T.getParameter(F.UNPACK_ROW_LENGTH),mt=T.getParameter(F.UNPACK_IMAGE_HEIGHT),Bn=T.getParameter(F.UNPACK_SKIP_PIXELS),si=T.getParameter(F.UNPACK_SKIP_ROWS),Vi=T.getParameter(F.UNPACK_SKIP_IMAGES);T.pixelStorei(F.UNPACK_ROW_LENGTH,Bt.width),T.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Bt.height),T.pixelStorei(F.UNPACK_SKIP_PIXELS,He),T.pixelStorei(F.UNPACK_SKIP_ROWS,it),T.pixelStorei(F.UNPACK_SKIP_IMAGES,ct);let rr=C.isDataArrayTexture||C.isData3DTexture,Ct=O.isDataArrayTexture||O.isData3DTexture;if(C.isDepthTexture){let Jt=V.get(C),Wi=V.get(O),Ft=V.get(Jt.__renderTarget),Xi=V.get(Wi.__renderTarget);T.bindFramebuffer(F.READ_FRAMEBUFFER,Ft.__webglFramebuffer),T.bindFramebuffer(F.DRAW_FRAMEBUFFER,Xi.__webglFramebuffer);for(let or=0;or<Be;or++)rr&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,V.get(C).__webglTexture,H,ct+or),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,V.get(O).__webglTexture,Re,Zt+or)),F.blitFramebuffer(He,it,Ne,Ce,Ue,_t,Ne,Ce,F.DEPTH_BUFFER_BIT,F.NEAREST);T.bindFramebuffer(F.READ_FRAMEBUFFER,null),T.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(H!==0||C.isRenderTargetTexture||V.has(C)){let Jt=V.get(C),Wi=V.get(O);T.bindFramebuffer(F.READ_FRAMEBUFFER,D),T.bindFramebuffer(F.DRAW_FRAMEBUFFER,U);for(let Ft=0;Ft<Be;Ft++)rr?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Jt.__webglTexture,H,ct+Ft):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Jt.__webglTexture,H),Ct?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Wi.__webglTexture,Re,Zt+Ft):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Wi.__webglTexture,Re),H!==0?F.blitFramebuffer(He,it,Ne,Ce,Ue,_t,Ne,Ce,F.COLOR_BUFFER_BIT,F.NEAREST):Ct?F.copyTexSubImage3D(Fe,Re,Ue,_t,Zt+Ft,He,it,Ne,Ce):F.copyTexSubImage2D(Fe,Re,Ue,_t,He,it,Ne,Ce);T.bindFramebuffer(F.READ_FRAMEBUFFER,null),T.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Ct?C.isDataTexture||C.isData3DTexture?F.texSubImage3D(Fe,Re,Ue,_t,Zt,Ne,Ce,Be,Pt,hn,Bt.data):O.isCompressedArrayTexture?F.compressedTexSubImage3D(Fe,Re,Ue,_t,Zt,Ne,Ce,Be,Pt,Bt.data):F.texSubImage3D(Fe,Re,Ue,_t,Zt,Ne,Ce,Be,Pt,hn,Bt):C.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Re,Ue,_t,Ne,Ce,Pt,hn,Bt.data):C.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Re,Ue,_t,Bt.width,Bt.height,Pt,Bt.data):F.texSubImage2D(F.TEXTURE_2D,Re,Ue,_t,Ne,Ce,Pt,hn,Bt);T.pixelStorei(F.UNPACK_ROW_LENGTH,mn),T.pixelStorei(F.UNPACK_IMAGE_HEIGHT,mt),T.pixelStorei(F.UNPACK_SKIP_PIXELS,Bn),T.pixelStorei(F.UNPACK_SKIP_ROWS,si),T.pixelStorei(F.UNPACK_SKIP_IMAGES,Vi),Re===0&&O.generateMipmaps&&F.generateMipmap(Fe),T.unbindTexture()},this.initRenderTarget=function(C){V.get(C).__webglFramebuffer===void 0&&J.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?J.setTextureCube(C,0):C.isData3DTexture?J.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?J.setTexture2DArray(C,0):J.setTexture2D(C,0),T.unbindTexture()},this.resetState=function(){W=0,k=0,re=null,T.reset(),Pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}};var Fi=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),u.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x), u.y); }
float vnoise3(vec3 p){ vec3 i=floor(p), f=fract(p); vec3 u=f*f*(3.-2.*f);
  float a=hash13(i), b=hash13(i+vec3(1,0,0)), c=hash13(i+vec3(0,1,0)), d=hash13(i+vec3(1,1,0));
  float e=hash13(i+vec3(0,0,1)), f1=hash13(i+vec3(1,0,1)), g=hash13(i+vec3(0,1,1)), h=hash13(i+vec3(1,1,1));
  return mix(mix(mix(a,b,u.x),mix(c,d,u.x),u.y), mix(mix(e,f1,u.x),mix(g,h,u.x),u.y), u.z); }
float fbm(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*vnoise(p); p=m*p; a*=.5;} return s; }
float fbm3(vec3 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*vnoise3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5;} return s; }
float ridge(vec2 p){ float s=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ s+=a*(1.-abs(vnoise(p)*2.-1.)); p=m*p; a*=.5;} return s; }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float luma(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
`,Qp=`
float fibres(vec2 p, float seed){
  float s = 0.;
  for(int i=0;i<4;i++){
    float fi = float(i);
    float ang = hash12(vec2(seed, fi))*6.2831;
    vec2 q = rot(ang) * p * (0.010 + fi*0.004);
    q.x *= 0.12;                                   // stretch => long fibres
    float n = vnoise(q*vec2(1.,14.) + fi*17.);
    s += smoothstep(0.80, 0.98, n) * (0.55 - fi*0.08);
  }
  return s;
}
vec3 washi(vec2 p, vec3 base, out float h){
  float m = fbm(p*0.0022) ;                         // big cloudy density
  float m2 = fbm(p*0.011 + 7.);
  float fb = fibres(p, 3.) + fibres(p*1.7+31., 9.)*0.6;
  float fleck = smoothstep(0.985, 1.0, hash12(floor(p*0.5))) * step(0.6, vnoise(p*0.02));
  float grain = hash12(floor(p)) - .5;
  h = m*0.6 + m2*0.3 + fb*0.5 + grain*0.15;
  vec3 c = base;
  c *= 0.93 + 0.10*m + 0.05*m2;                    // density mottling
  c = mix(c, c*vec3(1.04,1.02,0.97), fb*0.8);       // fibres catch light
  c *= 1. - fleck*0.35;
  c += grain*0.025;
  return c;
}
`,Kp=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }
`;var Y3=new Yn(2,2),Z3=new Os(-1,1,1,-1,0,1),It=class{constructor(e,t={},i={}){this.material=new Et({vertexShader:i.vert||Kp,fragmentShader:(i.noNoise?"":Fi)+e,uniforms:t,depthTest:!1,depthWrite:!1,transparent:!!i.transparent,blending:i.blending??is}),this.u=this.material.uniforms,this.mesh=new zt(Y3,this.material),this.mesh.frustumCulled=!1,this.scene=new Di,this.scene.add(this.mesh)}render(e,t=null,i=!0){e.setRenderTarget(t),i&&e.clear(),e.render(this.scene,Z3)}},wf={hdr:!0};function qp(n){let e=n.getContext();return wf.hdr=!!(e.getExtension("EXT_color_buffer_float")||e.getExtension("EXT_color_buffer_half_float")),wf}function Oi(n,e,t={}){let i=new dn(n,e,{type:t.type??(wf.hdr?Ln:yn),format:wn,minFilter:Gt,magFilter:Gt,depthBuffer:t.depth??!1,samples:t.samples??0,generateMipmaps:!1});return i.texture.colorSpace=Cn,i}var Hr=class{constructor(e,t){this.canvas=document.createElement("canvas"),this.canvas.width=e,this.canvas.height=t,this.ctx=this.canvas.getContext("2d"),this.tex=new Ds(this.canvas),this.tex.colorSpace=Cn,this.tex.minFilter=Gt,this.tex.magFilter=Gt,this.tex.generateMipmaps=!1,this.w=e,this.h=t}resize(e,t){e===this.w&&t===this.h||(this.canvas.width=this.w=e,this.canvas.height=this.h=t,this.tex.dispose(),this.tex=new Ds(this.canvas),this.tex.colorSpace=Cn,this.tex.minFilter=Gt,this.tex.generateMipmaps=!1)}begin(e=!0){let t=this.ctx;return t.setTransform(1,0,0,1,0,0),t.globalAlpha=1,t.globalCompositeOperation="source-over",t.filter="none",t.shadowBlur=0,t.shadowColor="rgba(0,0,0,0)",t.lineWidth=1,t.lineCap="butt",t.lineJoin="miter",t.textAlign="start",t.textBaseline="alphabetic","letterSpacing"in t&&(t.letterSpacing="0px"),e&&(t.clearRect(0,0,this.w,this.h),t.fillStyle="rgba(0,0,0,0.004)",t.fillRect(0,0,1,1)),t.fillStyle="#000",t.strokeStyle="#000",t.setTransform(this.w/1920,0,0,this.h/1080,0,0),t}end(){this.tex.needsUpdate=!0}},Tf=[];function ha(n){return Tf[n]||(Tf[n]=new Hr(1920,1080)),Tf[n]}function ks(n,e=!0){let t=new Ds(n);return t.colorSpace=Cn,t.minFilter=Gt,t.magFilter=Gt,t.generateMipmaps=!1,t.needsUpdate=!0,t}var $3=`
uniform sampler2D tA, tB; uniform float uP, uType, uAngle, uTime; uniform vec2 uRes;
varying vec2 vUv;
// type 0: cut/crossfade  1: blade slash (diagonal split, halves slide)  2: ink bleed
//      3: white flash dip  4: radial iris  5: vertical shutter slices  6: glitch blocks
void main(){
  vec2 uv = vUv; float p = uP; vec3 c;
  vec2 asp = vec2(uRes.x/uRes.y, 1.);
  if(uType < 0.5){
    c = mix(texture2D(tA,uv).rgb, texture2D(tB,uv).rgb, p);
  } else if(uType < 1.5){
    // blade: line through center at uAngle; A splits & slides away along the line, B revealed behind
    vec2 n = vec2(cos(uAngle), sin(uAngle));
    vec2 q = (uv-.5)*asp;
    float side = sign(dot(q, n));
    vec2 tdir = vec2(-n.y, n.x);
    float e = p*p*(3.-2.*p);
    vec2 off = tdir * side * e * 1.4 + n*side*e*0.08;
    vec2 uvA = uv - off/asp;
    float gap = abs(dot(q,n)) - e*0.02;
    vec3 a = texture2D(tA, uvA).rgb;
    vec3 b = texture2D(tB, uv).rgb;
    float inA = step(0., uvA.x)*step(uvA.x,1.)*step(0.,uvA.y)*step(uvA.y,1.);
    float cutLine = exp(-abs(dot(q,n))*900.) * (1.-e) * step(0.001, p);
    c = mix(b, a, inA*step(0., gap));
    c += vec3(1.,.95,.9)*cutLine*4.;
  } else if(uType < 2.5){
    // ink bleed: fbm threshold front moving through
    float n = fbm(uv*asp*3.5 + 3.1) * .55 + fbm(uv*asp*18.)*.18;
    float front = mix(-0.3, 1.2, p);
    float g = (1.-uv.y)*0.45 + n;
    float m = smoothstep(front-0.03, front+0.03, g);
    float edge = smoothstep(0.06,0.,abs(g-front));
    c = mix(texture2D(tB,uv).rgb, texture2D(tA,uv).rgb, m);
    c *= 1. - edge*0.55;
  } else if(uType < 3.5){
    float w = 1.-abs(p*2.-1.);
    c = p < .5 ? texture2D(tA,uv).rgb : texture2D(tB,uv).rgb;
    c = mix(c, vec3(1.,.98,.95), smoothstep(0.,1.,w)*1.2);
  } else if(uType < 4.5){
    float r = length((uv-.5)*asp);
    float m = smoothstep(p*1.05-0.01, p*1.05+0.01, r);
    c = mix(texture2D(tB,uv).rgb, texture2D(tA,uv).rgb, m);
    c += vec3(1.,.8,.5) * exp(-abs(r-p*1.05)*120.) * (1.-p);
  } else if(uType < 5.5){
    float k = floor(uv.x*14.);
    float d = hash12(vec2(k,3.))*0.35;
    float lp = clamp((p - d)/(1.-0.35), 0., 1.);
    float m = step(uv.y, lp*lp*(3.-2.*lp));
    c = mix(texture2D(tA,uv).rgb, texture2D(tB,uv).rgb, m);
  } else {
    vec2 blk = floor(uv*vec2(24.,14.));
    float r = hash12(blk + floor(uTime*30.));
    float m = step(r, p);
    vec2 o = (hash22(blk)-.5)*0.04*(1.-abs(p*2.-1.));
    c = mix(texture2D(tA,uv+o).rgb, texture2D(tB,uv-o).rgb, m);
  }
  gl_FragColor = vec4(c,1.);
}`,eS=`
uniform sampler2D tIn; uniform float uThresh, uKnee; varying vec2 vUv;
void main(){
  vec3 c = texture2D(tIn, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  float soft = clamp(br - uThresh + uKnee, 0., 2.*uKnee); soft = soft*soft/(4.*uKnee+1e-4);
  float w = max(soft, br-uThresh)/max(br,1e-4);
  gl_FragColor = vec4(c*w, 1.);
}`,tS=`
uniform sampler2D tIn; uniform vec2 uTexel; varying vec2 vUv;
void main(){
  vec2 o = uTexel;
  vec3 s = texture2D(tIn, vUv).rgb*4.;
  s += texture2D(tIn, vUv+vec2(-o.x,-o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,-o.y)).rgb;
  s += texture2D(tIn, vUv+vec2(-o.x,o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,o.y)).rgb;
  gl_FragColor = vec4(s/8., 1.);
}`,nS=`
uniform sampler2D tIn, tBase; uniform vec2 uTexel; uniform float uMix; varying vec2 vUv;
void main(){
  vec2 o = uTexel;
  vec3 s = texture2D(tIn, vUv+vec2(-o.x*2.,0.)).rgb + texture2D(tIn, vUv+vec2(o.x*2.,0.)).rgb
         + texture2D(tIn, vUv+vec2(0.,-o.y*2.)).rgb + texture2D(tIn, vUv+vec2(0.,o.y*2.)).rgb;
  s += (texture2D(tIn, vUv+vec2(-o.x,o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,o.y)).rgb
      + texture2D(tIn, vUv+vec2(-o.x,-o.y)).rgb + texture2D(tIn, vUv+vec2(o.x,-o.y)).rgb)*2.;
  gl_FragColor = vec4(s/12. + texture2D(tBase, vUv).rgb*uMix, 1.);
}`,iS=`
uniform sampler2D tIn; uniform vec2 uCenter; uniform float uDecay, uLen; varying vec2 vUv;
void main(){
  vec2 d = (vUv - uCenter) * uLen / 40.;
  vec2 uv = vUv; vec3 s = vec3(0.); float w = 1.;
  float j = hash12(gl_FragCoord.xy);
  uv -= d*j;
  for(int i=0;i<40;i++){ uv -= d; s += texture2D(tIn, uv).rgb * w; w *= uDecay; }
  gl_FragColor = vec4(s/20., 1.);
}`,sS=`
uniform sampler2D tScene, tBloom, tRays;
uniform vec2 uRes; uniform float uTime;
uniform float uBloom, uRays, uCA, uGrain, uVig, uExposure, uFlash, uInvert, uSat, uContrast, uHue, uGlitch, uScan;
uniform vec3 uFlashCol, uLift, uGain, uTint;
varying vec2 vUv;
vec3 hueShift(vec3 c, float h){
  const vec3 k = vec3(0.57735);
  float ca = cos(h);
  return c*ca + cross(k,c)*sin(h) + k*dot(k,c)*(1.-ca);
}
void main(){
  vec2 uv = vUv;
  // glitch: horizontal block displacement
  if(uGlitch > 0.001){
    float row = floor(uv.y*48.);
    float r = hash12(vec2(row, floor(uTime*24.)));
    uv.x += (r-.5) * step(1.-uGlitch*0.6, r) * 0.08 * uGlitch;
  }
  vec2 dc = uv - .5;
  float ca = uCA * 0.7 * (0.3 + dot(dc,dc)*2.4);
  vec3 col;
  col.r = texture2D(tScene, uv + dc*ca).r;
  col.g = texture2D(tScene, uv).g;
  col.b = texture2D(tScene, uv - dc*ca).b;
  col += texture2D(tBloom, uv).rgb * uBloom;
  col += texture2D(tRays, uv).rgb * uRays;
  col *= uExposure;
  // filmic shoulder
  col = col / (1. + max(col - 1., 0.) * 0.6);
  // grade
  col = uLift + col * uGain;
  col *= uTint;
  float L = luma(col);
  col = mix(vec3(L), col, uSat);
  col = (col - .5) * uContrast + .5;
  if(abs(uHue) > 0.001) col = hueShift(col, uHue);
  // flash & invert
  col = mix(col, uFlashCol, clamp(uFlash,0.,1.));
  col = mix(col, 1. - col, uInvert);
  // vignette
  float v = smoothstep(1.15, 0.25, length(dc*vec2(1.,.82))*1.25);
  col *= mix(1., v, uVig);
  // scanline / print grain
  col += (hash12(gl_FragCoord.xy + fract(uTime*7.)*517.) - .5) * uGrain;
  col *= 1. - uScan * (0.5+0.5*sin(gl_FragCoord.y*3.14159));
  gl_FragColor = vec4(clamp(col,0.,1.), 1.);
}`,nh=class{constructor(e){this.r=e,this.mix=new It($3,{tA:{value:null},tB:{value:null},uP:{value:0},uType:{value:0},uAngle:{value:.5},uTime:{value:0},uRes:{value:new ae(1,1)}}),this.bright=new It(eS,{tIn:{value:null},uThresh:{value:.72},uKnee:{value:.25}}),this.down=new It(tS,{tIn:{value:null},uTexel:{value:new ae}}),this.up=new It(nS,{tIn:{value:null},tBase:{value:null},uTexel:{value:new ae},uMix:{value:1}}),this.rays=new It(iS,{tIn:{value:null},uCenter:{value:new ae(.5,.6)},uDecay:{value:.96},uLen:{value:.5}}),this.final=new It(sS,{tScene:{value:null},tBloom:{value:null},tRays:{value:null},uRes:{value:new ae(1,1)},uTime:{value:0},uBloom:{value:.9},uRays:{value:0},uCA:{value:.004},uGrain:{value:.05},uVig:{value:.6},uExposure:{value:1},uFlash:{value:0},uInvert:{value:0},uSat:{value:1},uContrast:{value:1},uHue:{value:0},uGlitch:{value:0},uScan:{value:0},uFlashCol:{value:new Ae(1,.98,.95)},uLift:{value:new Ae(0,0,0)},uGain:{value:new Ae(1,1,1)},uTint:{value:new Ae(1,1,1)}}),this.levels=6,this.setSize(2,2)}setSize(e,t){this.w=e,this.h=t;let i=o=>o&&o.forEach(a=>a.dispose());i(this.mips),i(this.ups),this.rtA?.dispose(),this.rtB?.dispose(),this.rtMix?.dispose(),this.rtRays?.dispose(),this.rtA=Oi(e,t,{depth:!0}),this.rtB=Oi(e,t,{depth:!0}),this.rtMix=Oi(e,t),this.mips=[],this.ups=[];let s=Math.max(1,e>>1),r=Math.max(1,t>>1);for(let o=0;o<this.levels;o++)this.mips.push(Oi(s,r)),this.ups.push(Oi(s,r)),s=Math.max(1,s>>1),r=Math.max(1,r>>1);this.rtRays=Oi(Math.max(1,e>>2),Math.max(1,t>>2)),this.mix.u.uRes.value.set(e,t),this.final.u.uRes.value.set(e,t)}transition(e,t,i,s){let r=this.mix.u;return r.tA.value=this.rtA.texture,r.tB.value=this.rtB.texture,r.uP.value=t,r.uType.value=e,r.uAngle.value=i,r.uTime.value=s,this.mix.render(this.r,this.rtMix),this.rtMix}render(e,t){let i=this.r;this.bright.u.tIn.value=e.texture,this.bright.u.uThresh.value=t.bloomThresh??.92,this.bright.render(i,this.mips[0]);for(let o=1;o<this.levels;o++){let a=this.mips[o-1];this.down.u.tIn.value=a.texture,this.down.u.uTexel.value.set(1/a.width,1/a.height),this.down.render(i,this.mips[o])}let s=this.mips[this.levels-1];for(let o=this.levels-2;o>=0;o--)this.up.u.tIn.value=s.texture,this.up.u.tBase.value=this.mips[o].texture,this.up.u.uTexel.value.set(1/s.width,1/s.height),this.up.render(i,this.ups[o]),s=this.ups[o];(t.rays??0)>.001&&(this.rays.u.tIn.value=this.mips[1].texture,this.rays.u.uCenter.value.set(t.raysX??.5,t.raysY??.6),this.rays.u.uLen.value=t.raysLen??.55,this.rays.render(i,this.rtRays));let r=this.final.u;r.tScene.value=e.texture,r.tBloom.value=s.texture,r.tRays.value=this.rtRays.texture,r.uTime.value=t.time,r.uBloom.value=t.bloom??.9,r.uRays.value=t.rays??0,r.uCA.value=t.ca??.004,r.uGrain.value=t.grain??.05,r.uVig.value=t.vig??.6,r.uExposure.value=t.exposure??1,r.uFlash.value=t.flash??0,r.uInvert.value=t.invert??0,r.uSat.value=t.sat??1,r.uContrast.value=t.contrast??1,r.uHue.value=t.hue??0,r.uGlitch.value=t.glitch??0,r.uScan.value=t.scan??0,r.uFlashCol.value.set(t.flashCol??16775922),r.uLift.value.setRGB(...t.lift??[0,0,0]),r.uGain.value.setRGB(...t.gain??[1,1,1]),r.uTint.value.setRGB(...t.tint??[1,1,1]),this.final.render(i,null)}};var Jp="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Mw1ii3MkKwtmjWAhJRFnjVAgHw5ojEMeGgxqizsdFgpsizYbEwhtijIbKgltiy8aIyNtjS4ZHh1uji8ZGRlvjjIZFRVxjjUYEhJ1jDgYDw94iTsYDQx5h0MZCwp3hlMaJQlwh2gcOQdoiX0eMA5ji44gKQxhjJkiIgpijJ4kHQ5ojJ0lGAxxjJQkOhR5jIUiNhF9jHggLg54iHQdJwxngHscIQpLcoscHAgvXZwdFwcdRqogFAYWM7MjEQURJLgnDgQOGrcpIgMMFrQqHAMMFbEpGAILFLAoFAILFLImEQILFbQjPgELFrUiNQEMF7QhLQEMFrMhJgINFbEiIAINErEjGwEMEbAjIQEMEKwiHAEMEaggFw0LEqQeFAsLEaIcEQkLEaEaDgcLD6AXDAYKDp8WCgULDJ0UCAQLC5oRIAQLCZcOGwMLCJAMFgIKB4cJEwIJBnoGEBUIBWsEDSwIBFsCCyUHBEwBCR8HAz0BCBoGAy8ABxYFAiMABhMEARkABRAEARAABA0DAQoAAwsDAQcAAwkCAQUAAggCAAQAAgcCAAMAAQUCAAMAAQUCAAMAAQQCAAMAAQMCAAMAAAMCAAMAAAICAAMAAAICAQMAAAECAQMAAAICAQMAAAICAQMAAAICAAMAAAECAAMAAAECAAMAAAMCAAMAAAICAAMAAAICAAMAAAECAAMAAAECAAIAAAECAAIAAAECAAIAAAECAAIAAAECAAIAAAECAAIAAAACAAIAAAECAAIAAAACAAIAAAACAAIAAAECAAIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAECAQIAAAECAQIAAAECAQIAAAMCAQIAAAICAQIAAAIDAQIAAAIDAQIAAAEDAQIAAAEDAQIAAAECAQIAAAECAQIAAAACAQIAAAACAQIAAAACAQIAAAECAQIAAAMCAQIAAAMCAQIAAAICAQIAAAICAQIAAAICAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAEDAQIAAAMDAQIAAAIDAQIAAAIDAQIAAAIDAQIAAAEDAQIAAAEDAQIAAAECAQIAAAECAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAICAQIAAAICAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAACAQIAAAACAQIAAAACAQIAAAUCAQIAAAcDAQIAAAYDAQIAAAUDAQIAAAQDAQIAAAQDAQIAAAMCAQIAAAICAQIAAAICAQIAAAICAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAACAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAACAQIAAAECAQIAAAMCAQIAAAICAQIAAAICAQIAAAICAQIAAAEDAQIAAAEDAQIAAAECAQIAAAICAQIAAAICAQIAAAICAQIAAAECAQIAAAECAQIAAAECAQIAAAECAQIAAAUCAQIAAAQCAQIAAAMDAQIAAAMDAQIAAgIDAQIAAwIDAQIABAEDCAIAGh8IFAYA//8UFA8A1+MTFA4A",ih=[.033,.233,.533,.717,.95,1.117,1.417,1.65,2.117,2.333,2.617,2.817,3.033,3.317,3.517,3.733,3.9,4.217,4.433,4.9,5.133,5.4,5.617,5.8,6.017,6.283,6.483,6.7,6.85,7.05,7.467,7.733,8.183,8.65,8.817,9.05,9.3,9.65,9.883,10.033,10.467,10.633,10.95,11.167,11.45,11.85,12.067,12.45,12.8,12.967,13.217,13.65,13.85,14,14.333,14.7,14.917,15.083,15.333,15.733,16.1,16.25,16.667,17.067,17.367,17.783,18.017,18.483,19.05,19.2,19.417,19.583,19.967,20.15,20.317,20.65,20.8,20.967,21.283,21.483,21.683,22.383,22.717,22.9,23.383,23.567,23.717,23.917,24.083,24.267,24.533,24.833,25.183,25.517,25.683,25.883,26.217,26.517,26.717,26.867,27.4,27.933,28.117,28.3,28.45,28.933,29.15,29.5,29.667,29.85,30.117,30.367,30.733,31.067,31.75,31.933,32.15,32.45,32.867,33.083,33.317,33.517,34.05,34.3,34.533,34.75,35.117,35.267,36,36.333,36.667,37.55,37.867,38.083,38.367,38.583,39.117,39.633,39.917,40.333,40.717,41.25,41.6,41.9,42.267,42.567,42.983,43.467,43.85,44,44.167,44.317,44.717,45.217,45.8,46.1,46.25,46.433,47.183,47.483,48,48.35,48.517,49.217,49.4,49.733,49.9,50.283,50.8,51.033,51.7,52,52.35,52.517,52.717,52.9,53.417,53.767,53.95,54.15,54.983,55.35,55.55,55.817,56.017,56.25,56.6,57.1,57.617,57.95,58.4,58.683,59.4,59.683,60.117,60.417,60.683,61.05,61.433,61.65,61.9,62.567,62.8,62.983,63.183,63.617,63.883,64.167,64.517,65.283,65.583,65.75,65.95,66.467,67.017,67.183,67.433,67.583,67.75,68.017,68.333,68.55,68.75,69.083,69.367,69.567,69.767,70.817,71.083,71.333,71.567,71.833,72.067,72.583,72.75,73,73.333,73.783,73.983,74.167,74.333,74.517,74.7,74.9,75.367,75.783,76.6,76.95,77.133,77.633,78.183,78.383,78.75,78.917,79.367,79.75,79.917,80.25,80.967,82.183,82.55,82.717,82.883,83.067,83.483,83.783,84.3,84.45,84.8,84.983,85.317,85.483,86,86.2,86.55,87.067,87.383,87.6,87.767,88.117,88.3,88.5,88.8,89.017,89.333,89.85,90.1,90.4,90.95,91.25,92.5,92.833,93.183,93.533,93.8,94.117,94.517,94.7,94.917,95.2,95.45,95.783,96.15,96.517,96.667,97.2,97.4,97.717,98.067,98.8,98.95,99.3,99.483,99.983,100.517,101.033,101.25,101.733,102.117,102.65,103,103.3,103.467,103.667,104.383,104.617,104.85,105.233,105.383,105.55,106.1,106.267,106.6,107.2,107.483,107.683,107.833,108.567,108.867,109.4,109.767,109.917,110.6,110.783,111.133,111.3,111.683,112.183,112.867,113.1,113.4,113.75,113.917,114.117,114.3,114.633,114.8,115.15,115.35,115.517,115.667,116.383,116.55,116.75,117.017,117.233,117.4,117.767,118.2,118.467,118.833,118.983,119.183,119.35,119.5,120.033,120.267,120.567,121.233,121.617,121.783,121.967,122.133,122.317,122.85,123.017,123.367,124.033,124.383,124.6,124.917,125.117,125.267,125.617,125.817,126.15,126.483,126.817,127.2,127.533,127.717,127.9,128.1,128.417,128.567,128.933,129.183,129.633,129.967,130.167,130.517,131.2,131.433,131.717,132.4,132.783,132.95,133.3,133.483,134,134.233,134.533,134.85,135,135.2,135.55,135.75,136.083,136.617,136.8,136.95,137.133,137.483,137.65,138.033,138.183,138.433,138.7,138.917,139.1,139.267,139.517,139.767,141,141.4,141.683,141.983,142.35,142.583,142.983,143.267,143.533,143.75,143.983,144.183,144.35,144.7,145.033,145.367,145.717,146.05,146.217,146.367,146.567,146.833,147.05,147.233,147.467,147.933,149.35,150.7,151.017,151.25,151.6,152.333,152.483,153,153.217,153.533,153.883,154.617,154.767,155.083,155.267,155.8,156.317,156.567,156.85,157.55,157.917,158.067,158.317,158.467,158.817,159.117,159.467,160.183,160.433,160.667,161.05,161.217,161.367,161.6,161.917,162.2,162.417,162.683,163,163.167,163.467,163.65,164.133,164.383,164.683,165.217,165.567,165.733,166.417,166.617,166.95,167.117,167.5,168,168.25,168.917,169.217,169.55,169.733,169.933,170.1,170.433,170.617,170.983,171.15,171.483,171.65,171.85,172.05,172.267,172.617,172.8,173,173.767,174.167,174.45,174.833,175.133,175.433,175.617,175.833,176.267,176.417,176.817,177.25,177.483,177.783,178.133,181.133],Cf=[.017,.35,.717,1.417,1.65,2.117,2.367,2.633,2.8,3.05,3.35,3.667,4.2,4.9,5.417,5.6,6.383,6.533,6.683,7.017,7.433,7.7,7.983,8.2,8.383,9.083,9.333,9.783,10.483,11.167,11.333,11.517,11.683,11.867,12.1,12.367,12.517,12.75,12.9,13.067,13.25,13.583,13.967,14.133,14.317,14.483,14.667,15.2,15.7,16.067,16.233,16.75,16.917,17.083,17.267,17.45,17.85,18.083,18.483,18.683,18.833,19.183,19.55,19.7,19.883,20.05,20.25,21.033,21.283,21.433,21.9,22.333,22.683,22.867,23.033,23.267,23.55,23.733,23.9,24.067,24.25,24.417,24.767,25.133,25.3,25.483,25.633,25.833,26.183,26.35,26.5,26.683,26.85,27.217,27.4,27.717,27.917,28.083,28.267,28.45,28.617,28.983,29.317,29.467,29.65,29.85,30,30.35,30.717,30.883,31.05,31.233,31.4,31.583,31.75,31.917,32.1,32.367,32.867,33.017,33.25,33.5,34.017,34.2,35.083,35.25,35.6,35.933,36.283,36.65,37,37.517,37.85,38.117,38.383,38.867,39.183,39.617,39.783,40.217,40.833,41.183,41.5,41.833,42.567,43.1,43.267,43.433,43.783,43.983,44.317,45.017,45.367,45.883,46.067,46.267,46.567,46.75,47.45,47.983,48.15,48.333,48.5,49.017,49.367,49.55,49.9,50.067,50.25,50.767,50.95,51.467,52.233,53.033,53.55,53.917,54.083,54.267,54.7,55.017,55.333,55.55,55.8,56.367,56.533,57.05,57.233,57.4,57.567,57.717,57.917,58.117,58.267,58.45,58.617,58.8,59.133,59.317,59.517,59.683,59.833,60.183,60.533,60.7,61.4,61.583,61.75,61.917,62.1,62.45,62.65,62.817,62.983,63.15,63.483,63.85,64.183,64.367,64.55,64.7,64.9,65.25,65.6,65.75,65.917,66.283,66.467,66.667,66.967,67.167,67.317,67.517,67.683,68.033,68.383,68.533,68.733,69.067,69.433,69.583,69.767,69.95,70.117,70.3,70.483,70.833,71.017,71.167,71.333,71.517,71.717,71.867,72.05,72.233,72.417,72.567,72.75,72.917,73.117,73.267,73.633,73.783,73.967,74.15,74.317,74.65,74.867,75.15,75.35,75.533,75.7,75.883,76.05,76.417,76.583,76.767,76.933,77.1,77.45,77.633,77.833,78.133,78.317,78.483,78.683,78.85,79.367,79.883,80.233,80.583,80.933,81.117,81.283,81.467,81.633,82,82.167,82.5,82.7,82.85,83.033,83.383,83.55,83.733,84.25,84.433,84.783,85.1,85.483,85.817,86.183,86.517,87.05,87.217,87.567,87.917,88.267,88.617,88.783,89.2,89.833,90.017,90.35,91.067,91.233,91.4,91.767,92.1,92.45,92.8,93.15,93.5,94.1,94.25,94.567,94.883,95.417,95.6,96.1,96.483,96.65,96.983,97.283,97.683,97.883,98.033,98.267,98.683,98.9,99.25,99.433,99.783,100.2,100.483,101.183,101.6,102.217,102.567,102.883,103.267,103.617,103.867,104.167,104.483,104.667,104.833,105.183,105.367,105.533,105.717,106.367,106.55,106.75,107.283,107.65,107.8,107.967,108.15,108.85,109.367,109.55,109.733,109.9,110.417,110.767,110.933,111.283,111.467,111.65,112.167,112.333,112.667,112.867,113.25,113.733,114.433,114.95,115.3,115.483,115.817,116.033,116.3,116.55,116.733,117.05,117.217,117.75,117.917,118.433,118.8,118.967,119.317,119.483,120.017,120.217,120.533,120.7,120.9,121.233,121.567,121.75,122.1,122.283,122.8,123.333,123.5,124.017,124.367,124.55,124.9,125.067,125.583,125.783,126.117,126.283,126.467,126.633,126.817,127.167,127.333,127.683,127.867,128.317,129.083,129.617,129.967,130.133,130.3,130.467,130.667,131.167,131.683,131.883,132.05,132.2,132.4,132.75,132.917,133.117,133.267,133.433,133.967,134.133,134.5,134.667,134.967,135.35,135.517,135.85,136.067,136.533,136.767,136.933,137.083,137.267,137.633,137.8,138.133,138.333,138.5,138.833,139.167,139.333,139.55,140.217,140.483,140.9,141.167,141.467,141.717,141.867,142.1,142.333,142.7,143.033,143.267,143.567,143.733,143.917,144.1,144.417,144.983,145.133,145.483,145.917,146.183,146.35,146.533,146.883,147.25,147.533,147.75,147.917,148.417,148.617,149.317,149.467,150.683,151.483,151.7,151.917,152.3,152.8,153.067,153.5,153.85,154.083,154.717,155.067,155.25,155.6,156.383,156.817,157,157.517,158.033,158.383,158.883,159.083,159.783,160.3,160.483,160.65,161,161.517,162,162.4,162.567,163.1,163.467,163.967,164.467,164.667,165.183,165.367,165.717,166.233,166.583,166.767,167.1,167.283,167.45,167.983,168.15,168.683,169.317,169.55,170.25,170.767,171.117,171.3,171.783,172.167,172.333,172.867,173.733,174.15,174.433,174.65,174.833,175.133,175.383,175.633,175.833,176.367,176.533,176.817,177.1,177.633,178.467,181.133],kr=[{sec:"v1",text:"\u30ED\u30B6\u30EA\u30AA \u5DFB\u304D\u3064\u3051\u305F\u30CD\u30C3\u30AF",t0:11.1,t1:13.45,c:[11.18,11.49,11.8,11.95,12.09,12.24,12.48,12.62,12.74,12.9,13.04,13.38,13.44]},{sec:"v1",text:"\u8056\u6B4C\u304C\u3086\u304C\u3093\u3067\u59CB\u307E\u308B",t0:13.45,t1:16.6,c:[13.44,14.12,14.8,14.98,15.16,15.34,15.53,15.72,15.98,16.38]},{sec:"v1",text:"\u3072\u3087\u3046\u305F\u3093\u306B\u6708\u3092\u3072\u3068\u3064",t0:16.6,t1:19.4,c:[16.66,17.16,17.18,17.24,17.4,17.6,17.78,18.08,18.38,18.52,18.62]},{sec:"v1",text:"\u5F7C\u5973\u306F\u7B11\u3063\u3066\u6B4C\u3044\u51FA\u3059",t0:19.45,t1:22.25,c:[19.52,20,20.24,20.48,20.88,21.09,21.3,21.56,21.84,22]},{sec:"pre1",text:"\u30D9\u30FC\u30B9\u304C\u4E0B\u3092\u9019\u3046\u3088\u3046\u306B",t0:22.25,t1:25.2,c:[22.32,22.76,22.82,22.92,23.18,23.44,23.64,23.8,23.9,24.07,24.23]},{sec:"pre1",text:"\u7948\u308A\u306E\u8A00\u8449\u306E\u3088\u3046\u306B",t0:25.3,t1:27.55,c:[25.36,25.84,26.08,26.14,26.4,26.88,27.04,27.23,27.43]},{sec:"pre1",text:"\u63FA\u308C\u308B\u7389\u97FF \u9AD8\u9CF4\u308B\u9F13\u52D5",t0:27.55,t1:30.05,c:[27.62,27.94,28.26,28.41,28.57,28.73,28.88,29.2,29.5,29.72,29.96]},{sec:"pre1",text:"\u4E94\u3064\u306E\u540D\u524D\u304C \u3072\u3068\u3064\u306E\u97F3\u306B\u306A\u308B",t0:30.05,t1:33.5,c:[30.2,30.88,31.22,31.48,31.84,31.96,32.05,32.13,32.21,32.3,32.6,32.8,32.98,33.21,33.44]},{sec:"ch1",text:"\u3055\u3042 \u30AB\u30DF\u30CA\u30EC",t0:33.6,t1:35.95,c:[33.7,34,34.3,34.6,34.89,35.19,35.49]},{sec:"ch1",text:"\u7A7A\u307E\u3067\u3086\u304C\u307E\u305B\u3066",t0:35.95,t1:38.35,c:[36.02,36.46,36.65,36.83,37,37.18,37.37,37.56]},{sec:"ch1",text:"\u8AB0\u306E\u795E\u3060\u3063\u3066\u69CB\u308F\u306A\u3044",t0:38.35,t1:40.85,c:[38.44,38.92,39.24,39.44,39.76,39.9,40.04,40.38,40.72,40.82]},{sec:"ch1",text:"\u30B5\u30D3\u3067\u306F\u5B97\u6D3E\u3082\u8981\u3089\u306A\u3044",t0:40.85,t1:44,c:[40.92,41.24,41.36,41.53,41.87,42.22,42.56,42.84,43.14,43.28,43.73]},{sec:"ch1",text:"\u3055\u3042 \u30AB\u30DF\u30CA\u30EC",t0:44.1,t1:46.42,c:[44.18,45.5,45.67,45.85,46.02,46.2,46.38]},{sec:"ch1",text:"\u5C11\u5973\u306E\u58F0\u304C\u30E4\u30A4\u30D0\u306B\u306A\u3063\u3066",t0:46.42,t1:49,c:[46.44,46.54,46.64,46.84,47.1,47.3,47.51,47.72,47.92,48.2,48.48,48.8]},{sec:"ch1",text:"\u6C88\u9ED9\u3092\u5207\u308A\u88C2\u3044\u3066",t0:49,t1:52.6,c:[49.12,49.72,50.02,50.92,51.44,51.78,51.92,52.09]},{sec:"ch1",text:"\u79C1\u305F\u3061\u304C\u79C1\u305F\u3061\u306E\u795E",t0:52.6,t1:56.5,c:[52.8,53.42,53.62,53.88,54.39,54.89,55.14,55.4,55.52]},{sec:"post",text:"\u3055\u3042 \u3055\u3042",t0:57.5,t1:59.9,c:[57.6,57.85,58.11,58.36,58.78]},{sec:"post",text:"\u56DB\u62CD\u5B50\u306E\u4E2D \u8AB0\u3082\u304C\u5E73\u7B49",t0:60.1,t1:65.2,c:[60.26,60.56,60.86,61.16,61.34,62.39,63.44,63.64,63.9,64.23,64.56]},{sec:"v2",text:"\u30B9\u30C6\u30A3\u30C3\u30AF\u306F\u516B\u8292\u661F",t0:65.8,t1:68.95,c:[65.9,66.36,66.5,66.56,66.68,66.8,67.23,67.66,68.08]},{sec:"v2",text:"\u30C4\u30FC\u30D0\u30B9\u3067\u591C\u3092\u7815\u3044\u3066",t0:68.95,t1:72.5,c:[69.08,69.23,69.38,69.48,69.68,69.96,70.28,70.52,70.77,71.01]},{sec:"v2",text:"\u30EA\u30FC\u30C9\u306F\u767D\u3044\u9CE9\u306B\u306A\u3063\u3066",t0:72.6,t1:75.5,c:[72.72,73.28,73.37,73.46,73.66,74.02,74.26,74.5,74.76,75.02,75.32]},{sec:"v2",text:"\u796D\u58C7\u304B\u3089\u97F3\u306E\u58C1\u3078",t0:75.5,t1:78.05,c:[75.62,76.05,76.48,76.63,76.78,77.14,77.42,77.55]},{sec:"v2",text:"\u304A\u7D4C\u3068\u5F26\u3092\u9CF4\u3089\u3057\u3066",t0:78.05,t1:80.8,c:[78.18,78.49,78.79,79.09,79.4,79.7,79.84,80.08,80.22]},{sec:"v2",text:"\u540C\u3058\u632F\u52D5\u3092\u4FE1\u3058\u3066\u308B",t0:80.8,t1:83.4,c:[80.94,81.48,81.7,81.92,82.14,82.5,82.78,83.04,83.18]},{sec:"pre2",text:"\u9055\u3046\u540D\u524D \u9055\u3046\u7948\u308A",t0:83.4,t1:86.4,c:[83.48,83.77,84.06,84.38,84.8,85.22,85.39,85.56,85.86]},{sec:"pre2",text:"\u540C\u3058\u30B5\u30D3\u3067\u51FA\u4F1A\u3046",t0:86.4,t1:88.45,c:[86.52,86.72,86.86,87,87.14,87.46,87.68,87.88]},{sec:"pre2",text:"\u8AB0\u3082\u982D\u3092\u4E0B\u3052\u306A\u304F\u3066\u3044\u3044",t0:88.45,t1:91.4,c:[88.54,89.12,89.38,89.78,90.1,90.3,90.48,90.65,90.83,91.02,91.25]},{sec:"pre2",text:"\u5F26\u306F\u3059\u3079\u3066\u306E\u4FE1\u5FC3\u3092\u77E5\u3063\u3066\u308B",t0:91.4,t1:94.65,c:[91.48,91.86,92.06,92.26,92.46,92.7,92.89,93.07,93.26,93.56,94.16,94.36,94.56]},{sec:"ch2",text:"\u3055\u3042 \u30AB\u30DF\u30CA\u30EC",t0:94.65,t1:97.45,c:[94.76,95.44,95.69,95.94,96.19,96.45,96.7]},{sec:"ch2",text:"\u7A7A\u307E\u3067\u3086\u304C\u307E\u305B\u3066",t0:97.45,t1:99.7,c:[97.56,97.86,98.05,98.23,98.42,98.6,98.77,98.94]},{sec:"ch2",text:"\u8AB0\u306E\u795E\u3060\u3063\u3066\u69CB\u308F\u306A\u3044",t0:99.7,t1:102.2,c:[99.82,100.3,100.56,100.88,101.16,101.26,101.36,101.68,102.1,102.2]},{sec:"ch2",text:"\u30B5\u30D3\u3067\u306F\u5B97\u6D3E\u3082\u8981\u3089\u306A\u3044",t0:102.2,t1:105.45,c:[102.2,102.49,102.78,103.07,103.36,103.65,103.94,104.24,104.5,104.66,105.12]},{sec:"ch2",text:"\u3055\u3042 \u30AB\u30DF\u30CA\u30EC",t0:105.45,t1:107.75,c:[105.58,106.4,106.63,106.86,107.09,107.33,107.56]},{sec:"ch2",text:"\u5C11\u5973\u306E\u58F0\u304C\u30E4\u30A4\u30D0\u306B\u306A\u3063\u3066",t0:107.75,t1:110.4,c:[107.8,107.91,108.02,108.24,108.48,108.7,108.93,109.16,109.38,109.63,109.88,110.18]},{sec:"ch2",text:"\u6C88\u9ED9\u3092\u5207\u308A\u88C2\u3044\u3066",t0:110.4,t1:114.1,c:[110.48,111.04,111.4,112.32,112.86,113.3,113.32,113.76]},{sec:"ch2",text:"\u79C1\u305F\u3061\u304C\u79C1\u305F\u3061\u306E\u795E",t0:114.1,t1:117.6,c:[114.2,114.74,115.06,115.26,115.98,116.22,116.52,116.76,116.98]},{sec:"br",text:"\u3082\u3057\u660E\u65E5 \u58F0\u3092\u6BBA\u305B\u3068\u8A00\u308F\u308C\u3066\u3082",t0:137.6,t1:141.45,c:[137.78,138.09,138.41,138.72,139.03,139.35,139.66,139.94,140.18,140.44,140.56,140.74,140.96,141.09,141.22]},{sec:"br",text:"\u7B11\u3044\u58F0\u3082 \u97F3\u91CF\u3082",t0:141.45,t1:143.75,c:[141.54,142.22,142.58,142.78,142.88,142.98,143.08,143.42]},{sec:"br",text:"\u6559\u4F1A\u3054\u3068 \u795E\u6BBF\u3054\u3068",t0:143.75,t1:146.85,c:[143.82,144.82,145.28,145.46,145.6,145.74,146.09,146.44,146.7]},{sec:"br",text:"\u4E38\u3054\u3068\u30B9\u30C6\u30FC\u30B8\u306B\u4E57\u305B\u3066\u3084\u308B",t0:146.85,t1:150.4,c:[146.94,147.2,147.42,147.64,147.74,148.1,148.28,148.46,148.68,148.9,149.03,149.16,149.82]},{sec:"fc",text:"\u3055\u3042 \u30AB\u30DF\u30CA\u30EC",t0:150.5,t1:153.3,c:[150.68,151.16,151.49,151.82,152.16,152.49,152.82]},{sec:"fc",text:"\u7A7A\u307E\u3067\u3086\u304C\u307E\u305B\u3066",t0:153.3,t1:155.5,c:[153.36,153.72,153.89,154.07,154.24,154.42,154.59,154.76]},{sec:"fc",text:"\u8AB0\u306E\u795E\u3060\u3063\u3066\u69CB\u308F\u306A\u3044",t0:155.5,t1:158.1,c:[155.62,156.08,156.44,156.66,156.96,157.08,157.2,157.48,157.9,158.06]},{sec:"fc",text:"\u3053\u306E\u62CD\u306E\u4E0A \u8AB0\u3082\u304C\u5E73\u7B49",t0:158.1,t1:161.65,c:[158.22,158.76,158.98,159.21,159.43,159.66,159.88,160.28,160.62,160.95,161.29]},{sec:"fc",text:"\u3055\u3042 \u30AB\u30DF\u30CA\u30EC",t0:161.65,t1:163.75,c:[161.74,162.48,162.71,162.94,163.18,163.41,163.64]},{sec:"fc",text:"\u5C11\u5973\u306E\u58F0\u304C\u30E4\u30A4\u30D0\u306B\u306A\u3063\u3066",t0:163.75,t1:166.25,c:[163.8,163.93,164.06,164.19,164.32,164.53,164.74,164.95,165.16,165.42,165.68,166.01]},{sec:"fc",text:"\u6C88\u9ED9\u3092\u5207\u308A\u88C2\u3044\u3066",t0:166.25,t1:169.9,c:[166.34,166.92,167.16,168.12,168.66,169.08,169.1,169.27]},{sec:"fc",text:"\u79C1\u305F\u3061\u304C\u79C1\u305F\u3061\u306E\u795E",t0:169.9,t1:173.3,c:[170.02,170.64,170.9,171.1,171.76,172.04,172.36,172.52,172.72]},{sec:"out",text:"\u6700\u5F8C\u306E\u97F3\u7B26\u304C\u843D\u3061\u3066",t0:173.3,t1:175.55,c:[173.38,173.62,173.86,174.08,174.3,174.52,174.8,175.04,175.22]},{sec:"out",text:"\u9418\u306E\u4F59\u97FB\u3060\u3051\u304C\u6B8B\u308B",t0:175.55,t1:178.6,c:[175.66,176.06,176.3,176.54,176.78,177.14,177.5,177.86,178.22]}];var se=(n,e=0,t=1)=>n<e?e:n>t?t:n,ce=(n,e,t)=>n+(e-n)*t,rS=(n,e,t)=>se((t-n)/(e-n));var be=Math.PI*2;function jp(n,e,t,i=.2,s=.2){return n<=e||n>=t?0:Math.min(i>0?se((n-e)/i):1,s>0?se((t-n)/s):1)}var Oe={linear:n=>n,inQuad:n=>n*n,outQuad:n=>1-(1-n)*(1-n),inOutQuad:n=>n<.5?2*n*n:1-Math.pow(-2*n+2,2)/2,inCubic:n=>n*n*n,outCubic:n=>1-Math.pow(1-n,3),inOutCubic:n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,outQuart:n=>1-Math.pow(1-n,4),inQuart:n=>n*n*n*n,inOutQuart:n=>n<.5?8*n*n*n*n:1-Math.pow(-2*n+2,4)/2,outExpo:n=>n>=1?1:1-Math.pow(2,-10*n),inExpo:n=>n<=0?0:Math.pow(2,10*n-10),inOutExpo:n=>n<=0?0:n>=1?1:n<.5?Math.pow(2,20*n-10)/2:(2-Math.pow(2,-20*n+10))/2,outBack:(n,e=1.70158)=>1+(e+1)*Math.pow(n-1,3)+e*Math.pow(n-1,2),outElastic:n=>n<=0?0:n>=1?1:Math.pow(2,-10*n)*Math.sin((n*10-.75)*(2*Math.PI/3))+1},ge=(n,e,t,i=Oe.outCubic)=>i(rS(n,e,t));function at(n){return n=(n|0)^2654435769,n=Math.imul(n^n>>>16,2246822507),n=Math.imul(n^n>>>13,3266489909),n^=n>>>16,(n>>>0)/4294967296}var Vr=(n,e)=>at(Math.imul(n|0,73856093)^Math.imul(e|0,19349663));function Vt(n=1){let e=n>>>0||1,t=()=>{e|=0,e=e+1831565813|0;let i=Math.imul(e^e>>>15,1|e);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296};return t.range=(i,s)=>i+(s-i)*t(),t.int=(i,s)=>Math.floor(i+(s-i+1)*t()),t.pick=i=>i[Math.floor(t()*i.length)],t.gauss=()=>{let i=0;for(let s=0;s<4;s++)i+=t();return(i-2)/.577},t}function ls(n,e=0){let t=Math.floor(n),i=n-t,s=i*i*(3-2*i);return ce(Vr(t,e),Vr(t+1,e),s)*2-1}function Rf(n,e,t=0){let i=Math.floor(n),s=Math.floor(e),r=n-i,o=e-s,a=r*r*(3-2*r),c=o*o*(3-2*o),l=t*7919,h=Vr(i+l,s),d=Vr(i+1+l,s),u=Vr(i+l,s+1),f=Vr(i+1+l,s+1);return ce(ce(h,d,a),ce(u,f,a),c)*2-1}function ua(n,e=0,t=4){let i=.5,s=0,r=1;for(let o=0;o<t;o++)s+=i*ls(n*r,e+o*31),r*=2.03,i*=.5;return s}var Tt=n=>.0638+n*.348837,xt=n=>(n-.0638)/.348837;var Ni=(n,e=1,t=6)=>{let i=xt(n)/e,s=i-Math.floor(i);return i<0?0:Math.exp(-s*t)},ut={intro:[0,Tt(32)],v1:[Tt(32),Tt(64)],pre1:[Tt(64),Tt(96)],ch1:[Tt(96),Tt(160)],post:[Tt(160),Tt(188)],v2:[Tt(188),Tt(240)],pre2:[Tt(240),Tt(272)],ch2:[Tt(272),Tt(336)],inter:[Tt(336),Tt(368)],solo:[Tt(368),Tt(394)],freeze:[Tt(394),Tt(400)],bridge:[Tt(400),Tt(432)],fc:[Tt(432),Tt(496)],outro:[Tt(496),181.161]},Bi=Tt(15),fa=[["intro","INTRO","\u5E8F"],["v1","VERSE I","\u58F1"],["pre1","PRE","\u6607"],["ch1","CHORUS","\u795E\u9CF4"],["post","POST","\u62CD"],["v2","VERSE II","\u5F10"],["pre2","PRE","\u6607"],["ch2","CHORUS","\u795E\u9CF4"],["inter","INTERLUDE","\u7E04"],["solo","SOLO","\u9CE9"],["bridge","BRIDGE","\u71C8"],["fc","FINAL","\u795E\u9CF4"],["outro","OUTRO","\u9418"]],If=(()=>{let n=atob(Jp),e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e})(),aS=Math.floor(If.length/6);function rh(n,e){let t=se(e*60,0,aS-1.001),i=Math.floor(t),s=t-i;return(If[i*6+n]*(1-s)+If[(i+1)*6+n]*s)/255}var da=n=>rh(2,n),pa=n=>rh(3,n),oh=n=>rh(4,n),Wr=n=>rh(5,n);function Zp(n,e){let t=0,i=n.length-1,s=-1;for(;t<=i;){let r=t+i>>1;n[r]<=e?(s=r,t=r+1):i=r-1}return s}var ah=n=>{let e=Zp(ih,n);return e<0?99:n-ih[e]},lS=n=>{let e=Zp(Cf,n);return e<0?99:n-Cf[e]},Dt=(n,e=9)=>Math.exp(-ah(n)*e),cs=(n,e=9)=>Math.exp(-lS(n)*e),hs=ih;var an=n=>kr.filter(e=>e.sec===n);ot.enabled=!1;var cS=`
uniform sampler2D tHud; uniform float uA; varying vec2 vUv;
void main(){ vec4 c = texture2D(tHud, vUv); gl_FragColor = vec4(c.rgb, c.a*uA); }`,lh=class{constructor({shots:e,scenes:t,hud:i,capture:s}){this.shots=e,this.sceneDefs=t,this.hudDraw=i,this.capture=s,this.t=0,this.playing=!1,this.quality=1,this.debug=/[?&]debug/.test(location.search)}async init(e){let t=this.stage=document.getElementById("stage"),i=this.canvas=document.createElement("canvas");i.id="gl",t.prepend(i);let s=this.renderer=new $c({canvas:i,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!!this.capture});qp(s),s.outputColorSpace=Rs,s.autoClear=!1,s.setClearColor(0,1),this.post=new nh(s),this.hud=new Hr(1280,720),this.hudPass=new It(cS,{tHud:{value:this.hud.tex},uA:{value:1}},{transparent:!0,noNoise:!0}),this.resize(),window.addEventListener("resize",()=>this.resize()),this.scenes={};let r=Object.keys(this.sceneDefs),o=0;for(let a of r){let c=performance.now(),l=new this.sceneDefs[a](this);await l.init?.(),this.capture&&console.log(`init ${a} ${(performance.now()-c).toFixed(0)}ms`),this.scenes[a]=l,o++,e?.(o/r.length,a),await new Promise(h=>setTimeout(h,0))}for(let a of this.capture?[]:r){let c=this.shots.find(l=>l.scene===a);c&&this.renderScene(a,(c.t0+c.t1)/2,this.post.rtA)}}resize(){let t=this.stage.getBoundingClientRect().width||window.innerWidth,i=Math.min(window.devicePixelRatio||1,2),s=1920*this.quality,r=Math.min(Math.round(t*i),s);this.capture&&(r=this.capture.width||1280);let o=Math.round(r*9/16);this.rw=r,this.rh=o,this.renderer.setPixelRatio(1),this.renderer.setSize(r,o,!1),this.canvas.style.width="100%",this.canvas.style.height="100%",this.post.setSize(r,o);let a=Math.min(r,1920),c=Math.round(a*9/16);this.hud.resize(a,c),this.hudPass.u.tHud.value=this.hud.tex;for(let l of Object.values(this.scenes||{}))l.resize?.(r,o)}shotAt(e){let t=this.shots,i=0;for(let s=0;s<t.length;s++)e>=t[s].t0&&(i=s);return i}renderScene(e,t,i){let s=this.scenes[e];return this.renderer.setRenderTarget(i),this.renderer.setClearColor(0,1),this.renderer.clear(!0,!0,!0),s.render(t,i)||{}}frame(e){let t=this.shotAt(e),i=this.shots[t],s=this.shots[t-1],r=i.tin,o,a,c=this.shots[t+1],l=c?.tin;if(l&&l.pre&&e>c.t0-l.pre){let d=se((e-(c.t0-l.pre))/(l.pre+(l.post||0))),u=this.renderScene(i.scene,e,this.post.rtA),f=this.renderScene(c.scene,e,this.post.rtB);o=this.post.transition(l.type,d,l.angle??.6,e),a=d<.5?u:f}else if(s&&r&&r.post&&e<i.t0+r.post){let d=se((e-(i.t0-(r.pre||0)))/((r.pre||0)+r.post)),u=this.renderScene(s.scene,e,this.post.rtA),f=this.renderScene(i.scene,e,this.post.rtB);o=this.post.transition(r.type,d,r.angle??.6,e),a=d<.5?u:f}else a=this.renderScene(i.scene,e,this.post.rtA),o=this.post.rtA;let h=a.hud??1;if(h>.001&&!this.hideHud){let d=this.hud.begin();this.hudDraw(d,e,a,this),this.hud.end(),this.hudPass.u.uA.value=h,this.hudPass.render(this.renderer,o,!1)}a.time=e,this.post.render(o,a),this.lastFx=a}attachAudio(e){this.audio=e,this.syncT=0,this.syncPerf=performance.now(),e.addEventListener("play",()=>{this.playing=!0,this.resync()}),e.addEventListener("pause",()=>{this.playing=!1,this.resync()}),e.addEventListener("seeked",()=>this.resync()),e.addEventListener("ended",()=>{this.playing=!1,this.onEnded?.()})}resync(){this.syncT=this.audio.currentTime,this.syncPerf=performance.now()}clockTime(){if(!this.audio)return this.t;let e=this.audio.currentTime;if(!this.playing)return e;let t=this.syncT+(performance.now()-this.syncPerf)/1e3;return Math.abs(t-e)>.08&&(this.syncT=e,this.syncPerf=performance.now(),t=e),t}start(){let e=()=>{requestAnimationFrame(e),this.t=se(this.clockTime(),0,181.161),this.frame(this.t),this.onTick?.(this.t)};e()}renderAt(e){this.t=e,this.frame(e)}chapterAt(e){let t=fa[0];for(let i of fa)e>=ut[i[0]][0]&&(t=i);return t}beatInfo(e){let t=Math.max(0,Math.floor(xt(e)));return{bar:Math.floor(t/4)+1,beat:t%4+1}}};var _e={mincho:"KMincho",minchoB:"KMinchoB",gothic:"KGothic",brush:"KBrush",syuku:"KSyuku",black:"KBlack",serif:"KSerif",mono:"KMono",dot:"KDot"};async function $p(){let n=window.KAMINARE_FONTS||{},e=Object.entries(n).map(async([t,i])=>{try{let s=new FontFace(t,`url(data:font/woff2;base64,${i})`);await s.load(),document.fonts.add(s)}catch(s){console.warn("font failed",t,s)}});await Promise.all(e)}var Te=(n,e,t="")=>`${t?t+" ":""}${Math.round(e*100)/100}px ${n}, "Hiragino Mincho ProN", "Yu Mincho", serif`,hS=new Set("\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308E\u30A1\u30A3\u30A5\u30A7\u30A9\u30C3\u30E3\u30E5\u30E7\u30EE\u30F5\u30F6"),uS=new Set("\u30FC\u2015\u2026\u301C-\u2014()\uFF08\uFF09\u300C\u300D\u300E\u300F[]"),fS=new Set("\u3001\u3002\uFF0C\uFF0E");function Xr(n,e,t,i,s){uS.has(e)?(n.save(),n.translate(t,i),n.rotate(Math.PI/2),n.fillText(e,0,0),n.restore()):hS.has(e)?n.fillText(e,t+s*.1,i-s*.1):fS.has(e)?n.fillText(e,t+s*.6,i-s*.55):n.fillText(e,t,i)}function ln(n,e,t,i,s=1.08){let r=[],o=t;for(let a=0;a<n.length;a++){let c=n[a];if(c===" "||c==="\u3000"){o+=i*.6;continue}r.push({ch:c,x:e,y:o+i*.5,i:a}),o+=i*s}return r}function Ht(n,e,t,i,s,r=0,o="center"){let a=[],c=[...e].map(d=>d===" "?s*.45:n.measureText(d).width+r),l=c.reduce((d,u)=>d+u,0)-r,h=o==="center"?t-l/2:o==="right"?t-l:t;return[...e].forEach((d,u)=>{d!==" "&&a.push({ch:d,x:h+c[u]/2,y:i,i:u,w:c[u]}),h+=c[u]}),a.total=l,a}var vt={ink(n,e,t,i,s=!0){if(t<=0)return;let r=Oe.outCubic(t);n.save(),n.globalAlpha*=se(t*2.2),n.translate(e.x,e.y);let o=1.18-.18*r;n.scale(o,o),t<.9&&(n.filter=`blur(${((1-r)*i*.08).toFixed(1)}px)`),s?Xr(n,e.ch,0,0,i):n.fillText(e.ch,0,0),n.restore()},slam(n,e,t,i,s=!1){if(t<=0)return;let r=Oe.outExpo(t);n.save(),n.globalAlpha*=se(t*4),n.translate(e.x,e.y);let o=1+(1-r)*1.6;n.scale(o,o),s?Xr(n,e.ch,0,0,i):n.fillText(e.ch,0,0),n.restore()},rise(n,e,t,i,s=!1){if(t<=0)return;let r=Oe.outQuart(t);n.save(),n.beginPath(),n.rect(e.x-i,e.y-i*.62,i*2,i*1.24),n.clip(),n.translate(e.x,e.y+(1-r)*i*1.1),s?Xr(n,e.ch,0,0,i):n.fillText(e.ch,0,0),n.restore()},flick(n,e,t,i,s=!1){t<=0||!(t>.6||at(Math.floor(t*24)+e.i*17)>.5)||(n.save(),n.translate(e.x,e.y),s?Xr(n,e.ch,0,0,i):n.fillText(e.ch,0,0),n.restore())}};function ft(n,e,t,i,s,r,o="left",a=.22){n.save(),n.font=Te(_e.mono,s),n.fillStyle=r,n.textBaseline="middle","letterSpacing"in n?(n.letterSpacing=`${s*a}px`,n.textAlign=o,n.fillText(e,t,i)):(n.textAlign=o,n.fillText(e.split("").join(" "),t,i)),n.restore()}var ma=(n,e=2)=>String(Math.floor(n)).padStart(e,"0");function em(n,e,t,i){let s=t.hudInk==="dark",r=s?"rgba(20,14,12,0.78)":"rgba(240,232,216,0.82)",o=s?"rgba(20,14,12,0.42)":"rgba(240,232,216,0.42)",a=t.hudShu||"#e3402a",c=46;n.save(),n.lineWidth=1.4,n.strokeStyle=o;let l=22;for(let[_,b,A,x]of[[c,c,1,1],[1920-c,c,-1,1],[c,1080-c,1,-1],[1920-c,1080-c,-1,-1]])n.beginPath(),n.moveTo(_-A*10,b),n.lineTo(_+A*l,b),n.moveTo(_,b-x*10),n.lineTo(_,b+x*l),n.stroke();n.beginPath(),n.arc(960,c,7,0,Math.PI*2),n.moveTo(948,c),n.lineTo(972,c),n.moveTo(960,c-12),n.lineTo(960,c+12),n.stroke(),n.fillStyle=r,n.textBaseline="middle",n.font=Te(_e.mincho,22),n.fillText("\u30AB\u30DF\u30CA\u30EC",c+34,c+2),ft(n,"KAMINARE  /  \u795E\u9CF4\u308C",c+140,c+2,13,o);let d=`${ma(e/60)}:${ma(e%60)}:${ma(e%1*24)}`;ft(n,d,1920-c-34,c+2,15,r,"right",.18);let u=Math.max(0,Math.floor(xt(e))),f=Math.floor(u/4)+1;ft(n,`BPM 172  \xB7  BAR ${ma(f,3)}.${u%4+1}`,1920-c-34,c+30,12,o,"right");let g=i.chapterAt(e),S=c+34,m=1080-c-36;n.fillStyle=a,n.globalAlpha=.92;let p=g[2].length>1?58:40;n.fillRect(S,m-20,p,40),n.globalAlpha=1,n.fillStyle="#f6efe2",n.font=Te(_e.mincho,g[2].length>1?21:24),n.textAlign="center",n.fillText(g[2],S+p/2,m+1),n.textAlign="left",ft(n,g[1],S+p+16,m-7,13,r);let v=0;for(let _=0;_<kr.length;_++)e>=kr[_].t0&&(v=_+1);ft(n,`LINE ${ma(v)}/${kr.length}`,S+p+16,m+13,11,o);let M=xt(e),y=Math.floor(M)%4;for(let _=0;_<4;_++){let b=1920-c-34-(3-_)*22,A=1080-c-30,x=_===y&&M>=0,E=x?se(1-(M-Math.floor(M))*1.5):0;n.beginPath(),n.arc(b,A,4+E*3,0,Math.PI*2),n.fillStyle=x?a:o,n.fill()}ft(n,`${(.348837*1e3).toFixed(0)} MS / BEAT`,1920-c-34,1080-c-6,11,o,"right"),n.restore()}var dS=`
uniform sampler2D tTex; uniform float uA; uniform vec3 uTint; uniform float uTintAmt;
uniform vec2 uOff; uniform float uScale, uRot; uniform float uWarp, uTime, uBoost;
varying vec2 vUv;
void main(){
  vec2 uv = (vUv - .5 - uOff) ;
  uv = rot(uRot) * (uv * vec2(16./9.,1.)) / vec2(16./9.,1.);
  uv = uv / uScale + .5;
  if(uWarp > 0.){
    uv.x += (fbm(vec2(uv.y*6., uTime*.7))-.5)*uWarp;
    uv.y += (fbm(vec2(uv.x*6.+9., uTime*.7))-.5)*uWarp*0.5;
  }
  vec4 c = texture2D(tTex, uv);
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.) c.a = 0.;
  c.rgb = mix(c.rgb, uTint, uTintAmt) * uBoost;
  gl_FragColor = vec4(c.rgb, c.a*uA);
}`,Nt=class{constructor(e=0){this.cl=ha(e),this.pass=new It(dS,{tTex:{value:this.cl.tex},uA:{value:1},uTint:{value:new Ae(1,1,1)},uTintAmt:{value:0},uOff:{value:new ae},uScale:{value:1},uRot:{value:0},uWarp:{value:0},uTime:{value:0},uBoost:{value:1}},{transparent:!0})}get ctx(){return this.cl.ctx}begin(){return this.cl.begin(!0)}draw(e,t,i={}){this.cl.end();let s=this.pass.u;s.tTex.value=this.cl.tex,s.uA.value=i.alpha??1,s.uOff.value.set(i.x??0,i.y??0),s.uScale.value=i.scale??1,s.uRot.value=i.rot??0,s.uWarp.value=i.warp??0,s.uTime.value=i.time??0,s.uTintAmt.value=i.tintAmt??0,s.uBoost.value=i.boost??1,i.tint&&s.uTint.value.set(i.tint),this.pass.render(e,t,!1)}},pS=`
${Qp}
uniform vec3 uBase, uDye; uniform float uDyeAmt, uDyeFront; uniform vec2 uPan; uniform float uZoom, uTime, uDark;
uniform vec2 uRes;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - .5) * vec2(1920., 1080.) / uZoom + uPan + vec2(960.,540.);
  float h;
  vec3 c = washi(p, uBase, h);
  // dye soak rising from bottom, fbm edge
  float n = fbm(p*0.004 + 3.) * 260. + fbm(p*0.02)*40.;
  float y = (1. - vUv.y) * 1080.;
  float front = uDyeFront;
  float m = smoothstep(front + 18., front - 18., 1080. - y + n - 130.);
  m = max(m, uDyeAmt);
  float edge = exp(-abs(1080. - y + n - 130. - front)*0.03) * (1.-uDyeAmt) * step(0.001, front+300.);
  vec3 dyed = washi(p + 77., uDye, h);
  c = mix(c, dyed, m);
  c = mix(c, uDye*0.55, edge*0.35);
  // light falloff (lamp)
  float v = 1. - length((vUv-.5)*vec2(1.,.8))*0.55;
  c *= mix(1., v, 0.8);
  c = mix(c, c*vec3(.18,.15,.14), uDark);
  gl_FragColor = vec4(c, 1.);
}`,vi=class{constructor(e="#ede4d3",t="#d63a24"){this.pass=new It(pS,{uBase:{value:new Ae(e)},uDye:{value:new Ae(t)},uDyeAmt:{value:0},uDyeFront:{value:-400},uPan:{value:new ae},uZoom:{value:1},uTime:{value:0},uDark:{value:0},uRes:{value:new ae(1920,1080)}})}draw(e,t,i={}){let s=this.pass.u;s.uPan.value.set(i.panX??0,i.panY??0),s.uZoom.value=i.zoom??1,s.uDyeAmt.value=i.dye??0,s.uDyeFront.value=i.dyeFront??-400,s.uDark.value=i.dark??0,i.base&&s.uBase.value.set(i.base),i.dyeCol&&s.uDye.value.set(i.dyeCol),this.pass.render(e,t,!1)}},mS=`
uniform sampler2D tCol, tTime; uniform float uProg, uSoft, uA, uWet; uniform vec3 uInk;
uniform vec4 uRect; // x,y,w,h in design px (y down)
uniform vec2 uPan; uniform float uZoom, uWarp, uWT;
varying vec2 vUv;
void main(){
  // design pixels, y down
  vec2 p = vec2((vUv.x - .5) * 1920., (.5 - vUv.y) * 1080.) / uZoom + uPan + vec2(960.,540.);
  p.y += sin(p.x*0.011 + uWT*5.) * uWarp * 22. + sin(p.x*0.031 - uWT*3.) * uWarp * 6.;
  p.x += sin(p.y*0.02 + uWT*4.) * uWarp * 8.;
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.) discard;
  uv.y = 1. - uv.y;
  vec4 c = texture2D(tCol, uv);
  float tm = texture2D(tTime, uv).r;
  float rev = clamp((uProg - tm) / uSoft, 0., 1.);
  float wet = 1. - clamp((uProg - tm) / uWet, 0., 1.);
  // fibre absorption: ink thins where paper is dense
  float fib = vnoise(p*vec2(0.9,0.08)) * vnoise(p*0.05);
  float a = c.a * rev * (0.9 + fib*0.15) * uA;
  vec3 ink = uInk * (1. - wet*0.5) + vec3(0.02,0.015,0.)*wet;
  gl_FragColor = vec4(mix(ink, c.rgb*0.25+ink*0.75, 0.5), a);
}`,Qr=class{constructor(e,t,i="#0f0c0b"){this.tc=ks(e.color),this.tt=ks(e.time),this.pass=new It(mS,{tCol:{value:this.tc},tTime:{value:this.tt},uProg:{value:1},uSoft:{value:.025},uWet:{value:.12},uA:{value:1},uInk:{value:new Ae(i)},uRect:{value:new Ot(...t)},uPan:{value:new ae},uZoom:{value:1},uWarp:{value:0},uWT:{value:0}},{transparent:!0})}draw(e,t,i,s={}){let r=this.pass.u;r.uProg.value=i,r.uA.value=s.alpha??1,r.uPan.value.set(s.panX??0,s.panY??0),r.uZoom.value=s.zoom??1,r.uWarp.value=s.warp??0,r.uWT.value=s.time??0,s.ink&&r.uInk.value.set(s.ink),s.rect&&r.uRect.value.set(...s.rect),this.pass.render(e,t,!1)}},gS=`
uniform sampler2D tCol; uniform float uProg, uA; uniform vec4 uRect; uniform vec2 uPan, uFrom; uniform float uZoom, uMul;
varying vec2 vUv;
void main(){
  vec2 p = vec2((vUv.x - .5) * 1920., (.5 - vUv.y) * 1080.) / uZoom + uPan + vec2(960.,540.);
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.) discard;
  float d = length((uv - uFrom) * vec2(uRect.z/uRect.w, 1.));
  float n = fbm(uv*7.) * 0.35 + fbm(uv*30.)*0.1;
  float v = d*1.2 + n;
  float m = smoothstep(uProg*1.9, uProg*1.9 - 0.08, v);
  m = uProg >= 1. ? 1. : m;
  uv.y = 1. - uv.y;
  vec4 c = texture2D(tCol, uv);
  gl_FragColor = vec4(c.rgb * uMul, c.a * m * uA);
}`,ga=class{constructor(e,t){this.tex=ks(e),this.pass=new It(gS,{tCol:{value:this.tex},uProg:{value:1},uA:{value:1},uRect:{value:new Ot(...t)},uPan:{value:new ae},uFrom:{value:new ae(.5,.5)},uZoom:{value:1},uMul:{value:1}},{transparent:!0})}draw(e,t,i,s={}){let r=this.pass.u;r.uProg.value=i,r.uA.value=s.alpha??1,r.uPan.value.set(s.panX??0,s.panY??0),r.uZoom.value=s.zoom??1,r.uMul.value=s.mul??1,s.from&&r.uFrom.value.set(s.from[0],s.from[1]),s.rect&&r.uRect.value.set(...s.rect),this.pass.render(e,t,!1)}};var xS=`
uniform mat4 uInvProj, uCamWorld; uniform float uTime, uWarp, uFlash, uHue, uDark;
uniform vec3 uFlashDir, uTop, uMid, uLow, uRim;
uniform vec2 uSwirl;
varying vec2 vUv;
vec3 rayDir(vec2 uv){
  vec4 c = uInvProj * vec4(uv*2.-1., 1., 1.);
  c /= c.w;
  return normalize((uCamWorld * vec4(normalize(c.xyz), 0.)).xyz);
}
void main(){
  vec3 d = rayDir(vUv);
  // twirl in screen space around uSwirl
  vec2 sp = (vUv - uSwirl) * vec2(16./9., 1.);
  float r = length(sp);
  float tw = uWarp * 5.5 * exp(-r*1.4);
  d.xy = rot(tw*0.35) * d.xy;
  float h = d.y;
  vec2 q = d.xz / (max(h, 0.0) + 0.18) * 1.6;
  q = rot(tw) * q;
  q += vec2(uTime*0.05, -uTime*0.11);
  vec2 w1 = vec2(fbm(q*0.6 + uTime*0.03), fbm(q*0.6 + 5.2 - uTime*0.02));
  vec2 w2 = vec2(fbm(q*1.1 + w1*2.4 + 1.7), fbm(q*1.1 + w1*2.4 + 9.2));
  float cl = fbm(q*0.9 + w2*2.2);
  float dense = smoothstep(0.25, 0.85, cl);
  vec3 c = mix(uLow, uMid, smoothstep(-0.1, 0.35, h));
  c = mix(c, uTop, smoothstep(0.3, 0.95, h));
  // cloud mass darker, rims lit by uRim (city/stage glow from below)
  c = mix(c, c*0.35, dense);
  float rim = smoothstep(0.45, 0.55, cl) * (1. - smoothstep(0.55, 0.8, cl));
  c += uRim * rim * 0.35 * smoothstep(0.6, -0.1, h);
  // lightning illumination: bright inside clouds near the flash direction
  float fd = max(dot(d, normalize(uFlashDir)), 0.);
  float glow = pow(fd, 6.) * uFlash;
  c += vec3(.75,.8,1.)* glow * (0.4 + 1.6*dense) ;
  c += vec3(.6,.65,1.) * uFlash * 0.12 * dense;
  // horizon haze
  c += uRim * exp(-abs(h)*9.) * 0.25;
  // twirl streaks
  c += uRim * uWarp * 0.25 * smoothstep(0.6, 0.0, r) * (0.5+0.5*sin(atan(sp.y,sp.x)*12. + tw*3.));
  c *= 1. - uDark;
  gl_FragColor = vec4(c, 1.);
}`,Kr=class{constructor(){this.pass=new It(xS,{uInvProj:{value:new yt},uCamWorld:{value:new yt},uTime:{value:0},uWarp:{value:0},uFlash:{value:0},uHue:{value:0},uDark:{value:0},uFlashDir:{value:new L(.2,.6,-1)},uTop:{value:new Ae(.02,.02,.06)},uMid:{value:new Ae(.09,.04,.16)},uLow:{value:new Ae(.32,.07,.1)},uRim:{value:new Ae(1,.35,.18)},uSwirl:{value:new ae(.5,.65)}})}draw(e,t,i,s={}){let r=this.pass.u;i.updateMatrixWorld(),r.uInvProj.value.copy(i.projectionMatrixInverse),r.uCamWorld.value.copy(i.matrixWorld),r.uTime.value=s.time??0,r.uWarp.value=s.warp??0,r.uFlash.value=s.flash??0,r.uDark.value=s.dark??0,s.flashDir&&r.uFlashDir.value.copy(s.flashDir),s.swirl&&r.uSwirl.value.set(s.swirl[0],s.swirl[1]),s.pal&&(r.uTop.value.setRGB(...s.pal.top),r.uMid.value.setRGB(...s.pal.mid),r.uLow.value.setRGB(...s.pal.low),r.uRim.value.setRGB(...s.pal.rim)),this.pass.render(e,t,!1)}};function Df(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new Rt,l=0;for(let h=0;h<n.length;++h){let d=n[h],u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0,d=[];for(let u=0;u<n.length;++u){let f=n[u].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+h);h+=n[u].attributes.position.count}c.setIndex(d)}for(let h in r){let d=tm(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let S=0;S<o[h].length;++S)f.push(o[h][S][u]);let g=tm(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}}return c}function tm(n){let e,t,i,s=-1,r=0;for(let l=0;l<n.length;++l){let h=n[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Kt(o,t,i),c=0;for(let l=0;l<n.length;++l){let h=n[l];if(h.isInterleavedBufferAttribute){let d=c/t;for(let u=0,f=h.count;u<f;u++)for(let g=0;g<t;g++){let S=h.getComponent(u,g);a.setComponent(u+d,g,S)}}else o.set(h.array,c);c+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var vS={spacing:9,count:30,z0:-4,archA:7.2,archH:15,roseZ:-290,roseY:30,roseR:22},ch=`
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  mat4 im = mat4(1.);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec4 wp = modelMatrix * im * vec4(position,1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix*im)*normal); vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Lf=`
uniform vec3 uFog; uniform float uFogD, uFlash, uPulseZ, uPulse, uGlowZ; uniform vec3 uFlashDir, uFlashCol, uWin;
uniform vec3 uCam;
float fogF(vec3 w){ float d = length(w - uCam); return 1. - exp(-pow(d*uFogD, 1.4)); }
vec3 light(vec3 base, vec3 w, vec3 n, float rimAmt, vec3 rimCol){
  vec3 V = normalize(uCam - w);
  float ndl = max(dot(n, normalize(uFlashDir)), 0.);
  vec3 c = base * (0.10 + 0.9*ndl*uFlash) * mix(vec3(1.), uFlashCol, uFlash*.6);
  // rose window light from far end
  float wl = max(dot(n, vec3(0.,0.,-1.)), 0.) ;
  c += base * uWin * (0.35 + 0.65*wl) * 0.5;
  // travelling pulse ring down the nave
  float pz = exp(-abs(w.z - uPulseZ)*0.35) * uPulse;
  float fr = pow(1. - max(dot(n, V), 0.), 3.);
  c += rimCol * (fr*rimAmt + pz*0.9);
  return c;
}`,nm=`
${Fi}
${Lf}
uniform vec3 uBase, uRim; uniform float uRimAmt;
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  vec3 n = normalize(vN);
  float tex = 0.75 + 0.5*fbm(vW.xy*0.6 + vW.z*0.13);
  vec3 c = light(uBase*tex, vW, n, uRimAmt, uRim);
  c = mix(c, uFog, fogF(vW));
  gl_FragColor = vec4(c, 1.);
}`,yS=`
${Lf}
uniform vec3 uCol; uniform float uA;
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  float pz = exp(-abs(vW.z - uPulseZ)*0.25) * uPulse;
  vec3 c = uCol * (uA + pz*2.5 + uFlash*0.8);
  c = mix(c, uFog, fogF(vW));
  gl_FragColor = vec4(c, 1.);
}`,SS=`
${Fi}
${Lf}
uniform vec3 uRim; uniform float uGrid;
varying vec3 vW; varying vec3 vN; varying vec2 vUv;
void main(){
  vec2 p = vW.xz;
  float stone = 0.6 + 0.4*fbm(p*0.35);
  vec3 c = vec3(.025,.022,.028) * stone;
  // reflection streak of rose window & candles (fake glossy)
  float streak = exp(-abs(p.x)*0.22) * smoothstep(40., -300., p.y) ;
  c += uWin * streak * 0.6 * (0.7+0.3*vnoise(vec2(p.x*3., p.y*0.15)));
  // inlaid gold lines (stage grid)
  vec2 g = abs(fract(p/vec2(4.5, 9.) + .5) - .5) * vec2(4.5, 9.);
  float gl = exp(-g.x*14.) * step(abs(p.x), 14.) + exp(-g.y*14.)*0.5;
  c += uRim * gl * uGrid;
  float pz = exp(-abs(vW.z - uPulseZ)*0.3) * uPulse;
  c += uRim * pz * 0.25 * exp(-abs(p.x)*0.1);
  c += uFlashCol * uFlash * 0.08;
  c = mix(c, uFog, fogF(vW));
  gl_FragColor = vec4(c, 1.);
}`,bS=`
attribute float aSeed; attribute float aKind;
uniform float uTime, uSize, uPulseZ, uPulse; uniform vec3 uCam;
varying float vSeed; varying float vKind; varying float vFade; varying float vPz;
void main(){
  vec3 p = position;
  vSeed = aSeed; vKind = aKind;
  if(aKind > 0.5){
    // drifting gold leaf: slow fall & sway, wraps
    p.y = mod(p.y - uTime*(0.4+aSeed*0.6), 30.) ;
    p.x += sin(uTime*0.7 + aSeed*40.)*1.2;
    p.z += cos(uTime*0.5 + aSeed*20.)*1.2;
  }
  vec4 mv = viewMatrix * modelMatrix * vec4(p,1.);
  float d = -mv.z;
  vFade = smoothstep(260., 40., d) * smoothstep(0.5, 3., d);
  vPz = exp(-abs(p.z - uPulseZ)*0.3) * uPulse;
  gl_PointSize = uSize * (aKind > 0.5 ? 0.16 : 0.6) * (0.6 + aSeed*0.8) * 300. / d;
  gl_Position = projectionMatrix * mv;
}`,_S=`
uniform float uTime; uniform vec3 uCandle, uLeaf;
varying float vSeed; varying float vKind; varying float vFade; varying float vPz;
void main(){
  vec2 q = gl_PointCoord - .5;
  float r = length(q);
  vec3 c;
  float a;
  if(vKind > 0.5){
    // gold leaf flake: thin glinting quad
    float ang = uTime*2. + vSeed*30.;
    vec2 qq = mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*q;
    a = step(abs(qq.x), .32) * step(abs(qq.y), .12+0.1*sin(ang*1.3));
    float glint = pow(max(sin(ang*1.7+vSeed*9.),0.), 8.);
    c = uLeaf * (0.5 + 2.5*glint);
  } else {
    float fl = 0.75 + 0.25*sin(uTime*13. + vSeed*80.) * sin(uTime*7.3 + vSeed*31.);
    a = exp(-r*r*28.) ;
    c = uCandle * fl * (1.2 + vPz*2.);
    a += exp(-r*r*180.)*0.6;
  }
  if(a < 0.01) discard;
  gl_FragColor = vec4(c * a * vFade, 1.);
}`;function MS(n,e,t,i){let s=new pi,r=t+i,o=n+i,a=t-n,c=(h,d)=>Math.acos(d/h);s.moveTo(-o,0),s.lineTo(-o,e),s.absarc(a,e,r,Math.PI,c(r,a),!0),s.absarc(-a,e,r,Math.PI-c(r,a),0,!0),s.lineTo(o,0),s.lineTo(-o,0);let l=new Ls;return l.moveTo(-n,0),l.lineTo(-n,e),l.absarc(a,e,t,Math.PI,c(t,a),!0),l.absarc(-a,e,t,Math.PI-c(t,a),0,!0),l.lineTo(n,0),l.lineTo(-n,0),s.holes.push(l),s}function AS(){let n=[],e=new Bo(.42,.5,11.5,14);for(let a of[-4.6,4.6]){let c=e.clone();c.rotateZ(a>0?-.03:.03),c.translate(a,5.75,0),n.push(c)}let t=new pi;t.moveTo(-7.4,12.2),t.quadraticCurveTo(0,11.2,7.4,12.2),t.lineTo(7.1,11.5),t.quadraticCurveTo(0,10.7,-7.1,11.5),t.closePath();let i=new Dr(t,{depth:1.3,bevelEnabled:!1,curveSegments:24});i.translate(0,0,-.65),n.push(i);let s=new di(12.2,.6,.9);s.translate(0,10.6,0),n.push(s);let r=new di(12.6,.55,.6);r.translate(0,8.4,0),n.push(r);let o=new di(.8,2,.5);return o.translate(0,9.5,0),n.push(o),Df(n.map(a=>a.index?a.toNonIndexed():a))}function im(n={}){let e={...vS,...n},t=new Pi,i={uFog:{value:new Ae(.03,.02,.05)},uFogD:{value:.006},uFlash:{value:0},uFlashDir:{value:new L(.3,1,.2)},uFlashCol:{value:new Ae(.75,.82,1)},uPulseZ:{value:-1e3},uPulse:{value:0},uCam:{value:new L},uGlowZ:{value:0},uWin:{value:new Ae(.25,.12,.2)}},s=new Et({vertexShader:ch,fragmentShader:nm,uniforms:{...i,uBase:{value:new Ae(.16,.15,.17)},uRim:{value:new Ae(1,.7,.35)},uRimAmt:{value:.4}}}),r=new Et({vertexShader:ch,fragmentShader:nm,uniforms:{...i,uBase:{value:new Ae(.9,.16,.08)},uRim:{value:new Ae(1,.45,.2)},uRimAmt:{value:.6}}}),o=new Et({vertexShader:ch,fragmentShader:yS,uniforms:{...i,uCol:{value:new Ae(1,.72,.36)},uA:{value:.55}}}),a=new Et({vertexShader:ch,fragmentShader:SS,uniforms:{...i,uRim:{value:new Ae(1,.7,.35)},uGrid:{value:.5}}}),c=new Dr(MS(e.archA,e.archH,e.archA*1.32,1.3),{depth:1.8,bevelEnabled:!0,bevelThickness:.15,bevelSize:.12,bevelSegments:1,curveSegments:28});c.translate(0,0,-.9);let l=e.count,h=new wr(c,s,l),d=new wr(AS(),r,l),u=new yt,f=new Uo(c,25),g=[];for(let R=0;R<l;R++){let I=e.z0-R*e.spacing*2;u.makeTranslation(0,0,I),h.setMatrixAt(R,u);let N=f.clone();N.translate(0,0,I),g.push(N),u.makeTranslation(0,0,I-e.spacing),d.setMatrixAt(R,u)}h.frustumCulled=!1,d.frustumCulled=!1;let S=new Lo(Df(g),o);S.frustumCulled=!1,t.add(h,d,S);let m=new zt(new Yn(240,700),a);m.rotation.x=-Math.PI/2,m.position.set(0,0,-300),t.add(m);let p=Vt(1234),v=260,M=340,y=new Float32Array((v+M)*3),_=new Float32Array(v+M),b=new Float32Array(v+M),A=0;for(let R=0;R<v;R++,A++){let I=R%2?1:-1,N=Math.floor(R/2);y.set([I*(9.5+N%3*1.4+p()*.4),.6+N%4*.45,-N*2.3-2],A*3),_[A]=p(),b[A]=0}for(let R=0;R<M;R++,A++)y.set([(p()-.5)*34,p()*30,-p()*300],A*3),_[A]=p(),b[A]=1;let x=new Rt;x.setAttribute("position",new Kt(y,3)),x.setAttribute("aSeed",new Kt(_,1)),x.setAttribute("aKind",new Kt(b,1));let E=new Et({vertexShader:bS,fragmentShader:_S,uniforms:{uTime:{value:0},uSize:{value:3.2},uPulseZ:i.uPulseZ,uPulse:i.uPulse,uCam:i.uCam,uCandle:{value:new Ae(1.6,.85,.35)},uLeaf:{value:new Ae(1,.75,.3)}},transparent:!0,depthWrite:!1,blending:Bs}),w=new Is(x,E);return w.frustumCulled=!1,t.add(w),{group:t,shared:i,stoneMat:s,shuMat:r,lineMat:o,floorMat:a,pMat:E,P:e}}var ES=`
varying vec2 vUv; varying vec3 vN; varying vec3 vView;
void main(){ vUv = uv; vec4 wp = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal);
  vView = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix*viewMatrix*wp; }`,TS=`
${Fi}
uniform float uTime, uGlow, uFlash, uRot1, uRot2, uRot3, uKal, uSymA, uSymB, uSymMix, uSymN, uHue, uBeat, uOn;
uniform sampler2D tSym; uniform vec3 uTintA, uTintB;
varying vec2 vUv; varying vec3 vN; varying vec3 vView;
const float PI = 3.14159265;
vec3 glassPal(float h){
  h = fract(h);
  if(h < .26) return vec3(.86,.06,.10);   // ruby
  if(h < .50) return vec3(.06,.20,.85);   // cobalt
  if(h < .64) return vec3(1.0,.70,.18);   // gold
  if(h < .76) return vec3(.05,.55,.30);   // emerald
  if(h < .90) return vec3(.42,.12,.70);   // violet
  return vec3(.95,.88,.74);               // clear amber
}
// glass body for a cell: id seeds colour & mottling; q local coords
vec3 glass(float id, vec2 q, float bright){
  vec3 base = glassPal(hash12(vec2(id, 7.1)) + uHue);
  float m = fbm(q*6. + id*3.1);
  float streak = vnoise(vec2(q.x*30., q.y*2.) + id);
  float seed = smoothstep(.96, .99, hash12(floor(q*80.) + id)) ;
  vec3 c = base * (0.55 + 0.9*m) * (0.85 + 0.3*streak);
  c += seed * 0.6;
  // hot spot transmission (light behind the glass)
  return c * bright;
}
void main(){
  vec2 p = (vUv - .5) * 2.;
  float r = length(p);
  if(r > 1.0) discard;
  float a = atan(p.y, p.x);
  float lead = 1.0;           // 1 = glass, 0 = lead/stone
  vec3 col = vec3(0.);
  float stone = 0.;
  float bright = uGlow * (0.75 + 0.5*fbm(p*2.+uTime*.05)) + uFlash*2.5;
  float aa = 0.006;

  if(r < 0.205){
    // centre rondel: symbol on ruby/gold ground
    float id = 1.;
    vec2 q = p / 0.17;
    // rotate symbol slowly when kaleidoscoping
    q = rot(uRot2*0.5) * q;
    vec2 su = q*0.5 + .5;
    float sA = texture2D(tSym, vec2((uSymA + su.x)/uSymN, 1.-su.y)).a;
    float sB = texture2D(tSym, vec2((uSymB + su.x)/uSymN, 1.-su.y)).a;
    float s = mix(sA, sB, uSymMix) * step(abs(q.x),1.) * step(abs(q.y),1.);
    vec3 ground = mix(vec3(.75,.05,.08), vec3(.08,.12,.6), .3+.3*sin(uTime*.3)) ;
    col = mix(glass(id, p*2., bright)*0.7 + ground*bright*0.35, vec3(1.,.88,.62)*(0.9+bright*0.7), s);
    // ring of small cells around symbol
    lead *= smoothstep(0.0, aa, abs(r - 0.195) - 0.008);
  } else if(r < 0.575){
    // 12 lancet petals
    float N = 12.;
    float aa1 = a + uRot1;
    float sec = floor((aa1 + PI) / (2.*PI/N));
    float th = mod(aa1 + PI, 2.*PI/N) - PI/N;             // -pi/N .. pi/N
    if(uKal > 0.5) th = abs(th);                           // mirror fold
    float rr = (r - 0.22) / 0.34;                          // 0..1 along petal
    float hw = 0.115 * pow(max(sin(PI*clamp(rr*0.92,0.,1.)),0.), 0.55) * (1. - smoothstep(.8,1.,rr)*0.0);
    float x = th * r;                                      // arc-length across
    float f = abs(x) - hw*r*2.0;
    if(f < 0. && rr > 0. && rr < 1.){
      // inside petal: 2 panes split by mullion + horizontal saddle bars
      float pane = step(0., x);
      float bar = floor(rr*4.);
      float id = sec*10. + pane*3. + bar + 20.;
      col = glass(id, vec2(x, rr)*3., bright);
      lead *= smoothstep(0., aa, abs(x) - 0.004);
      lead *= smoothstep(0., aa, (0.5 - abs(fract(rr*4.)-.5))*0.085 - 0.003);
      lead *= smoothstep(0., aa, -f - 0.006);
    } else {
      // tracery between petals with a small trefoil hole
      vec2 tc = vec2((th - sign(th)*PI/N*0.0) * r, r - 0.47);
      float tre = length(vec2(abs(th)-PI/N, 0.)*r*1.0 + vec2(0., r-0.5));
      float hole = smoothstep(0.028, 0.024, length(vec2((abs(th)-PI/N)*r, r - 0.505)));
      if(hole > 0.){
        col = glass(sec + 200., p*3., bright*0.9);
        lead = hole;
      } else { lead = 0.; stone = 1.; }
    }
  } else if(r < 0.64){
    // band of quatrefoil roundels
    float N = 24.;
    float aa2 = a - uRot2;
    float th = mod(aa2 + PI, 2.*PI/N) - PI/N;
    float sec = floor((aa2 + PI)/(2.*PI/N));
    vec2 q = vec2(th * r, r - 0.6075);
    float d = length(q);
    // quatrefoil = min of 4 offset circles
    float qf = min(min(length(q-vec2(.012,0.)), length(q+vec2(.012,0.))), min(length(q-vec2(0.,.012)), length(q+vec2(0.,.012))));
    if(qf < 0.017){
      col = glass(sec + 400., q*40., bright);
      lead = smoothstep(0., aa, 0.017 - qf - 0.003);
    } else { lead = 0.; stone = 1.; }
  } else if(r < 0.925){
    // 24 outer lancets with trefoil heads
    float N = 24.;
    float aa3 = a + uRot3;
    float sec = floor((aa3 + PI)/(2.*PI/N));
    float th = mod(aa3 + PI, 2.*PI/N) - PI/N;
    if(uKal > 0.5) th = abs(th);
    float rr = (r - 0.655)/0.255;
    float hw = 0.118 * pow(max(sin(PI*clamp(rr*0.9+0.05,0.,1.)),0.), 0.4);
    float x = th * r;
    float f = abs(x) - hw * r * 1.25;
    if(f < 0. && rr > 0. && rr < 1.){
      float bar = floor(rr*3.);
      float id = sec*5. + bar + 600.;
      col = glass(id, vec2(x, rr)*4., bright);
      lead *= smoothstep(0., aa, (0.5 - abs(fract(rr*3.)-.5))*0.085 - 0.003);
      lead *= smoothstep(0., aa, -f - 0.005);
      lead *= smoothstep(0., aa, abs(x) - 0.0035);
    } else { lead = 0.; stone = 1.; }
  } else {
    lead = 0.; stone = 1.;
  }
  // stone tracery: dark carved stone, rim-lit, mouldings
  vec3 stoneCol = vec3(.055,.05,.06) * (0.7 + 0.6*fbm(p*20.));
  float mould = smoothstep(.0, .01, abs(r-.95)-.012) ;
  stoneCol *= 0.6 + 0.4*mould;
  stoneCol += vec3(1.,.75,.4) * uFlash * 0.25;
  // gold edge line on outer ring and tracery rims
  float rim = exp(-abs(r - .925)*260.) + exp(-abs(r - .64)*300.)*.6 + exp(-abs(r - .575)*300.)*.6;
  vec3 c = mix(stoneCol, col, lead);
  c += vec3(1.,.72,.35) * rim * (0.35 + uBeat*0.8) * uGlow;
  // global tint (variant grading)
  c *= mix(uTintA, uTintB, smoothstep(-0.4, 0.4, p.y));
  c *= uOn;
  gl_FragColor = vec4(c, 1.);
}`;function sm(n,e){return new Et({vertexShader:ES,fragmentShader:TS,uniforms:{uTime:{value:0},uGlow:{value:1.2},uFlash:{value:0},uRot1:{value:0},uRot2:{value:0},uRot3:{value:0},uKal:{value:0},uSymA:{value:0},uSymB:{value:0},uSymMix:{value:0},uSymN:{value:e},uHue:{value:0},uBeat:{value:0},uOn:{value:1},tSym:{value:n},uTintA:{value:new Ae(1,1,1)},uTintB:{value:new Ae(1,1,1)}},side:Tn})}var kt=Math.PI*2;function wS(n,e,t,i){n.beginPath();for(let s=0;s<=e;s++){let r=s*t/e*kt-Math.PI/2,o=Math.cos(r)*i,a=Math.sin(r)*i;s===0?n.moveTo(o,a):n.lineTo(o,a)}n.closePath()}var us={cross(n){n.beginPath(),n.rect(-.14,-.95,.28,1.9),n.rect(-.62,-.5,1.24,.28),n.fill("nonzero")},torii(n){n.beginPath(),n.moveTo(-1,-.72),n.quadraticCurveTo(0,-.58,1,-.72),n.lineTo(.92,-.52),n.quadraticCurveTo(0,-.42,-.92,-.52),n.closePath(),n.rect(-.78,-.42,1.56,.1),n.rect(-.82,-.18,1.64,.12),n.rect(-.62,-.45,.14,1.4),n.rect(.48,-.45,.14,1.4),n.rect(-.05,-.42,.1,.26),n.fill("nonzero")},wheel(n){n.beginPath(),n.arc(0,0,.92,0,kt),n.arc(0,0,.74,0,kt,!0),n.fill(),n.beginPath(),n.arc(0,0,.2,0,kt),n.fill();for(let e=0;e<8;e++)n.save(),n.rotate(e/8*kt),n.beginPath(),n.moveTo(-.05,-.2),n.lineTo(.05,-.2),n.lineTo(.03,-.76),n.lineTo(-.03,-.76),n.closePath(),n.fill(),n.beginPath(),n.arc(0,-.98,.08,0,kt),n.fill(),n.restore()},crescent(n){n.beginPath(),n.arc(-.1,0,.86,0,kt),n.arc(.24,-.06,.72,0,kt,!0),n.fill("nonzero"),n.save(),n.translate(.5,-.04),wS(n,5,2,.28),n.fill("nonzero"),n.restore()},hexagram(n){n.lineWidth=.12,n.lineJoin="miter",n.beginPath();for(let e of[0,Math.PI]){for(let t=0;t<=3;t++){let i=t/3*kt-Math.PI/2+e,s=Math.cos(i)*.86,r=Math.sin(i)*.86;t===0?n.moveTo(s,r):n.lineTo(s,r)}n.closePath()}n.stroke()},octagram(n){n.beginPath();for(let e of[0,Math.PI/4]){for(let t=0;t<=4;t++){let i=t/4*kt+e-Math.PI/4,s=Math.cos(i)*.9,r=Math.sin(i)*.9;t===0?n.moveTo(s,r):n.lineTo(s,r)}n.closePath()}n.fill("nonzero"),n.save(),n.globalCompositeOperation="destination-out",n.beginPath(),n.arc(0,0,.26,0,kt),n.fill(),n.restore()},yinyang(n){n.beginPath(),n.arc(0,0,.9,-Math.PI/2,Math.PI/2),n.arc(0,.45,.45,Math.PI/2,-Math.PI/2,!0),n.arc(0,-.45,.45,Math.PI/2,-Math.PI/2,!1),n.closePath(),n.fill(),n.lineWidth=.06,n.beginPath(),n.arc(0,0,.9,0,kt),n.stroke(),n.beginPath(),n.arc(0,-.45,.13,0,kt),n.fill(),n.save(),n.globalCompositeOperation="destination-out",n.beginPath(),n.arc(0,.45,.13,0,kt),n.fill(),n.restore()},lotus(n){let e=(t,i,s)=>{n.save(),n.rotate(t),n.beginPath(),n.moveTo(0,.5),n.bezierCurveTo(s,.2,s*.8,.5-i*.7,0,.5-i),n.bezierCurveTo(-s*.8,.5-i*.7,-s,.2,0,.5),n.fill(),n.restore()};for(let[t,i,s]of[[0,1.35,.36],[-.55,1.15,.32],[.55,1.15,.32],[-1.05,.85,.28],[1.05,.85,.28]])e(t,i,s);n.fillRect(-.85,.52,1.7,.08)},tomoe(n){for(let e=0;e<3;e++)n.save(),n.rotate(e/3*kt),n.beginPath(),n.arc(0,-.42,.32,0,kt),n.fill(),n.beginPath(),n.moveTo(.32,-.42),n.bezierCurveTo(.34,-.05,.1,.25,-.35,.42),n.bezierCurveTo(-.05,.12,-.02,-.15,-.3,-.36),n.closePath(),n.fill(),n.restore()}},Vs=["cross","torii","wheel","crescent","hexagram","octagram","yinyang","lotus"],Ui={rosary(n){for(let e=0;e<26;e++){let t=e/26*kt*.86+Math.PI*.57,i=Math.cos(t)*.62,s=Math.sin(t)*.5-.22;n.beginPath(),n.arc(i,s,e%9===0?.07:.045,0,kt),n.fill()}for(let e=0;e<4;e++)n.beginPath(),n.arc(0,.32+e*.1,.045,0,kt),n.fill();n.fillRect(-.04,.68,.08,.34),n.fillRect(-.14,.77,.28,.07)},dove(n){n.beginPath(),n.moveTo(-.95,.1),n.bezierCurveTo(-.6,0,-.4,.05,-.2,.12),n.bezierCurveTo(-.35,-.3,-.15,-.75,.25,-.92),n.bezierCurveTo(.15,-.55,.2,-.25,.25,.02),n.bezierCurveTo(.45,-.05,.62,-.12,.75,-.08),n.bezierCurveTo(.86,-.1,.94,-.04,.98,0),n.lineTo(.85,.05),n.bezierCurveTo(.7,.2,.45,.36,.15,.42),n.bezierCurveTo(-.1,.48,-.4,.5,-.62,.62),n.lineTo(-.7,.42),n.bezierCurveTo(-.75,.3,-.85,.2,-.95,.1),n.closePath(),n.fill()},rope(n){n.save();for(let e=-6;e<=6;e++)n.beginPath(),n.ellipse(e*.14,-.35+Math.abs(e)*Math.abs(e)*.006,.12,.2,.7,0,kt),n.fill();for(let e of[-.5,0,.5])n.beginPath(),n.moveTo(e-.08,-.15),n.lineTo(e+.08,-.15),n.lineTo(e+.08,.1),n.lineTo(e-.06,.1),n.lineTo(e-.06,.35),n.lineTo(e+.1,.35),n.lineTo(e+.1,.6),n.lineTo(e-.04,.6),n.lineTo(e-.04,.85),n.lineTo(e-.12,.85),n.lineTo(e-.12,.6),n.lineTo(e,.6),n.lineTo(e,.42),n.lineTo(e-.14,.42),n.lineTo(e-.14,.17),n.lineTo(e,.17),n.lineTo(e,.02),n.lineTo(e-.08,.02),n.closePath(),n.fill();n.restore()},star8(n){us.octagram(n)},bell(n){n.beginPath(),n.moveTo(-.12,-.95),n.lineTo(.12,-.95),n.lineTo(.12,-.8),n.bezierCurveTo(.45,-.8,.55,-.65,.56,-.4),n.lineTo(.6,.62),n.lineTo(.7,.75),n.lineTo(-.7,.75),n.lineTo(-.6,.62),n.lineTo(-.56,-.4),n.bezierCurveTo(-.55,-.65,-.45,-.8,-.12,-.8),n.closePath(),n.fill(),n.save(),n.globalCompositeOperation="destination-out",n.lineWidth=.05;for(let e of[-.45,.1,.5])n.beginPath(),n.moveTo(-.6,e),n.lineTo(.6,e),n.stroke();n.beginPath(),n.moveTo(0,-.45),n.lineTo(0,.1),n.stroke();for(let e=0;e<9;e++)n.beginPath(),n.arc(-.42+e%3*.12,-.33+Math.floor(e/3)*.13,.035,0,kt),n.arc(.18+e%3*.12,-.33+Math.floor(e/3)*.13,.035,0,kt),n.fill();n.beginPath(),n.arc(-.3,.32,.09,0,kt),n.fill(),n.restore()}},rm=[{key:"rosary",name:"\u30ED\u30B6\u30EA\u30AA",role:"VOCAL \xB7 GUITAR",faith:"ROSARIO"},{key:"dove",name:"\u30CF\u30C8",role:"LEAD GUITAR",faith:"COLUMBA"},{key:"rope",name:"\u30CA\u30EF",role:"BASS",faith:"SHIMENAWA"},{key:"star8",name:"\u30DB\u30B7",role:"DRUMS",faith:"OCTAGRAM"},{key:"bell",name:"\u30AB\u30CD",role:"KEYS",faith:"BONSHO"}];function Sn(n,e,t,i,s,r=0){n.save(),n.translate(t,i),n.rotate(r),n.scale(s,s),e(n),n.restore()}function om(n,e=256,t=us){let i=document.createElement("canvas");i.width=e*n.length,i.height=e;let s=i.getContext("2d");return s.fillStyle="#fff",s.strokeStyle="#fff",n.forEach((r,o)=>Sn(s,t[r],e*o+e/2,e/2,e*.4)),i}function hh(n,e,t,i,s,r=1){let o=Math.sin(s);n.save(),n.translate(e,t),n.scale(i*r,i);let a=(c,l)=>{n.save(),n.translate(.02,-.02),n.scale(1,c);let h=-.5*l-.05;n.beginPath(),n.moveTo(-.12,0),n.bezierCurveTo(-.1,h*.6,-.2,h,-.42,h*1.05-.02),n.lineTo(-.34,h*.9+.02),n.lineTo(-.38,h*.82+.05),n.lineTo(-.28,h*.7+.06),n.lineTo(-.3,h*.6+.09),n.bezierCurveTo(-.16,h*.35+.05,-.02,.06,.12,.02),n.closePath(),n.fill(),n.restore()};n.globalAlpha*=.75,a(1,o*.8+.1),n.globalAlpha/=.75,n.beginPath(),n.ellipse(0,.02,.24,.075,-.08,0,kt),n.fill(),n.beginPath(),n.arc(.24,-.03,.06,0,kt),n.fill(),n.beginPath(),n.moveTo(.29,-.04),n.lineTo(.36,-.015),n.lineTo(.29,0),n.fill(),n.beginPath(),n.moveTo(-.2,0),n.lineTo(-.42,-.05),n.lineTo(-.44,.06),n.lineTo(-.2,.06),n.fill(),a(1,o+.15),n.restore()}var xa=new Map;function Ws(n,e,t,i,s,r={}){let o=`${n|0},${e|0},${t|0},${i|0},${s},${r.branch??.5},${r.rough??1}`;if(xa.has(o))return xa.get(o);xa.size>600&&xa.clear();let a=Vt(s),c=r.rough??1,l=[],h=(d,u,f,g,S,m,p)=>{let v=[[d,u],[f,g]],M=Math.hypot(f-d,g-u)*.22*c;for(let y=0;y<7;y++){let _=[v[0]];for(let b=0;b<v.length-1;b++){let[A,x]=v[b],[E,w]=v[b+1],R=(A+E)/2,I=(x+w)/2,N=E-A,D=w-x,U=Math.hypot(N,D)||1,W=(a()-.5)*2*M;_.push([R-D/U*W,I+N/U*W],v[b+1])}v=_,M*=.52}if(l.push({pts:v,w:S,depth:m}),m<p){let y=Math.floor(a()*4*(r.branch??.5)*(1-m*.3))+(m===0?1:0);for(let _=0;_<y;_++){let b=Math.floor((.15+a()*.6)*v.length),[A,x]=v[b],E=f-d,w=g-u,R=Math.atan2(w,E)+(a()-.5)*1.6,I=Math.hypot(E,w)*(.18+a()*.35)*(1-m*.25);h(A,x,A+Math.cos(R)*I,x+Math.sin(R)*I,S*.45,m+1,p)}}};return h(n,e,t,i,r.w??3,0,r.depth??2),xa.set(o,l),l}function Xs(n,e=0){if(n<0||n>.6)return 0;let t=Math.exp(-n*9),i=n>.07?Math.exp(-(n-.07)*16)*.8:0,s=.7+.3*at(Math.floor(n*50)+e*7);return se((t+i)*s,0,1.4)}function Qs(n,e,t,i=1,s=[200,220,255]){if(t<=.001)return;n.save(),n.globalCompositeOperation="lighter",n.lineCap="round",n.lineJoin="round";let r=[[26,.05,`rgba(${s[0]*.6|0},${s[1]*.5|0},${s[2]},`],[9,.16,`rgba(${s[0]},${s[1]},${s[2]},`],[3.2,.6,"rgba(235,242,255,"],[1.3,1,"rgba(255,255,255,"]];for(let[o,a,c]of r)for(let l of e){let h=Math.max(2,Math.floor(l.pts.length*se(i*(1+l.depth*.5))));if(!(l.depth>0&&i<.4)){n.strokeStyle=c+se(a*t*(l.depth?.7:1))+")",n.lineWidth=o*(l.w/3)*(l.depth?.8:1),n.beginPath(),n.moveTo(l.pts[0][0],l.pts[0][1]);for(let d=1;d<h;d++)n.lineTo(l.pts[d][0],l.pts[d][1]);n.stroke()}}n.restore()}function am(n,e,t,i,s={}){let r=s.time??0,o=s.pulse??0,a=s.alpha??1,c=s.spin??0,l=s.n??8,h=s.gold??["#fff1c4","#f2c766","#b07a26"];n.save(),n.translate(e,t),n.globalAlpha=a,n.save(),n.globalCompositeOperation="lighter";let d=72;for(let f=0;f<d;f++){let g=f/d*be+c*.3,S=i*(1.25+.35*Math.sin(f*7.3+r*3)+(f%2?.1:.32)+o*.3);n.save(),n.rotate(g);let m=n.createLinearGradient(0,i*.55,0,S);m.addColorStop(0,"rgba(255,200,110,0.0)"),m.addColorStop(.25,`rgba(255,190,90,${.12+o*.14})`),m.addColorStop(1,"rgba(255,120,40,0)"),n.fillStyle=m,n.beginPath(),n.moveTo(-i*.018,i*.55),n.quadraticCurveTo(i*.03,(i*.55+S)/2,0,S),n.quadraticCurveTo(-i*.03,(i*.55+S)/2,i*.018,i*.55),n.fill(),n.restore()}n.restore();let u=n.createRadialGradient(0,0,i*.9,0,0,i*1.08);u.addColorStop(0,h[2]),u.addColorStop(.5,h[0]),u.addColorStop(1,h[2]),n.strokeStyle=u,n.lineWidth=i*.05,n.beginPath(),n.arc(0,0,i,0,be),n.stroke(),n.lineWidth=i*.012,n.beginPath(),n.arc(0,0,i*1.09,0,be),n.stroke(),n.beginPath(),n.arc(0,0,i*.9,0,be),n.stroke();for(let f=0;f<l;f++){let g=f/l*be+c-Math.PI/2,S=Math.cos(g)*i,m=Math.sin(g)*i,p=se(o*(f%2?.7:1)),v=i*.15*(1+p*.12);n.save(),n.translate(S,m);let M=n.createRadialGradient(-v*.3,-v*.3,v*.1,0,0,v*1.15);M.addColorStop(0,"#ffefc0"),M.addColorStop(.55,h[1]),M.addColorStop(1,"#6b3d12"),n.fillStyle=M,n.beginPath(),n.arc(0,0,v*1.12,0,be),n.fill(),n.fillStyle="#3a210c";for(let y=0;y<16;y++){let _=y/16*be;n.beginPath(),n.arc(Math.cos(_)*v*1.02,Math.sin(_)*v*1.02,v*.045,0,be),n.fill()}n.fillStyle=`rgba(${200+p*55|0},${40+p*60|0},30,1)`,n.beginPath(),n.arc(0,0,v*.88,0,be),n.fill(),n.fillStyle=p>.3?"#fff6d8":"#1a0f08",Sn(n,us.tomoe,0,0,v*.72,r*.5+f),n.restore()}n.restore()}var Ks={intro:[[.07,59.1],[.743,74.1],[1.463,73.2],[1.695,72.9],[2.02,81.1],[2.159,81.2],[2.415,81.2],[2.67,81.2],[2.856,66.1],[2.972,66.1],[3.088,54.1],[3.39,62.1],[3.553,62.1],[3.855,50.4],[4.249,54.1],[4.69,54.1],[4.946,64.1]],bridge:[[140.993,54.1],[141.759,54],[141.922,54.1],[142.154,54.2],[142.363,55.1],[142.735,62.2],[143.083,59.5],[143.315,67.5],[143.594,69.1],[143.78,50.4],[144.987,54],[145.033,54.1],[145.173,50.4],[145.521,54.2],[145.684,59.7],[145.869,59.2],[146.032,59.2],[146.241,62],[146.38,62.1],[146.566,50.4],[146.891,56.9],[146.938,56.9],[147.17,50.4],[147.286,50.4],[147.797,50.4],[147.959,50.4],[148.47,50.4],[148.656,50.4],[148.818,50.4],[149.143,50.4],[149.352,50.4],[149.492,50.4]],outro:[[173.766,74.1],[174.091,74.2],[174.207,74.1],[174.37,73.1],[174.486,73.1],[174.602,73.2],[174.881,73.1],[175.159,81.1],[175.345,81.2],[175.438,81.2],[175.647,57.2],[175.856,66.1],[176.297,66.1],[176.413,66.1],[176.553,74.1],[176.831,74.3],[177.272,54.1],[177.528,54.1],[177.76,54.1]]};var yi=["#ff4a2e","#f4f1ff","#ffc24a","#a56bff","#3fe0b0"],CS=`
uniform float uTime, uGong, uAge, uZoom, uLight, uOpen;
uniform vec2 uC; uniform float uR;
varying vec2 vUv;
void main(){
  vec2 asp = vec2(16./9., 1.);
  vec2 p = (vUv - .5) * asp / uZoom + (uC - .5)*asp*(1. - 1./uZoom);
  vec2 cc = (uC - .5) * asp;
  vec2 d = p - cc;
  float r = length(d);
  // shock ring distortion
  float wave = sin((r - uAge*1.25)*55.) * exp(-abs(r - uAge*1.25)*14.) * exp(-uAge*1.6) * step(0., uAge);
  vec2 pw = p + normalize(d+1e-5) * wave * 0.012;
  // smoke
  float sm = fbm(pw*2.2 + vec2(uTime*0.03, -uTime*0.05)) * fbm(pw*4. - uTime*0.02);
  vec3 col = vec3(0.012, 0.008, 0.012) + vec3(0.22,0.08,0.05) * sm * (0.4 + uLight*1.6) * smoothstep(1.2, 0.0, length(pw - cc + vec2(0.,0.3)));
  // stage glow from below
  col += vec3(0.5,0.12,0.06) * exp(-(1.-vUv.y)*0.0) * smoothstep(0.55, -0.1, vUv.y) * 0.18 * (0.5+uLight);
  // gong
  float R = uR;
  if(uGong > 0.001){
    vec2 q = (pw - cc) / R;
    float rr = length(q);
    float ang = atan(q.y, q.x);
    // hammered bronze: polar dents + concentric lathe lines
    float dents = vnoise(vec2(ang*9., rr*18.)) * 0.6 + vnoise(q*22.)*0.4;
    float lathe = sin(rr*160. + vnoise(q*6.)*4.) * 0.5 + 0.5;
    // vibration waves after the hit
    float vib = sin(rr*38. - uAge*42.) * exp(-uAge*0.9) * step(0., uAge);
    // normal-ish shading
    vec2 grad = vec2(cos(ang), sin(ang)) * (dents - .5) * 0.6 + q*0.25 + vec2(cos(ang),sin(ang))*vib*0.25;
    vec3 n = normalize(vec3(grad, 1.));
    vec3 L = normalize(vec3(-0.5, 0.6, 0.8));
    float diff = max(dot(n, L), 0.);
    float spec = pow(max(dot(reflect(-L, n), vec3(0.,0.,1.)), 0.), 30.);
    vec3 bronze = mix(vec3(0.35,0.18,0.07), vec3(0.85,0.55,0.22), lathe*0.35 + dents*0.4);
    // raised boss
    float boss = smoothstep(0.24, 0.2, rr);
    bronze = mix(bronze, vec3(0.95,0.68,0.3), boss*0.6);
    vec3 g = bronze * (0.15 + diff*0.9) + vec3(1.,.8,.5) * spec * (0.6 + 1.5*exp(-uAge*2.));
    g *= 0.6 + 0.6*uLight;
    // rim band
    float rim = smoothstep(0.93, 0.95, rr) * smoothstep(1.0, 0.98, rr);
    g = mix(g, vec3(0.12,0.07,0.04), rim*0.8);
    g += vec3(1.0,0.55,0.2) * exp(-abs(rr-0.97)*80.) * (0.3 + 1.2*exp(-uAge*1.5)) ;
    float inside = smoothstep(1.0, 0.99, rr);
    col = mix(col, g, inside * uGong);
    // open: the centre glows white-hot when we push in
    col += vec3(1.,.85,.6) * smoothstep(0.9, 0.0, rr) * uOpen * 2.5 * uGong;
    // halo
    col += vec3(1.0,0.45,0.15) * exp(-max(rr-1.,0.)*5.) * (0.08 + 0.6*exp(-uAge*1.4)) * uGong * step(1., rr);
  }
  // bright shock ring
  col += vec3(1.,.7,.4) * exp(-abs(r - uAge*1.25)*40.) * exp(-uAge*1.8) * step(0., uAge) * 1.5;
  gl_FragColor = vec4(col, 1.);
}`,uh=class{constructor(e){this.app=e}init(){this.bg=new It(CS,{uTime:{value:0},uGong:{value:0},uAge:{value:-1},uZoom:{value:1},uLight:{value:0},uOpen:{value:0},uC:{value:new ae(.5,.5)},uR:{value:.3}}),this.glow=new Nt(1),this.type=new Nt(0);let e=Vt(77);this.crowd=[];for(let t=0;t<230;t++){let i=Math.pow(e(),1.6);this.crowd.push({x:e()*2200-140,y:1080-ce(40,420,i)+e()*40,z:i,col:yi[Math.floor(e()*5)],ph:e()*be,sp:.6+e()*1.4,amp:6+e()*20})}this.crowd.sort((t,i)=>i.z-t.z),this.notes=Ks.intro.map(([t,i],s)=>({t,m:i,i:s}))}render(e,t){let i=this.app.renderer,s=e-Bi,r=ge(Bi-.02,Bi+.12,e,Oe.outExpo),o=ge(10.45,ut.v1[0]+.4,e,Oe.inCubic),a=1+o*5+Math.max(0,e-8)*.02,c=this.bg.u;c.uTime.value=e,c.uGong.value=r,c.uAge.value=s,c.uZoom.value=a,c.uLight.value=se(e/5)*.4+(s>0?.6*Math.exp(-s*.5)+.25:0)+Wr(e)*.3,c.uOpen.value=o,this.bg.render(i,t,!1);let l=this.glow.begin(),h=this.type.begin(),d=s>0?Math.exp(-s*1.2):0;l.save(),l.globalCompositeOperation="lighter";for(let v=0;v<5;v++){let M=260+v*350,y=s>0?1.8:.35,_=Math.sin(e*y*(.6+v*.13)+v*1.7)*.42+(v-2)*.08,b=1300,A=M+Math.sin(_)*b,x=1100-Math.cos(_)*b,E=(.05+d*.08)*se(e*.4),w=l.createLinearGradient(M,1100,A,x);w.addColorStop(0,`rgba(255,170,110,${E*1.6})`),w.addColorStop(1,"rgba(255,120,80,0)"),l.fillStyle=w,l.beginPath(),l.moveTo(M-6,1100),l.lineTo(M+6,1100),l.lineTo(A+Math.cos(_)*160,x+Math.sin(_)*160),l.lineTo(A-Math.cos(_)*160,x-Math.sin(_)*160),l.closePath(),l.fill()}l.restore(),l.save(),l.globalCompositeOperation="lighter";let u=v=>Math.sin(e*v.sp+v.ph)*v.amp*(1+d*2);for(let v of this.crowd){let M=ce(11,2.5,v.z)*(1+d*.4),y=v.x+u(v),_=v.y+Math.cos(e*v.sp*.7+v.ph)*4,b=ce(.32,.14,v.z)*(.6+.4*Math.sin(e*3+v.ph*5))*(1+d*.6),A=l.createRadialGradient(y,_,0,y,_,M*2.6);if(A.addColorStop(0,v.col),A.addColorStop(.25,v.col+"88"),A.addColorStop(1,v.col+"00"),l.globalAlpha=se(b*se(e*.6+.2)),l.fillStyle=A,l.beginPath(),l.arc(y,_,M*2.6,0,be),l.fill(),v.z<.12){l.globalAlpha=se(b*.8),l.strokeStyle=v.col,l.lineWidth=Math.max(1.2,M*.28),l.beginPath();let x=Math.sin(e*v.sp+v.ph)*.35;l.moveTo(y,_),l.lineTo(y+Math.sin(x)*M*7,_+Math.cos(x)*M*7),l.stroke()}}l.restore();let f=960,g=540,S=.3*1080*.97,m=v=>{let M=230+v.t/5.3*1460,y=560-(v.m-66)*15,_=ge(Bi-.05+v.i*.008,Bi+.35+v.i*.012,e,Oe.inOutCubic),b=v.i/this.notes.length*be-Math.PI/2;return[ce(M,f+Math.cos(b)*S,_),ce(y,g+Math.sin(b)*S,_),_]};l.save(),l.globalCompositeOperation="lighter";let p=this.notes.filter(v=>e>=v.t-.02);p.length>1&&e<Bi+.6&&(l.strokeStyle="rgba(242,190,110,0.5)",l.lineWidth=1.4,l.beginPath(),p.forEach((v,M)=>{let[y,_]=m(v);M===0?l.moveTo(y,_):l.lineTo(y,_)}),l.globalAlpha=1-se((e-Bi)/.5),l.stroke(),l.globalAlpha=1);for(let v of p){let[M,y,_]=m(v),b=e-v.t,A=1-se((e-Bi-.6)/1.2);if(A<=0)continue;let x=5+Math.exp(-b*4)*10,E=l.createRadialGradient(M,y,0,M,y,x*4);E.addColorStop(0,"rgba(255,240,200,1)"),E.addColorStop(.3,"rgba(255,190,90,0.6)"),E.addColorStop(1,"rgba(255,120,40,0)"),l.fillStyle=E,l.globalAlpha=A,l.beginPath(),l.arc(M,y,x*4,0,be),l.fill(),b<.8&&(l.strokeStyle=`rgba(255,210,150,${(1-b/.8)*.8})`,l.lineWidth=1.2,l.beginPath(),l.arc(M,y,8+b*70,0,be),l.stroke()),l.globalAlpha=1,_<.1&&b<1.6&&(h.save(),h.globalAlpha=(1-b/1.6)*.7,ft(h,["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][Math.round(v.m)%12]+Math.floor(Math.round(v.m)/12-1),M+14,y-16,12,"#f2d58a"),h.restore())}if(l.restore(),e>9.6&&e<ut.v1[0]+.4){let v=Math.floor(e*9);for(let M=0;M<3;M++){let y=v*3+M,_=y/9/3,b=e-Math.floor(e*9)/9,A=at(y)*be,x=Ws(f+Math.cos(A)*S*1.02,g+Math.sin(A)*S*1.02,f+Math.cos(A)*(S+260+at(y+3)*300),g+Math.sin(A)*(S+260+at(y+3)*300),y+5e3,{branch:.6,depth:1,w:2.2});Qs(l,x,Xs(b+M*.03,y)*ge(9.6,11,e)*(at(y+9)<.7?1:0),1)}}{let y="THIS IS A JAPANESE SONG",_=Math.floor(se((e-5.82)/1.4799999999999995)*y.length);if(e>5.82-.1&&e<7.95+.6){let b=se((e-7.95)/.5);h.save(),h.globalAlpha=1-b;let A=b>0?Math.floor(at(Math.floor(e*30))*20)-10:0;ft(h,`[  ${y.slice(0,_)}${_<y.length&&Math.floor(e*4)%2?"\u258D":""}  ]`,960+A,930,30,"#f1e8da","center",.32),ft(h,"\u25CF VOICE  \xB7  INTRO  \xB7  "+e.toFixed(2)+"s",960,968,12,"rgba(241,232,218,0.5)","center"),h.restore()}}if(e>8.15){let M=ge(8.15,9.05,e,Oe.outCubic),y=a;h.save(),h.translate(f,g),h.scale(y,y),h.font=Te(_e.brush,300),h.textAlign="center",h.textBaseline="middle";let _=["\u30AB","\u30DF","\u30CA","\u30EC"],b=300;_.forEach((x,E)=>{let w=ge(8.15+E*.16,8.15+E*.16+.45,e,Oe.outCubic);if(w<=0)return;let R=(E-1.5)*b;h.save(),h.translate(R,0);let I=1.25-.25*w;h.scale(I,I),h.globalAlpha=se(w*1.6),w<.95&&(h.filter=`blur(${((1-w)*14).toFixed(1)}px)`),h.lineJoin="round",h.lineWidth=14,h.strokeStyle="rgba(20,8,4,0.85)",h.strokeText(x,4,8),h.fillStyle="#e8432b",h.fillText(x,0,0),h.restore()});let A=ge(8.15+.6,8.15+1.4,e);h.globalAlpha=A,h.font=Te(_e.mincho,40),h.fillStyle="#f6e7c8","letterSpacing"in h&&(h.letterSpacing="30px"),h.fillText("\u795E \u9CF4 \u308C",15,190),h.font=Te(_e.black,56),"letterSpacing"in h&&(h.letterSpacing="4px"),h.fillStyle="#f2d58a",h.fillText("Kaminare",0,-185),h.restore()}return e<4.6&&(h.save(),h.globalAlpha=jp(e,.4,4.6,.8,.8)*.85,ft(h,"LIVE  \xB7  \u795E\u9CF4 HALL  \xB7  2026",960,470,16,"#f1e8da","center",.5),ft(h,"ONE KEYBOARD.  FIVE NAMES.  ONE SOUND.",960,505,12,"rgba(241,232,218,0.55)","center",.4),h.restore()),this.glow.draw(i,t,{boost:2.2,scale:a}),this.type.draw(i,t,{}),{hudInk:"light",bloom:1.2,bloomThresh:.9,grain:.06,vig:.75,ca:.004,flash:Math.max(s>0&&s<.25?(1-s/.25)*.42:0,o*o*.9),exposure:1+(s>0?Math.exp(-s*3)*.4:0),hud:se(e/2)}}};var RS={"\u30ED\u30B6\u30EA\u30AA \u5DFB\u304D\u3064\u3051\u305F\u30CD\u30C3\u30AF":"a rosary wound around the neck",\u8056\u6B4C\u304C\u3086\u304C\u3093\u3067\u59CB\u307E\u308B:"the hymn begins \u2014 distorted",\u3072\u3087\u3046\u305F\u3093\u306B\u6708\u3092\u3072\u3068\u3064:"one moon, caught in a gourd",\u5F7C\u5973\u306F\u7B11\u3063\u3066\u6B4C\u3044\u51FA\u3059:"she laughs, and starts to sing",\u30D9\u30FC\u30B9\u304C\u4E0B\u3092\u9019\u3046\u3088\u3046\u306B:"the bass crawls along beneath",\u7948\u308A\u306E\u8A00\u8449\u306E\u3088\u3046\u306B:"like the words of a prayer","\u63FA\u308C\u308B\u7389\u97FF \u9AD8\u9CF4\u308B\u9F13\u52D5":"a trembling tamayura \xB7 a racing heart","\u4E94\u3064\u306E\u540D\u524D\u304C \u3072\u3068\u3064\u306E\u97F3\u306B\u306A\u308B":"five names become one sound","\u3055\u3042 \u30AB\u30DF\u30CA\u30EC":"come on \u2014 kaminare \xB7 resound, gods",\u7A7A\u307E\u3067\u3086\u304C\u307E\u305B\u3066:"bend it all the way up to the sky",\u8AB0\u306E\u795E\u3060\u3063\u3066\u69CB\u308F\u306A\u3044:"it doesn't matter whose god",\u30B5\u30D3\u3067\u306F\u5B97\u6D3E\u3082\u8981\u3089\u306A\u3044:"no sect is needed in the chorus",\u5C11\u5973\u306E\u58F0\u304C\u30E4\u30A4\u30D0\u306B\u306A\u3063\u3066:"a girl's voice becomes a blade",\u6C88\u9ED9\u3092\u5207\u308A\u88C2\u3044\u3066:"cutting the silence apart",\u79C1\u305F\u3061\u304C\u79C1\u305F\u3061\u306E\u795E:"we are our own gods","\u3055\u3042 \u3055\u3042":"come on \xB7 come on","\u56DB\u62CD\u5B50\u306E\u4E2D \u8AB0\u3082\u304C\u5E73\u7B49":"inside four-four time, everyone is equal",\u30B9\u30C6\u30A3\u30C3\u30AF\u306F\u516B\u8292\u661F:"the sticks trace eight-pointed stars",\u30C4\u30FC\u30D0\u30B9\u3067\u591C\u3092\u7815\u3044\u3066:"twin kick drums smash the night",\u30EA\u30FC\u30C9\u306F\u767D\u3044\u9CE9\u306B\u306A\u3063\u3066:"the lead line becomes a white dove",\u796D\u58C7\u304B\u3089\u97F3\u306E\u58C1\u3078:"from the altar to the wall of sound",\u304A\u7D4C\u3068\u5F26\u3092\u9CF4\u3089\u3057\u3066:"ringing out sutras and strings",\u540C\u3058\u632F\u52D5\u3092\u4FE1\u3058\u3066\u308B:"we believe in the same vibration","\u9055\u3046\u540D\u524D \u9055\u3046\u7948\u308A":"different names \xB7 different prayers",\u540C\u3058\u30B5\u30D3\u3067\u51FA\u4F1A\u3046:"meeting in the same chorus",\u8AB0\u3082\u982D\u3092\u4E0B\u3052\u306A\u304F\u3066\u3044\u3044:"nobody has to bow their head",\u5F26\u306F\u3059\u3079\u3066\u306E\u4FE1\u5FC3\u3092\u77E5\u3063\u3066\u308B:"the strings know every kind of faith","\u3082\u3057\u660E\u65E5 \u58F0\u3092\u6BBA\u305B\u3068\u8A00\u308F\u308C\u3066\u3082":"even if tomorrow they tell us to kill our voices","\u7B11\u3044\u58F0\u3082 \u97F3\u91CF\u3082":"our laughter, our volume \u2014","\u6559\u4F1A\u3054\u3068 \u795E\u6BBF\u3054\u3068":"whole churches, whole shrines",\u4E38\u3054\u3068\u30B9\u30C6\u30FC\u30B8\u306B\u4E57\u305B\u3066\u3084\u308B:"we'll haul it all up onto the stage","\u3053\u306E\u62CD\u306E\u4E0A \u8AB0\u3082\u304C\u5E73\u7B49":"on top of this beat, everyone is equal",\u6700\u5F8C\u306E\u97F3\u7B26\u304C\u843D\u3061\u3066:"the last note falls",\u9418\u306E\u4F59\u97FB\u3060\u3051\u304C\u6B8B\u308B:"only the bell's echo remains"},bn=n=>RS[n.text]||"";var PS=new L,IS=["CRUX","TORII","DHARMACAKRA","HIL\u0100L","MAGEN DAVID","KHATAM","TAIJITU","PADMA"],DS={ch1:{top:[.02,.02,.07],mid:[.1,.04,.18],low:[.36,.07,.12],rim:[1,.36,.18],win:[.3,.13,.22],fog:[.03,.02,.06]},ch2:{top:[.05,.02,.04],mid:[.2,.06,.08],low:[.55,.16,.06],rim:[1,.62,.22],win:[.4,.22,.12],fog:[.06,.025,.03]},fc:{top:[.03,.01,.07],mid:[.22,.03,.22],low:[.62,.08,.32],rim:[1,.4,.62],win:[.45,.16,.36],fog:[.07,.015,.08]}},fh=class{constructor(e){this.app=e}init(){this.scene=new Di,this.cam=new sn(60,16/9,.1,1500),this.sky=new Kr,this.nave=im(),this.scene.add(this.nave.group);let e=om(Vs,256);this.symTex=ks(e),this.rose=new zt(new No(this.nave.P.roseR,96),sm(this.symTex,Vs.length)),this.rose.position.set(0,this.nave.P.roseY,this.nave.P.roseZ),this.scene.add(this.rose);let t=this.nave.P.roseR,i=new zt(new Ko(t*.995,t*1.1,128,1),new Ps({color:723212}));i.position.copy(this.rose.position).add(new L(0,0,.05)),this.scene.add(i);let s=[];for(let h=0;h<=256;h++){let d=h/256*Math.PI*2;s.push(new L(Math.cos(d)*t*1.1,Math.sin(d)*t*1.1,0))}this.ringLine=new Rr(new Rt().setFromPoints(s),new Cr({color:new Ae(2.2,1.5,.7)})),this.ringLine.position.copy(i.position),this.scene.add(this.ringLine),this.layer=new Nt(0),this.glow=new Nt(1);let r=document.createElement("canvas");r.width=r.height=256;let o=r.getContext("2d");o.fillStyle="#fff",Sn(o,Ui.dove,128,128,110);let a=90,c=new Ns().copy(new Yn(1,1)),l=new Float32Array(a);for(let h=0;h<a;h++)l[h]=h/a;c.setAttribute("aSeed",new jn(l,1)),c.instanceCount=a,this.birdMat=new Et({uniforms:{uTime:{value:0},uOn:{value:0},uCamZ:{value:0},tDove:{value:ks(r)},uFog:{value:new Ae}},vertexShader:`
        attribute float aSeed; uniform float uTime, uCamZ; varying vec2 vUv; varying float vD;
        void main(){
          vUv = uv;
          float s = aSeed;
          float z = uCamZ - 6. - mod(uTime*(14. + s*10.) + s*260., 220.);
          vec3 c = vec3(sin(s*91.+uTime*0.8)*9., 6. + sin(s*47. + uTime*1.3)*4. + s*10., z);
          float flap = 0.35 + 0.65*abs(sin(uTime*(9.+s*6.) + s*30.));
          vec4 mv = viewMatrix * vec4(c, 1.);
          float sz = 1.4 + s*1.2;
          mv.xy += position.xy * vec2(sz, sz*flap);
          vD = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform sampler2D tDove; uniform float uOn; uniform vec3 uFog; varying vec2 vUv; varying float vD;
        void main(){
          float a = texture2D(tDove, vUv).a * uOn;
          if(a < 0.05) discard;
          float fog = 1. - exp(-pow(vD*0.006, 1.4));
          vec3 c = mix(vec3(1.6,1.5,1.4), uFog, fog);
          gl_FragColor = vec4(c, a*(1.-fog*0.8));
        }`,transparent:!0,depthWrite:!1}),this.birds=new zt(c,this.birdMat),this.birds.frustumCulled=!1,this.scene.add(this.birds),this.V={};for(let h of["ch1","ch2","fc"]){let d=an(h),u=d.map((f,g)=>g===0?ut[h][0]:Tt(Math.round(xt(f.t0-.1))));this.V[h]={key:h,t0:ut[h][0],t1:ut[h][1],ls:d,cuts:u}}}variant(e){return e<ut.post[0]+2?this.V.ch1:e<ut.inter[0]+2?this.V.ch2:this.V.fc}camera(e,t,i,s,r){let o=this.cam,a=this.nave.P,c=a.roseY,l=a.roseZ,h=[0,4,0],d=[0,c,l],u=60,f=0,g=e.key==="ch2"?-1:1;switch(t){case 0:{let p=Oe.outQuart(i);e.key==="ch2"?(h=[Math.sin(s*.7)*.6,ce(34,4.5,Oe.inOutCubic(i)),ce(-10,-70,p)],d=[0,ce(0,c*.8,Oe.inOutCubic(i)),l],u=ce(70,58,p)):(h=[Math.sin(s*.7)*.6,4.2+Math.sin(i*3)*.4,ce(e.key==="fc"?40:14,-70,p)],d=[0,c*.8,l],u=ce(e.key==="fc"?92:78,58,p),f=(1-p)*(e.key==="fc"?.35:.12)*g);break}case 1:{let p=Oe.inOutCubic(i);h=[0,ce(4,7,p),ce(-74,-96,i)],d=[0,ce(c,160,p),ce(l,-110,p)],u=ce(60,82,p),f=p*.25*g;break}case 2:{h=[Math.sin(i*2)*1.5,13.6,ce(-170,-205,Oe.outCubic(i))],d=[0,c,l],u=52;break}case 3:{e.key==="fc"?(h=[ce(-14,14,i),38,ce(14,-24,i)],d=[0,2,-150],u=62,f=.05):(h=[0,c,ce(-258,-266,i)],d=[0,c,l],u=58,f=xt(s)*.09*g);break}case 4:{h=[-4.8*g,2.2,ce(-30,-150,i)],d=[9*g,5.5,ce(-36,-156,i)],u=74,f=-.06*g;break}case 5:{if(e.key==="ch2")h=[ce(-6,6,i),30,ce(-110,-130,i)],d=[0,3,-175],u=60;else if(e.key==="fc"){let p=ce(-.6,.6,i);h=[Math.sin(p)*9,2.2,-150+Math.cos(p)*9],d=[0,12,-175],u=72}else h=[0,1.4,ce(-128,-140,i)],d=[0,14,-168],u=70;break}case 6:{let p=e.ls[6].c[3],v=s>p;h=[0,v?5:3,v?ce(-150,-185,ge(p,e.cuts[7]??p+2,s)):ce(-112,-120,i)],d=v?[0,c,l]:[0,6,-200],u=v?64:48,f=v?(1-ge(p,p+.6,s))*.4:0;break}case 7:{let p=Oe.inOutCubic(i);h=[0,c-3+p*1,ce(-236,-205,p)],d=[0,c,l],u=ce(48,56,p);break}}let S=Dt(s,14)*(t===3?.3:1),m=.18*S;o.position.set(h[0]+ua(s*30,1)*m,h[1]+ua(s*30,2)*m,h[2]),o.up.set(Math.sin(f),Math.cos(f),0),o.lookAt(d[0],d[1],d[2]),o.fov=u*(1-S*.015),o.updateProjectionMatrix()}render(e,t){let i=this.app.renderer,s=this.variant(e),r=DS[s.key],o=0;for(let E=0;E<s.cuts.length;E++)e>=s.cuts[E]&&(o=E);let a=s.cuts[o],c=s.cuts[o+1]??s.t1,l=se((e-a)/(c-a)),h=s.ls[o];this.camera(s,o,l,e,e-a);let d=s.key==="fc"?.6:s.key==="ch2"?.45:.36,u=[];for(let E=0;E<hs.length;E++){let w=hs[E];if(w>e)break;w<e-.6||w<s.t0-.05||at(E*7+3)<d&&u.push({age:e-w,seed:E})}(o===0||o===4)&&h.c.forEach((E,w)=>{h.text[w]!==" "&&w>=3&&e>=E-.04&&e<E+.6&&u.push({age:e-E+.04,seed:900+w+o*10,char:w})});let f=0;for(let E of u)f=Math.max(f,Xs(E.age,E.seed));let g=this.nave.shared,S=Dt(e,6);g.uCam.value.copy(this.cam.position),g.uFlash.value=f*.9,g.uPulse.value=Math.exp(-ah(e)*2.5)*(s.key==="ch1"?.8:1.1),g.uPulseZ.value=this.cam.position.z-6-ah(e)*110,g.uFog.value.setRGB(...r.fog),g.uWin.value.setRGB(...r.win.map(E=>E*(1+S*.6))),this.nave.pMat.uniforms.uTime.value=e;let m=this.birdMat.uniforms;if(m.uTime.value=e,m.uCamZ.value=this.cam.position.z,m.uOn.value=s.key==="ch1"?0:1,m.uFog.value.setRGB(...r.fog),s.key==="fc"&&o===3){let E=xt(e);g.uPulseZ.value=-20-Math.floor(E)%4*36-E%1*20,g.uPulse.value=1.6*Math.exp(-(E%1)*2)}let p=this.rose.material.uniforms;p.uTime.value=e,p.uGlow.value=(s.key==="fc"?1.45:1.25)*(1+S*.3)+(o===7?ge(a,c,e)*(s.key==="fc"?.35:.6):0),p.uFlash.value=f*.4,p.uBeat.value=Ni(e,1,5),p.uHue.value=s.key==="fc"?.12:s.key==="ch2"?.35:0;let v=o===3&&s.key!=="fc";p.uKal.value=v?1:0;let M=xt(e);p.uRot1.value=v?M*.18:e*.02,p.uRot2.value=v?-M*.12:-e*.015,p.uRot3.value=v?M*.09:e*.01;let y=Math.floor(M);p.uSymA.value=((y-1)%8+8)%8,p.uSymB.value=(y%8+8)%8,p.uSymMix.value=o===2||o===3?se(M%1*5):1,o!==2&&o!==3&&(p.uSymA.value=p.uSymB.value=5);let _=PS.set(Math.sin((u[0]?.seed??0)*1.7)*.8,.7,-1);this.sky.draw(i,t,this.cam,{time:e,warp:o===1?ge(a,c,e,Oe.inOutCubic)*1.1:o===3&&v?.15:0,flash:f,pal:r,flashDir:_,swirl:[.5,.72],dark:o===6&&e<h.c[3]?.6:0}),i.setRenderTarget(t),i.render(this.scene,this.cam);let b=this.layer.begin(),A=this.glow.begin();this.draw2D(b,A,e,s,o,l,a,c,h,u),this.glow.draw(i,t,{boost:2.6,time:e}),this.layer.draw(i,t,{warp:o===1?ge(a,c,e)*.02:0,time:e});let x={hudInk:"light",bloom:s.key==="fc"?o===7?.95:1.25:o===7?.95:1.1,ca:.0035+S*.006,bloomThresh:.95,grain:.055,vig:.65,flash:f*.12,exposure:1+f*.25,rays:o===7?s.key==="fc"?.3:.4:o===2||o===3?.5:.25,raysX:.5,raysY:o===2||o===7?.5:.62,raysLen:.5,hue:s.key==="fc"?-.12:0,contrast:1.06,sat:1.08};if(o===6){let E=h.c[3],w=e-E;w>-.02&&w<.5&&(x.flash=Math.max(x.flash,Math.exp(-Math.max(w,0)*9)*.9),x.invert=w<.07?1:0,x.ca=.03*Math.exp(-w*6)),e<E&&(x.sat=.15,x.contrast=1.2)}return o===0&&l<.08&&(x.flash=Math.max(x.flash,(1-l/.08)*.8)),x}draw2D(e,t,i,s,r,o,a,c,l,h){for(let m of h){let p=Xs(m.age,m.seed);if(p<=0)continue;let v,M,y,_;if(m.char!==void 0&&this._charPos){let A=this._charPos[m.char];if(!A)continue;v=A[0]+(at(m.seed)-.5)*400,M=-20,y=A[0],_=A[1]-60}else v=200+at(m.seed*3)*1520,M=-30,y=v+(at(m.seed*5)-.5)*700,_=280+at(m.seed*11)*420;let b=Ws(v,M,y,_,m.seed,{branch:.7,depth:2,w:3.2});Qs(t,b,p,se(m.age/.05),s.key==="fc"?[255,170,235]:[190,210,255])}this._charPos=null;let d=bn(l),u="#f1e8da";e.textAlign="center",e.textBaseline="middle";let f=(m=30,p="rgba(0,0,0,0.55)")=>{e.shadowColor=p,e.shadowBlur=m},g=()=>{e.shadowBlur=0,e.shadowColor="transparent"},S=(m,p=1)=>{e.save(),e.globalAlpha=p*se((i-l.t0)*3),e.font=Te(_e.serif,30),e.fillStyle="rgba(245,232,210,0.85)","letterSpacing"in e&&(e.letterSpacing="6px"),e.fillText(d.toUpperCase(),960,m),e.restore()};if(r===0||r===4){let m=r===4,p=m?200:290;e.font=Te(_e.gothic,p);let v;m?(v=ln("\u30AB\u30DF\u30CA\u30EC",1450*(s.key==="ch2",1),120,p,1.02),s.key==="ch2"&&v.forEach(y=>y.x=470)):v=Ht(e,"\u30AB\u30DF\u30CA\u30EC",960,560,p,-6),this._charPos={},v.forEach((y,_)=>this._charPos[_+3]=[y.x,y.y]),e.save(),e.font=Te(_e.mincho,70),e.fillStyle=u;let M=Ht(e,"\u3055\u3042",m?s.key==="ch2"?760:1160:960,300,70,30);f(30),M.forEach((y,_)=>vt.rise(e,y,se((i-l.c[_]+.05)/.25),70)),e.restore(),e.save(),e.font=Te(_e.gothic,p),v.forEach((y,_)=>{let b=_+3,A=se((i-l.c[b]+.04)/.22);if(A<=0)return;let x=Math.exp(-(i-l.c[b])*6);e.save(),e.globalCompositeOperation="lighter",e.fillStyle=`rgba(227,64,42,${.55*se(A*3)})`;let E=10+x*26,w={...y,x:y.x+E,y:y.y+E*.4};m?(e.save(),e.translate(w.x,w.y),Xr(e,y.ch,0,0,p),e.restore()):e.fillText(y.ch,w.x,w.y),e.restore(),e.fillStyle=u,f(40+x*60,`rgba(255,220,180,${.3+x*.6})`),vt.slam(e,y,A,p,m),g()}),e.restore(),m?S(1e3):(e.save(),e.font=Te(_e.mincho,34),e.fillStyle="rgba(242,213,138,0.9)","letterSpacing"in e&&(e.letterSpacing="22px"),e.globalAlpha=se((i-l.c[6])*2),e.fillText("\u795E \u9CF4 \u308C",960,760),e.restore(),S(820))}else if(r===1){let m=ge(a,c,i,Oe.inOutCubic);e.save(),e.font=Te(_e.gothic,132),e.fillStyle=u,f(30);let p=l.text,v=520-m*120,M=960,y=760;for(let _=0;_<p.length;_++){let b=se((i-l.c[_]+.05)/.3);if(b<=0)continue;let A=-Math.PI/2+(_-(p.length-1)/2)*(.19+m*.03)+m*.25+Math.sin(i*2+_)*.02*m;e.save(),e.translate(M+Math.cos(A)*v,y+Math.sin(A)*v),e.rotate(A+Math.PI/2),e.globalAlpha=se(b*2);let x=1+(1-Oe.outBack(b))*.5;e.scale(x,x),e.fillText(p[_],0,0),e.restore()}e.restore(),S(980)}else if(r===2){e.save(),e.font=Te(_e.mincho,96),e.fillStyle=u,f(30);let m=ln("\u8AB0\u306E\u795E\u3060\u3063\u3066",330,180,96,1.06),p=ln("\u69CB\u308F\u306A\u3044",1590,300,96,1.06);p.forEach(y=>y.i+=6);for(let y of[...m,...p])vt.ink(e,y,se((i-l.c[y.i]+.05)/.3),96,!0);g();let v=xt(i),M=(Math.floor(v)%8+8)%8;e.font=Te(_e.mono,22),e.fillStyle="rgba(242,213,138,0.95)","letterSpacing"in e&&(e.letterSpacing="9px"),e.globalAlpha=.9,e.fillText(`${String(M+1).padStart(2,"0")} / 08 \u2014 ${IS[M]}`,960,930),e.restore(),S(990)}else if(r===3)if(s.key==="fc"){e.save(),e.font=Te(_e.gothic,120),e.fillStyle=u,f(30),Ht(e,"\u3053\u306E\u62CD\u306E\u4E0A",960,330,120,4).forEach(M=>vt.rise(e,M,se((i-l.c[M.i]+.05)/.25),120)),Ht(e,"\u8AB0\u3082\u304C\u5E73\u7B49",960,620,120,4).forEach(M=>{M.i+=6,vt.rise(e,M,se((i-l.c[M.i]+.05)/.25),120)}),g();let v=xt(i);e.font=Te(_e.mono,64);for(let M=0;M<4;M++){let y=Math.floor(v)%4===M;e.fillStyle=y?"#ff5aa0":"rgba(255,255,255,0.25)",e.fillText(String(M+1),960+(M-1.5)*150,820)}e.restore(),S(930)}else{e.save();let m=e.createRadialGradient(960,520,60,960,520,760);m.addColorStop(0,"rgba(8,4,10,0.62)"),m.addColorStop(.6,"rgba(8,4,10,0.35)"),m.addColorStop(1,"rgba(8,4,10,0)"),e.fillStyle=m,e.globalAlpha=se((i-a)*3),e.fillRect(0,0,1920,1080),e.globalAlpha=1,e.font=Te(_e.gothic,230),e.lineWidth=3,e.strokeStyle="rgba(255,240,220,0.95)";let p=Ht(e,"\u30B5\u30D3\u3067\u306F",960,380,230,0);for(let M of p){let y=se((i-l.c[M.i]+.05)/.2);if(y<=0)continue;e.save(),e.translate(M.x,M.y);let _=1+(1-Oe.outExpo(y))*.8;e.scale(_,_),e.strokeText(M.ch,0,0),e.restore()}e.font=Te(_e.mincho,92),e.fillStyle=u,f(24),Ht(e,"\u5B97\u6D3E\u3082\u8981\u3089\u306A\u3044",960,660,92,18).forEach(M=>{M.i+=4,vt.ink(e,M,se((i-l.c[M.i]+.05)/.3),92,!1)}),e.restore(),S(800)}else if(r===5){let p=ge(l.c[5]-.1,l.c[7]+.2,i,Oe.outCubic);if(p>0){t.save(),t.globalCompositeOperation="lighter";let _=1700*p,b=t.createLinearGradient(960-_/2,0,960+_/2,0);b.addColorStop(0,"rgba(160,190,255,0)"),b.addColorStop(.5,"rgba(255,255,255,1)"),b.addColorStop(1,"rgba(160,190,255,0)"),t.fillStyle=b,t.beginPath(),t.moveTo(960-_/2,560),t.quadraticCurveTo(960,546,960+_/2,557),t.quadraticCurveTo(960,566,960-_/2,560),t.fill();for(let A=0;A<6;A++){let x=960-_/2+(A+.5)/6*_,E=Ws(x,556,x+(at(A+40)-.5)*200,440-at(A)*160,400+A+Math.floor(i*12),{branch:.3,depth:1,w:1.6});Qs(t,E,.5*p,1,[170,200,255])}t.restore()}e.save(),e.font=Te(_e.mincho,64),e.fillStyle=u,f(20),Ht(e,"\u5C11\u5973\u306E\u58F0\u304C",960,330,64,14).forEach(_=>vt.ink(e,_,se((i-l.c[_.i]+.05)/.3),64,!1)),e.font=Te(_e.gothic,210),Ht(e,"\u30E4\u30A4\u30D0",960,560,210,30).forEach(_=>{_.i+=5;let b=se((i-l.c[_.i]+.04)/.2);e.save(),e.globalCompositeOperation="source-over",f(50,"rgba(160,200,255,0.9)"),vt.slam(e,_,b,210,!1),e.restore()}),e.font=Te(_e.mincho,64),Ht(e,"\u306B\u306A\u3063\u3066",960,780,64,14).forEach(_=>{_.i+=8,vt.ink(e,_,se((i-l.c[_.i]+.05)/.3),64,!1)}),e.restore(),S(880)}else if(r===6){let m=l.c[3],p=i-m;e.save(),e.font=Te(_e.gothic,250);let v=Ht(e,"\u6C88\u9ED9\u3092",960,470,250,10),M=()=>{e.fillStyle=p<0?"rgba(220,214,206,0.92)":u,v.forEach(_=>vt.rise(e,_,se((i-l.c[_.i]+.05)/.4),250))};if(p<0)M();else{let _=Oe.outExpo(se(p/.5))*90,b=-.38;for(let E of[-1,1]){e.save(),e.beginPath();let w=Math.sin(b),R=-Math.cos(b),I=4e3,N=960,D=470,U=Math.cos(b)*I,W=Math.sin(b)*I;e.moveTo(N-U,D-W),e.lineTo(N+U,D+W),e.lineTo(N+U+w*I*E,D+W+R*I*E),e.lineTo(N-U+w*I*E,D-W+R*I*E),e.closePath(),e.clip(),e.translate(Math.cos(b)*_*E,Math.sin(b)*_*E),M(),e.restore()}let A=se(p/.12);t.save(),t.globalCompositeOperation="lighter",t.strokeStyle=`rgba(255,250,240,${Math.exp(-p*3)})`,t.lineWidth=6*Math.exp(-p*2)+1,t.beginPath();let x=-.38;t.moveTo(960-Math.cos(x)*1400*A,470-Math.sin(x)*1400*A),t.lineTo(960+Math.cos(x)*1400*A,470+Math.sin(x)*1400*A),t.stroke(),t.restore()}e.font=Te(_e.mincho,96),e.fillStyle=u,Ht(e,"\u5207\u308A\u88C2\u3044\u3066",960,780,96,24).forEach(_=>{_.i+=3,vt.slam(e,_,se((i-l.c[_.i]+.03)/.18),96,!1)}),e.restore(),S(900)}else if(r===7){let m=ge(a,a+1.2,i,Oe.outCubic);e.save();let p=e.createRadialGradient(960,520,0,960,520,330);p.addColorStop(0,"rgba(10,4,8,0.72)"),p.addColorStop(.75,"rgba(10,4,8,0.5)"),p.addColorStop(1,"rgba(10,4,8,0)"),e.fillStyle=p,e.globalAlpha=m,e.beginPath(),e.arc(960,520,340,0,be),e.fill(),e.restore();let v=l.c[8],M=s.key==="fc"?ge(v-.3,v+.4,i,Oe.outCubic):0;if(M>0){t.save(),t.globalCompositeOperation="lighter";for(let A=0;A<10;A++){let x=A/10*be+xt(i)*.05-Math.PI/2,E=1400*M,w=yi[A%5],R=t.createLinearGradient(960,520,960+Math.cos(x)*E,520+Math.sin(x)*E);R.addColorStop(0,w+"00"),R.addColorStop(.25,w+"55"),R.addColorStop(1,w+"00"),t.fillStyle=R,t.beginPath(),t.moveTo(960,520),t.lineTo(960+Math.cos(x-.05)*E,520+Math.sin(x-.05)*E),t.lineTo(960+Math.cos(x+.05)*E,520+Math.sin(x+.05)*E),t.closePath(),t.fill()}for(let A=0;A<160;A++){let x=i-v;if(x<0)break;let E=at(A*3+1)*be,w=300+at(A*5+2)*900,R=960+Math.cos(E)*w*x*(1-x*.25),I=520+Math.sin(E)*w*x*(1-x*.25)+x*x*260,N=x*8+A;t.save(),t.translate(R,I),t.rotate(N),t.globalAlpha=Math.max(0,1-x*.7),t.fillStyle=A%7===0?yi[A%5]:"#ffd27a";let D=4+at(A)*9;t.fillRect(-D/2,-D*Math.abs(Math.cos(x*9+A))/2,D,D*Math.abs(Math.cos(x*9+A))+1),t.restore()}t.restore()}am(e,960,520,330+m*40+M*30,{time:i,pulse:Math.max(Dt(i,7),M*Math.exp(-(i-v)*3)),alpha:m,spin:xt(i)*.08+(1-m)*-1.2+M*(i-v)*.8}),e.save(),e.font=Te(_e.mincho,70),e.fillStyle=u,f(30,"rgba(0,0,0,0.8)"),Ht(e,"\u79C1\u305F\u3061\u304C",960,380,70,22).forEach(A=>vt.ink(e,A,se((i-l.c[A.i]+.05)/.3),70,!1)),e.font=Te(_e.mincho,150);let _=e.createLinearGradient(0,470,0,640);_.addColorStop(0,"#fff6d6"),_.addColorStop(1,"#f0b54e"),e.fillStyle=_,f(50,"rgba(255,170,60,0.75)"),Ht(e,"\u79C1\u305F\u3061\u306E\u795E",960,560,150,6).forEach(A=>{A.i+=4,vt.ink(e,A,se((i-l.c[A.i]+.05)/.35),150,!1)}),e.restore(),S(930)}}};function LS(n,e=2,t=!1){let i=n.map(c=>[c[0],c[1],c[2]??1]);if(i.length<2)return i;let s=[],r=i.length,o=c=>t?i[(c+r)%r]:i[se(c,0,r-1)],a=t?r:r-1;for(let c=0;c<a;c++){let l=o(c-1),h=o(c),d=o(c+1),u=o(c+2),f=Math.hypot(d[0]-h[0],d[1]-h[1]),g=Math.max(1,Math.ceil(f/e));for(let S=0;S<g;S++){let m=S/g,p=m*m,v=p*m,M=(y,_,b,A)=>.5*(2*_+(-y+b)*m+(2*y-5*_+4*b-A)*p+(-y+3*_-3*b+A)*v);s.push([M(l[0],h[0],d[0],u[0]),M(l[1],h[1],d[1],u[1]),ce(h[2],d[2],m)])}}return t?s.push(s[0].slice()):s.push(i[r-1].slice()),s}var lm=n=>{let e=se(n/.08),t=se((1-n)/.35);return(.35+.65*Math.sin(e*Math.PI/2))*(.25+.75*Math.pow(t,.7))},Si=class{constructor(e,t,{seed:i=1,scale:s=1}={}){this.w=e,this.h=t,this.scale=s,this.R=Vt(i),this.strokes=[],this.ops=[]}stroke(e,t={}){return this.strokes.push({pts:e,...t,kind:"stroke"}),this}fill(e,t={}){return this.strokes.push({fn:e,...t,kind:"fill"}),this}splat(e,t,i,s={}){return this.strokes.push({x:e,y:t,r:i,...s,kind:"splat"}),this}bake(){let e=this.scale,t=Math.round(this.w*e),i=Math.round(this.h*e),s=document.createElement("canvas");s.width=t,s.height=i;let r=document.createElement("canvas");r.width=t,r.height=i;let o=s.getContext("2d"),a=r.getContext("2d");o.setTransform(e,0,0,e,0,0),a.setTransform(e,0,0,e,0,0),a.fillStyle="#fff",a.fillRect(0,0,this.w,this.h),o.lineCap="round",o.lineJoin="round",a.lineCap="round",a.lineJoin="round";let c=document.createElement("canvas");c.width=t,c.height=i,this._bleed=c.getContext("2d"),this._bleed.setTransform(e,0,0,e,0,0),this._bleed.lineCap="round";for(let l of this.strokes)l.kind==="stroke"?this._drawStroke(o,l):l.kind==="fill"?this._drawFill(o,l):this._drawSplat(o,l);this._bleedW&&(o.save(),o.setTransform(1,0,0,1,0,0),o.globalCompositeOperation="destination-over",o.filter=`blur(${Math.max(1.5,this._bleedW*.12*e).toFixed(1)}px)`,o.drawImage(c,0,0),o.restore()),this._bleed=null;for(let l=this.strokes.length-1;l>=0;l--){let h=this.strokes[l];h.kind==="stroke"?this._timeStroke(a,h):h.kind==="fill"?this._timeFill(a,h):this._timeSplat(a,h)}return this.color=s,this.time=r,this}_path(e){return e._rs||(e._rs=LS(e.pts,1.6,e.closed)),e._rs}_drawStroke(e,t){let i=this.R,s=this._path(t),r=s.length;if(r<2)return;let o=t.w??12,a=t.pressure||lm,c=t.dry??.5,l=t.ink??1,h=t.color||"#100d0c",d=t.bristles??Math.round(se(o*.85,8,110)),u=t.pts[0][2]!==void 0,f=[0];for(let b=1;b<r;b++)f[b]=f[b-1]+Math.hypot(s[b][0]-s[b-1][0],s[b][1]-s[b-1][1]);let g=f[r-1]||1,S=s.map((b,A)=>{let x=s[Math.max(0,A-2)],E=s[Math.min(r-1,A+2)],w=E[0]-x[0],R=E[1]-x[1],I=Math.hypot(w,R)||1;return[-R/I,w/I]}),m=b=>o*a(f[b]/g)*(u?s[b][2]:1)*(t.spread??1),p=i.int(0,1e6),v=t.bleed??.35;if(v>0&&this._bleed){let b=this._bleed;b.save(),b.globalAlpha=.13*v*l*se(1.1-c),b.strokeStyle=h;for(let A=1;A<r;A+=2){let x=f[A]/g;b.lineWidth=m(A)*(1+.25*(1-x)),b.beginPath(),b.moveTo(s[A-1][0],s[A-1][1]),b.lineTo(s[Math.min(r-1,A+1)][0],s[Math.min(r-1,A+1)][1]),b.stroke()}b.restore(),this._bleedW=Math.max(this._bleedW||0,Math.min(o,60))}e.save(),e.strokeStyle=h,e.fillStyle=h;let M=(t.body??.92)*l*se(1-c*1.4);if(M>.02){let b=[],A=[];for(let E=0;E<r;E+=2){let w=f[E]/g,R=m(E)*.5*.86*se(1-Math.pow(w,2)*c);b.push([s[E][0]+S[E][0]*R,s[E][1]+S[E][1]*R]),A.push([s[E][0]-S[E][0]*R,s[E][1]-S[E][1]*R])}e.globalAlpha=M,e.beginPath(),e.moveTo(b[0][0],b[0][1]);for(let E of b)e.lineTo(E[0],E[1]);for(let E=A.length-1;E>=0;E--)e.lineTo(A[E][0],A[E][1]);e.closePath(),e.fill();let x=m(Math.min(r-1,2))*.43;x>1&&(e.beginPath(),e.arc(s[0][0],s[0][1],x,0,Math.PI*2),e.fill())}if((t.blob??0)>0&&o>8){let b=m(Math.min(r-1,3));e.globalAlpha=.9*l,e.beginPath();let A=Math.atan2(S[0][1],S[0][0]);e.ellipse(s[0][0],s[0][1],b*.5,b*.42,A,0,Math.PI*2),e.fill()}let y=Math.max(.6,o/d*1.7);for(let b=0;b<d;b++){let A=b/(d-1)*2-1+(i()-.5)*(2.2/d),x=Math.abs(A),E=.7+.3*i(),w=(.5+i())*(.65+x*.8),R=.0035+i()*.011,I=.03+i()*.05,N=p+b*13,D=(.82+.18*i())*l;e.lineWidth=y*(.75+i()*.5);let U=!1,W=0;for(let k=0;k<r;k++){let re=f[k]/g,q=m(k);if(q<.4){U&&(e.stroke(),U=!1);continue}let Z=ls(f[k]*.006+b*3.1,N)*.06,ee=s[k][0]+S[k][0]*(A+Z)*q*.5,Ge=s[k][1]+S[k][1]*(A+Z)*q*.5,Le=se(c*w*(.22+1.05*Math.pow(re,1.2))+(1-E)*.35-.06),dt=(Rf(f[k]*.0055,A*2.6,p)*.62+Rf(f[k]*.022,A*9,p+3)*.28+ls(f[k]*I,N+7)*.1)*.5+.5;dt>Le?U?e.lineTo(ee,Ge):(e.beginPath(),e.moveTo(ee,Ge),U=!0,W=0,e.globalAlpha=se(D*(.75+(dt-Le)*2))):U&&(e.stroke(),U=!1)}U&&e.stroke()}let _=t.spatter??0;if(_>0)for(let b=0;b<_*14;b++){let A=Math.floor(i()*Math.min(r,40)),x=i()*Math.PI*2,E=o*(.55+i()*1.6);e.globalAlpha=(.5+i()*.5)*l,e.beginPath(),e.arc(s[A][0]+Math.cos(x)*E,s[A][1]+Math.sin(x)*E,i()*o*.07+.5,0,Math.PI*2),e.fill()}e.restore()}_timeStroke(e,t){let i=this._path(t),s=i.length;if(s<2)return;let r=t.w??12,o=t.pressure||lm,a=[0];for(let d=1;d<s;d++)a[d]=a[d-1]+Math.hypot(i[d][0]-i[d-1][0],i[d][1]-i[d-1][1]);let c=a[s-1]||1,l=t.t0??0,h=t.t1??1;for(let d=s-1;d>=1;d--){let u=a[d]/c,f=se(ce(l,h,u)),g=Math.round(f*254);e.strokeStyle=`rgb(${g},${g},${g})`;let S=Math.max(o(u),.15)*(t.pts[0][2]!==void 0?i[d][2]:1);e.lineWidth=r*S*(t.spread??1)*1.35+6,e.beginPath(),e.moveTo(i[d][0],i[d][1]),e.lineTo(i[d-1][0],i[d-1][1]),e.stroke()}}_drawFill(e,t){e.save(),e.fillStyle=t.color||"#100d0c",e.globalAlpha=t.alpha??1,t.blur&&(e.filter=`blur(${t.blur}px)`),t.fn(e,this.R),e.restore()}_timeFill(e,t){let i=t.t0??0,s=t.t1??1,[r,o,a,c]=t.bounds||[0,0,this.w,this.h],l=Math.max(6,Math.min(48,Math.round(Math.max(a,c)/6)));e.save(),e.beginPath(),t.fn(new Ff(e),this.R,!0),e.clip();let[h,d,u,f]=t.bounds||[0,0,this.w,this.h];for(let g=l-1;g>=0;g--){let S=se(ce(i,s,g/(l-1))),m=Math.round(S*254);if(e.fillStyle=`rgb(${m},${m},${m})`,t.from==="center"){let p=h+u/2,v=d+f/2,M=Math.hypot(u,f)/2*((g+1)/l);e.beginPath(),e.arc(p,v,M,0,Math.PI*2),e.fill()}else t.from==="top"?e.fillRect(h-4,d-4,u+8,(f+8)*(g+1)/l):e.fillRect(h-4,d-4,(u+8)*(g+1)/l,f+8)}e.restore()}_drawSplat(e,t){let i=this.R;e.save(),e.fillStyle=t.color||"#100d0c";let s=t.n??18;for(let r=0;r<s;r++){let o=i()*Math.PI*2,a=t.r*Math.pow(i(),.6);e.globalAlpha=.6+i()*.4,e.beginPath(),e.arc(t.x+Math.cos(o)*a,t.y+Math.sin(o)*a,(t.dot??3)*(.3+i()),0,Math.PI*2),e.fill()}e.restore()}_timeSplat(e,t){let i=Math.round(se(t.t0??0)*254);e.fillStyle=`rgb(${i},${i},${i})`,e.beginPath(),e.arc(t.x,t.y,t.r+10,0,Math.PI*2),e.fill()}},Ff=class{constructor(e){this.ctx=e}beginPath(){}fill(){}stroke(){}save(){this.ctx.save()}restore(){this.ctx.restore()}translate(...e){this.ctx.translate(...e)}rotate(...e){this.ctx.rotate(...e)}scale(...e){this.ctx.scale(...e)}set fillStyle(e){}set strokeStyle(e){}set lineWidth(e){}set globalAlpha(e){}set filter(e){}moveTo(...e){this.ctx.moveTo(...e)}lineTo(...e){this.ctx.lineTo(...e)}arc(...e){this.ctx.arc(...e)}ellipse(...e){this.ctx.ellipse(...e)}bezierCurveTo(...e){this.ctx.bezierCurveTo(...e)}quadraticCurveTo(...e){this.ctx.quadraticCurveTo(...e)}closePath(){this.ctx.closePath()}rect(...e){this.ctx.rect(...e)}};var Dd={};Qg(Dd,{Color:()=>Eh,DEGREES:()=>Jm,Plot:()=>kn,Polygon:()=>ti,Position:()=>Fa,RADIANS:()=>Oh,add:()=>dg,addField:()=>gs,angleMode:()=>QS,arc:()=>ig,beginShape:()=>sg,beginStroke:()=>eb,box:()=>rb,circle:()=>$S,clear:()=>bd,clip:()=>lb,createCanvas:()=>jS,endShape:()=>rg,endStroke:()=>nb,field:()=>Qm,fill:()=>Eg,fillBleed:()=>Tg,fillTexture:()=>wg,flowLine:()=>db,getAngleMode:()=>KS,hatch:()=>Id,hatchArray:()=>_g,hatchStyle:()=>gb,initStandaloneRuntime:()=>jm,instance:()=>OS,line:()=>Pd,listFields:()=>XS,load:()=>Lh,mass:()=>yb,massArray:()=>Cb,move:()=>tb,noClip:()=>cb,noField:()=>WS,noFill:()=>Pb,noHatch:()=>xb,noMass:()=>Sb,noStroke:()=>ab,noWash:()=>Ib,noise:()=>km,noiseSeed:()=>ud,pick:()=>pg,polygon:()=>YS,pop:()=>vd,push:()=>xd,random:()=>US,rect:()=>ZS,refreshField:()=>VS,render:()=>Sd,rotate:()=>qS,scale:()=>JS,scaleBrushes:()=>ob,seed:()=>hd,set:()=>Nh,spline:()=>ib,stroke:()=>mg,strokeWeight:()=>gg,translate:()=>yd,vertex:()=>Aa,wRand:()=>GS,wash:()=>Rg,wiggle:()=>Km});var FS={a:1,b:0,c:0,d:1,x:0,y:0},qt,jt,wt,Qt,Da=()=>!1,ph=n=>n,sr=()=>{throw new Error("No runtime color adapter registered.")},tr=()=>FS,Lm=()=>{};function Fm(n){n.usesRadians&&(Da=n.usesRadians),n.fromDegrees&&(ph=n.fromDegrees),n.createColor&&(sr=n.createColor),n.getAffineMatrix&&(tr=n.getAffineMatrix),n.notifyDraw&&(Lm=n.notifyDraw)}var bs={load:()=>{throw new Error("No target runtime adapter registered.")},syncDensity:()=>Qt,isCanvasReady:()=>{throw new Error("No target runtime adapter registered.")},instance:n=>{},activateInstance:n=>{},deactivateInstance:()=>{},getActiveFramebuffer:()=>null,isFramebufferTarget:()=>!1};function Om(n){"Cwidth"in n&&(qt=n.Cwidth),"Cheight"in n&&(jt=n.Cheight),"Instance"in n&&n.Instance,"Renderer"in n&&(wt=n.Renderer),"Density"in n&&(Qt=n.Density)}var za=()=>bs.isCanvasReady(),OS=n=>bs.instance(n),cm=()=>bs.getActiveFramebuffer(),Nm=n=>bs.isFramebufferTarget(n),NS=(n,e=0)=>n?{minX:n.minX-e,minY:n.minY-e,maxX:n.maxX+e,maxY:n.maxY+e}:null,Mh=(n,e,t=!1)=>{let i=typeof OffscreenCanvas<"u"?new OffscreenCanvas(n,e):(()=>{let s=document.createElement("canvas");return s.width=n,s.height=e,s})();return i.drawingContext=i.getContext("2d",t?{willReadFrequently:!0}:void 0),i},ys={clearTarget:()=>{throw new Error("No compositor runtime adapter registered.")},ensureBlendShaderProgram:()=>{throw new Error("No compositor runtime adapter registered.")},ensureBlendSourceFramebuffer:()=>{throw new Error("No compositor runtime adapter registered.")},createFramebuffer:()=>{throw new Error("No compositor runtime adapter registered.")},runBlendShaderPass:()=>{throw new Error("No compositor runtime adapter registered.")},blitSourceToFramebuffer:()=>{throw new Error("No compositor runtime adapter registered.")}},Bm=(...n)=>ys.createFramebuffer(...n),_a=null,Ma=null,Of=n=>{((...e)=>{ys.clearTarget(...e)})(wt,n,Nm)},Ih=()=>({width:Math.max(1,Math.round(qt*Qt)),height:Math.max(1,Math.round(jt*Qt))}),qf=n=>{if(!n)return null;let{width:e,height:t}=Ih();return((i,s,r)=>{if(!i)return null;let o=Math.max(0,Math.floor(Math.min(i.minX,i.maxX))),a=Math.max(0,Math.floor(Math.min(i.minY,i.maxY))),c=Math.min(s,Math.ceil(Math.max(i.minX,i.maxX))),l=Math.min(r,Math.ceil(Math.max(i.minY,i.maxY)));return c<=o||l<=a?null:{minX:o,minY:a,maxX:c,maxY:l}})(n,e,t)},hm=()=>{let{width:n,height:e}=Ih();return((t,i)=>({minX:0,minY:0,maxX:t,maxY:i}))(n,e)},Um=(n,e=!0)=>{let t=qf(n);if(!t)return null;let{height:i}=Ih();return{x:t.minX,y:e?i-t.maxY:t.minY,width:t.maxX-t.minX,height:t.maxY-t.minY}},um=(n,e,t,i=!0)=>{let s=Um(e,i);if(s){n.enable(n.SCISSOR_TEST),n.scissor(s.x,s.y,s.width,s.height);try{t()}finally{n.disable(n.SCISSOR_TEST)}}else t()},Q={},Dh=()=>{wt?.loaded||(za(),Ie.load())},Ie={isBlending:!1,cachedColor:null,markDirtyRect(n,e){let t=qf(e);var i,s;n&&t&&(n.dirtyRect=(s=t,(i=n.dirtyRect)?s?{minX:Math.min(i.minX,s.minX),minY:Math.min(i.minY,s.minY),maxX:Math.max(i.maxX,s.maxX),maxY:Math.max(i.maxY,s.maxY)}:i:s),n.isDrawn=!0)},clearMask(n){if(!n)return;(n===this.glMask?_a:Ma)?.clearMask?.(n,Of)},getCompositeRect(n,e){return(e?_a:Ma)?.getCompositeRect?.(n,cm,hm,NS,qf)},load(){bs.syncDensity();let n=!wt.blendSourceFramebuffer||wt.blendSourceFramebuffer.width!==qt||wt.blendSourceFramebuffer.height!==jt||typeof wt.blendSourceFramebuffer.pixelDensity=="function"&&wt.blendSourceFramebuffer.pixelDensity()!==Qt;((...t)=>{ys.ensureBlendShaderProgram(...t)})(wt,`#version 300 es
#define GLSLIFY 1
out vec2 p;void main(){vec3 v=vec3(-1);v[gl_VertexID]=3.;p=v.xy;gl_Position=vec4(v.x,-v.y,0,1);}`,`#version 300 es
precision highp float;
#define GLSLIFY 1
uniform bool u_isBrush;uniform bool u_targetIsFramebuffer;uniform sampler2D u_source;uniform sampler2D u_mask;uniform vec3 u_color;in vec2 p;out vec4 outColor;const int SPECTRAL_SIZE=38;const float SPECTRAL_GAMMA=2.4;const float SPECTRAL_EPSILON=0.0001;float spectral_uncompand(float x){return(x<0.04045)? x/12.92 : pow((x+0.055)/1.055,SPECTRAL_GAMMA);}float spectral_compand(float x){return(x<0.0031308)? x*12.92 : 1.055*pow(x,1.0/SPECTRAL_GAMMA)-0.055;}vec3 spectral_srgb_to_linear(vec3 srgb){return vec3(spectral_uncompand(srgb[0]),spectral_uncompand(srgb[1]),spectral_uncompand(srgb[2]));}vec3 spectral_linear_to_srgb(vec3 lrgb){return clamp(vec3(spectral_compand(lrgb[0]),spectral_compand(lrgb[1]),spectral_compand(lrgb[2])),0.,1.);}void spectral_linear_to_reflectance(vec3 lrgb,inout float R[SPECTRAL_SIZE]){float w=min(lrgb.r,min(lrgb.g,lrgb.b));lrgb-=w;float c=min(lrgb.g,lrgb.b);float m=min(lrgb.r,lrgb.b);float y=min(lrgb.r,lrgb.g);float r=min(max(0.0,lrgb.r-lrgb.b),max(0.0,lrgb.r-lrgb.g));float g=min(max(0.0,lrgb.g-lrgb.b),max(0.0,lrgb.g-lrgb.r));float b=min(max(0.0,lrgb.b-lrgb.g),max(0.0,lrgb.b-lrgb.r));R[0]=max(SPECTRAL_EPSILON,w*1.0011607271876400+c*0.9705850013229620+m*0.9906735573199880+y*0.0210523371789306+r*0.0315605737777207+g*0.0095560747554212+b*0.9794047525020140);R[1]=max(SPECTRAL_EPSILON,w*1.0011606515972800+c*0.9705924981434250+m*0.9906715249619790+y*0.0210564627517414+r*0.0315520718330149+g*0.0095581580120851+b*0.9794007068431300);R[2]=max(SPECTRAL_EPSILON,w*1.0011603192274700+c*0.9706253487298910+m*0.9906625823534210+y*0.0210746178695038+r*0.0315148215513658+g*0.0095673245444588+b*0.9793829034702610);R[3]=max(SPECTRAL_EPSILON,w*1.0011586727078900+c*0.9707868061190170+m*0.9906181076447950+y*0.0211649058448753+r*0.0313318044982702+g*0.0096129126297349+b*0.9792943649455940);R[4]=max(SPECTRAL_EPSILON,w*1.0011525984455200+c*0.9713686732282480+m*0.9904514808787100+y*0.0215027957272504+r*0.0306729857725527+g*0.0097837090401843+b*0.9789630146085700);R[5]=max(SPECTRAL_EPSILON,w*1.0011325252899800+c*0.9731632306212520+m*0.9898710814002040+y*0.0226738799041561+r*0.0286480476989607+g*0.0103786227058710+b*0.9778144666940430);R[6]=max(SPECTRAL_EPSILON,w*1.0010850066332700+c*0.9767402231587650+m*0.9882866087596400+y*0.0258235649693629+r*0.0246450407045709+g*0.0120026452378567+b*0.9747243211338360);R[7]=max(SPECTRAL_EPSILON,w*1.0009968788945300+c*0.9815876054913770+m*0.9842906927975040+y*0.0334879385639851+r*0.0192960753663651+g*0.0160977721473922+b*0.9671984823439730);R[8]=max(SPECTRAL_EPSILON,w*1.0008652515227400+c*0.9862802656529490+m*0.9739349056253060+y*0.0519069663740307+r*0.0142066612220556+g*0.0267061902231680+b*0.9490796575305750);R[9]=max(SPECTRAL_EPSILON,w*1.0006962900094000+c*0.9899491476891340+m*0.9418178384601450+y*0.1007490148334730+r*0.0102942608878609+g*0.0595555440185881+b*0.9008501289409770);R[10]=max(SPECTRAL_EPSILON,w*1.0005049611488800+c*0.9924927015384200+m*0.8173903261951560+y*0.2391298997068470+r*0.0076191460521811+g*0.1860398265328260+b*0.7631504454622400);R[11]=max(SPECTRAL_EPSILON,w*1.0003080818799200+c*0.9941456804052560+m*0.4324728050657290+y*0.5348043122727480+r*0.0058980410835420+g*0.5705798201161590+b*0.4659221716493190);R[12]=max(SPECTRAL_EPSILON,w*1.0001196660201300+c*0.9951839750332120+m*0.1384539782588700+y*0.7978075786430300+r*0.0048233247781713+g*0.8614677684002920+b*0.2012632804510050);R[13]=max(SPECTRAL_EPSILON,w*0.9999527659684070+c*0.9957567501108180+m*0.0537347216940033+y*0.9114498940673840+r*0.0042298748350633+g*0.9458790897676580+b*0.0877524413419623);R[14]=max(SPECTRAL_EPSILON,w*0.9998218368992970+c*0.9959128182867100+m*0.0292174996673231+y*0.9537979630045070+r*0.0040599171299341+g*0.9704654864743050+b*0.0457176793291679);R[15]=max(SPECTRAL_EPSILON,w*0.9997386095575930+c*0.9956061578345280+m*0.0213136517508590+y*0.9712416154654290+r*0.0043533695594676+g*0.9784136302844500+b*0.0284706050521843);R[16]=max(SPECTRAL_EPSILON,w*0.9997095516396120+c*0.9945976009618540+m*0.0201349530181136+y*0.9793031238075880+r*0.0053434425970201+g*0.9795890314112240+b*0.0205271767569850);R[17]=max(SPECTRAL_EPSILON,w*0.9997319302106270+c*0.9922157154923700+m*0.0241323096280662+y*0.9833801195075750+r*0.0076917201010463+g*0.9755335369086320+b*0.0165302792310211);R[18]=max(SPECTRAL_EPSILON,w*0.9997994363461950+c*0.9862364527832490+m*0.0372236145223627+y*0.9854612465677550+r*0.0135969795736536+g*0.9622887553978130+b*0.0145135107212858);R[19]=max(SPECTRAL_EPSILON,w*0.9999003303166710+c*0.9679433372645410+m*0.0760506552706601+y*0.9864350469766050+r*0.0316975442661115+g*0.9231215745131200+b*0.0136003508637687);R[20]=max(SPECTRAL_EPSILON,w*1.0000204065261100+c*0.8912850042449430+m*0.2053754719423990+y*0.9867382506701410+r*0.1078611963552490+g*0.7934340189431110+b*0.0133604258769571);R[21]=max(SPECTRAL_EPSILON,w*1.0001447879365800+c*0.5362024778620530+m*0.5412689034604390+y*0.9866178824450320+r*0.4638126031687040+g*0.4592701359024290+b*0.0135488943145680);R[22]=max(SPECTRAL_EPSILON,w*1.0002599790341200+c*0.1541081190018780+m*0.8158416850864860+y*0.9862777767586430+r*0.8470554052720110+g*0.1855741036663030+b*0.0139594356366992);R[23]=max(SPECTRAL_EPSILON,w*1.0003557969708900+c*0.0574575093228929+m*0.9128177041239760+y*0.9858605924440560+r*0.9431854093939180+g*0.0881774959955372+b*0.0144434255753570);R[24]=max(SPECTRAL_EPSILON,w*1.0004275378026900+c*0.0315349873107007+m*0.9463398301669620+y*0.9854749276762100+r*0.9688621506965580+g*0.0543630228766700+b*0.0148854440621406);R[25]=max(SPECTRAL_EPSILON,w*1.0004762334488800+c*0.0222633920086335+m*0.9599276963319910+y*0.9851769347655580+r*0.9780306674736030+g*0.0406288447060719+b*0.0152254296999746);R[26]=max(SPECTRAL_EPSILON,w*1.0005072096750800+c*0.0182022841492439+m*0.9662605952303120+y*0.9849715740141810+r*0.9820436438543060+g*0.0342215204316970+b*0.0154592848180209);R[27]=max(SPECTRAL_EPSILON,w*1.0005251915637300+c*0.0162990559732640+m*0.9693259700584240+y*0.9848463034157120+r*0.9839236237187070+g*0.0311185790956966+b*0.0156018026485961);R[28]=max(SPECTRAL_EPSILON,w*1.0005350960689600+c*0.0153656239334613+m*0.9708545367213990+y*0.9847753518111990+r*0.9848454841543820+g*0.0295708898336134+b*0.0156824871281936);R[29]=max(SPECTRAL_EPSILON,w*1.0005402209748200+c*0.0149111568733976+m*0.9716050665281280+y*0.9847380666252650+r*0.9852942758145960+g*0.0288108739348928+b*0.0157248764360615);R[30]=max(SPECTRAL_EPSILON,w*1.0005427281678400+c*0.0146954339898235+m*0.9719627697573920+y*0.9847196483117650+r*0.9855072952198250+g*0.0284486271324597+b*0.0157458108784121);R[31]=max(SPECTRAL_EPSILON,w*1.0005438956908700+c*0.0145964146717719+m*0.9721272722745090+y*0.9847110233919390+r*0.9856050715398370+g*0.0282820301724731+b*0.0157556123350225);R[32]=max(SPECTRAL_EPSILON,w*1.0005444821215100+c*0.0145470156699655+m*0.9722094177458120+y*0.9847066833006760+r*0.9856538499335780+g*0.0281988376490237+b*0.0157605443964911);R[33]=max(SPECTRAL_EPSILON,w*1.0005447695999200+c*0.0145228771899495+m*0.9722495776784240+y*0.9847045543930910+r*0.9856776850338830+g*0.0281581655342037+b*0.0157629637515278);R[34]=max(SPECTRAL_EPSILON,w*1.0005448988776200+c*0.0145120341118965+m*0.9722676219987420+y*0.9847035963093700+r*0.9856883918061220+g*0.0281398910216386+b*0.0157640525629106);R[35]=max(SPECTRAL_EPSILON,w*1.0005449625468900+c*0.0145066940939832+m*0.9722765094621500+y*0.9847031240775520+r*0.9856936646900310+g*0.0281308901665811+b*0.0157645892329510);R[36]=max(SPECTRAL_EPSILON,w*1.0005449892705800+c*0.0145044507314479+m*0.9722802433068740+y*0.9847029256150900+r*0.9856958798482050+g*0.0281271086805816+b*0.0157648147772649);R[37]=max(SPECTRAL_EPSILON,w*1.0005449969930000+c*0.0145038009464639+m*0.9722813248265600+y*0.9847028681227950+r*0.9856965214637620+g*0.0281260133612096+b*0.0157648801149616);}vec3 spectral_xyz_to_srgb(vec3 xyz){mat3 XYZ_RGB;XYZ_RGB[0]=vec3(3.2409699419045200,-1.537383177570090,-0.4986107602930030);XYZ_RGB[1]=vec3(-0.9692436362808790,1.875967501507720,0.0415550574071756);XYZ_RGB[2]=vec3(0.0556300796969936,-0.203976958888976,1.0569715142428700);float r=dot(XYZ_RGB[0],xyz);float g=dot(XYZ_RGB[1],xyz);float b=dot(XYZ_RGB[2],xyz);return spectral_linear_to_srgb(vec3(r,g,b));}vec3 spectral_reflectance_to_xyz(float R[SPECTRAL_SIZE]){vec3 xyz=vec3(0.);xyz+=R[0]*vec3(0.0000646919989576,0.0000018442894440,0.0003050171476380);xyz+=R[1]*vec3(0.0002194098998132,0.0000062053235865,0.0010368066663574);xyz+=R[2]*vec3(0.0011205743509343,0.0000310096046799,0.0053131363323992);xyz+=R[3]*vec3(0.0037666134117111,0.0001047483849269,0.0179543925899536);xyz+=R[4]*vec3(0.0118805536037990,0.0003536405299538,0.0570775815345485);xyz+=R[5]*vec3(0.0232864424191771,0.0009514714056444,0.1136516189362870);xyz+=R[6]*vec3(0.0345594181969747,0.0022822631748318,0.1733587261835500);xyz+=R[7]*vec3(0.0372237901162006,0.0042073290434730,0.1962065755586570);xyz+=R[8]*vec3(0.0324183761091486,0.0066887983719014,0.1860823707062960);xyz+=R[9]*vec3(0.0212332056093810,0.0098883960193565,0.1399504753832070);xyz+=R[10]*vec3(0.0104909907685421,0.0152494514496311,0.0891745294268649);xyz+=R[11]*vec3(0.0032958375797931,0.0214183109449723,0.0478962113517075);xyz+=R[12]*vec3(0.0005070351633801,0.0334229301575068,0.0281456253957952);xyz+=R[13]*vec3(0.0009486742057141,0.0513100134918512,0.0161376622950514);xyz+=R[14]*vec3(0.0062737180998318,0.0704020839399490,0.0077591019215214);xyz+=R[15]*vec3(0.0168646241897775,0.0878387072603517,0.0042961483736618);xyz+=R[16]*vec3(0.0286896490259810,0.0942490536184085,0.0020055092122156);xyz+=R[17]*vec3(0.0426748124691731,0.0979566702718931,0.0008614711098802);xyz+=R[18]*vec3(0.0562547481311377,0.0941521856862608,0.0003690387177652);xyz+=R[19]*vec3(0.0694703972677158,0.0867810237486753,0.0001914287288574);xyz+=R[20]*vec3(0.0830531516998291,0.0788565338632013,0.0001495555858975);xyz+=R[21]*vec3(0.0861260963002257,0.0635267026203555,0.0000923109285104);xyz+=R[22]*vec3(0.0904661376847769,0.0537414167568200,0.0000681349182337);xyz+=R[23]*vec3(0.0850038650591277,0.0426460643574120,0.0000288263655696);xyz+=R[24]*vec3(0.0709066691074488,0.0316173492792708,0.0000157671820553);xyz+=R[25]*vec3(0.0506288916373645,0.0208852059213910,0.0000039406041027);xyz+=R[26]*vec3(0.0354739618852640,0.0138601101360152,0.0000015840125870);xyz+=R[27]*vec3(0.0214682102597065,0.0081026402038399,0.0000000000000000);xyz+=R[28]*vec3(0.0125164567619117,0.0046301022588030,0.0000000000000000);xyz+=R[29]*vec3(0.0068045816390165,0.0024913800051319,0.0000000000000000);xyz+=R[30]*vec3(0.0034645657946526,0.0012593033677378,0.0000000000000000);xyz+=R[31]*vec3(0.0014976097506959,0.0005416465221680,0.0000000000000000);xyz+=R[32]*vec3(0.0007697004809280,0.0002779528920067,0.0000000000000000);xyz+=R[33]*vec3(0.0004073680581315,0.0001471080673854,0.0000000000000000);xyz+=R[34]*vec3(0.0001690104031614,0.0000610327472927,0.0000000000000000);xyz+=R[35]*vec3(0.0000952245150365,0.0000343873229523,0.0000000000000000);xyz+=R[36]*vec3(0.0000490309872958,0.0000177059860053,0.0000000000000000);xyz+=R[37]*vec3(0.0000199961492222,0.0000072209749130,0.0000000000000000);return xyz;}float KS(float R){return pow(1.0-R,2.0)/(2.0*R);}float KM(float KS){return 1.0+KS-sqrt(pow(KS,2.0)+2.0*KS);}vec3 spectral_mix(vec3 color1,float tintingStrength1,float factor1,vec3 color2,float tintingStrength2,float factor2){vec3 lrgb1=spectral_srgb_to_linear(color1);vec3 lrgb2=spectral_srgb_to_linear(color2);float R1[SPECTRAL_SIZE];float R2[SPECTRAL_SIZE];spectral_linear_to_reflectance(lrgb1,R1);spectral_linear_to_reflectance(lrgb2,R2);float luminance1=spectral_reflectance_to_xyz(R1)[1];float luminance2=spectral_reflectance_to_xyz(R2)[1];float R[SPECTRAL_SIZE];for(int i=0;i<SPECTRAL_SIZE;i++){float concentration1=pow(factor1,2.)*pow(tintingStrength1,2.)*luminance1;float concentration2=pow(factor2,2.)*pow(tintingStrength2,2.)*luminance2;float totalConcentration=concentration1+concentration2;float ksMix=0.;ksMix+=KS(R1[i])*concentration1;ksMix+=KS(R2[i])*concentration2;R[i]=KM(ksMix/totalConcentration);}return spectral_xyz_to_srgb(spectral_reflectance_to_xyz(R));}vec3 spectral_mix(vec3 color1,vec3 color2,float factor){return spectral_mix(color1,1.,1.-factor,color2,1.,factor);}vec3 spectral_mix(vec3 color1,float factor1,vec3 color2,float factor2){return spectral_mix(color1,1.,factor1,color2,1.,factor2);}const float GAMMA=2.4,EPSILON=0.0001;const float DARKEN_THRESHOLD=0.7;const float EDGE_MIN=0.05,EDGE_MAX=0.35;void main(void){vec2 uv=0.5*p+0.5;vec2 sourceUV=vec2(uv.x,1.0-uv.y);vec2 maskUV=u_targetIsFramebuffer ? vec2(uv.x,1.0-uv.y): uv;vec4 source=texture(u_source,sourceUV);vec4 maskColor=texture(u_mask,maskUV);if(maskColor.a==0.0){outColor=source;return;}vec4 pigment=vec4(u_color.xyz,1.0);if(u_isBrush&&(maskColor.a>DARKEN_THRESHOLD)){float blacken=0.5*(min(maskColor.a,1.0)-DARKEN_THRESHOLD);pigment=pigment*(1.0-blacken)-vec4(0.5)*blacken;pigment.rgb=max(pigment.rgb,vec3(0.0));}float mixIntensity=min(maskColor.a,1.0);if(!u_isBrush){vec2 texelSize=1.0/vec2(textureSize(u_mask,0));float scaledAlpha=maskColor.a*15.0;float blurEdge=0.0;for(int i=-2;i<=2;i+=2){for(int j=-2;j<=2;j+=2){vec2 neighborUV=maskUV+vec2(float(i),float(j))*texelSize;float neighborAlpha=texture(u_mask,neighborUV).a*15.0;blurEdge+=smoothstep(EDGE_MIN,EDGE_MAX,length(vec2(dFdx(neighborAlpha),dFdy(neighborAlpha))));}}blurEdge/=9.0;mixIntensity=clamp(maskColor.a+blurEdge*0.1,0.0,1.0);}vec3 bgColor=mix(vec3(1.0),source.rgb,source.a);outColor=vec4(spectral_mix(bgColor,pigment.rgb,mixIntensity),1.);}`),this.glMask=_a?.ensureResources?.(wt,qt,jt,Qt);let e=Ma?.ensureResources?.(wt,qt,jt,Qt,Of)??{mask:null,ctx:null};n&&(wt.blendSourceFramebuffer=((...t)=>ys.ensureBlendSourceFramebuffer(...t))(wt,wt.blendSourceFramebuffer,qt,jt,Qt)),this.mask=e.mask,this.ctx=e.ctx},blend(n=!1,e=!1){Dh();let t=this.isBrush===!0,i=t?this.glMask:this.mask,s=t?this.mask:this.glMask,r=n?._array,o=!!r&&(this.cachedColor?.[0]!==r[0]||this.cachedColor?.[1]!==r[1]||this.cachedColor?.[2]!==r[2]||this.cachedColor?.[3]!==r[3]);!this.isBlending&&r&&(this.isBlending=!0,this.cachedColor=r,Lm(),this.clearMask(this.glMask)),(e||o)&&(this.justChanged&&(this.applyShader(s,!t),this.justChanged=!1),this.isBlending&&this.applyShader(i,t),r&&(this.cachedColor=r),e&&(this.isBlending=!1,this.cachedColor=null))},applyShader(n,e){if(!n?.isDrawn)return;let t=this.getCompositeRect(n,e);if(!t)return void this.clearMask(n);wt.drawingContext;let i=wt.shaderProgram,s=cm(),r=((...c)=>ys.blitSourceToFramebuffer(...c))({renderer:wt,sourceTarget:s??wt,sourceFramebuffer:wt.blendSourceFramebuffer,dirtyRect:t,isFramebufferTarget:Nm,Cwidth:qt,Cheight:jt,getTargetPixelSize:Ih,toScissorBox:Um,withScissor:um}),o=!!s,a=(e?_a:Ma).getShaderMask(wt,n,t,hm,Of);((...c)=>{ys.runBlendShaderPass(...c)})({renderer:wt,shader:i,source:r,mask:a,color:this.cachedColor,isBrushMask:e,Cwidth:qt,Cheight:jt,dirtyRect:t,targetIsFramebuffer:o,withScissor:um}),this.clearMask(n)}},Lh=(n=!1)=>{((e=!1)=>{bs.load(e)})(n),wt.loaded&&Ie.load()},Gm=Math.sqrt(3),BS=.5*(Gm-1),va=(3-Gm)/6,fm=n=>0|Math.floor(n),dm=new Float64Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]);function Ah(n=Math.random){let e=(function(s){let r=new Uint8Array(512);for(let o=0;o<256;o++)r[o]=o;for(let o=0;o<255;o++){let a=o+~~(s()*(256-o)),c=r[o];r[o]=r[a],r[a]=c}for(let o=256;o<512;o++)r[o]=r[o-256];return r})(n),t=new Float64Array(e).map(s=>dm[s%12*2]),i=new Float64Array(e).map(s=>dm[s%12*2+1]);return function(s,r){let o=0,a=0,c=0,l=(s+r)*BS,h=fm(s+l),d=fm(r+l),u=(h+d)*va,f=s-(h-u),g=r-(d-u),S,m;f>g?(S=1,m=0):(S=0,m=1);let p=f-S+va,v=g-m+va,M=f-1+2*va,y=g-1+2*va,_=255&h,b=255&d,A=.5-f*f-g*g;if(A>=0){let w=_+e[b];A*=A,o=A*A*(t[w]*f+i[w]*g)}let x=.5-p*p-v*v;if(x>=0){let w=_+S+e[b+m];x*=x,a=x*x*(t[w]*p+i[w]*v)}let E=.5-M*M-y*y;if(E>=0){let w=_+1+e[b+1];E*=E,c=E*E*(t[w]*M+i[w]*y)}return 70*(o+a+c)}}function _s(n){let e=(function(t){let i=0,s=String(t);for(let r=0;r<s.length;r++)i=0|Math.imul(i^s.charCodeAt(r),2654435769),i^=i>>>15;return i=0|Math.imul(i^i>>>16,2246822507),i=0|Math.imul(i^i>>>13,3266489909),(i^i>>>16)>>>0||1})(n);return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t^=t+Math.imul(t^t>>>7,61|t),23283064365386963e-26*((t^t>>>14)>>>0)}}var so=_s(Math.random()),cd=_s(Math.random()+":2"),zm=[],Hm=n=>zm.push(n),hd=n=>{so=_s(n),cd=_s(`${n}:2`),mh=!1;for(let e of zm)e()},km=Ah(_s(Math.random())),Jf=Ah(_s(Math.random()+":2")),ud=n=>{km=Ah(_s(n)),Jf=Ah(_s(`${n}:2`))},Qe=(n=0,e=1)=>n+so()*(e-n);function US(n=0,e=1){return Array.isArray(n)?fd(n):arguments.length===1?cd()*n:Xt(n,e)}var Xt=(n=0,e=1)=>n+cd()*(e-n),fd=n=>n[~~(so()*n.length)],Vm=(n,e)=>~~Qe(n,e),on=(n,e)=>~~Xt(n,e),mh=!1,pm=0,ro=(n=0,e=1)=>{if(mh)return mh=!1,pm*e+n;let t=1-so(),i=so(),s=Math.sqrt(-2*Math.log(t)),r=360*i;return pm=s*Mn(r),mh=!0,s*On(r)*e+n},GS=n=>{let e=0,t=[];for(let s in n)e+=n[s],t.push({key:s,cumulative:e});let i=so()*e;for(let{key:s,cumulative:r}of t)if(i<r)return isNaN(s)?s:parseInt(s)},Gi=(n,e,t,i,s,r=!1)=>{let o=i+(n-e)/(t-e)*(s-i);return r?i<s?oo(o,i,s):oo(o,s,i):o},oo=(n,e,t)=>Math.max(Math.min(n,t),e),Fh=1440,mm=2*Math.PI/Fh,dd=new Float32Array(Fh),pd=new Float32Array(Fh);for(let n=0;n<Fh;n++)dd[n]=Math.cos(n*mm),pd[n]=Math.sin(n*mm);var md=n=>n<0?n>=-360?~~(4*(n+360)):~~(4*((n%=360)<0?n+360:n)):n<360?~~(4*n):n<720?~~(4*(n-360)):n<1080?~~(4*(n-720)):~~(4*((n%=360)<0?n+360:n)),On=n=>dd[md(n)],Mn=n=>pd[md(n)],Nf=new Float32Array(2),La=n=>{let e=md(n);return Nf[0]=dd[e],Nf[1]=pd[e],Nf},Ea=(n,e=!1)=>{if(e||Da()){let t=180*n/Math.PI%360;return t<0?t+360:t}return n},ao=(n,e=!1)=>e||Da()?180*n/Math.PI:n,zS=(n,e,t,i,s)=>{let r=La(s),o=r[0],a=r[1];return{x:o*(t-n)+a*(i-e)+n,y:o*(i-e)-a*(t-n)+e}},Ys=(n,e,t,i)=>Math.hypot(t-n,i-e),to=(n,e,t,i)=>Ea(Math.atan2(-(i-e),t-n),!0),Wm=(n,e,t,i,s=!1)=>{let r=n.x,o=n.y,a=e.x,c=e.y,l=t.x,h=t.y,d=a-r,u=c-o,f=i.x-l,g=i.y-h,S=g*d-f*u;if(S===0)return!1;let m=o-h,p=r-l,v=(f*m-g*p)/S,M=(d*m-u*p)/S;return!(!s&&(M<0||M>1))&&{x:r+v*d,y:o+v*u}},gm=!1;function Mi(){gm||(Dh(),Zs=.01*qt,jf=-.5*qt,Yf=-.5*jt,no=Math.round(2*qt/Zs),io=Math.round(2*jt/Zs),gs("hand",(n,e)=>{let t=Xt(.2,.8),i=on(5,10);return qr(e,(s,r)=>.5*i*Mn(t*r*s+on(15,25))*.2*On(n)+Jf(s,r)*i*.7)}),gs("curved",(n,e)=>{let t=on(-10,10);return on(0,100)%2==0&&(t*=-1),qr(e,(i,s)=>3*Gi(Jf(.02*i+.03*n,.02*s+.03*n),0,1,-t,t))}),gs("zigzag",(n,e)=>{let t=on(-30,-15)+Math.abs(44*Mn(n));on(0,100)%2==0&&(t*=-1);let i=t,s=0;for(let r=0;r<no;r++){for(let o=0;o<io;o++)e[r][o]=s,s+=i,i*=-1;s+=i,i*=-1}return e}),gs("waves",(n,e)=>{let t=on(10,15)+5*Mn(n),i=on(3,6)+3*On(n),s=on(20,35);return qr(e,(r,o)=>Mn(t*r)*s*On(o*i)+on(-3,3))}),gs("seabed",(n,e)=>{let t=Xt(.4,.8),i=on(18,26);return qr(e,(s,r)=>1.1*i*Mn(t*r*s+on(15,20))*On(n))}),gs("spiral",(n,e)=>{let t=on(5,10),i=2*on(0,2)-1,s=on(65,80),r=Array.from({length:t},()=>({x:Xt(.1,.9)*no,y:Xt(.1,.9)*io}));return qr(e,(o,a)=>{let c=0,l=0;for(let h of r){let d=o-h.x,u=a-h.y,f=1/(d*d+u*u+1),g=Math.atan2(u,d)*(180/Math.PI),S=i*(g+s)*Math.PI/180;c+=f*Math.cos(S),l+=f*Math.sin(S)}return Math.atan2(l,c)*(180/Math.PI)})}),gs("columns",(n,e)=>{let t=on(3,8),i=on(25,45);return qr(e,(s,r)=>Mn(s*t)*i)}),gm=!0)}var Fa=class n{constructor(e,t){Mi();let i=tr();this.mx=i.x,this.my=i.y,this.update(e,t),this.plotted=0}update(e,t){this.x=e,this.y=t,Q.field.isActive&&(this.colIdx=Math.round((e+this.mx-jf)/Zs),this.rowIdx=Math.round((t+this.my-Yf)/Zs))}reset(){this.plotted=0}isIn(){return Q.field.isActive?n.isIn(this.colIdx,this.rowIdx):this.isInCanvas(this.x,this.y)}isInCanvas(){let e=qt,t=jt,i=this.x+this.mx,s=this.y+this.my;return i>=-.5*e&&i<=1.5*e&&s>=-.5*t&&s<=1.5*t}angle(e=!1){return Q.field.isActive&&(e||this.isIn())?nr.get(Q.field.current).field[this.colIdx][this.rowIdx]*Q.field.wiggle:0}moveTo(e,t,i=1){let s=ao(e);Q.field.isActive?this.movePos(s,t,i):this._moveConstant(s,t,i)}_moveToDegrees(e,t,i=1){Q.field.isActive?this.movePos(e,t,i):this._moveConstant(e,t,i)}_moveConstant(e,t,i){if(!this.isIn())return void(this.plotted+=i);let s=t/i,r=La(-e),o=i*r[0],a=i*r[1];for(let c=0;c<s;c++)this.x+=o,this.y+=a,this.plotted+=i}plotTo(e,t,i,s=1,r=void 0){this.movePos(e,t,i,s,r)}movePos(e,t,i,s=!1,r=void 0){let o=s||1;if(!this.isIn())return void(this.plotted+=i/o);let a=t/i,c=Q.field.isActive,l=!!s;for(let h=0;h<a;h++){let d=l&&r!==void 0&&h===0?r:l?e.angle(this.plotted):e,u=(c?this.angle(!0):0)-d,f=La(u);this.update(this.x+i*f[0],this.y+i*f[1]),this.plotted+=i/o}}static getRowIndex(e,t=1){let i=e+tr().y-Yf;return Math.round(i/Zs/t)}static getColIndex(e,t=1){let i=e+tr().x-jf;return Math.round(i/Zs/t)}static isIn(e,t){return e>=0&&t>=0&&e<no&&t<io}};Q.field={isActive:!1,current:null,wiggle:1};var Zs,jf,Yf,no,io,nr=new Map,HS=new Set(["degrees","radians"]);function kS(n={}){let e=(typeof n=="string"?{angleMode:n}:n||{}).angleMode??"degrees";if(!HS.has(e))throw new Error(`Invalid field angle mode "${e}". Use "degrees" or "radians".`);return e}function Xm(n,e){return(function(t,i){if(i!=="radians")return t;for(let s=0;s<t.length;s++)for(let r=0;r<t[s].length;r++)t[s][r]=ao(t[s][r],!0);return t})(n.gen(e,new Array(no).fill(null).map(()=>new Float32Array(io))),n.angleMode)}function VS(n=0){if(!Q.field.isActive||!Q.field.current)throw new Error("No field is currently active. Call brush.field('name') to activate one before refreshing.");let e=nr.get(Q.field.current);e.field=Xm(e,n)}function Qm(n){if(Q.field.wiggle||(Q.field.wiggle=1),Mi(),!nr.has(n))throw new Error(`Field "${n}" does not exist. Available fields: ${Array.from(nr.keys()).join(", ")}.`);Q.field.isActive=!0,Q.field.current=n;let e=nr.get(n);e.field||(e.field=Xm(e,0))}function WS(){Mi(),Q.field.isActive=!1}function gs(n,e,t={}){nr.set(n,{gen:e,field:null,angleMode:kS(t)})}function XS(){return Mi(),Array.from(nr.keys())}function Km(n=1){Qm("hand"),Q.field.wiggle=n}function qr(n,e){for(let t=0;t<no;t++)for(let i=0;i<io;i++)n[t][i]=e(t,i);return n}var qm=[],fs=(n,e,t)=>Math.max(e,Math.min(n,t)),Jm="degrees",Oh="radians",Jr=null,Oa=Oh,Zf=[],Hi={a:1,b:0,c:0,d:1,x:0,y:0};function gd(n,e){return{a:n.a*e.a+n.c*e.b,b:n.b*e.a+n.d*e.b,c:n.a*e.c+n.c*e.d,d:n.b*e.c+n.d*e.d,x:n.a*e.x+n.c*e.y+n.x,y:n.b*e.x+n.d*e.y+n.y}}var Eh=class{constructor(e,t,i){let s=e,r=1;if(e?._array)return this.r=Math.round(255*e._array[0]),this.g=Math.round(255*e._array[1]),this.b=Math.round(255*e._array[2]),this.hex=this.rgbToHex(this.r,this.g,this.b),this._array=[...e._array],void(this.gl=this._array);if(typeof e=="string"){let o=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i.exec(e);if(o){this.r=fs(parseInt(o[1]),0,255),this.g=fs(parseInt(o[2]),0,255),this.b=fs(parseInt(o[3]),0,255),this.hex=this.rgbToHex(this.r,this.g,this.b);let c=o[4]!==void 0?fs(parseFloat(o[4]),0,1):1;return this._array=[this.r/255,this.g/255,this.b/255,c],void(this.gl=this._array)}this.hex=this.standardize(e);let a=this.hexToRgb(this.hex);this.r=a.r,this.g=a.g,this.b=a.b}else Array.isArray(e)&&([e,t,i,r=1]=e),this.r=fs(e??0,0,255),this.g=fs(t??e??0,0,255),this.b=fs(i??e??0,0,255),this.hex=this.rgbToHex(this.r,this.g,this.b);if(!Number.isFinite(this.r)||!Number.isFinite(this.g)||!Number.isFinite(this.b))throw new Error(`Invalid color value "${s}".`);this._array=[this.r/255,this.g/255,this.b/255,fs(r,0,1)],this.gl=this._array}rgbToHex(e,t,i){return`#${(1<<24|e<<16|t<<8|i).toString(16).slice(1)}`}hexToRgb(e){e=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(i,s,r,o)=>s+s+r+r+o+o);let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);if(!t)throw new Error(`Invalid color value "${e}".`);return{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}}standardize(e){let t=(function(){if(Jr)return Jr;if(typeof document<"u")return Jr=document.createElement("canvas").getContext("2d"),Jr;if(typeof OffscreenCanvas<"u")return Jr=new OffscreenCanvas(1,1).getContext("2d"),Jr;throw new Error("Standalone color parsing requires CanvasRenderingContext2D support.")})();t.fillStyle="#000000",t.fillStyle=e;let i=t.fillStyle;if(t.fillStyle="#ffffff",t.fillStyle=e,i!==t.fillStyle)throw new Error(`Invalid color value "${e}".`);return i}_getRed(){return this.r}_getGreen(){return this.g}_getBlue(){return this.b}};function QS(n){if(n!==Jm&&n!==Oh)throw new Error(`Invalid angle mode "${n}". Use "degrees" or "radians".`);Oa=n}function KS(){return Oa}function xd(){Mi(),qm.push({fill:{...Q.fill},wash:Q.wash?{...Q.wash}:null,stroke:{...Q.stroke},hatch:{...Q.hatch},mass:Q.mass?{...Q.mass}:null,field:{...Q.field}}),Zf.push({...Hi})}function vd(){Zf.length!==0&&(Hi=Zf.pop(),(function(){let n=qm.pop();n&&(Q.stroke={...n.stroke},Q.field={...n.field},Q.hatch={...n.hatch},Q.fill={...n.fill},n.wash&&(Q.wash={...n.wash}),n.mass?Q.mass={...n.mass}:Q.mass&&(Q.mass={...Q.mass,isActive:!1,brush:null,color:null,options:{}}))})())}function yd(n,e){Hi=gd(Hi,{a:1,b:0,c:0,d:1,x:n,y:e})}function qS(n){let e=Oa===Oh?n:n*Math.PI/180,t=Math.cos(e),i=Math.sin(e);Hi=gd(Hi,{a:t,b:i,c:-i,d:t,x:0,y:0})}function JS(n,e=n){Hi=gd(Hi,{a:n,b:0,c:0,d:e,x:0,y:0})}function jm(){Fm({usesRadians:()=>Oa==="radians",fromDegrees:n=>Oa==="radians"?n*Math.PI/180:n,createColor:(...n)=>n.length===1&&n[0]?._array?n[0]:new Eh(...n),getAffineMatrix:()=>Hi})}var $f=!1,Bf=!1;function Sd(){$f=!1,Dh(),Ie.blend(!1,!0),Ie.clearMask(Ie.glMask),Ie.clearMask(Ie.mask),Ie.justChanged=!1,Ie.isBlending=!1,Ie.isBrush=null,Ie.cachedColor=null}function bd(...n){za(),Ie.glMask&&Ie.clearMask(Ie.glMask),Ie.mask&&Ie.clearMask(Ie.mask),Ie.justChanged=!1,Ie.isBlending=!1,Ie.isBrush=null,Ie.cachedColor=null;let e=wt.drawingContext,t=n.length===0?[1,1,1,0]:[...sr(...n)._array.slice(0,3),1];e.bindFramebuffer(e.FRAMEBUFFER,null),e.disable(e.SCISSOR_TEST),e.clearColor(t[0],t[1],t[2],t[3]),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}Fm({notifyDraw:function(){Bf||(Bf=!0,$f=!0,requestAnimationFrame(()=>{Bf=!1,$f&&console.warn("[p5.brush] Drawing calls were made but brush.render() was never called. Call brush.render() after your drawing code to flush to the canvas.")}))}});var bi,Ym,$s,ed,Zm=null,$m=!1,td=1,eg=0,tg=0;function ng(n,e,t,i){Zm=n,eg=e,tg=t,td=i;let s=(function(r,o,a,c){let l=(function(h){return h.getContext("webgl2",{premultipliedAlpha:!0,preserveDrawingBuffer:!0})??h.getContext("webgl2",{preserveDrawingBuffer:!0})})(r);if(!l)throw new Error("brush.load(target) requires a canvas with a WebGL2 context.");return{canvas:r,drawingContext:l,width:o,height:a,pixelDensity:()=>c}})(n,e,t,i);Om({Renderer:s,Cwidth:e,Cheight:t,Density:i}),$m=!0}function jS(n,e,t={}){if(typeof document>"u")throw new Error("brush.createCanvas() requires a browser document.");let i=Math.max(1,Math.round(n)),s=Math.max(1,Math.round(e)),r=Math.max(1,Number(t.pixelDensity)||1),o=document.createElement("canvas");o.width=Math.max(1,Math.round(i*r)),o.height=Math.max(1,Math.round(s*r)),o.style.width=`${i}px`,o.style.height=`${s}px`,o.id=t.id??"brush-canvas";let a=t.parent!==void 0?t.parent:document.body;if(a){let c=typeof a=="string"?document.querySelector(a):a;if(!c)throw new Error(`Could not find parent "${t.parent}" for brush.createCanvas().`);c.appendChild(o)}return ng(o,i,s,r),o}var ti=class{constructor(e,t=!1){this.a=e,this.vertices=t?e:e.map(([i,s])=>({x:i,y:s})),this.sides=this.vertices.map((i,s,r)=>[i,r[(s+1)%r.length]]),this._intersectionCache={}}intersect(e){let t=`${e.point1.x},${e.point1.y}-${e.point2.x},${e.point2.y}`;if(this._intersectionCache[t])return this._intersectionCache[t];let i=[],s=this.sides,r=s.length;for(let o=0;o<r;o++){let a=Wm(e.point1,e.point2,s[o][0],s[o][1]);a&&i.push(a)}return this._intersectionCache[t]=i,i}show(){Q.wash&&this.wash(),Q.fill&&this.fill(),Q.mass&&this.mass(),Q.hatch&&this.hatch(),Q.stroke&&this.draw()}},kn=class{constructor(e){this.segments=[],this.angles=[],this.pres=[],this.type=e,this.dir=0,this._cumLen=[],this.length=0,this.index=0,this.suma=0,this.pol=!1}addSegment(e=0,t=0,i=1,s=!1){this.angles.length>0&&this.angles.pop(),e=s?(e%360+360)%360:Ea(e),this.angles.push(e,e),this.pres.push(i),this._cumLen.push(this.length),this.segments.push(t),this.length+=t}endPlot(e=0,t=1,i=!1){e=i?(e%360+360)%360:Ea(e),this.angles[this.angles.length-1]=e,this.pres.push(t)}rotate(e){this.dir=Ea(e)}pressure(e){if(e>this.length)return this.pres[this.pres.length-1];let t=this.pres[this.index],i=this.pres[this.index+1],s=this.segments[this.index];return s===0?t:t+(e-this.suma)/s*(i-t)}angle(e){if(e>this.length)return this.angles[this.angles.length-1];if(this.calcIndex(e),this.type!=="curve")return this.angles[this.index]+this.dir;let t=this.angles[this.index],i=this.angles[this.index+1];Math.abs(i-t)>180&&(i>t?i=-(360-i):t=-(360-t));let s=this.segments[this.index];return t+(s===0?0:(e-this.suma)/s)*(i-t)+this.dir}calcIndex(e){let t=this._cumLen,i=t.length;if(i===0)return this.index=0,this.suma=0,0;let s=this.index<i?this.index:i-1;for(;s+1<i&&t[s+1]<=e;)s++;if(t[s]>e){let r=0,o=s-1;for(;r<o;){let a=r+o+1>>1;t[a]<=e?r=a:o=a-1}s=r}return this.index=s,this.suma=t[s],s}genPol(e,t,i=1,s){Mi();let r=s<0?4:1,o=[],a=Math.round(this.length/r),c=new Fa(e+qt/2,t+jt/2),l=0,h=0;for(let d=0;d<a;d++){c.plotTo(this,r,r);let u=this.index;l+=r,(l>=(s<=0?8:Math.max(this.segments[u]*s*Xt(.7,1.3),20))||u>=h)&&c.x&&(o.push([c.x-qt/2,c.y-jt/2]),l=0,u>=h&&h++)}return new ti(o)}show(e,t,i=1){Q.wash&&this.wash(e,t,i),Q.fill&&this.fill(e,t,i),Q.mass&&this.mass(e,t,i),Q.hatch&&this.hatch(e,t,i),Q.stroke&&this.draw(e,t,i)}};function YS(n){let e=new ti(n);return e.show(),e}function ZS(n,e,t,i,s="corner"){s==="center"&&(n-=t/2,e-=i/2),sg(0),Aa(n,e),Aa(n+t,e),Aa(n+t,e+i),Aa(n,e+i),rg(!0)}function $S(n,e,t,i=!1){let s=new kn("curve"),r=Math.PI*t,o=Xt(0,360),a=i?()=>1+.2*i*Xt():()=>1;for(let h=0;h<4;h++){let d=-90*h+o;s.addSegment(d*a(),r/2*a(),1,!0)}if(i){let h=i*on(-5,5);s.addSegment(o,Math.abs(h)*(Math.PI/180)*t,1,!0),s.endPlot(h+o,1,!0)}else s.endPlot(o,1,!0);let c=n-t*Mn(o),l=e-t*On(-o);return s.show(c,l,1),[s,c,l]}function ig(n,e,t,i,s){let r=ao(i),o=((ao(s)-r)%360+360)%360;if(o===0)return null;let a=new kn("curve"),c=Math.max(1,Math.ceil(o/90)),l=o/c,h=Math.PI*t*l/180;for(let f=0;f<c;f++)a.addSegment(r+f*l+90,h,1,!0);a.endPlot(r+o+90,1,!0);let d=n+t*On(r),u=e-t*Mn(r);return a.draw(d,u,1),a}var nd=class{constructor(){this.isClosed=!1,this.curvature=Ym,this.vert=[]}vertex(e,t,i){this.vert.push([e,t,i])}show(){let e=og(this.vert,this.curvature,this.isClosed);return e.show(),e}};function sg(n=0){Ym=oo(n,0,1),bi=new nd}function Aa(n,e,t=1){if(!bi)throw new Error("vertex() called outside of beginShape()/endShape(). Call beginShape() first.");bi.vertex(n,e,t)}function rg(n=!1){if(!bi)throw new Error("endShape() called without beginShape(). Call beginShape() first.");if(bi.vert.length<2)throw new Error("endShape() requires at least 2 vertices. Add more with vertex().");n&&(bi.vertex(...bi.vert[0]),bi.isClosed=!0);let e=bi.show();return bi=!1,e}function eb(n,e,t){if(n!=="curve"&&n!=="segments")throw new Error(`beginStroke() type must be "curve" or "segments", got "${n}".`);ed=[e,t],$s=new kn(n)}function tb(n,e,t){if(!$s)throw new Error("move() called without beginStroke(). Call beginStroke() first.");$s.addSegment(n,e,t)}function nb(n,e){if(!$s)throw new Error("endStroke() called without beginStroke(). Call beginStroke() first.");$s.endPlot(n,e),$s.draw(ed[0],ed[1],1),$s=!1}function ib(n,e=.5){if(!n||n.length<2)throw new Error("spline() requires at least 2 points. Each point should be [x, y, pressure].");let t=og(n,e);return t.show(),t}function og(n,e=.5,t=!1){let i=new kn(e===0?"segments":"curve"),s=2*Math.PI;if(t&&e!==0&&n.push(n[1]),n&&n.length>0){let r,o,a,c=0;for(let l=0;l<n.length-1;l++)if(e>0&&l<n.length-2){let h=n[l],d=n[l+1],u=n[l+2],f=Ys(h[0],h[1],d[0],d[1]),g=Ys(d[0],d[1],u[0],u[1]),S=to(h[0],h[1],d[0],d[1]),m=to(d[0],d[1],u[0],u[1]),p=e*Math.min(f,g,.5*Math.min(f,g)),v=Math.max(f,g),M=f-p,y=g-p;if(Math.floor(S)===Math.floor(m)){let _=t&&l===0?0:f-c,b=t?l===0?0:g-a:g;i.addSegment(S,_,h[2],!0),l===n.length-3&&i.addSegment(m,b,d[2],!0),c=0,l===0&&(r=f,a=p,o=n[1],c=0)}else{let _={x:d[0]-p*On(-S),y:d[1]-p*Mn(-S)},b={x:_.x+v*On(90-S),y:_.y+v*Mn(90-S)},A={x:d[0]+p*On(-m),y:d[1]+p*Mn(-m)},x={x:A.x+v*On(90-m),y:A.y+v*Mn(90-m)},E=Wm(_,b,A,x,!0),w=Ys(_.x,_.y,E.x,E.y),R=Ys(_.x,_.y,A.x,A.y)/2,I=s*w*(2*Math.asin(R/w)*(180/Math.PI))/360,N=t&&l===0?0:M-c,D=l===n.length-3?t?r-p:y:0;i.addSegment(S,N,h[2],!0),i.addSegment(S,isNaN(I)?0:I,h[2],!0),i.addSegment(m,D,d[2],!0),c=p,l===0&&(r=M,a=p,o=[_.x,_.y])}l===n.length-3&&i.endPlot(m,d[2],!0)}else if(e===0){let h=n[l],d=n[l+1],u=Ys(h[0],h[1],d[0],d[1]),f=to(h[0],h[1],d[0],d[1]);i.addSegment(f,u,h[2],!0),l===n.length-2&&i.endPlot(f,d[2],!0)}i.origin=t&&e!==0?o:n[0]}return i}var Th={createTipSurface:()=>{throw new Error("No stroke runtime adapter registered.")},loadImageTip:()=>{throw new Error("No stroke runtime adapter registered.")}},xm=!1,id=(n,e,t)=>{let i=n.createProgram();for(let[s,r]of[[n.VERTEX_SHADER,e],[n.FRAGMENT_SHADER,t]]){let o=n.createShader(s);n.shaderSource(o,r),n.compileShader(o),n.attachShader(i,o)}return n.linkProgram(i),i},Na={beginDirectMaskDraw:()=>{throw new Error("No renderer runtime adapter registered.")},endDirectMaskDraw:()=>{throw new Error("No renderer runtime adapter registered.")},resetDirectShaderTracking:()=>{}},ag=(n,e)=>Na.resetDirectShaderTracking(n,e),X,lg,jr,Yr,ds,vm=!1,ym=0,Sm=0,ps=null,qs={},Uf={},Ta=1,wa=0,_d=0,Md=1,Ad=0,Ed=0,Ba=0,Ua=0,wh=1,Ss=1,ei=new Float32Array(8192),xs=0,Gf=2048,dh=32768,Ca=null,js=null,$r=null,ya=null,eo=null,_n={},gh={},Ch=0,Hn=new Float32Array(1280),vs=0,zf=256,Ra=null,ir=new Map,sb=new Float32Array([-1,-1,1,-1,-1,1,1,1]);function cg(){return lg}function hg(){return((n,e,t)=>Na.beginDirectMaskDraw(n,e,t))(wt,X,Ie.glMask)}function ug(n){((e,t,i)=>{Na.endDirectMaskDraw(e,t,i)})(wt,X,n)}function fg(n,e,t,i,s){return n?(e<n.minX&&(n.minX=e),t<n.minY&&(n.minY=t),i>n.maxX&&(n.maxX=i),s>n.maxY&&(n.maxY=s),n):{minX:e,minY:t,maxX:i,maxY:s}}function Td(n,e,t,i){if(xs>=Gf){Gf*=2;let u=new Float32Array(4*Gf);u.set(ei),ei=u}let s=n-Ba,r=e-Ua,o=4*xs,a=Ta*s+_d*r+Ad+Ba,c=wa*s+Md*r+Ed+Ua,l=Ss*t*wh/2;ei[o]=a,ei[o+1]=c,ei[o+2]=l,ei[o+3]=i/255;let h=a*Ss,d=c*Ss;Ca=fg(Ca,h-l-1,d-l-1,h+l+1,d+l+1),xs++}function bm(n,e){if(vs===0)return;Ie.glMask.isDrawn=!0;let t=hg(),i=ir.get(e);i||(i=X.createTexture(),X.bindTexture(X.TEXTURE_2D,i),X.texImage2D(X.TEXTURE_2D,0,X.RGBA,X.RGBA,X.UNSIGNED_BYTE,n.canvas),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_MIN_FILTER,X.LINEAR),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_MAG_FILTER,X.LINEAR),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_WRAP_S,X.CLAMP_TO_EDGE),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_WRAP_T,X.CLAMP_TO_EDGE),ir.set(e,i)),X.useProgram(js),X.enable(X.BLEND),X.blendFunc(X.ONE_MINUS_DST_ALPHA,X.ONE),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,i),X.uniform1i(gh.u_tex,0);let s=Q.stroke.color._array;X.uniform4f(gh.u_color,...s),X.uniformMatrix4fv(gh.u_proj,!1,cg()),X.bindVertexArray($r),X.bindBuffer(X.ARRAY_BUFFER,eo);let r=5*vs*4,o=Hn.subarray(0,5*vs);r>Ch?(X.bufferData(X.ARRAY_BUFFER,Hn,X.DYNAMIC_DRAW),Ch=Hn.byteLength):X.bufferSubData(X.ARRAY_BUFFER,0,o),X.drawArraysInstanced(X.TRIANGLE_STRIP,0,4,vs),X.bindVertexArray(null),X.bindTexture(X.TEXTURE_2D,null),ug(t),Ra&&(Ie.markDirtyRect(Ie.glMask,Ra),Ra=null),vs=0,ag(wt,X)}xm||(_a={ensureResources:function(n,e,t,i){var s,r;return(function(o,a,c,l){return!o.glMask||o.glMask.width!==a||o.glMask.height!==c||typeof o.glMask.pixelDensity=="function"&&o.glMask.pixelDensity()!==l})(n,e,t,i)&&(n.glMask?.remove&&n.glMask.remove(),n.glMask=Bm(n,{width:e,height:t,density:i,antialias:!1,depth:!1,stencil:!1})),(s=n.glMask).dirtyRect??(s.dirtyRect=null),(r=n.glMask).isDrawn??(r.isDrawn=!1),n.glMask},clearMask:function(n,e){n&&(e(n),n.isDrawn=!1,n.dirtyRect=null)},getCompositeRect:function(n,e,t,i,s){return n?n.dirtyRect?e()?t():s(i(n.dirtyRect,2)):t():null},getShaderMask:function(n,e){return e}},xm=!0),Q.stroke={color:null,weight:1,type:"HB",isActive:!1,opacity:1};var zi=new Map,xh={offset:.08,scale:.08,warp:.06,tilt:.06};function Rh(){return{...Q.stroke}}function wd(n){Q.stroke={...n}}function dg(n,e){if(e.type=["marker","custom","image","spray"].includes(e.type)?e.type:"default",e.markerTip===void 0&&(e.markerTip=!0),e.noise===void 0&&(e.noise=.3),e.noise=Math.max(0,Math.min(1,e.noise)),e.vibration!==void 0&&e.scatter===void 0&&(e.scatter=e.vibration),e.definition!==void 0&&e.sharpness===void 0&&(e.sharpness=e.definition),e.quality!==void 0&&e.grain===void 0&&(e.grain=e.quality),e.pressure=(function(t){if(!t)return t;if(typeof t=="function")return{type:"custom",min_max:[0,1],curve:t,variation:{...xh}};if(typeof t=="object"&&!Array.isArray(t)){if(t.type==="custom"||t.mode==="custom"){let{mode:i,...s}=t;return{...s,type:"custom",variation:{...xh,...s.variation??{}}}}return t.type==="gaussian"||t.mode==="gaussian"||Array.isArray(t.curve)&&Array.isArray(t.min_max)?{...t,type:"gaussian",curve:t.curve,min_max:t.min_max}:t}if(Array.isArray(t)){let[i,s,r]=t.length===2?[t[0],(t[0]+t[1])/2,t[1]]:t,o=Math.min(i,s,r),a=Math.max(i,s,r),c=a-o||1,[l,h,d]=[(i-o)/c,(s-o)/c,(r-o)/c];return{type:"custom",min_max:[o,a],variation:{...xh},curve:u=>u<.5?l+(h-l)*u*2:h+(d-h)*(u-.5)*2}}})(e.pressure),e.type==="custom"){if(typeof e.tip!="function")throw new Error(`Brush "${n}" is type "custom" but is missing a tip function.`);let t=`custom::${n}`;(function(s){let r=ir.get(s);r&&X&&X.deleteTexture(r),ir.delete(s)})(t);let i=Th.createTipSurface(500,500);return i.pixelDensity(1),i.background(255),i.noSmooth(),i.push(),i.translate(250,250),i.scale(5),i.noStroke(),e.tip(i),i.pop(),er.imageToWhite(i),er.tips.set(t,i),e.tipKey=t,void zi.set(n,{param:e,colors:[],buffers:[]})}if(e.type==="image"){if(!e.image||!e.image.src)throw new Error(`Brush "${n}" is type "image" but is missing params.image.src. Example: image: { src: "./tip.jpg" }`);return er.add(e.image.src),zi.set(n,{param:e,colors:[],buffers:[]}),er.load()}zi.set(n,{param:e,colors:[],buffers:[]})}function rb(){return[...zi.keys()]}function _m(n){return zi.get(n)?.param??null}function ob(n){for(let{param:e}of zi.values())e&&(e.weight*=n,e.scatter*=n,e.spacing*=n)}function pg(n){if(!zi.has(n))throw new Error(`Brush "${n}" not found. Available brushes: ${[...zi.keys()].join(", ")}.`);Q.stroke.type=n}function mg(n,e,t){za(),Q.stroke.color=sr(...arguments),Q.stroke.isActive=!0}function gg(n){Q.stroke.weight=n}function Nh(n,e,t=1){pg(n),mg(e),gg(t)}function ab(){Q.stroke.isActive=!1}function lb(n){return za(),n}function cb(){}var cn,Pa,_i,vh,Ph=0,he={};function Cd(n,e,t,i=!1){(function(){let s=tr();Ta=s.a,wa=s.b,_d=s.c,Md=s.d,Ad=s.x,Ed=s.y,Ba=qt/2,Ua=jt/2,wh=Math.sqrt(Ta*Ta+wa*wa),Ss=Qt})(),cn=new Fa(n+qt/2,e+jt/2),Pa=t,_i=i,_i&&_i.calcIndex(0)}var Ga=[];function Rd(n,e){e||(vh=n),(function(){he.seed=999999*Qe();let{param:r}=zi.get(Q.stroke.type)??{};if(!r)return;he.p=r;let{pressure:o}=r;if(he.isCustomPressure=o.type==="custom",he.a=he.isCustomPressure?0:Qe(-1,1),he.b=he.isCustomPressure?0:Qe(1,1.5),he.isCustomPressure){let h=o.variation??xh;he.cp=Qe(-h.offset,h.offset),he.ct=Qe(-h.warp,h.warp),he.cs=Qe(1-h.scale,1+h.scale),he.ck=Qe(-h.tilt,h.tilt)}else he.cp=Qe(3,3.5),he.ct=0,he.cs=1,he.ck=0;[he.min,he.max]=o.min_max,_i||(he.cos=On(vh),he.sin=Mn(vh)),(function(){Dh(),(function(){let u=wt?.glMask;u&&(ps=u,ps.dirtyRect??(ps.dirtyRect=null),ps.isDrawn??(ps.isDrawn=!1),Ie.glMask=ps)})();let h=wt.drawingContext,d=!vm||X!==h;(d||ym!==qt||Sm!==jt)&&(lg=new Float32Array([2/qt,0,0,0,0,2/jt,0,0,0,0,1,0,-1,-1,0,1]),ym=qt,Sm=jt),d&&((function(){if(X&&!X.isContextLost?.()){for(let u of ir.values())X.deleteTexture(u);ir.clear(),ds&&X.deleteProgram(ds),jr&&X.deleteVertexArray(jr),Yr&&X.deleteBuffer(Yr),js&&X.deleteProgram(js),$r&&X.deleteVertexArray($r),ya&&X.deleteBuffer(ya),eo&&X.deleteBuffer(eo),ds=jr=Yr=null,js=$r=ya=eo=null,dh=0,Ch=0}else ir.clear()})(),X=h,ds=id(X,`#version 300 es
#define GLSLIFY 1
in vec2 a_position;in float a_radius;in float a_alpha;uniform mat4 u_matrix;out float v_alpha;void main(){gl_Position=u_matrix*vec4(a_position,0.0,1.0);v_alpha=a_alpha;gl_PointSize=a_radius*2.0;}`,`#version 300 es
precision highp float;
#define GLSLIFY 1
in float v_alpha;out vec4 outColor;uniform vec4 u_color;void main(){vec2 v=gl_PointCoord-vec2(0.5);float f=length(v);float a=fwidth(f);f=1.0-smoothstep(0.5-a,0.5+a,f);if(f<0.01){discard;}outColor=vec4(u_color.xyz,v_alpha*f);}`),X.useProgram(ds),X.enable(X.BLEND),X.blendFunc(X.ONE_MINUS_DST_ALPHA,X.ONE),["a_position","a_radius","a_alpha"].forEach(u=>qs[u]=X.getAttribLocation(ds,u)),["u_matrix","u_color"].forEach(u=>Uf[u]=X.getUniformLocation(ds,u)),jr=X.createVertexArray(),X.bindVertexArray(jr),Yr=X.createBuffer(),X.bindBuffer(X.ARRAY_BUFFER,Yr),X.bufferData(X.ARRAY_BUFFER,ei.byteLength,X.DYNAMIC_DRAW),dh=ei.byteLength,X.enableVertexAttribArray(qs.a_position),X.vertexAttribPointer(qs.a_position,2,X.FLOAT,!1,16,0),X.enableVertexAttribArray(qs.a_radius),X.vertexAttribPointer(qs.a_radius,1,X.FLOAT,!1,16,8),X.enableVertexAttribArray(qs.a_alpha),X.vertexAttribPointer(qs.a_alpha,1,X.FLOAT,!1,16,12),X.bindVertexArray(null),js=id(X,`#version 300 es
#define GLSLIFY 1
in vec2 a_corner;in vec2 a_pos;in float a_size;in float a_angle;in float a_alpha;uniform mat4 u_proj;out vec2 v_uv;out float v_alpha;void main(){float c=cos(a_angle);float s=sin(a_angle);vec2 rotated=vec2(c*a_corner.x-s*a_corner.y,s*a_corner.x+c*a_corner.y);gl_Position=u_proj*vec4(a_pos+rotated*a_size,0.0,1.0);v_uv=a_corner*0.5+0.5;v_alpha=a_alpha;}`,`#version 300 es
precision highp float;
#define GLSLIFY 1
in vec2 v_uv;in float v_alpha;uniform sampler2D u_tex;uniform vec4 u_color;out vec4 outColor;void main(){float inkAlpha=texture(u_tex,v_uv).a;if(inkAlpha<0.01)discard;outColor=vec4(u_color.rgb,inkAlpha*v_alpha);}`),["a_corner","a_pos","a_size","a_angle","a_alpha"].forEach(u=>_n[u]=X.getAttribLocation(js,u)),["u_proj","u_color","u_tex"].forEach(u=>gh[u]=X.getUniformLocation(js,u)),$r=X.createVertexArray(),X.bindVertexArray($r),ya=X.createBuffer(),X.bindBuffer(X.ARRAY_BUFFER,ya),X.bufferData(X.ARRAY_BUFFER,sb,X.STATIC_DRAW),X.enableVertexAttribArray(_n.a_corner),X.vertexAttribPointer(_n.a_corner,2,X.FLOAT,!1,0,0),eo=X.createBuffer(),X.bindBuffer(X.ARRAY_BUFFER,eo),X.bufferData(X.ARRAY_BUFFER,Hn.byteLength,X.DYNAMIC_DRAW),Ch=Hn.byteLength,X.enableVertexAttribArray(_n.a_pos),X.vertexAttribPointer(_n.a_pos,2,X.FLOAT,!1,20,0),X.vertexAttribDivisor(_n.a_pos,1),X.enableVertexAttribArray(_n.a_size),X.vertexAttribPointer(_n.a_size,1,X.FLOAT,!1,20,8),X.vertexAttribDivisor(_n.a_size,1),X.enableVertexAttribArray(_n.a_angle),X.vertexAttribPointer(_n.a_angle,1,X.FLOAT,!1,20,12),X.vertexAttribDivisor(_n.a_angle,1),X.enableVertexAttribArray(_n.a_alpha),X.vertexAttribPointer(_n.a_alpha,1,X.FLOAT,!1,20,16),X.vertexAttribDivisor(_n.a_alpha,1),X.bindVertexArray(null),vm=!0)})();let a=Ie.isBrush!==!0;Ie.isBrush=!0,a&&(Ie.justChanged=!0),Ie.blend(Q.stroke.color);let c=["default","spray"].includes(he.p.type)?he.p.opacity:he.p.opacity/Math.min(Q.stroke.weight,1.3),l=.1*(he.p.noise??0);he.alpha=l>0?Math.max(0,c*(1+ro(0,l))):c,he.overscan=(function(){let h=Math.max(1,he.max??1),d=Q.stroke.weight*he.p.scatter,u=Q.stroke.weight*he.p.weight*h;return Math.max(8,1.5*d+.75*u)})(),he.drawFn=he.p.type==="spray"?ub:he.p.type==="marker"?vg:he.p.type==="custom"||he.p.type==="image"?yg:fb,Am()})();let t=he.p?.spacing??1,i=Math.round(Pa*(e?n:1)/t);he.pressureCount=10,he.cachedPressure=void 0;let s=2*i;for(;Ga.length<s;)Ga.push(ro());for(let r=0;r<i;r++)e&&(Ph=_i.angle(cn.plotted)),hb(),e?cn.plotTo(_i,t,t,n,Ph):cn._moveToDegrees(n,t,t);(function(){Am(),(function(){if(xs===0)return;Ie.glMask.isDrawn=!0;let o=hg(),a=Q.stroke.color._array;X.useProgram(ds),X.enable(X.BLEND),X.blendFunc(X.ONE_MINUS_DST_ALPHA,X.ONE),X.bindVertexArray(jr),X.bindBuffer(X.ARRAY_BUFFER,Yr);let c=16*xs,l=ei.subarray(0,4*xs);c>dh?(X.bufferData(X.ARRAY_BUFFER,ei,X.DYNAMIC_DRAW),dh=ei.byteLength):X.bufferSubData(X.ARRAY_BUFFER,0,l),X.uniform4f(Uf.u_color,...a),X.uniformMatrix4fv(Uf.u_matrix,!1,cg()),X.drawArrays(X.POINTS,0,xs),X.bindVertexArray(null),ug(o),Ca&&(Ie.markDirtyRect(Ie.glMask,Ca),Ca=null),xs=0,ag(wt,X)})();let r=he.p?.type;r==="image"?bm(er.tips.get(he.p.image.src),he.p.image.src):r==="custom"&&bm(er.tips.get(he.p.tipKey),he.p.tipKey)})()}function hb(){let n=xg();he.drawFn(n)}function xg(){return(he.pressureCount>=10||he.cachedPressure===void 0)&&(he.cachedPressure=_i?Mm()*_i.pressure(cn.plotted):Mm(),he.pressureCount=0),he.pressureCount++,he.cachedPressure}function Mm(){if(!he.isCustomPressure)return(function(e=.5+he.p.pressure.curve[0]*he.a,t=1-he.p.pressure.curve[1]*he.b,i=he.cp,s=he.min,r=he.max){let o=e*Pa,a=(cn.plotted<o?1.2*t:.8*t)*(Pa/2);return Gi(1/(1+Math.pow(Math.abs((cn.plotted-o)/a),2*i)),0,1,s,r)})();let n=cn.plotted/Pa;return Gi(he.p.pressure.curve(Math.max(0,Math.min(1,.5+(n-.5+he.ct)*he.cs)))+he.cp+he.ck*(n-.5),0,1,he.min,he.max,!0)}function ub(n){let e=Q.stroke.weight*he.p.scatter*n+Q.stroke.weight*fd(Ga)*he.p.scatter/3,t=he.p.weight*Qe(.9,1.1),i=Math.ceil(he.p.grain/n);for(let s=0;s<i;s++){let r=Qe(.9,1.1),o=r*e*Qe(-1,1),a=Qe(-1,1),c=Math.sqrt((r*e)**2-o**2);Td(cn.x+o,cn.y+a*c,t,he.alpha)}}function vg(n,e=!0,t=he.alpha){let i=e?Q.stroke.weight*he.p.scatter:0,s=e?i*Qe(-1,1):0,r=e?i*Qe(-1,1):0;Td(cn.x+s,cn.y+r,Q.stroke.weight*he.p.weight*n,t*Math.max(.8,n)*Qe(.9,1.1))}function yg(n,e=he.alpha){let t=Q.stroke.weight*he.p.scatter,i=t*Qe(-1,1),s=t*Qe(-1,1),r=he.p.weight*Q.stroke.weight*n,o=he.overscan,a=0;he.p.rotate==="random"?a=Vm(0,360)*(Math.PI/180):he.p.rotate==="natural"&&(a=((_i?-Ph:-vh)+cn.angle())*(Math.PI/180)),(function(c,l,h,d,u,f=0){if(vs>=zf){zf*=2;let x=new Float32Array(5*zf);x.set(Hn),Hn=x}let g=c-Ba,S=l-Ua,m=Ta*g+_d*S+Ad+Ba,p=wa*g+Md*S+Ed+Ua,v=Ss*h*wh/2,M=Ss*f*wh,y=5*vs;Hn[y]=m,Hn[y+1]=p,Hn[y+2]=v,Hn[y+3]=d,Hn[y+4]=u/255;let _=m*Ss,b=p*Ss,A=1.42*v+M;Ra=fg(Ra,_-A-1,b-A-1,_+A+1,b+A+1),vs++})(cn.x+i,cn.y+s,r,a,e*Math.max(.8,n)*Qe(.9,1.1),o)}function fb(n){if(Qe(0,1)>=he.p.grain*n)return;let e=Q.stroke.weight*he.p.scatter*(he.p.sharpness+(1-he.p.sharpness)*fd(Ga)/n),t,i;if(_i){let o=Ph,a=On(o),c=Mn(o),l=e*Qe(-1,1),h=.3*e*Qe(-1,1);t=l*c+h*a,i=l*a-h*c}else{let o=e*Qe(-1,1),a=.3*e*Qe(-1,1);t=o*he.sin+a*he.cos,i=o*he.cos-a*he.sin}let s=n*n*he.p.weight*Qe(.85,1.15)*Q.stroke.weight,r=Math.max(.9,n)*he.alpha*Qe(.75,1.1);Td(cn.x+t,cn.y+i,s,r)}function Am(){if(he.p.markerTip===!1)return;let n=xg(),e=he.alpha;if(he.p.type==="marker")for(let t=1;t<10;t++)vg(n*t/10,!0,8*e);else if(he.p.type==="custom"||he.p.type==="image")for(let t=1;t<5;t++)yg(n*t/10,2*e)}function Pd(n,e,t,i){if(!Q.stroke.isActive||!Q.stroke.color)throw new Error("No brush or color set. Call brush.set('brushName', color) before drawing.");Mi();let s=Ys(n,e,t,i);s!=0&&(Cd(n,e,s),Rd(to(n,e,t,i),!1))}function db(n,e,t,i){if(!Q.stroke.isActive||!Q.stroke.color)throw new Error("No brush or color set. Call brush.set('brushName', color) before drawing.");Mi(),Cd(n,e,t),Rd(Ea(i),!1)}Hm(()=>{Ga.length=0});var pb=["weight","scatter","sharpness","grain","opacity","spacing","pressure","type","tip","rotate","markerTip","noise"],mb=[["pen",[.3,.15,.9,.7,150,.1,{curve:[.15,.2],min_max:[1.2,1]}]],["rotring",[.15,.05,.7,.9,210,.1,{curve:[.35,.2],min_max:[1.3,1]}]],["2B",[.3,.75,.45,.8,180,.1,{curve:[.1,.3],min_max:[1.1,.9]}]],["HB",[.3,.6,.3,.7,170,.1,{curve:[.15,.2],min_max:[1.1,.9]}]],["2H",[.2,.6,.3,.75,120,.1,{curve:[.15,.2],min_max:[1.1,.9]}]],["cpencil",[.35,.55,.8,.7,75,.1,{curve:[.15,.2],min_max:[.95,1.1]}]],["pastel",[.7,5,.91,1,30,.085/3,{mode:"gaussian",curve:[.4,.05],min_max:[1.09,.93]},"default",void 0,"natural",!0,1]],["crayon",[.33,1.9,.75,2,159,.07,[1.1,.9],"default",void 0,"natural",!0,1]],["charcoal",[.35,1.5,.68,2,120,.03,{curve:[.15,.4],min_max:[1.1,.95]}]],["spray",[.2,6,15,40,90,.5,{curve:[.2,.35],min_max:[.7,1]},"spray"]],["marker",[2,.2,null,null,1,.03,{curve:[.35,.25],min_max:[1.2,.85]},"marker"]]];for(let n of mb){let e={};for(let t=0;t<n[1].length;t++)e[pb[t]]=n[1][t];dg(n[0],e)}ti.prototype.draw=function(n=!1,e,t){let i=Rh();if(n&&Nh(n,e,t),i.isActive)for(let s of this.sides)Pd(s[0].x,s[0].y,s[1].x,s[1].y);return wd(i),this},kn.prototype.draw=function(n,e,t){return Rh().isActive&&(this.origin&&(n=this.origin[0],e=this.origin[1],t=1),(function(i,s,r,o){Mi(),Cd(s,r,i.length,i),Rd(o,!0)})(this,n,e,t)),this};var er={tips:new Map,add(n){this.tips.has(n)||this.tips.set(n,!1)},imageToWhite(n){n.loadPixels();for(let e=0;e<4*n.width*n.height;e+=4){let t=(n.pixels[e]+n.pixels[e+1]+n.pixels[e+2])/3;n.pixels[e]=n.pixels[e+1]=n.pixels[e+2]=255,n.pixels[e+3]=255-t}n.updatePixels()},async load(){let n=[...this.tips.keys()].filter(e=>!this.tips.get(e));await Promise.all(n.map(e=>((t,i)=>Th.loadImageTip(t,i))(e,er.imageToWhite).then(t=>{this.tips.set(e,t)})))}};function sd(){return{...Q.hatch}}function Sg(n){Q.hatch={...n}}function Id(n=5,e=45,t={rand:!1,continuous:!1,gradient:!1}){let i=Q.hatch;i.isActive=!0,i.dist=n,i.angle=ao(e),i.options=t}function gb(n,e="black",t=1){Q.hatch.hBrush={brush:n,color:e,weight:t}}function xb(){Q.hatch.isActive=!1,Q.hatch.hBrush=!1}Q.hatch={isActive:!1,dist:5,angle:45,options:{},hBrush:!1};var Sa=new Float64Array(256),ms=new Float64Array(256),ba=new Float64Array(512),Hf=new Float64Array(512),kf=new Float64Array(512),Vf=new Float64Array(512);function vb(n,e,t,i){let s=(function(r,o,a,c){Array.isArray(r)||(r=[r]);let l=o*Math.PI/180,h=Math.cos(l),d=Math.sin(l),u=0;for(let b of r)u+=b.a.length;if(u===0)return[];Sa.length<u&&(Sa=new Float64Array(2*u),ms=new Float64Array(2*u));let f=1/0,g=-1/0,S=0,m=0;ba.length<u&&(ba=new Float64Array(2*u),Hf=new Float64Array(2*u),kf=new Float64Array(2*u),Vf=new Float64Array(2*u));for(let b of r){let A=b.a,x=A.length,E=m;for(let w=0;w<x;w++){let R=A[w][0],I=A[w][1];Sa[m]=R*h-I*d,ms[m]=R*d+I*h,ms[m]<f&&(f=ms[m]),ms[m]>g&&(g=ms[m]),m++}for(let w=0;w<x;w++){let R=E+w,I=E+(w+1<x?w+1:0),N=ms[R],D=ms[I];N!==D&&(ba[S]=Sa[R],Hf[S]=N,kf[S]=Sa[I],Vf[S]=D,S++)}}let p=[],v=[],M=f+.5*a,y=a,_=c!==1;for(;M<g;){v.length=0;for(let A=0;A<S;A++){let x=Hf[A],E=Vf[A];x<=M!=E<=M&&v.push(ba[A]+(M-x)/(E-x)*(kf[A]-ba[A]))}let b=v.length;if(b===2){let A=v[0],x=v[1];if(A>x){let E=A;A=x,x=E}p.push({scanY:M,x1:A*h+M*d,y1:-A*d+M*h,x2:x*h+M*d,y2:-x*d+M*h})}else if(b>2){v.sort((A,x)=>A-x);for(let A=0;A<b-1;A+=2){let x=v[A],E=v[A+1];p.push({scanY:M,x1:x*h+M*d,y1:-x*d+M*h,x2:E*h+M*d,y2:-E*d+M*h})}}M+=y,_&&(y*=c)}return p})(n,t,e,i);return s.sort((r,o)=>r.scanY===o.scanY?r.x1-o.x1:r.scanY-o.scanY),s}function bg(n){let{dist:e,options:t,segs:i}=(function(o){let a=Q.hatch.dist,c=(Q.hatch.angle%180+180)%180,l=Q.hatch.options;return{dist:a,options:l,segs:vb(o,a,c,l.gradient?Gi(l.gradient,0,1,1,1.1,!0):1)}})(n),s=t.rand||0,r=[];for(let o=0;o<i.length;o++){let a=i[o],c=a.x1,l=a.y1,h=a.x2,d=a.y2;s&&(c+=2*s*e*Qe(-1,1),l+=2*s*e*Qe(-1,1),h+=2*s*e*Qe(-1,1),d+=2*s*e*Qe(-1,1));let u=t.continuous&&o%2==1?{x1:h,y1:d,x2:c,y2:l,scanY:a.scanY,isConnector:!1}:{x1:c,y1:l,x2:h,y2:d,scanY:a.scanY,isConnector:!1};if(r.push(u),o>0&&t.continuous){let f=r[r.length-2];r.push({x1:f.x2,y1:f.y2,x2:u.x1,y2:u.y1,scanY:a.scanY,isConnector:!0})}}return r}function _g(n){(function(e,t){let i=bg(e);(function(){let s=Rh();(()=>{for(let r=0;r<i.length;r++){let o=i[r];t(o.x1,o.y1,o.x2,o.y2,r,i)}})(),wd(s)})()})(n,(e,t,i,s)=>{Q.hatch.hBrush&&Nh(Q.hatch.hBrush.brush,Q.hatch.hBrush.color,Q.hatch.hBrush.weight*Qe(.9,1.1)),Pd(e,t,i,s)})}function yb(n,e,t={}){Q.mass.brush=n,Q.mass.color=e,Q.mass.options=t,Q.mass.isActive=!0}function Sb(){Q.mass.isActive=!1,Q.mass.brush=null,Q.mass.color=null,Q.mass.options={}}function rd(n,e,t){return new ti(n.vertices.map(i=>[i.x+e,i.y+t]))}function Em(n,e,t){return n.map(i=>rd(i,e,t))}function Mg(n){let e=Array.isArray(n)?n.flatMap(o=>o?.a??[]):n?.a??[],t=1/0,i=1/0,s=-1/0,r=-1/0;for(let[o,a]of e)o<t&&(t=o),a<i&&(i=a),o>s&&(s=o),a>r&&(r=a);return{minX:t,minY:i,maxX:s,maxY:r,cx:(t+s)/2,cy:(i+r)/2,size:Math.hypot(s-t,r-i)}}function bb(n,e,t,i,s){let r=(e+i)/2,o=(t+s)/2,a=i-e,c=s-t,l=Math.hypot(a,c);if(!l)return null;let h=-c/l,d=a/l,u=(n.x-r)*h+(n.y-o)*d;return{x:r+h*u,y:o+d*u}}function _b(n,e,t,i,s,r){if(!Array.isArray(n))return e;let o=(t+s)/2,a=(i+r)/2,c=Math.hypot(s-t,r-i),l=Math.max(Mg(n).size,c,1),h=.08+.18*(1-Math.min(1,c/(.42*l)));return{x:e.x+(o-e.x)*h,y:e.y+(a-e.y)*h}}function Tm(n,e,t){let i=!1;for(let s=0,r=n.length-1;s<n.length;r=s++){let o=n[s][0],a=n[s][1],c=n[r][0],l=n[r][1];a>t!=l>t&&e<(c-o)*(t-a)/(l-a||Number.EPSILON)+o&&(i=!i)}return i}function Mb(n,e,t){if(Array.isArray(n)){let i=!1;for(let s of n)Tm(s.a,e,t)&&(i=!i);return i}return Tm(n.a,e,t)}function Ab(n,e,t,i,s,r,o){let a=r(i),c=(a+((r(s)-a)%360+360)%360*o)*Math.PI/180;return{x:n+t*Math.cos(c),y:e-t*Math.sin(c)}}function wm(n,e,t,i,s,r,o){for(let a of[.125,.25,.375,.5,.625,.75,.875]){let c=Ab(e,t,i,s,r,o,a);if(!Mb(n,c.x,c.y))return!1}return!0}function Eb(n,e,t,i,s,r,o,a,c,l){let h=(function(g,S,m,p,v,M,y){let _=to(g,S,m,p),b=to(g,S,v,M);return((b-_)%360+360)%360>180&&([_,b]=[b,_]),[y(_),y(b)]})(e,t,s,r,o,a,c),d=[h[1],h[0]],u=wm(n,e,t,i,h[0],h[1],l),f=wm(n,e,t,i,d[0],d[1],l);return u&&!f?h:f&&!u?d:u?h:f?d:null}function Tb(n){let e=Xt(.35,.65),t=n.x1+(n.x2-n.x1)*e,i=n.y1+(n.y2-n.y1)*e,s=n.x2-n.x1,r=n.y2-n.y1,o=Math.hypot(s,r)||1,a=Xt(.04,.1)*o,c=s/o*a*.5,l=r/o*a*.5;return[{x1:n.x1,y1:n.y1,x2:t-c,y2:i-l},{x1:t+c,y1:i+l,x2:n.x2,y2:n.y2}]}function wb(n,e,t,i){let s=(function(r,o){let a=Mg(r),c=a.size*Xt(.6,1.4),[l,h]=o;return{x:a.cx+l*c,y:a.cy+h*c}})(n,e);for(let r of bg(n)){let o=!r.isConnector&&Xt()<.35?Tb(r):[r];for(let a of o){let c=bb(s,a.x1,a.y1,a.x2,a.y2),l=c?_b(n,c,a.x1,a.y1,a.x2,a.y2):null;if(!l)continue;let h=Ys(l.x,l.y,a.x1,a.y1);if(!h)continue;let d=Eb(n,l.x,l.y,h,a.x1,a.y1,a.x2,a.y2,t,i);if(!d)continue;let[u,f]=d;ig(l.x,l.y,h,u,f)}}}function Wf(n,e,t,i,s,r,o){Id(e,t,Array.isArray(n)?{...i,continuous:!1}:i),wb(n,s,r,o)}function od(n,e,t,i){let s=(function(v,M,y,_){let b=M===!1,A=_m(Q.mass.brush)?.scatter??0,x=b?v:v.genPol(M,y,_,.15),E=Math.min(2*A,5),w=[[Xt(-E,E),Xt(-E,E)],[Xt(-E,E),Xt(-E,E)]];return Array.isArray(x)?[x,Em(x,w[0][0],w[0][1]),Em(x,w[1][0],w[1][1])]:[x,rd(x,w[0][0],w[0][1]),rd(x,w[1][0],w[1][1])]})(n,e,t,i),r=sd(),o=Rh(),a={...Q.field},c=Q.mass.options?.precision??.5,l=Q.mass.options?.strength??1,h=Q.mass.options?.gradient??.1,d=Q.mass.options?.outline??!1,u=_m(Q.mass.brush)?.scatter??0,f=1.6*Xt(.65*u,.85*u)-.4*h,g=Xt(-90,90),S=((g+90)%180+180)%180-90>=0?Xt()<.5?[1,1]:[-1,-1]:Xt()<.5?[-1,1]:[1,-1],m=Da()?v=>v*Math.PI/180:v=>v,p=Da()?v=>180*v/Math.PI:v=>v;Nh(Q.mass.brush,Q.mass.color,1),Km(2-c),d&&(function(v){if(Array.isArray(v))for(let M of v)M.draw();else v.draw()})(s[0]),Wf(s[0],.9*f,ph(g),{gradient:h,rand:2-2*c,continuous:!0},S,m,p),l>.33&&Wf(s[1],f,ph(g+20*Xt(-1,1)),{gradient:h,rand:.6-.6*c,continuous:!0},S,m,p),l>.66&&Wf(s[2],.8*f,ph(g+15*Xt(-1,1)),{gradient:h,rand:.6-.6*c,continuous:!0},S,m,p),wd(o),Sg(r),Q.field={...a}}function Cb(n){return od(n,!1)}function Ag(n,e=null){let t=Ie.ctx;e||(e=t.getTransform());let i=e.a,s=e.b,r=e.c,o=e.d,a=e.e,c=e.f,l=1/0,h=1/0,d=-1/0,u=-1/0;t.beginPath();let f=n[0],g=i*f.x+r*f.y+a,S=s*f.x+o*f.y+c;l=d=g,h=u=S,t.moveTo(f.x,f.y);for(let p=1;p<n.length;p++){let v=n[p];g=i*v.x+r*v.y+a,S=s*v.x+o*v.y+c,l=Math.min(l,g),h=Math.min(h,S),d=Math.max(d,g),u=Math.max(u,S),t.lineTo(v.x,v.y)}t.closePath();let m=(function(p,v){let M=p.lineWidth||0;return M<=0?1:1+M*Math.max(Math.hypot(v.a,v.c),Math.hypot(v.b,v.d))/2})(t,e);Ie.markDirtyRect(Ie.mask,{minX:l-m,minY:h-m,maxX:d+m,maxY:u+m})}function Rb(n,e,t){let i=2*Math.PI,s=Ie.ctx,r=t/2;s.moveTo(n+r,e),s.arc(n,e,r,0,i)}ti.prototype.hatch=function(n=!1,e,t){let i=sd();return n&&Id(n,e,t),Q.hatch.isActive&&_g(this),Sg(i),this},kn.prototype.hatch=function(n,e,t){sd().isActive&&(this.origin&&(n=this.origin[0],e=this.origin[1],t=1),this.pol=this.genPol(n,e,t,.3),this.pol.hatch())},Q.mass={isActive:!1,brush:null,color:null,options:{}},ti.prototype.mass=function(){return Q.mass?.isActive&&od(this,!1),this},kn.prototype.mass=function(n,e,t){return Q.mass?.isActive&&(this.origin&&(n=this.origin[0],e=this.origin[1],t=1),od(this,n,e,t)),this};var Zr=null,Cm=!1;Cm||(Ma={ensureResources:function(n,e,t,i,s){var a,c;let r=Math.max(1,Math.round(e*i)),o=Math.max(1,Math.round(t*i));return(function(l,h,d){return!l.mask||l.mask.width!==h||l.mask.height!==d})(n,r,o)&&(n.mask=Mh(r,o)),(function(l,h,d,u){return!l.fillMaskFramebuffer||l.fillMaskFramebuffer.width!==h||l.fillMaskFramebuffer.height!==d||typeof l.fillMaskFramebuffer.pixelDensity=="function"&&l.fillMaskFramebuffer.pixelDensity()!==u})(n,e,t,i)&&(n.fillMaskFramebuffer?.remove&&n.fillMaskFramebuffer.remove(),n.fillMaskFramebuffer=Bm(n,{width:e,height:t,density:i,antialias:!1,depth:!1,stencil:!1}),s(n.fillMaskFramebuffer)),(a=n.mask).dirtyRect??(a.dirtyRect=null),(c=n.mask).isDrawn??(c.isDrawn=!1),n.mask.drawingContext.imageSmoothingEnabled=!1,{mask:n.mask,ctx:n.mask.drawingContext}},clearMask:function(n,e){n&&(e(n),n.isDrawn=!1,n.dirtyRect=null)},getCompositeRect:function(n,e,t,i,s){return n?n.dirtyRect?s(i(n.dirtyRect,4)):t():null},getShaderMask:function(n,e,t,i,s){let r=n.fillMaskFramebuffer,o=n.drawingContext,a=t??i(),c=a.maxX-a.minX,l=a.maxY-a.minY;Zr&&Zr.width===c&&Zr.height===l||(Zr=Mh(c,l));let h=Zr.drawingContext;return h.clearRect(0,0,c,l),h.drawImage(e,a.minX,a.minY,c,l,0,0,c,l),s(r),o.bindTexture(o.TEXTURE_2D,r.colorTexture),o.texSubImage2D(o.TEXTURE_2D,0,a.minX,a.minY,o.RGBA,o.UNSIGNED_BYTE,Zr),r}},Cm=!0);var Js,Xf=[],Rm=[],Qf=[],Pm=[];Q.fill={opacity:150,bleed_strength:.07,texture_strength:.8,border_strength:.5,direction:"out",angle:null,scatter:!0,isActive:!1};var Im=()=>({...Q.fill});function Eg(n,e,t,i){Q.fill.opacity=(arguments.length<4?e:i)||150,Q.fill.color=arguments.length<3?sr(n):sr(n,e,t),Q.fill.isActive=!0}function Tg(n,e="out",t=null){Q.fill.bleed_strength=oo(n,0,1),Q.fill.direction=e,Q.fill.angle=t==null?null:ao(t)}function wg(n=.4,e=.4,t=!0){Q.fill.texture_strength=oo(n,0,1),Q.fill.border_strength=oo(e,0,1),Q.fill.scatter=t}function Pb(){Q.fill.isActive=!1}var ad,yh,Sh,bh,_h,Ia=[[],[]];function Cg(){for(let n=0;n<512;n++)Ia[0][n]=ro(.5,.2),Ia[1][n]=ro(0,.02)}Hm(Cg);var ld=class n{constructor(e,t,i,s=[],r=!1,o,a){if(this.v=e,this.m=t,this.dir=s,this.midP=i,r){let c=0,l=0,h=[];for(let g=0;g<e.length;g++){let S=Math.abs(i.x-e[g].x),m=Math.abs(i.y-e[g].y);c=Math.max(c,S),l=Math.max(l,m);let p=e[g],v=e[(g+1)%e.length],M={x:v.x-p.x,y:v.y-p.y},y=zS(0,0,M.x,M.y,90),_={x:p.x+M.x/2,y:p.y+M.y/2};h.push({v1:p,v2:v,ray:{point1:_,point2:{x:_.x+y.x,y:_.y+y.y}}})}this.sizeX=c,this.sizeY=l;let d=ad.sides;this.dir=Array(e.length);for(let g=0;g<h.length;g++){let S=h[g],m=S.ray.point1.x,p=S.ray.point1.y,v=S.ray.point2.x-m,M=S.ray.point2.y-p,y=S.v2.x-S.v1.x,_=S.v2.y-S.v1.y,b=-(y*y+_*_),A=0;for(let x=0;x<d.length;x++){let E=d[x][0],w=d[x][1],R=w.x-E.x,I=w.y-E.y,N=I*v-R*M;if(N===0)continue;let D=(v*(p-E.y)-M*(m-E.x))/N;D<0||D>1||(R*(p-E.y)-I*(m-E.x))/N*b<=.01||A++}this.dir[g]=A%2==0}let u=Qe(-.6,.6)*c,f=Qe(-.6,.6)*l;this.midP={x:i.x+u,y:i.y+f}}else this.sizeX=o,this.sizeY=a}trim(e=1){if(e>=1||e<0||this.v.length<=8)return{v:this.v,m:this.m,dir:this.dir};let t=this.v.length,i=~~((1-e)*t),s=~~(t/2-i/2),r=s,o=s+i,a=this.v[(r-1+t)%t],c=this.v[o%t],l=c.x-a.x,h=c.y-a.y,d=Math.hypot(l,h),u=s>=2?~~Qe(0,s-1):o<t-1?o:0,f=this.v[u],g=this.v[(u+1)%t],S=Math.max(1,Math.hypot(g.x-f.x,g.y-f.y)),m=Math.max(2,Math.ceil(d/S*.05)),p=t-i+m,v=new Array(p),M=new Array(p),y=new Array(p),_=0;for(let x=0;x<s;x++,_++)v[_]=this.v[x],M[_]=this.m[x],y[_]=this.dir[x];let b=.06*d,A=this.dir[r%this.dir.length];for(let x=0;x<m;x++,_++){let E=(x+1)/(m+1);v[_]={x:a.x+l*E+Qe(-b,b),y:a.y+h*E+Qe(-b,b)},M[_]=Qe(.3,.5),y[_]=A}for(let x=o;x<t;x++,_++)v[_]=this.v[x],M[_]=this.m[x],y[_]=this.dir[x];return{v,m:M,dir:y}}scatter(e=.3){let t=this.v.length,i=Math.max(3,~~(t*e)),s=t/i,r=.8*s,o=[],a=[],c=[],l=this.midP,h=ad.sides;for(let d=0;d<i;d++){let u=~~(d*s+Qe(0,r))%t,f=this.v[u],g=!1;if(f.x<yh||f.x>bh||f.y<Sh||f.y>_h)g=!0;else{let S=0;for(let[m,p]of h){let v=m.y,M=p.y;if(v>f.y==M>f.y)continue;let y=(f.y-v)/(M-v);f.x<m.x+y*(p.x-m.x)&&S++}g=S%2==0}g&&(f={x:l.x+(f.x-l.x)*Qe(.3,.6),y:l.y+(f.y-l.y)*Qe(.3,.6)}),o.push(f),a.push(this.m[u]),c.push(!this.dir[u])}return new n(o,a,this.midP,c,!1,this.sizeX,this.sizeY)}flipDirs(){return new n(this.v,this.m,this.midP,this.dir.map(e=>!e),!1,this.sizeX,this.sizeY)}grow(e=1){let{v:t,m:i,dir:s}=this.trim(e),r=t.length,o=2*r;Xf.length<r&&(Xf=new Array(r),Rm=new Array(r)),Qf.length<o&&(Qf=new Array(o),Pm=new Array(o));let a=Xf,c=Rm,l=Qf,h=Pm,d=Q.fill.direction==="out"?-90:90;Ia[0].length===0&&Cg();let u=Ia[0],f=u.length,g=Ia[1],S=g.length,m=0,p=0,v=e===999?Qe(.6,.8):Q.fill.bleed_strength,M=Js&&2*r>Js?Math.ceil(2*r/Js):1;if(M>=2&&!(1&M)){for(let A=0;A<r;A++){let x=i[A];e<997&&(v=x),v>=.05&&(Qe(-1,1),u[~~(Qe(0,1)*f)],Qe(.65,1.35),g[~~(Qe(0,1)*S)])}return new n(t,i,this.midP,s,!1,this.sizeX,this.sizeY)}for(let A=0;A<r;A++){let x=t[A],E=t[A+1<r?A+1:0],w=i[A],R=s[A];if(e<997&&(v=w),v<.05){l[m]=w,h[m]=R,m++,a[p]=(x.x+E.x)/2,c[p]=(x.y+E.y)/2,l[m]=w,h[m]=R,m++,p++;continue}let I=(R?d:-d)+5*Qe(-1,1),N=La(I),D=N[0],U=N[1],W=E.x-x.x,k=E.y-x.y,re=D*W+U*k,q=D*k-U*W,Z=u[~~(Qe(0,1)*f)]*Qe(.65,1.35)*v,ee=w+g[~~(Qe(0,1)*S)];l[m]=w,h[m]=R,m++,a[p]=x.x+.5*W+re*Z,c[p]=x.y+.5*k+q*Z,l[m]=ee,h[m]=R,m++,p++}let y,_,b;if(Js&&m>Js){let A=Math.ceil(m/Js),x=Math.ceil(m/A);y=new Array(x),_=new Array(x),b=new Array(x);let E=0;for(let w=0;w<m;w+=A,E++)y[E]=w%2==0?t[w>>1]:{x:a[w>>1],y:c[w>>1]},_[E]=l[w],b[E]=h[w]}else{y=new Array(m);for(let A=0;A<m;A++)y[A]=A%2==0?t[A>>1]:{x:a[A>>1],y:c[A>>1]};_=l.slice(0,m),b=h.slice(0,m)}return new n(y,_,this.midP,b,!1,this.sizeX,this.sizeY)}fill(e,t,i){let s=3*i,r=2*t*(1+i/2),o=Ie.isBrush!==!1;Ie.isBrush=!1,o&&(Ie.justChanged=!0),Ie.blend(e);let a=tr();Ie.ctx.save(),Ie.ctx.setTransform(Qt*a.a,Qt*a.b,Qt*a.c,Qt*a.d,Qt*(a.x+qt/2),Qt*(a.y+jt/2)),Ie.ctx.strokeStyle="rgb(255 0 0 / "+.01*Q.fill.border_strength+")",Ie.ctx.lineCap="round",Js=2024*Math.max(.2,2*Q.fill.bleed_strength);let c=Ie.ctx.getTransform(),l=Math.max(this.sizeX,this.sizeY),h=Qe(.15,.7),d=this.grow(),u=this.scatter(.1).grow().scatter(.75).flipDirs(),f;for(let g=0;g<20;g++){g%4==0&&(d=d.grow()),g%2==0&&(f=[d.grow(1-.0125*g),d.grow(.7-.0125*g),d.grow(.4-.0125*g)]);for(let S of f)S.grow(999).grow(997).layer(g,l,r,c);Q.fill.scatter&&u.grow(999).flipDirs().grow(997).layer(g,l,r*s,c),g%2==0&&d.grow(h).grow(999).layer(g,l,2*r,c),g%8!=0&&g!==19||(s!==0&&d.erase(3*s,t),Ie.blend(e,!0))}Ie.ctx.restore()}layer(e,t,i,s=null){Ie.ctx.lineWidth=Gi(e,0,24,t/25,t/30,!0)*Q.fill.border_strength,Ie.ctx.fillStyle="rgb(255 0 0 / "+i+"%)",Ag(this.v,s),Ie.ctx.fill(),Ie.ctx.stroke()}erase(e,t){Ie.ctx.save();let i=~~(Qe(80,110)*Gi(e,0,1,2,3.5)),s=this.sizeX/1.3,r=this.sizeY/1.3,o=1.3*Math.min(this.sizeX,this.sizeY),a=.03*o,c=.45*o,{x:l,y:h}=this.midP;Ie.ctx.globalCompositeOperation="destination-out";let d=(5-Gi(t,80,100,.3,.7,!0))*e/255;Ie.ctx.fillStyle=`rgb(255 0 0 / ${d})`,Ie.ctx.lineWidth=0;for(let u=0;u<i;u++){let f=l+ro(0,s),g=h+ro(0,r),S=Qe(a,c);Ie.ctx.beginPath(),Rb(f,g,S),u%5!=0&&Ie.ctx.fill()}Ie.ctx.globalCompositeOperation="source-over",Ie.ctx.restore()}};function Rg(n,e,t,i){za(),Q.wash.opacity=(arguments.length<4?e:i)??150,Q.wash.color=arguments.length<3?sr(n):sr(n,e,t),Q.wash.isActive=!0}function Ib(){Q.wash.isActive=!1}function Db(n,e,t){let i=e.isEnabled(e.DEPTH_TEST);return i&&e.disable(e.DEPTH_TEST),e.bindFramebuffer(e.FRAMEBUFFER,t.framebuffer),e.viewport(0,0,t.width*t.density,t.height*t.density),{hadDepthTest:i}}function Lb(n,e,t){t?.hadDepthTest&&e.enable(e.DEPTH_TEST),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,Math.max(1,Math.round(qt*Qt)),Math.max(1,Math.round(jt*Qt)))}function Fb(n,e){e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,null),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA)}function Ob(n,e,t){if(!e)return;if(t(e)){let s=n.drawingContext,r=s.getParameter(s.FRAMEBUFFER_BINDING),o=s.getParameter(s.VIEWPORT);return s.bindFramebuffer(s.FRAMEBUFFER,e.framebuffer),s.viewport(0,0,e.width*e.density,e.height*e.density),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),s.bindFramebuffer(s.FRAMEBUFFER,r),void s.viewport(o[0],o[1],o[2],o[3])}let i=e.drawingContext;i.save(),i.setTransform(1,0,0,1,0,0),i.clearRect(0,0,e.width,e.height),i.restore()}function Nb(n,e,t){return n.shaderProgram??(n.shaderProgram=(function(i,s,r){let o=id(i,s,r),a=new Map,c=i.createVertexArray(),l=i.getUniformLocation(o,"u_source"),h=i.getUniformLocation(o,"u_mask"),d=i.getUniformLocation(o,"u_color");return{program:o,quadVao:c,loc_source:l,loc_mask:h,loc_color:d,setUniform(u,f){let g=(S=>(a.has(S)||a.set(S,i.getUniformLocation(o,S)),a.get(S)))(u);g&&(typeof f!="boolean"?typeof f!="number"?Array.isArray(f)&&(f.length===3?i.uniform3f(g,f[0],f[1],f[2]):f.length===4&&i.uniform4f(g,f[0],f[1],f[2],f[3])):i.uniform1f(g,f):i.uniform1i(g,f?1:0))}}})(n.drawingContext,e,t)),n.shaderProgram}function Pg(n,e){let t=n.drawingContext,i=e.density??1,s=t.createFramebuffer(),r=Math.max(1,e.width),o=Math.max(1,e.height),a=Math.max(1,Math.round(r*i)),c=Math.max(1,Math.round(o*i)),l=(function(h,d,u){let f=h.createTexture();return h.bindTexture(h.TEXTURE_2D,f),h.texImage2D(h.TEXTURE_2D,0,h.RGBA,d,u,0,h.RGBA,h.UNSIGNED_BYTE,null),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,h.LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MAG_FILTER,h.LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.CLAMP_TO_EDGE),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.CLAMP_TO_EDGE),h.bindTexture(h.TEXTURE_2D,null),f})(t,a,c);return t.bindFramebuffer(t.FRAMEBUFFER,s),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,l,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{__brushFramebuffer:!0,framebuffer:s,colorTexture:l,width:r,height:o,density:i,pixelDensity:()=>i,remove(){t.deleteFramebuffer(s),t.deleteTexture(l)}}}function Bb(n,e,t,i,s){return e?.remove?.(),Pg(n,{width:t,height:i,density:s})}function Ub({renderer:n,shader:e,source:t,mask:i,color:s,isBrushMask:r,dirtyRect:o,targetIsFramebuffer:a,withScissor:c}){let l=n.drawingContext,h=l.isEnabled(l.DEPTH_TEST),d=l.getParameter(l.FRAMEBUFFER_BINDING),u=l.getParameter(l.CURRENT_PROGRAM),f=l.getParameter(l.VERTEX_ARRAY_BINDING);l.bindVertexArray(e.quadVao),l.useProgram(e.program),l.disable(l.DEPTH_TEST),l.enable(l.BLEND),l.blendEquation(l.FUNC_ADD),l.blendFunc(l.ONE,l.ONE_MINUS_SRC_ALPHA),l.activeTexture(l.TEXTURE0),l.bindTexture(l.TEXTURE_2D,t.colorTexture),l.uniform1i(e.loc_source,0),l.activeTexture(l.TEXTURE1),l.bindTexture(l.TEXTURE_2D,i.colorTexture),l.uniform1i(e.loc_mask,1),e.setUniform("u_targetIsFramebuffer",a),e.setUniform("u_isBrush",r),l.uniform3f(e.loc_color,s[0],s[1],s[2]),l.bindFramebuffer(l.FRAMEBUFFER,null),c(l,o,()=>{l.drawArrays(l.TRIANGLES,0,3)},!a),l.bindTexture(l.TEXTURE_2D,null),l.activeTexture(l.TEXTURE0),l.bindVertexArray(f),l.useProgram(u),l.bindFramebuffer(l.FRAMEBUFFER,d),h&&l.enable(l.DEPTH_TEST)}function Gb(n){return(function({renderer:e,sourceFramebuffer:t,dirtyRect:i,getTargetPixelSize:s,toScissorBox:r}){let o=e.drawingContext,{width:a,height:c}=s(),l=i?r(i):null,h=o.getParameter(o.READ_FRAMEBUFFER_BINDING),d=o.getParameter(o.DRAW_FRAMEBUFFER_BINDING);return o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,t.framebuffer),o.blitFramebuffer(l?.x??0,l?.y??0,l?l.x+l.width:a,l?l.y+l.height:c,l?.x??0,l?.y??0,l?l.x+l.width:a,l?l.y+l.height:c,o.COLOR_BUFFER_BIT,o.NEAREST),o.bindFramebuffer(o.READ_FRAMEBUFFER,h),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,d),t})(n)}function Kf(n){if(typeof n=="number"){let e=Math.max(0,Math.min(255,n));return`rgb(${e} ${e} ${e})`}return n??"black"}function Ig(n){let e=((i,s=!1)=>(i.drawingContext??(i.drawingContext=i.getContext("2d",s?{willReadFrequently:!0}:void 0)),i.drawingContext))(n,!0),t={canvas:n,drawingContext:e,width:n.width,height:n.height,pixels:null,_fillStyle:"#ffffff",_strokeStyle:"transparent",_lineWidth:1,pixelDensity:()=>1,background(i){e.save(),e.setTransform(1,0,0,1,0,0),e.fillStyle=Kf(i),e.fillRect(0,0,n.width,n.height),e.restore()},noSmooth(){e.imageSmoothingEnabled=!1},push(){e.save()},pop(){e.restore()},translate(i,s){e.translate(i,s)},scale(i,s=i){e.scale(i,s)},rotate(i){e.rotate(i)},noStroke(){t._strokeStyle="transparent"},stroke(i){t._strokeStyle=Kf(i)},noFill(){t._fillStyle="transparent"},fill(i){t._fillStyle=Kf(i)},strokeWeight(i){t._lineWidth=i},rect(i,s,r,o){e.beginPath(),e.rect(i,s,r,o),t._paint()},circle(i,s,r){e.beginPath(),e.arc(i,s,r/2,0,2*Math.PI),t._paint()},ellipse(i,s,r,o){e.beginPath(),e.ellipse(i,s,r/2,o/2,0,0,2*Math.PI),t._paint()},line(i,s,r,o){e.beginPath(),e.moveTo(i,s),e.lineTo(r,o),e.strokeStyle=t._strokeStyle,e.lineWidth=t._lineWidth,e.stroke()},beginShape(){e.beginPath(),t._shapeStarted=!1},vertex(i,s){t._shapeStarted?e.lineTo(i,s):(e.moveTo(i,s),t._shapeStarted=!0)},endShape(i=!1){i&&e.closePath(),t._paint()},loadPixels(){t.pixels=e.getImageData(0,0,n.width,n.height).data},updatePixels(){let i=e.getImageData(0,0,n.width,n.height);i.data.set(t.pixels),e.putImageData(i,0,0)},_paint(){t._fillStyle!=="transparent"&&(e.fillStyle=t._fillStyle,e.fill()),t._strokeStyle!=="transparent"&&(e.strokeStyle=t._strokeStyle,e.lineWidth=t._lineWidth,e.stroke())}};return t}function zb(n,e){return Ig(Mh(n,e,!0))}function Hb(n,e){return new Promise((t,i)=>{let s=globalThis.Image;if(!s)return void i(new Error("Standalone image brush loading requires Image support."));let r=new s;r.onload=()=>{let o=Ig(Mh(r.naturalWidth,r.naturalHeight,!0));o.drawingContext.drawImage(r,0,0),e(o),t(o)},r.onerror=()=>i(new Error(`Failed to load image tip: ${n}`)),r.crossOrigin="anonymous",r.src=n})}var Dm;ti.prototype.fill=function(n=!1,e,t,i,s,r,o){let a=Im();return n&&(Eg(n,e),Tg(t,r,o),wg(i,s)),a.isActive&&(Mi(),(function(c){if(!Q.fill.isActive||!Q.fill.color)throw new Error("No fill color set. Call brush.fill(color) before drawing shapes.");ad=c,yh=1/0,Sh=1/0,bh=-1/0,_h=-1/0;for(let[v]of c.sides)v.x<yh&&(yh=v.x),v.x>bh&&(bh=v.x),v.y<Sh&&(Sh=v.y),v.y>_h&&(_h=v.y);let l=[...c.vertices],h=Qe(0,75),d=~~(.25*l.length*(h<5?1:h<15?2:3)),u=Q.fill.bleed_strength,f=l.map((v,M)=>(M>d?1:.3)*Qe(.85,1.4)*u),g=Q.fill.angle==null?Vm(0,l.length):(function(v,M){let y=La(M),_=y[0],b=-y[1],A=0,x=1/0;for(let E=0;E<v.length;E++){let w=v[E].x*_+v[E].y*b;w<x&&(x=w,A=E)}return A})(l,Q.fill.angle),S=l.length,m=new Array(S);for(let v=0;v<S;v++)m[v]=l[(v+g)%S];let p=(function(v){let M=v.length;if(M===0)return{x:0,y:0};if(M<8){let A=0,x=0;for(let E=0;E<M;E++)A+=v[E].x,x+=v[E].y;return{x:A/M,y:x/M}}let y=0,_=0,b=0;for(let A=0;A<M;A++){let x=A+1<M?A+1:0,E=v[A].x,w=v[A].y,R=v[x].x,I=v[x].y,N=E*I-R*w;y+=N,_+=(E+R)*N,b+=(w+I)*N}return y*=.5,y?{x:_/(6*y),y:b/(6*y)}:{x:v[0].x,y:v[0].y}})(m);new ld(m,f,p,[],!0).fill(Q.fill.color,Gi(Q.fill.opacity,0,255,0,1,!0),Q.fill.texture_strength)})(this)),(c=>{Q.fill={...c}})(a),this},kn.prototype.fill=function(n,e,t){Im().isActive&&(this.origin&&(n=this.origin[0],e=this.origin[1],t=1),this.pol=this.genPol(n,e,t,Q.fill.bleed_strength<.06?0:Gi(Q.fill.bleed_strength,0,.6,.2,.6,!0)),this.pol.fill())},Q.wash={color:null,opacity:150,isActive:!1},ti.prototype.wash=function(n=!1,e){let t={...Q.wash};return n!==!1&&Rg(n,e),Q.wash.isActive&&(function(i){if(!Q.wash?.isActive||!Q.wash.color||i.vertices.length<3)return;let s=Ie.isBrush!==!1;Ie.isBrush=!1,s&&(Ie.justChanged=!0),Ie.blend(Q.wash.color);let r=tr();Ie.ctx.save(),Ie.ctx.setTransform(Qt*r.a,Qt*r.b,Qt*r.c,Qt*r.d,Qt*(r.x+qt/2),Qt*(r.y+jt/2)),Ag(i.vertices);let o=Q.wash.opacity/255;Ie.ctx.fillStyle="rgb(255 0 0 / "+o+")",Ie.ctx.fill(),Ie.ctx.restore()})(this),Q.wash={...t},this},kn.prototype.wash=function(n,e,t){Q.wash?.isActive&&(this.origin&&(n=this.origin[0],e=this.origin[1],t=1),this.pol=this.genPol(n,e,t,0,-1),this.pol.wash())},Dm={load:function(n=Zm){if(!(function(e){return(function(t){return typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement})(e)||(function(t){return typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas})(e)})(n))throw new Error("Standalone brush.load(target) requires an HTMLCanvasElement or OffscreenCanvas.");ng(n,n.width,n.height,1)},syncDensity:function(){return Om({Cwidth:eg,Cheight:tg,Density:td}),td},isCanvasReady:function(){if(!$m)throw new Error("No standalone target loaded. Call brush.load(canvasOrOffscreenCanvas) first.")},instance:function(){},activateInstance:function(){},deactivateInstance:function(){},getActiveFramebuffer:function(){return null},isFramebufferTarget:function(){return arguments[0]?.__brushFramebuffer===!0}},bs={...bs,...Dm},jm(),(function(){var n;n={beginDirectMaskDraw:Db,endDirectMaskDraw:Lb,resetDirectShaderTracking:Fb},Na={...Na,...n}})(),(function(){var n;n={clearTarget:Ob,ensureBlendShaderProgram:Nb,ensureBlendSourceFramebuffer:Bb,createFramebuffer:Pg,runBlendShaderPass:Ub,blitSourceToFramebuffer:Gb},ys={...ys,...n}})(),(function(){var n;n={createTipSurface:zb,loadImageTip:Hb},Th={...Th,...n}})();var ni=null,kb=!1;function Vb(n,e){ni?(ni.width!==n||ni.height!==e)&&(ni.width=n,ni.height=e,Lh(ni)):(ni=document.createElement("canvas"),ni.width=n,ni.height=e,Lh(ni),kb=!0)}function Ld(n,e,t,i){let s=document.createElement("canvas");s.width=n,s.height=e;try{Vb(n,e),hd(t),ud(t),bd(),xd(),yd(-n/2,-e/2),i(Dd,n,e),vd(),Sd(),s.getContext("2d").drawImage(ni,0,0)}catch(r){console.warn("p5.brush unavailable, skipping plate",r)}return s}var Nn=1920,ki=[6720,4800,2880,960],Dg=[["\u7B2C\u4E00\u6BB5","I \xB7 THE ROSARY NECK"],["\u7B2C\u4E8C\u6BB5","II \xB7 A HYMN, BENT"],["\u7B2C\u4E09\u6BB5","III \xB7 MOON IN A GOURD"],["\u7B2C\u56DB\u6BB5","IV \xB7 SHE LAUGHS, SHE SINGS"]];function Wb(){let n=new Si(Nn,1080,{seed:11}),e=[-60,1010],t=[1230,250],i=Math.hypot(t[0]-e[0],t[1]-e[1]),s=[(t[0]-e[0])/i,(t[1]-e[1])/i],r=[-s[1],s[0]],o=56,a=(m,p)=>[e[0]+s[0]*i*m+r[0]*p,e[1]+s[1]*i*m+r[1]*p];n.stroke([a(-.05,o),a(.5,o+2),a(1,o)],{w:16,dry:.55,t0:0,t1:.16}),n.stroke([a(-.05,-o),a(.5,-o-2),a(1,-o)],{w:13,dry:.65,t0:.05,t1:.2});let c=a(1,0),l=(m,p)=>[c[0]+s[0]*m+r[0]*p,c[1]+s[1]*m+r[1]*p];n.stroke([l(0,-o),l(80,-o-22),l(250,-o-30),l(300,-o+6)],{w:11,dry:.5,t0:.18,t1:.26}),n.stroke([l(0,o),l(80,o+22),l(250,o+28),l(300,o-4),l(300,-o+6)],{w:11,dry:.5,t0:.2,t1:.28});for(let m=0;m<3;m++)for(let p of[-1,1]){let v=l(70+m*70,p*(o+6));n.fill(y=>{y.beginPath(),y.arc(v[0],v[1],9,0,be),y.fill()},{t0:.26+m*.01,t1:.3,bounds:[v[0]-12,v[1]-12,24,24],from:"center"});let M=l(70+m*70,p*(o+40));n.stroke([v,M],{w:7,dry:.2,t0:.27,t1:.3,bristles:6})}n.stroke([a(1,-o),a(1,o)],{w:10,dry:.2,t0:.16,t1:.18});for(let m=1;m<=15;m++){let p=1-1700*(1-Math.pow(2,-m/12))/i;if(p<.02)break;n.stroke([a(p,-o+4),a(p,o-4)],{w:5,dry:.35,t0:.12+m*.006,t1:.14+m*.006,bristles:5})}for(let m=0;m<6;m++){let p=-o*.72+m/5*o*1.44;n.stroke([a(1,p),a(.5,p),a(-.05,p)],{w:2.2,dry:.1,ink:.7,t0:.2+m*.01,t1:.3+m*.01,bristles:3,bleed:0,body:0,pressure:()=>1})}let h=Vt(5),d=[],u=58;for(let m=0;m<u;m++){let p=m/(u-1),v=.28+p*.4,M=p*be*3.1,y=Math.cos(M)*o*1.32,_=Math.sin(M)>-.1;d.push({pos:a(v,y),front:_,u:p})}for(let m=1;m<u;m++){let p=d[m-1],v=d[m];p.front&&v.front&&n.stroke([p.pos,v.pos],{w:2,dry:.05,ink:.8,t0:.38+p.u*.4,t1:.39+v.u*.4,bristles:3,bleed:0,pressure:()=>1})}for(let m of d){let p=m.front?9+h()*2:6;n.fill(v=>{v.globalAlpha=m.front?.95:.3,v.beginPath(),v.arc(m.pos[0],m.pos[1],p,0,be),v.fill()},{t0:.38+m.u*.4,t1:.4+m.u*.4,bounds:[m.pos[0]-p,m.pos[1]-p,2*p,2*p],from:"center"})}let f=a(.47,o*1.3),g=[];for(let m=0;m<=9;m++)g.push([f[0]+Math.sin(m*.3)*8+m*2,f[1]+m*26]);n.stroke(g,{w:2,dry:.05,t0:.8,t1:.86,bristles:3,bleed:0,pressure:()=>1}),g.forEach((m,p)=>{p%1===0&&p<9&&n.fill(v=>{v.beginPath(),v.arc(m[0],m[1],7.5,0,be),v.fill()},{t0:.8+p*.006,t1:.82+p*.006,bounds:[m[0]-8,m[1]-8,16,16],from:"center"})});let S=g[9];return n.stroke([[S[0],S[1]],[S[0]+4,S[1]+120]],{w:15,dry:.4,t0:.87,t1:.92,spatter:.5}),n.stroke([[S[0]-40,S[1]+38],[S[0]+44,S[1]+34]],{w:13,dry:.45,t0:.92,t1:.96}),n.bake()}function Xb(){let n=new Si(Nn,1080,{seed:23}),e=430,t=44,i=(c,l)=>Math.sin(c*.009+l*.4)*(8+c/Nn*70)+Math.sin(c*.023+l)*(c/Nn)*16;for(let c=0;c<5;c++){let l=[];for(let h=70;h<=1520;h+=40)l.push([h,e+c*t+i(h,c)]);n.stroke(l,{w:6,dry:.55,t0:.02+c*.03,t1:.3+c*.03,bristles:7,bleed:.2,pressure:h=>.7+.3*Math.sin(h*9)})}let s=170,r=e+t*2.6,o=[];for(let c=0;c<be*1.6;c+=.25){let l=18+c*9;o.push([s+Math.cos(c+1.6)*l,r+Math.sin(c+1.6)*l*1.15])}return o.push([s+30,e-90],[s+5,e-120],[s-10,e-60],[s+10,e+t*4+60],[s-12,e+t*4+90]),n.stroke(o,{w:14,dry:.5,t0:.18,t1:.36,spatter:.6}),[[330,3.5,0],[430,2.5,1],[530,2,0],[640,3,1],[760,1.5,0],[880,2.5,0],[990,4,1],[1110,1,0],[1220,2,1],[1330,3,0]].forEach(([c,l,h],d)=>{let u=e+l*t+i(c,l),f=.36+d*.055;n.fill(g=>{g.save(),g.translate(c,u),g.rotate(-.35+Math.sin(d)*.15),g.beginPath(),g.ellipse(0,0,22,15,0,0,be),h&&g.ellipse(0,0,13,6,.3,0,be,!0),g.fill("evenodd"),g.restore()},{t0:f,t1:f+.02,bounds:[c-24,u-18,48,36],from:"center"}),n.stroke([[c+19,u-4],[c+21+Math.sin(d)*6,u-140-i(c,0)*.3]],{w:6,dry:.3,t0:f+.02,t1:f+.05,bristles:5})}),n.stroke([[1060,250],[1240,220],[1420,160],[1480,140]],{w:40,dry:.92,t0:.92,t1:1}),n.bake()}function Qb(){let n=new Si(Nn,1080,{seed:37}),e=760,t=s=>{let r=[],o=[[0,135],[.06,112],[.14,70],[.24,120],[.33,128],[.42,82],[.47,62],[.53,120],[.65,205],[.8,220],[.92,175],[1,40]];for(let[a,c]of o)r.push([e+s*c*1.12,175+a*800]);return r};n.stroke(t(-1),{w:30,dry:.5,t0:.02,t1:.3,spatter:.6}),n.stroke(t(1),{w:22,dry:.68,t0:.08,t1:.34}),n.fill(s=>{s.globalAlpha=.3,s.beginPath(),s.ellipse(e-26,720,215,235,0,0,be),s.ellipse(e-14,395,125,135,0,0,be),s.fill()},{t0:.3,t1:.5,bounds:[e-250,240,500,760],from:"top",blur:22}),n.stroke([[e+160,560],[e+228,720],[e+185,900]],{w:70,dry:.9,ink:.7,t0:.34,t1:.42}),n.stroke([[e+95,300],[e+130,400],[e+100,480]],{w:40,dry:.9,ink:.6,t0:.4,t1:.44}),n.stroke([[e-10,185],[e+6,140],[e+34,110]],{w:26,dry:.4,t0:.42,t1:.47});let i=[];for(let s=0;s<=be*1.1;s+=.3)i.push([e+Math.cos(s)*78,535+Math.sin(s)*18]);i.push([e+90,600],[e+130,700],[e+120,760]),n.stroke(i,{w:5,dry:.15,t0:.47,t1:.56,bristles:5});for(let s=0;s<6;s++){let r=160+s*34,o=1060;n.stroke([[r,o],[r+40+s*12,o-220-s*30],[r+140+s*20,o-330-s*25]],{w:9,dry:.6,t0:.7+s*.03,t1:.82+s*.03})}return n.bake()}function Kb(){let n=new Si(Nn,1080,{seed:53}),e=[];for(let t=-.6;t<be-.9;t+=.18)e.push([800+Math.cos(t)*330,520+Math.sin(t)*330*.96]);n.stroke(e,{w:74,dry:.78,t0:0,t1:.42,spatter:1,pressure:t=>(.5+.5*Math.sin(Math.min(1,t*6)*Math.PI/2))*(1-.6*t)});for(let t=0;t<4;t++){let i=400+t*70,s=[];for(let r=2.2;r<4.1;r+=.12)s.push([800+Math.cos(r)*i,520+Math.sin(r)*i]);n.stroke(s,{w:7-t,dry:.5+t*.1,t0:.6+t*.08,t1:.75+t*.08,bristles:6})}return n.bake()}var Bh=class{constructor(e){this.app=e}init(){this.paper=new vi("#ece2cf","#d63a24");let e=performance.now(),t=[Wb,Xb,Qb,Kb].map(o=>{let a=performance.now(),c=o();return this.app.capture&&console.log("plate",o.name,(performance.now()-a).toFixed(0),"ms"),c});this.app.capture&&console.log("plates total",(performance.now()-e).toFixed(0)),this.views=t.map((o,a)=>new Qr(o,[ki[a]-Nn/2,0,Nn,1080],"#120e0c"));let i=Ld(420,420,9,o=>{o.noStroke(),o.fill("#d9a63c",200),o.fillBleed(.12),o.fillTexture(.55,.5),o.circle(210,210,150),o.fill("#f3d27a",140),o.fillBleed(.06),o.circle(196,196,108)});this.moon=new ga(i,[ki[2]-Nn/2+760-230,505,460,460]);let s=Ld(520,520,4,o=>{o.noStroke(),o.fill("#d8331f",170),o.fillBleed(.25),o.fillTexture(.4,.6),o.circle(260,260,170)});this.shu=new ga(s,[ki[3]-Nn/2+800-260,260,520,520]),this.type=new Nt(0),this.ls=an("v1");let r=Vt(808);this.flecks=Array.from({length:420},()=>({x:r()*7680,y:r()*1080,s:2+Math.pow(r(),3)*16,r:r()*be,k:r()<.7?0:1,ph:r()*be}))}pan(e){let i=this.ls.map(l=>l.t0),s=0;for(let l=0;l<i.length;l++)e>=i[l]-.5&&(s=l);let r=i[s]-.5,o=i[s+1]!==void 0?i[s+1]-.5:ut.v1[1],a=ce(70,-70,se((e-r)/(o-r))),c=ki[s]+a;if(s>0){let l=ge(r,r+.7,e,Oe.inOutCubic),h=ki[s-1]-70;c=ce(h,c,l)}else c=ce(ki[0]+380,c,ge(ut.v1[0]-.6,i[0]+.2,e,Oe.outCubic));return c-960}render(e,t){let i=this.app.renderer,s=this.pan(e),r=1+Dt(e,10)*.006+cs(e,12)*.004,o=this.ls;this.paper.draw(i,t,{panX:s,zoom:r}),o.forEach((l,h)=>{let d=l.c[l.c.length-1]+.9,u=ge(l.t0-.35,d,e,f=>f);h===2&&this.moon.draw(i,t,ge(l.c[6]-.2,l.c[6]+.9,e,Oe.outCubic),{panX:s,zoom:r,mul:1.05}),h===3&&this.shu.draw(i,t,ge(l.c[6]-.15,l.c[6]+.7,e,Oe.outCubic),{panX:s,zoom:r,alpha:.85}),this.views[h].draw(i,t,u,{panX:s,zoom:r,warp:h===1?.25+Dt(e,7)*.9:0,time:e})});let a=this.type.begin();a.save(),a.translate(960,540),a.scale(r,r),a.translate(-960-s,-540);for(let l of this.flecks){if(l.x<s-40||l.x>s+1960)continue;let h=.55+.45*Math.sin(l.ph+s*.01+e*.8);a.save(),a.translate(l.x,l.y),a.rotate(l.r),a.fillStyle=`rgba(${200+h*50|0},${150+h*50|0},${60+h*30|0},${.55+h*.4})`,l.k?a.fillRect(-l.s*.15,-l.s,l.s*.3,l.s*2):a.fillRect(-l.s/2,-l.s/2,l.s,l.s),a.restore()}a.textAlign="center",a.textBaseline="middle";let c=[[["\u30ED\u30B6\u30EA\u30AA",0],["\u5DFB\u304D\u3064\u3051\u305F\u30CD\u30C3\u30AF",5]],[["\u8056\u6B4C\u304C",0],["\u3086\u304C\u3093\u3067\u59CB\u307E\u308B",3]],[["\u3072\u3087\u3046\u305F\u3093\u306B",0],["\u6708\u3092\u3072\u3068\u3064",6]],[["\u5F7C\u5973\u306F\u7B11\u3063\u3066",0],["\u6B4C\u3044\u51FA\u3059",6]]];o.forEach((l,h)=>{let d=ki[h]+Nn/2-170;a.font=Te(_e.mincho,74),a.fillStyle="#16100d",c[h].forEach(([f,g],S)=>{ln(f,d-S*104,150+S*92,74,1.12).forEach(p=>{p.i+=g;let v=l.c[p.i];vt.ink(a,p,se((e-v+.06)/.4),74,!0)})}),a.save(),a.globalAlpha=.55*se((e-l.t0)*1.5),a.translate(d-230,160),a.rotate(Math.PI/2),a.font=Te(_e.serif,24),a.textAlign="left","letterSpacing"in a&&(a.letterSpacing="5px"),a.fillText(bn(l),0,0),a.restore();let u=ki[h]-Nn/2+130;a.save(),a.globalAlpha=.75*se((e-l.t0+.4)*2),a.fillStyle="#16100d",a.font=Te(_e.mincho,26),a.textAlign="left",a.fillText(Dg[h][0],u,980),ft(a,Dg[h][1],u+100,981,13,"rgba(22,16,13,0.7)"),a.fillRect(u,1005,260,1.5),a.restore()});{let h=o[3].c[6],d=e-h;if(d>-.05){let u=Oe.outBack(se(d/.22)),f=ce(1.8,1,u);a.save(),a.translate(ki[3]-Nn/2+800,520),a.rotate(-.06),a.scale(f,f),a.globalAlpha=se(d/.08),a.fillStyle="#c92a1c";let g=Vt(3);a.beginPath();let S=[];for(let m=0;m<4;m++)for(let p=0;p<12;p++){let v=p/12,M=[-1,1,1,-1][m],y=[-1,-1,1,1][m],_=[1,1,-1,-1][m],b=[-1,1,1,-1][m],A=ce(M,_,v)*125+(g()-.5)*6,x=ce(y,b,v)*125+(g()-.5)*6;S.push([A,x])}S.forEach(([m,p],v)=>v?a.lineTo(m,p):a.moveTo(m,p)),a.closePath(),a.fill(),a.globalCompositeOperation="destination-out",a.font=Te(_e.mincho,190),a.fillText("\u6B4C",0,8),a.lineWidth=7,a.strokeRect(-108,-108,216,216),a.restore()}}return a.restore(),this.type.draw(i,t,{}),{hudInk:"dark",bloom:.35,bloomThresh:.95,grain:.04,vig:.45,ca:.0015,contrast:1.04,hudShu:"#c92a1c"}}};var qb=["AVE MARIA GRATIA PLENA","\u5357\u7121\u963F\u5F25\u9640\u4ECF","KYRIE ELEISON","\u7953\u3048\u7D66\u3044 \u6E05\u3081\u7D66\u3048","HALLELUJAH","\u5357\u7121\u5999\u6CD5\u84EE\u83EF\u7D4C","GLORIA IN EXCELSIS","OM MANI PADME HUM","AMEN","\u516D\u6839\u6E05\u6D44","SANCTUS SANCTUS","\u0100M\u012AN"],Jb=[["NOMEN","Latin"],["\u540D","\u65E5\u672C\u8A9E"],["ISM","\u02BFarab\u012B"],["N\u0100MA","sa\u1E43sk\u1E5Bta"],["NAME","English"]],jb=[["\u014CR\u0100TI\u014C","Latin"],["\u795D\u8A5E","norito"],["DU\u02BF\u0100\u02BE","\u02BFarab\u012B"],["P\u016AJ\u0100","sa\u1E43sk\u1E5Bta"],["\u5FF5\u4ECF","nembutsu"]],Uh=class{constructor(e){this.app=e}init(){this.paper=new vi("#ece2cf","#cf3320"),this.ink=new Nt(0),this.glow=new Nt(1),this.l1=an("pre1"),this.l2=an("pre2");let e=Vt(91);this.crowd=[];for(let t=0;t<4;t++)for(let i=0;i<16+t*2;i++)this.crowd.push({row:t,x:(i+.5+(e()-.5)*.4)/(16+t*2)*2e3-40,s:1-t*.16,ph:e()})}render(e,t){let i=e>=ut.v2[0],s=this.app.renderer,r=i?ut.pre2:ut.pre1,o=Dt(e,8),a=1+o*.012+ge(r[1]-2.8,r[1],e,Oe.inCubic)*.08;this.paper.draw(s,t,{zoom:a,dye:1,dyeCol:i?"#1b2d6b":"#cf3320",panX:(e-r[0])*18});let c=this.ink.begin(),l=this.glow.begin();i?this.drawPre2(c,l,e):this.drawPre1(c,l,e),this.glow.draw(s,t,{boost:2,scale:a}),this.ink.draw(s,t,{scale:a});let h=ge(r[1]-1.2,r[1],e,Oe.inExpo);return{hudInk:"light",bloom:.7,bloomThresh:.9,grain:.07,vig:.7,ca:.002+o*.004,flash:h*.85,contrast:1.08,hudShu:i?"#e3402a":"#111"}}drawPre1(e,t,i){let s=this.l1,r="#0f0b0a",o="#f3e9d7";this.watermark(e,i,s,["\u9019","\u7948","\u97FF","\u4E00"],"#2a0806");let a=760,c=[],l=2.2;for(let y=-40;y<=1960;y+=12){let _=i-(1960-y)/2e3*l,b=Math.pow(pa(_),3)*1.3,A=Dt(_,10),x=a+Math.sin(y*.006-i*4)*50-b*120-A*60;c.push([y,x,26+b*30+A*20])}let h=ge(ut.pre1[0]-.2,s[0].t0+.6,i,Oe.outCubic),d=1-ge(s[3].t0-.3,s[3].t0+.5,i)*.85,u=ce(1960,-40,h);e.save(),e.globalAlpha=d,e.fillStyle=r,e.beginPath();let f=[],g=[];for(let[y,_,b]of c)y<u||(f.push([y,_-b]),g.push([y,_+b]));if(f.length>1){e.moveTo(f[0][0],f[0][1]),f.forEach(([y,_])=>e.lineTo(y,_+ls(y*.05,3)*3));for(let y=g.length-1;y>=0;y--)e.lineTo(g[y][0],g[y][1]+ls(g[y][0]*.05,7)*4);e.closePath(),e.fill(),e.strokeStyle=o,e.globalAlpha=.35*d;for(let y=0;y<6;y++){e.lineWidth=1+y%3,e.beginPath();let _=!1;c.forEach(([b,A,x],E)=>{if(b<u)return;let w=(y/5-.5)*x*1.6,R=ls(b*.012+y*7,y)>.25;R&&!_?(e.moveTo(b,A+w),_=!0):R?e.lineTo(b,A+w):_=!1}),e.stroke()}e.globalAlpha=1}e.restore();let S=ge(s[1].t0-.3,s[1].t0+.8,i);if(S>0&&f.length>4){e.save(),e.font=Te(_e.mono,19),e.fillStyle=o,e.textBaseline="middle";let y=qb.join("  \xB7  ")+"  \xB7  ",b=i*160%3e3,A=c.filter(([I])=>I>=u),x=[0];for(let I=1;I<A.length;I++)x[I]=x[I-1]+Math.hypot(A[I][0]-A[I-1][0],A[I][1]-A[I-1][1]);let E=-b,w=0,R=x[x.length-1];for(e.globalAlpha=S*d;E<R;){let I=y[w%y.length],N=e.measureText(I).width+3;if(E>0){let D=1;for(;D<x.length-1&&x[D]<E;)D++;let U=(E-x[D-1])/(x[D]-x[D-1]||1),W=ce(A[D-1][0],A[D][0],U),k=ce(A[D-1][1],A[D][1],U),re=Math.atan2(A[D][1]-A[D-1][1],A[D][0]-A[D-1][0]);e.save(),e.translate(W,k),e.rotate(re),e.fillText(I,0,0),e.restore()}if(E+=N,w++,w>600)break}e.restore()}let m=ge(s[2].t0-.4,s[2].t0+.3,i,Oe.outBack),p=1-ge(s[3].t0-.2,s[3].t0+.4,i);if(m>.001&&p>0){for(let y=0;y<5;y++){let _=560+y*200,b=-20,A=500+y%2*60,x=Math.sin(xt(i)*Math.PI*.5+y*.9)*.45*(1+Dt(i,5)),E=_+Math.sin(x)*A,w=b+Math.cos(x)*A*m;e.save(),e.globalAlpha=p,e.strokeStyle=r,e.lineWidth=2,e.beginPath(),e.moveTo(_,b),e.lineTo(E,w),e.stroke(),e.translate(E,w),e.rotate(x*.6),e.fillStyle=yi[y],e.beginPath(),e.arc(0,26,26,0,be),e.fill(),e.beginPath(),e.moveTo(26,26),e.bezierCurveTo(28,70,0,92,-26,96),e.bezierCurveTo(-6,76,-16,54,-26,26),e.fill(),e.fillStyle=r,e.beginPath(),e.arc(0,22,6,0,be),e.fill(),e.restore();let R=xt(i)%1;Math.floor(xt(i))%5===y&&(t.save(),t.globalAlpha=(1-R)*p,t.strokeStyle="#ffd890",t.lineWidth=2,t.beginPath(),t.arc(E,w+40,30+R*120,0,be),t.stroke(),t.restore())}t.save(),t.globalAlpha=p,t.strokeStyle="#ffe2a8",t.lineWidth=3,t.beginPath();for(let y=0;y<=1920;y+=6){let _=i-(1920-y)/1920*1.6,A=600-Dt(_,18)*180*Math.sin(y*.15%6.28)-cs(_,20)*60;y===0?t.moveTo(y,A):t.lineTo(y,A)}t.stroke(),t.restore()}let v=s[3];if(ge(v.t0-.5,v.t0+.4,i,Oe.outCubic)>0){let y=ge(v.c[7]-.1,v.c[14]+.1,i,Oe.inCubic),_=ce(330,0,y),b=xt(i)*.1+y*3;if(rm.forEach((A,x)=>{let E=ge(v.c[0]+x*.15-.2,v.c[0]+x*.15+.3,i,Oe.outBack);if(E<=0)return;let w=x/5*be-Math.PI/2+b,R=960+Math.cos(w)*_,I=600+Math.sin(w)*_*.7;e.save(),e.globalAlpha=se(E)*(1-y*.9),e.fillStyle=r,e.beginPath(),e.arc(R,I,92*E,0,be),e.fill(),e.fillStyle=yi[x],Sn(e,Ui[A.key],R,I,62*E,0),e.fillStyle=o,e.textAlign="center",e.font=Te(_e.mincho,34),e.fillText(A.name,R,I+140),ft(e,A.role,R,I+175,12,"rgba(243,233,215,0.85)","center"),e.restore()}),y>0){t.save();let A=30+y*220+Dt(i,9)*40,x=t.createRadialGradient(960,600,0,960,600,A);x.addColorStop(0,`rgba(255,250,235,${y})`),x.addColorStop(.3,`rgba(255,200,120,${y*.6})`),x.addColorStop(1,"rgba(255,120,40,0)"),t.fillStyle=x,t.beginPath(),t.arc(960,600,A,0,be),t.fill(),t.restore()}}this.lyric(e,i,s,"#f6eddc",210)}watermark(e,t,i,s,r){let o=-1;for(let h=0;h<i.length;h++)t>=i[h].t0-.4&&(o=h);if(o<0)return;let a=i[o],c=ge(a.t0-.4,a.t0+.4,t)*(o<i.length-1?1-ge(i[o+1].t0-.5,i[o+1].t0-.3,t):1);e.save(),e.globalAlpha=c*.13,e.fillStyle=r,e.font=Te(_e.brush,900),e.textAlign="center",e.textBaseline="middle";let l=1+(t-a.t0)*.03;e.translate(o%2?560:1360,560),e.scale(l,l),e.fillText(s[o],0,0),e.restore()}lyric(e,t,i,s,r){let o=null;for(let l of i)t>=l.t0-.3&&(o=l);if(!o)return;let a=o===i[i.length-1]?1:se(1-(t-(i[i.indexOf(o)+1].t0-.35))/.2);e.save(),e.globalAlpha=a,e.font=Te(_e.mincho,92),e.fillStyle=s,e.textAlign="center",e.textBaseline="middle",e.shadowColor="rgba(0,0,0,0.35)",e.shadowBlur=18,Ht(e,o.text,960,r,92,10).forEach(l=>vt.rise(e,l,se((t-o.c[l.i]+.05)/.22),92)),e.shadowBlur=0,e.font=Te(_e.serif,28),"letterSpacing"in e&&(e.letterSpacing="7px"),e.globalAlpha=a*.8*se((t-o.t0)*2),e.fillText(bn(o).toUpperCase(),960,r+92),e.restore()}drawPre2(e,t,i){let s=this.l2,r="#f1e8d6";this.watermark(e,i,s,["\u540D","\u4F1A","\u982D","\u5F26"],"#050a24");let o="#e3402a",a="#f2c766",c=s[0],l=s[1],h=ge(l.t0-.2,l.t0+.9,i,Oe.inOutCubic),d=ge(s[2].t0-.3,s[2].t0+.2,i);if(d<1){for(let p=0;p<5;p++){let M=p*384,y=ce(M+384/2,960,h),_=ge(c.t0+p*.1-.3,c.t0+p*.1+.2,i);if(_<=0)continue;e.save(),e.globalAlpha=1-d,e.fillStyle=p%2?"rgba(10,14,40,0.35)":"rgba(255,255,255,0.04)",e.globalAlpha*=1-h,e.fillRect(ce(M,960-384/2,h),0,384,1080*_),e.fillStyle=yi[p],e.fillRect(ce(M,960-384/2,h),0,384,6),e.globalAlpha=1-d,e.textAlign="center",e.textBaseline="middle";let b=i>c.c[5]-.1,[A,x]=b?jb[p]:Jb[p],E=/[a-zA-Zāīūʿʾ]/.test(A)?Te(_e.black,74):Te(_e.mincho,84);e.font=E,e.fillStyle=r;let w=b?ge(c.c[5]+p*.08-.1,c.c[5]+p*.08+.1,i):1;e.globalAlpha*=w;let R=ce(520,330+p*92,h);h>0&&(e.font=/[a-zA-Zāīūʿʾ]/.test(A)?Te(_e.black,ce(74,54,h)):Te(_e.mincho,ce(84,60,h))),e.fillText(A,y,R),ft(e,x.toUpperCase(),y+h*170,R+ce(70,4,h),13,"rgba(241,232,214,0.7)",h>.5?"left":"center"),e.restore()}h>0&&(t.save(),t.globalAlpha=h*(1-d),t.strokeStyle=a,t.lineWidth=3,t.beginPath(),t.arc(960,515,290+Dt(i,8)*30,0,be),t.stroke(),t.restore())}let u=s[2],f=ge(u.t0-.4,u.t0+.2,i),g=ge(s[3].t0-.3,s[3].t0+.3,i);if(f>0&&g<1){let p=u.c[8]-.2;for(let v of this.crowd){let M=ge(p+v.x/1920*.6,p+v.x/1920*.6+.5,i,Oe.outBack),y=1040-v.row*120,_=v.s*1.2;e.save(),e.globalAlpha=f*(1-g)*(.55+v.s*.45),e.translate(v.x,y+(1-f)*200),e.scale(_,_),e.fillStyle="#0a0d1e",e.beginPath(),e.moveTo(-46,0),e.quadraticCurveTo(-40,-90,0,-100+M*10),e.quadraticCurveTo(40,-90,46,0),e.fill();let b=ce(-92,-142,M),A=ce(14,0,M);if(e.beginPath(),e.arc(A,b,26,0,be),e.fill(),M>.5){let x=Ni(i,1,10),E=ce(36,6,x);e.strokeStyle="#0a0d1e",e.lineWidth=12,e.lineCap="round",e.beginPath(),e.moveTo(-30,-80),e.lineTo(-E,-190*M),e.moveTo(30,-80),e.lineTo(E,-190*M),e.stroke(),x>.6&&v.row<2&&(t.save(),t.globalAlpha=(x-.6)*2*(1-g),t.fillStyle="#ffe9b0",t.beginPath(),t.arc(v.x,y-190*_,14*_,0,be),t.fill(),t.restore())}e.restore()}}let S=s[3],m=ge(S.t0-.4,S.t0+.2,i);if(m>0){let p=ge(S.t0,ut.pre2[1],i,Oe.inCubic);for(let v=0;v<6;v++){let M=330+v*78,y=(6+p*30)*(1+Dt(i,9)),_=2+v*.5+p*6;t.save(),t.strokeStyle=v<3?"#f2e2c0":a,t.lineWidth=1.2+(5-v)*.5,t.globalAlpha=m,t.beginPath();for(let b=0;b<=1920;b+=8){let A=Math.sin(b/1920*Math.PI),x=M+Math.sin(b/1920*Math.PI*_+i*(30+v*5))*y*A*Math.sin(i*40+v);b===0?t.moveTo(b,x):t.lineTo(b,x)}t.stroke(),t.restore();for(let b=0;b<8;b++){let A=((b/8+i*.06*(v%2?1:-1))%1+1)%1,x=A*1920,E=Math.sin(A*Math.PI),w=M+Math.sin(A*Math.PI*_+i*(30+v*5))*y*E*Math.sin(i*40+v),R=Vs[(b+v*3)%8];e.save(),e.globalAlpha=m*ge(S.c[2]+b*.03+v*.05,S.c[2]+b*.03+v*.05+.3,i),e.fillStyle=v%2?o:r,e.strokeStyle=e.fillStyle,Sn(e,us[R],x,w,22,i*(v%2?1:-1)),e.restore()}}}this.lyric(e,i,s,r,150)}};var Yb=[57.97,58.67,59.02,59.37,59.71],Gh=class{constructor(e){this.app=e}init(){this.bg=new vi("#141012","#141012"),this.l=new Nt(0),this.g=new Nt(1),this.ls=an("post")}render(e,t){let i=this.app.renderer;this.bg.draw(i,t,{dark:.55,zoom:1.4});let s=this.l.begin(),r=this.g.begin(),[o,a]=this.ls,c=xt(e),l=(Math.floor(c)%4+4)%4,h=c-Math.floor(c),d="#e3402a",u="#f2c766",f="#efe6d6";s.save(),s.strokeStyle="rgba(239,230,214,0.12)",s.lineWidth=1;for(let m=1;m<4;m++)s.beginPath(),s.moveTo(m*480,0),s.lineTo(m*480,1080),s.stroke();s.beginPath(),s.moveTo(0,540),s.lineTo(1920,540),s.stroke(),s.restore();let g=(1-h)*.85;s.save(),s.fillStyle=l===0?d:"rgba(239,230,214,0.09)",s.globalAlpha=l===0?g:g*1.4,s.fillRect(l*480,0,480,1080),s.restore(),s.save(),s.font=Te(_e.gothic,520),s.textAlign="center",s.textBaseline="middle";for(let m=0;m<4;m++){let p=m===l;s.lineWidth=2,s.strokeStyle=p?f:"rgba(239,230,214,0.18)",s.fillStyle=p?f:"transparent";let v=p?1+(1-h)*.06:1;s.save(),s.translate(m*480+240,560),s.scale(v,v),p&&e<a.t0-.2?(s.globalAlpha=.18+(1-h)*.2,s.fillText(String(m+1),0,0)):s.strokeText(String(m+1),0,0),s.restore()}s.restore();let S=0;for(let m of Yb)e>=m&&e<m+.4&&(S=Math.max(S,1-(e-m)/.4));if(e>o.t0-.3&&e<a.t0){let m=1-ge(a.t0-.4,a.t0,e);s.save(),s.globalAlpha=m,s.font=Te(_e.gothic,300),s.textAlign="center",s.textBaseline="middle",s.fillStyle=f;let p=[["\u3055\u3042",0,560,0],["\u3055\u3042",3,1360,3]];for(let[v,M,y]of p){let _=se((e-o.c[M]+.05)/.2);if(_<=0)continue;Ht(s,v,y,520,300,-10).forEach(A=>vt.slam(s,A,_,300,!1))}ft(s,"( CALL & RESPONSE )",960,800,16,"rgba(239,230,214,0.6)","center",.5),s.restore(),r.save();for(let v=0;v<40;v++){let M=(v+.5)*48,y=Math.max(se((e-o.c[0])/.3),0)*(.6+.4*Math.sin(e*6+v)),_=Math.sin(e*5+v*.7)*.4;r.strokeStyle=yi[v%5],r.globalAlpha=.8*m,r.lineWidth=7,r.lineCap="round",r.beginPath(),r.moveTo(M,1100),r.lineTo(M+Math.sin(_)*160*y,1100-Math.cos(_)*160*y),r.stroke()}r.restore()}if(e>a.t0-.3){let m=ge(a.c[6]-.3,a.c[6]+.6,e,Oe.inOutCubic);for(let M=0;M<8;M++){let y=M%4,_=Math.floor(M/4),b=y*480+240,A=_?760:330,x=960+(M-3.5)*205,E=560,w=ce(b,x,m),R=ce(A,E,m),I=m>.9?1:y===l?1-h*.6:.25,N=ge(a.t0+M*.05-.2,a.t0+M*.05+.2,e,Oe.outBack);s.save(),s.globalAlpha=se(N)*I,s.fillStyle=m>.9?u:f,s.strokeStyle=s.fillStyle,Sn(s,us[Vs[M]],w,R,ce(95,72,m)*N,0),s.restore(),m>.6&&M<7&&(s.save(),s.globalAlpha=(m-.6)/.4,s.fillStyle=d,s.font=Te(_e.gothic,64),s.textAlign="center",s.textBaseline="middle",s.fillText("\uFF1D",x+102,E+4),s.restore())}s.save(),s.textAlign="center",s.textBaseline="middle",s.fillStyle=f,s.font=Te(_e.mincho,86),Ht(s,"\u56DB\u62CD\u5B50\u306E\u4E2D",960,150,86,20).forEach(M=>vt.rise(s,M,se((e-a.c[M.i]+.05)/.25),86)),s.font=Te(_e.gothic,150),Ht(s,"\u8AB0\u3082\u304C\u5E73\u7B49",960,870,150,10).forEach(M=>{M.i+=6,s.fillStyle=M.i>=9?d:f,vt.slam(s,M,se((e-a.c[M.i]+.04)/.2),150,!1)}),s.font=Te(_e.serif,28),"letterSpacing"in s&&(s.letterSpacing="8px"),s.fillStyle="rgba(239,230,214,0.75)",s.globalAlpha=se((e-a.c[6])*2),s.fillText(bn(a).toUpperCase(),960,990),s.restore()}return ft(s,`4 / 4   \xB7   BEAT ${l+1}`,960,60,14,"rgba(239,230,214,0.55)","center",.5),this.g.draw(i,t,{boost:1.8}),this.l.draw(i,t,{}),{hudInk:"light",bloom:.6,bloomThresh:.9,grain:.06,vig:.5,flash:S*.22,flashCol:14893098,ca:.002+Dt(e,10)*.004,contrast:1.1}}};var Zb=`
uniform sampler2D tB, tR; uniform vec3 uPaper, uBlue, uRed; uniform vec2 uMis; uniform float uTime, uSeed;
varying vec2 vUv;
float screenDot(vec2 p, float ang, float size, float a){
  vec2 q = rot(ang) * p / size;
  float d = length(fract(q) - .5);
  float r = sqrt(clamp(a,0.,1.)) * 0.72;
  return smoothstep(r + 0.06, r - 0.06, d);
}
void main(){
  vec2 px = vUv * vec2(1920., 1080.);
  vec2 res = vec2(1920.,1080.);
  vec4 b = texture2D(tB, vUv);
  vec4 r = texture2D(tR, vUv + uMis/res);
  // halftone only the mid-tones; solids stay solid
  float aB = b.a, aR = r.a;
  float hB = screenDot(px, 0.785, 6.5, aB);
  float hR = screenDot(px, 0.26, 6.5, aR);
  aB = mix(hB, aB, smoothstep(0.85, 0.98, aB));
  aR = mix(hR, aR, smoothstep(0.85, 0.98, aR));
  // riso grain: ink dropouts + roller streaks
  float n = hash12(floor(px*0.9) + uSeed);
  float streak = vnoise(vec2(px.x*0.004, px.y*0.25 + uSeed));
  aB *= 1. - 0.32*step(0.86, n) - 0.12*smoothstep(0.6,0.9,streak);
  aR *= 1. - 0.28*step(0.88, hash12(floor(px*0.9)+uSeed+7.)) - 0.1*smoothstep(0.65,0.9,streak);
  // cream stock with fibres
  vec3 paper = uPaper * (0.94 + 0.06*fbm(px*0.01)) * (0.97 + 0.03*hash12(floor(px)));
  vec3 c = paper;
  c *= mix(vec3(1.), uBlue, aB);
  c *= mix(vec3(1.), uRed, aR);
  // overprint is a deep plum like real riso
  gl_FragColor = vec4(c, 1.);
}`;function $b(n){let e=Vt(n),t=[],i=960,s=520,r=[0,120,260,420,620,900];for(let o=0;o<r.length-1;o++){let a=7+o*5,c=e()*be;for(let l=0;l<a;l++){let h=c+l/a*be+(e()-.5)*.2,d=c+(l+1)/a*be+(e()-.5)*.2,u=r[o]*(.85+e()*.3),f=r[o+1]*(.85+e()*.3),g=(S,m)=>[i+Math.cos(S)*m,s+Math.sin(S)*m*.75];t.push({pts:[g(h,u),g(d,u),g(d,f),g(h,f)],ang:(h+d)/2,k:o,sp:.6+e()*.8,rot:(e()-.5)*2})}}return t}function Fd(n,e,t,i){let s=Vt(i),r=(a,c)=>Math.cos(n*Math.PI*a)*Math.cos(e*Math.PI*c)-Math.cos(e*Math.PI*a)*Math.cos(n*Math.PI*c),o=new Float32Array(t*2);for(let a=0;a<t;a++){let c=s()*2-1,l=s()*2-1;for(let h=0;h<40;h++){let d=r(c,l),u=.001,f=(r(c+u,l)-d)/u,g=(r(c,l+u)-d)/u,S=f*f+g*g+1e-6;c-=d*f/S*.6,l-=d*g/S*.6,c=se(c,-1,1),l=se(l,-1,1)}o[a*2]=c,o[a*2+1]=l}return o}var lo=["\u8272\u5373\u662F\u7A7A","\u7A7A\u5373\u662F\u8272","\u53D7\u60F3\u884C\u8B58","\u4EA6\u5FA9\u5982\u662F","\u7FAF\u8AE6\u7FAF\u8AE6","\u6CE2\u7F85\u7FAF\u8AE6","\u6CE2\u7F85\u50E7\u7FAF\u8AE6","\u83E9\u63D0\u85A9\u5A46\u8A36","\u89B3\u81EA\u5728\u83E9\u85A9","\u7167\u898B\u4E94\u860A\u7686\u7A7A"],zh=class{constructor(e){this.app=e}init(){this.B=ha(0),this.R=ha(1),this.pass=new It(Zb,{tB:{value:this.B.tex},tR:{value:this.R.tex},uPaper:{value:new Ae("#f1e9d6")},uBlue:{value:new Ae("#2f4bb8")},uRed:{value:new Ae("#ff4f3a")},uMis:{value:new ae(3,-2)},uTime:{value:0},uSeed:{value:0}}),this.ls=an("v2"),this.tris=$b(17),this.cl=[Fd(3,5,5200,3),Fd(4,7,5200,4),Fd(2,9,5200,5)];let e=Vt(8);this.rand=new Float32Array(5200*2).map(()=>e()*2-1);let t=Vt(9);this.flock=Array.from({length:46},()=>({a:t()*.9-.45,sp:.7+t()*.6,s:.4+t()*.8,ph:t()*be,d:t()*.6}))}shot(e){let t=this.ls,i=0;for(let s=0;s<t.length;s++)e>=t[s].t0-.35&&(i=s);return i}render(e,t){let i=this.app.renderer,s=this.B.begin(),r=this.R.begin(),o=this.shot(e),a=this.ls[o],c=o===0?ut.v2[0]:a.t0-.35,l=this.ls[o+1]?this.ls[o+1].t0-.35:ut.v2[1],h=se((e-c)/(l-c)),d=Dt(e,10),u=["sticks","night","doves","wall","sutra","chladni"][o];this[u](s,r,e,a,h,c,l),this.lyric(s,r,e,a,o),ft(s,`ZINE \xB7 KAMINARE \xB7 P.${String(o+2).padStart(2,"0")}`,80,1035,13,"rgba(47,75,184,1)"),ft(r,"RISO 2C  \xB7  MEDIUM BLUE / FLUO RED",1840,1035,13,"rgba(255,79,58,1)","right"),this.B.end(),this.R.end();let f=this.pass.u;return f.tB.value=this.B.tex,f.tR.value=this.R.tex,f.uMis.value.set(3+d*14*Math.sin(e*50),-2+d*8),f.uSeed.value=Math.floor(e*12)%7,this.pass.render(i,t,!1),{hudInk:"dark",bloom:.2,bloomThresh:.97,grain:.03,vig:.3,ca:.001,hudShu:"#ff4f3a"}}lyric(e,t,i,s,r){let o=[[120,"left",112],[960,"center",118],[120,"left",100],[960,"center",104],[1800,"right",100],[960,"center",104]],[a,c,l]=o[r],h=r===1||r===5?930:r===3?140:170;if(r===2||r===4){e.save(),e.font=Te(_e.gothic,l);let d=Ht(e,s.text,a,h,l,2,c),u=c==="left"?a:c==="right"?a-d.total:a-d.total/2,f=se((i-s.t0+.4)/.3);e.globalCompositeOperation="destination-out",e.fillRect(u-30,h-l*.75,(d.total+60)*f,l*1.5+70),e.restore()}for(let[d,u,f,g]of[[t,"#000",8,8],[e,"#000",0,0]])d.save(),d.font=Te(_e.gothic,l),d.textBaseline="middle",d.fillStyle=u,Ht(d,s.text,a+f,h+g,l,2,c).forEach(m=>vt.rise(d,m,se((i-s.c[m.i]+.04)/.2),l)),d.restore();e.save(),e.font=Te(_e.mono,18),e.fillStyle="#000",e.globalAlpha=se((i-s.t0)*2),e.textAlign=c,"letterSpacing"in e&&(e.letterSpacing="5px"),e.fillText(bn(s).toUpperCase(),a,h+(h<500?90:-88)),e.restore()}sticks(e,t,i,s,r){let o=xt(i),a=o*.25,c=1100,l=560,h=Math.floor(xt(s.t0-.35)),d=se(o-h,0,8),u=330,f=v=>{let M=v*3/8*be-Math.PI/2;return[c+Math.cos(M)*u,l+Math.sin(M)*u]};t.save(),t.strokeStyle="#000",t.lineWidth=26,t.lineJoin="miter",t.beginPath();let g=Math.floor(d),S=d-g;t.moveTo(...f(0));for(let v=1;v<=g;v++)t.lineTo(...f(v));if(g<8){let v=f(g),M=f(g+1);t.lineTo(ce(v[0],M[0],S),ce(v[1],M[1],S))}t.stroke(),t.restore(),e.save();let m=e.createRadialGradient(c,l,0,c,l,420);m.addColorStop(0,"rgba(0,0,0,0.55)"),m.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=m,e.beginPath(),e.arc(c,l,420,0,be),e.fill(),e.restore();let p=Ni(i,1,8);for(let v of[-1,1])e.save(),e.translate(c+v*40,l+40),e.rotate(v*(.6-p*.25)+a*.2),e.fillStyle="#000",e.beginPath(),e.moveTo(-14,420),e.lineTo(14,420),e.lineTo(9,-330),e.quadraticCurveTo(0,-380,-9,-330),e.closePath(),e.fill(),e.beginPath(),e.ellipse(0,-360,13,22,0,0,be),e.fill(),e.restore();t.save(),t.fillStyle="#000",t.globalAlpha=.6,Sn(t,Ui.star8,330,640,120+p*10,a),t.restore()}night(e,t,i,s,r){let o=s.t0-.35,a=0,c=-9;for(let u of hs)u>=o&&u<=i&&(a++,c=u);let l=i-c,h=se(a/14);for(let u of this.tris){let f=h*(u.k+1)*60*u.sp+(l<.15?(.15-l)*80*(u.k+1)*.3:0),g=Math.cos(u.ang)*f,S=Math.sin(u.ang)*f,m=u.pts.reduce((v,M)=>v+M[0],0)/4,p=u.pts.reduce((v,M)=>v+M[1],0)/4;e.save(),e.translate(m+g,p+S),e.rotate(u.rot*h*.8),e.fillStyle="#000",e.globalAlpha=.95,e.beginPath(),u.pts.forEach(([v,M],y)=>y?e.lineTo(v-m,M-p):e.moveTo(v-m,M-p)),e.closePath(),e.fill(),e.restore()}e.save(),e.globalCompositeOperation="destination-out";let d=Vt(4);for(let u=0;u<140;u++){let f=d()*1920,g=d()*1080,S=d()*2.5+.6;e.beginPath(),e.arc(f,g,S,0,be),e.fill()}e.restore(),t.save(),t.fillStyle="#000",t.beginPath(),t.arc(1500,300,120*(1-h*.3),0,be),t.fill(),t.globalCompositeOperation="destination-out",t.lineWidth=6,t.beginPath(),t.moveTo(1420,220),t.lineTo(1500,300),t.lineTo(1470,380),t.moveTo(1500,300),t.lineTo(1600,280),t.stroke(),t.restore(),t.save(),t.strokeStyle="#000",t.lineWidth=10*Math.exp(-l*6),t.globalAlpha=Math.exp(-l*4),t.beginPath(),t.arc(960,520,60+l*900,0,be),t.stroke(),t.restore(),ft(e,`KICKS ${String(a).padStart(3,"0")}`,1840,520,18,"#000","right",.4)}doves(e,t,i,s,r){e.save(),e.fillStyle="#000",e.globalAlpha=.92,e.fillRect(0,0,1920,1080),e.restore(),t.save(),t.fillStyle="#000",t.translate(1650,760),t.rotate(-.5),t.fillRect(-40,0,80,600),t.beginPath(),t.moveTo(-60,0),t.lineTo(60,0),t.lineTo(80,-260),t.lineTo(-80,-260),t.closePath(),t.fill(),t.restore();let o=s.c[6]-.2;e.save(),e.globalCompositeOperation="destination-out";for(let a of this.flock){let c=i-o-a.d;if(c<0)continue;let l=1600-c*900*a.sp,h=600+Math.sin(a.a*6+c)*60+a.a*c*500-c*120;hh(e,l,h,a.s*230,i*13*a.sp+a.ph,-1)}e.restore(),t.save(),t.strokeStyle="#000",t.lineWidth=3;for(let a of this.flock.slice(0,14)){let c=i-o-a.d;if(!(c<0)){t.beginPath();for(let l=0;l<12;l++){let h=Math.max(0,c-l*.04),d=1600-h*900*a.sp,u=600+Math.sin(a.a*6+h)*60+a.a*h*500-h*120;l?t.lineTo(d,u):t.moveTo(d,u)}t.stroke()}}t.restore()}wall(e,t,i,s,r){let o=s.c[2]-.15,a=ge(o-.2,o+.5,i,Oe.inOutCubic),c=a*420;e.save(),e.globalAlpha=1-a*.85,e.translate(0,c),e.fillStyle="#000",e.fillRect(420,600,1080,70),e.fillRect(480,670,960,330),e.globalAlpha*=.45;for(let f=0;f<9;f++)e.fillRect(520+f*104,690,40,290);e.restore(),t.save(),t.globalAlpha=1-a,t.translate(0,c),t.fillStyle="#000",t.fillRect(470,700,980,26);for(let f=0;f<9;f++){let g=520+f*110,S=120+f%2*40+(f===4?80:0);e.save(),e.globalAlpha=1-a,e.translate(0,c),e.fillStyle="#000",e.fillRect(g-11,600-S,22,S),e.restore(),t.beginPath(),t.ellipse(g,600-S-26+Math.sin(i*9+f)*3,10,24,0,0,be),t.fill()}t.restore();let l=Math.floor(xt(o)),h=8,d=3,u=Dt(i,10);for(let f=0;f<d;f++)for(let g=0;g<h;g++){let S=l+f*1+g%2*.5,m=se((xt(i)-S)*2.5);if(m<=0)continue;let p=226,v=196,M=25+g*235,_=860-f*206-(1-Oe.outBack(m))*700;e.save(),e.fillStyle="#000",e.fillRect(M,_,p,v),e.globalCompositeOperation="destination-out",e.fillRect(M+12,_+36,p-24,v-48),e.restore(),e.save(),e.globalAlpha=.42,e.fillStyle="#000",e.fillRect(M+12,_+36,p-24,v-48),e.restore(),t.save(),t.fillStyle="#000",t.font=Te(_e.black,22),t.fillText("Kaminare",M+16,_+25),t.strokeStyle="#000",t.lineWidth=5;for(let[b,A]of[[62,82],[164,82],[62,150],[164,150]])t.beginPath(),t.arc(M+b,_+A,28+u*7,0,be),t.stroke();t.restore()}}sutra(e,t,i,s,r){let o=(i-s.t0)*120;e.save(),e.font=Te(_e.mincho,62),e.fillStyle="#000",e.textAlign="center",e.textBaseline="middle";for(let a=0;a<9;a++){let c=160+a*200,l=lo[a%lo.length]+"\u3000"+lo[(a+3)%lo.length]+"\u3000"+lo[(a+6)%lo.length],h=a%2?1:-1,d=(o*h%700+700)%700;for(let u=-1;u<2;u++)ln(l,c,-d+u*1400+100,62,1.1).forEach(g=>e.fillText(g.ch,g.x,g.y))}e.restore(),t.save(),t.strokeStyle="#000";for(let a=0;a<8;a++){let c=260+a*200,l=Ni(i-a*.04,1,4);t.lineWidth=3+a%3,t.beginPath();for(let h=0;h<=1080;h+=10){let d=h/1080,u=Math.sin(d*Math.PI)*Math.sin(d*Math.PI*(3+a%3)+i*40)*26*l;h===0?t.moveTo(c+u,h):t.lineTo(c+u,h)}t.stroke()}t.restore()}chladni(e,t,i,s,r){let o=xt(i),a=Math.floor(xt(s.t0-.35)),c=Math.floor((o-a)/4),l=this.cl[(c%3+3)%3],h=this.cl[((c+1)%3+3)%3],d=se((o-a)%4/1.2),u=ge(s.t0-.35,s.t0+.8,i,Oe.outCubic),f=960,g=560,S=380;t.save(),t.strokeStyle="#000",t.lineWidth=4,t.strokeRect(f-S-20,g-S-20,2*S+40,2*S+40),t.restore(),e.save(),e.fillStyle="#000";let m=Dt(i,12)*.03,p=5200;for(let v=0;v<p;v++){let M=ce(l[v*2],h[v*2],Oe.inOutCubic(d)),y=ce(l[v*2+1],h[v*2+1],Oe.inOutCubic(d)),_=this.rand[v*2],b=this.rand[v*2+1],A=ce(_,M,u)+(at(v+Math.floor(i*30)*7)-.5)*m,x=ce(b,y,u)+(at(v*3+Math.floor(i*30)*5)-.5)*m;e.fillRect(f+A*S,g+x*S,3,3)}e.restore(),ft(t,`MODE ${["3\xB75","4\xB77","2\xB79"][(c%3+3)%3]}   \xB7   ${(172/60*4*(2+c%3)).toFixed(2)} Hz`,f,g+S+60,18,"#000","center",.4)}};var Lg=420,Hh=n=>new L(Math.sin(n*.012)*6,6+Math.sin(n*.03)*1.5-Math.cos(n*.006)*2,-n),Od=class extends xn{constructor(e,t,i){super(),this.phase=e,this.radius=t,this.turns=i}getPoint(e,t=new L){let i=e*Lg,s=Hh(i),r=this.phase+i*this.turns;return t.set(s.x+Math.cos(r)*this.radius,s.y+Math.sin(r)*this.radius,s.z)}},e_=`
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){ vUv = uv; vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,t_=`
${Fi}
uniform vec3 uCol, uGlowCol, uCam; uniform float uGlow, uTime, uPulseZ, uKind;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 n = normalize(vN);
  // twisted straw fibres: diagonal stripes around the tube
  float fib = sin((vUv.x*2600. + vUv.y*6.2831*4.) ) * 0.5 + 0.5;
  float grain = fbm(vec2(vUv.x*2400., vUv.y*20.));
  vec3 L = normalize(vec3(0.3, 1., 0.4));
  float dif = 0.25 + 0.75*max(dot(n, L), 0.);
  vec3 V = normalize(uCam - vW);
  float rim = pow(1. - max(dot(n, V), 0.), 2.5);
  vec3 c = uCol * dif * (0.75 + 0.25*fib) * (0.8 + 0.4*grain);
  float pz = exp(-abs(vW.z - uPulseZ)*0.15);
  c += uGlowCol * (rim*0.6 + pz*uGlow*1.6) ;
  if(uKind > 0.5){ // keys strand: running sparkles
    float sp = step(0.985, hash12(floor(vec2(vUv.x*3000. - uTime*40., vUv.y*8.))));
    c += uGlowCol * sp * 3.;
  }
  float fog = 1. - exp(-pow(length(vW - uCam)*0.012, 1.5));
  c = mix(c, vec3(0.02,0.015,0.04), fog);
  gl_FragColor = vec4(c, 1.);
}`,n_=`
attribute vec3 aOff; attribute float aSeed;
uniform float uTime, uBeat;
varying float vShade; varying vec3 vW;
void main(){
  vec3 p = position;
  float hang = -p.y; // 0 at top .. 1.8 at bottom
  float sw = sin(uTime*3. + aSeed*20. + hang*1.5) * 0.25 * hang + uBeat * 0.35 * hang * sin(aSeed*9.);
  p.x += sw; p.z += cos(uTime*2. + aSeed*13.) * 0.15 * hang;
  vShade = 0.75 + 0.25*sin(sw*4. + p.x);
  vec4 w = modelMatrix*vec4(p + aOff, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,i_=`
uniform vec3 uCam; uniform float uFlash;
varying float vShade; varying vec3 vW;
void main(){
  float dn = length(vW - uCam);
  if(dn < 7.) discard;
  vec3 c = vec3(0.96,0.93,0.86) * vShade * (0.55 + uFlash*0.8) * smoothstep(7., 12., dn);
  float fog = 1. - exp(-pow(length(vW - uCam)*0.012, 1.5));
  c = mix(c, vec3(0.02,0.015,0.04), fog);
  gl_FragColor = vec4(c, 1.);
}`,s_=`
attribute float aSeed; uniform float uTime; varying float vS; varying float vD;
void main(){ vec3 p = position; p.y += sin(uTime*0.6 + aSeed*30.)*0.8;
  vec4 mv = viewMatrix*modelMatrix*vec4(p,1.); vD = -mv.z; vS = aSeed;
  gl_PointSize = min((2.5 + aSeed*4.) * 300. / vD, 46.); gl_Position = projectionMatrix*mv; }`,r_=`
uniform float uTime; varying float vS; varying float vD;
void main(){ vec2 q = gl_PointCoord - .5; float r = length(q);
  float a = exp(-r*r*14.) + exp(-r*r*120.)*0.8; float fl = 0.8 + 0.2*sin(uTime*5. + vS*40.);
  vec3 c = mix(vec3(1.4,0.55,0.2), vec3(1.6,1.1,0.5), vS) * fl * smoothstep(300., 30., vD);
  gl_FragColor = vec4(c*a, 1.); }`;function o_(){let n=new pi,e=.62,t=.85;return n.moveTo(-e,0),n.lineTo(e,0),n.lineTo(e,-t),n.lineTo(-e*.2,-t),n.lineTo(-e*.2,-2*t),n.lineTo(e*1.2,-2*t),n.lineTo(e*1.2,-3*t),n.lineTo(e*.2,-3*t),n.lineTo(e*.2,-4*t),n.lineTo(-e*.6,-4*t),n.lineTo(-e*.6,-3.2*t),n.lineTo(-e*1+.4,-3.2*t),n.lineTo(-e*1+.4,-2.2*t),n.lineTo(-e*1,-2.2*t),n.lineTo(-e*1,-t*1.2),n.lineTo(-e,-t*1.2),n.closePath(),new qo(n)}var kh=class{constructor(e){this.app=e}init(){this.scene=new Di,this.cam=new sn(55,16/9,.1,800),this.sky=new Kr;let e=(S,m,p)=>new Et({vertexShader:e_,fragmentShader:t_,uniforms:{uCol:{value:new Ae(S)},uGlowCol:{value:new Ae(...m)},uCam:{value:new L},uGlow:{value:0},uTime:{value:0},uPulseZ:{value:0},uKind:{value:p}}});this.mBass=e("#2a0f0b",[1.6,.35,.15],0),this.mKeys=e("#b8892e",[1.6,1.2,.6],1),this.mStraw=e("#8a7650",[.9,.7,.4],0);let t=[];for(let S=0;S<3;S++){let m=new Jo(new Od(S/3*be,.9,.62),2600,.88,12,!1),p=new zt(m,S===1?this.mKeys:S===2?this.mStraw:this.mBass);p.frustumCulled=!1,t.push(p),this.scene.add(p)}let i=o_(),s=70,r=new Float32Array(s*3),o=new Float32Array(s);for(let S=0;S<s;S++){let m=8+S*5,p=Hh(m);r.set([p.x,p.y-1.6,p.z],S*3),o[S]=S*.618%1}let a=new Ns().copy(i);a.instanceCount=s,a.setAttribute("aOff",new jn(r,3)),a.setAttribute("aSeed",new jn(o,1)),this.shideMat=new Et({vertexShader:n_,fragmentShader:i_,side:Tn,uniforms:{uTime:{value:0},uBeat:{value:0},uCam:{value:new L},uFlash:{value:0}}});let c=new zt(a,this.shideMat);c.frustumCulled=!1,this.scene.add(c);let l=Vt(66),h=420,d=new Float32Array(h*3),u=new Float32Array(h);for(let S=0;S<h;S++)d.set([(l()-.5)*140,l()*50-12,-l()*Lg],S*3),u[S]=l();let f=new Rt;f.setAttribute("position",new Kt(d,3)),f.setAttribute("aSeed",new Kt(u,1)),this.lanMat=new Et({vertexShader:s_,fragmentShader:r_,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:Bs});let g=new Is(f,this.lanMat);g.frustumCulled=!1,this.scene.add(g),this.layer=new Nt(0)}render(e,t){let i=this.app.renderer,[s,r]=ut.inter,a=20+se((e-s)/(r-s))*260+ge(s+7.5,r,e,Oe.inCubic)*60,c=Hh(a),l=[c.x+15,c.y-1.5,c.z+4],h=[c.x+4,c.y-11,c.z+7],d=[c.x+5,c.y+3.5,c.z+9],u=ge(s+3.2,s+4.6,e,Oe.inOutCubic),f=ge(s+7.3,s+8.4,e,Oe.inOutCubic),g=l.map((A,x)=>ce(ce(A,h[x],u),d[x],f));this.cam.position.set(g[0]+Math.sin(e*.8)*.6,g[1]+Math.sin(e*.6)*.4,g[2]);let S=Hh(a-ce(9,16,f));this.cam.lookAt(S.x,S.y+ce(0,2.5,u)*(1-f),S.z),this.cam.fov=ce(50,62,f)-Dt(e,10)*2,this.cam.updateProjectionMatrix();let m=Dt(e,5);for(let A of[this.mBass,this.mKeys,this.mStraw])A.uniforms.uCam.value.copy(this.cam.position),A.uniforms.uTime.value=e;this.mBass.uniforms.uGlow.value=Math.pow(pa(e),4)*1.4+m*.5,this.mBass.uniforms.uPulseZ.value=c.z-8-e%.7*60,this.mKeys.uniforms.uGlow.value=da(e)*.6+cs(e,8)*.7,this.mKeys.uniforms.uPulseZ.value=c.z-20+Math.sin(e*3)*10,this.shideMat.uniforms.uTime.value=e,this.shideMat.uniforms.uBeat.value=Ni(e,1,6),this.shideMat.uniforms.uCam.value.copy(this.cam.position),this.shideMat.uniforms.uFlash.value=cs(e,10),this.lanMat.uniforms.uTime.value=e,this.sky.draw(i,t,this.cam,{time:e,warp:0,flash:cs(e,14)*.2,dark:.45,pal:{top:[.01,.01,.035],mid:[.03,.02,.08],low:[.09,.03,.08],rim:[.6,.25,.15]}}),i.setRenderTarget(t),i.render(this.scene,this.cam);let p=this.layer.begin(),v=ge(s+.3,s+1.2,e),M=1-ge(r-.8,r,e);p.save(),p.globalAlpha=v*M,p.fillStyle="#f1e8da",p.textAlign="center",p.textBaseline="middle",p.font=Te(_e.mincho,120),ln("\u9593\u594F",1700,300,120,1.1).forEach(A=>vt.ink(p,A,ge(s+.3+A.i*.2,s+.9+A.i*.2,e),120,!0)),ft(p,"INTERLUDE  \xB7  BASS \xD7 KEYS",1700,640,14,"rgba(241,232,218,0.75)","center",.4);let _=Math.pow(pa(e),3),b=da(e);return p.font=Te(_e.mincho,54),p.fillStyle="#ff6a45",p.globalAlpha=v*M*(.6+_*.4),p.fillText("\u30CA\u30EF",760,960),p.fillStyle="#ffd27a",p.globalAlpha=v*M*(.6+b*.4),p.fillText("\u30AB\u30CD",1160,960),p.globalAlpha=v*M,p.fillStyle="#f1e8da",p.font=Te(_e.serif,44),p.fillText("\xD7",960,960),p.fillStyle="#ff6a45",Sn(p,Ui.rope,760,880,34+_*6),p.fillStyle="#ffd27a",Sn(p,Ui.bell,1160,880,34+b*6),p.restore(),this.layer.draw(i,t,{}),{hudInk:"light",bloom:1.1,bloomThresh:.85,grain:.06,vig:.75,ca:.003+m*.005,contrast:1.05}}};function Nd(n,e,t,i=1){if(!t)return;n.save(),n.globalAlpha=i,n.fillStyle="rgba(236,226,208,0.86)",n.textAlign="center",n.textBaseline="middle",n.font=Te(_e.mincho,46);let s=t.text.split(" "),r=0;s.forEach((o,a)=>{ln(o,1330-a*70,300+a*50,46,1.18).forEach(l=>{l.i+=r,vt.ink(n,l,se((e-t.c[l.i]+.08)/.5),46,!0)}),r+=o.length+1}),n.globalAlpha=i*.55*se((e-t.t0)*1.2),n.font=Te(_e.serif,22),"letterSpacing"in n&&(n.letterSpacing="4px"),n.textAlign="left",n.fillText(bn(t),1420,300),n.restore()}var a_=`
uniform float uTime, uSize, uWind, uBright; uniform vec2 uPos;
varying vec2 vUv;
void main(){
  vec2 px = vec2(vUv.x*1920., (1.-vUv.y)*1080.);
  vec2 d = (px - uPos) / uSize;            // flame space: y up negative
  d.y = -d.y;
  float flick = fbm(vec2(uTime*3., d.y*2.)) - .5;
  d.x += flick * 0.25 * max(d.y, 0.) + uWind*d.y*d.y*0.08;
  // teardrop
  float w = 0.32 * (1. - smoothstep(0., 2.2, d.y)) * smoothstep(-0.6, 0.15, d.y) + 0.05;
  float body = smoothstep(w, w*0.35, abs(d.x)) * smoothstep(2.4, 1.2, d.y) * smoothstep(-0.7, -0.2, d.y);
  float core = smoothstep(w*0.55, 0., abs(d.x)) * smoothstep(1.1, 0.2, d.y) * smoothstep(-0.5, -0.1, d.y);
  float blue = smoothstep(0.2, -0.3, d.y) * body;
  vec3 c = vec3(1.0, 0.45, 0.12) * body * 1.6 + vec3(1.0, 0.9, 0.65) * core * 2.6 + vec3(0.2, 0.35, 1.0) * blue * 0.8;
  // halo
  float r = length((px - uPos - vec2(0., -uSize*0.9)) / vec2(1., 1.25));
  c += vec3(1.0, 0.55, 0.22) * exp(-r / (uSize*3.2)) * 0.32 * uBright;
  c += vec3(1.0, 0.4, 0.15) * exp(-r / (uSize*14.)) * 0.08 * uBright;
  gl_FragColor = vec4(c * uBright, 1.);
}`;function Fg(n){let e=0;for(let t=1;t<n.length;t++)e+=Math.hypot(n[t][0]-n[t-1][0],n[t][1]-n[t-1][1]);return e}function l_(n,e,t){let s=e.reduce((r,o)=>r+o._L,0)*t;for(let r of e){if(s<=0)break;n.beginPath(),n.moveTo(r[0][0],r[0][1]);let o=0;for(let a=1;a<r.length;a++){let c=Math.hypot(r[a][0]-r[a-1][0],r[a][1]-r[a-1][1]);if(o+c>s){let l=(s-o)/c;n.lineTo(ce(r[a-1][0],r[a][0],l),ce(r[a-1][1],r[a][1],l)),o=s;break}n.lineTo(r[a][0],r[a][1]),o+=c}n.stroke(),s-=r._L}}var c_=(n,e,t,i,s,r=24)=>Array.from({length:r+1},(o,a)=>[n+Math.cos(ce(i,s,a/r))*t,e+Math.sin(ce(i,s,a/r))*t]);function h_(){let n=[];n.push([[330,780],[330,300],[380,180],[430,300],[430,780]]),n.push([[610,780],[610,300],[660,180],[710,300],[710,780]]),n.push([[330,780],[710,780]]),n.push([[430,520],[520,380],[610,520]]),n.push([[430,520],[610,520]]),n.push(c_(520,465,38,0,be,40));for(let e=0;e<8;e++)n.push([[520,465],[520+Math.cos(e/8*be)*38,465+Math.sin(e/8*be)*38]]);n.push([[480,780],[480,670],[488,640],[505,618],[520,606],[535,618],[552,640],[560,670],[560,780]]),n.push([[520,380],[520,320]],[[502,340],[538,340]]);for(let e of[380,660])for(let t of[380,560])n.push([[e-12,t+70],[e-12,t+10],[e,t-6],[e+12,t+10],[e+12,t+70]]);return n.forEach(e=>e._L=Fg(e)),n}function u_(){let n=[];n.push([[1150,780],[1590,780]],[[1150,750],[1590,750]]);for(let i of[1190,1300,1440,1550])n.push([[i,750],[i,600]]);let e=[];for(let i=0;i<=30;i++){let s=i/30,r=ce(1100,1640,s),o=600-Math.sin(s*Math.PI)*170-(s<.5,-1*Math.pow(Math.abs(s-.5)*2,3)*30);e.push([r,o])}n.push(e),n.push([[1100,600],[1640,600]]),n.push([[1270,432],[1470,432]]);for(let i of[1270,1470])n.push([[i-22,448],[i+26,368]],[[i+22,448],[i-26,368]]);for(let i of[1320,1370,1420])n.push([[i-14,420],[i+14,420],[i+14,410],[i-14,410],[i-14,420]]);let t=[];for(let i=0;i<=20;i++)t.push([ce(1190,1550,i/20),640+Math.sin(i/20*Math.PI)*26]);n.push(t);for(let i of[1260,1370,1480])n.push([[i,660],[i+12,676],[i-6,690],[i+10,708],[i-4,722]]);return n.push([[1330,780],[1310,840],[1430,840],[1410,780]]),n.forEach(i=>i._L=Fg(i)),n}var Vh=class{constructor(e){this.app=e}init(){this.flame=new It(a_,{uTime:{value:0},uSize:{value:40},uWind:{value:0},uBright:{value:1},uPos:{value:new ae(960,740)}}),this.glow=new Nt(1),this.type=new Nt(0),this.ls=an("br"),this.church=h_(),this.shrine=u_()}render(e,t){let i=this.app.renderer,s=this.ls,[r,o]=ut.bridge,a=ge(s[3].t0-.2,s[3].t0+1.2,e,Oe.inOutCubic),c=e>150.02?1:0,l=1+a*-.25,h=this.flame.u,d=ce(740,870,a);h.uTime.value=e,h.uPos.value.set(960,d),h.uSize.value=ce(40,22,a)*(1+oh(e)*.25),h.uWind.value=Math.sin(e*.7)*.6+oh(e)*1.2,h.uBright.value=(1-c*.85)*(.9+Wr(e)*.3),this.flame.render(i,t,!1);let u=this.glow.begin(),f=this.type.begin();f.save();let g=ce(46,26,a),S=ce(260,120,a),m=f.createLinearGradient(960-g,0,960+g,0);m.addColorStop(0,"#2a1e16"),m.addColorStop(.45,"#cdb894"),m.addColorStop(1,"#1a120c"),f.fillStyle=m,f.globalAlpha=1-c*.8,f.fillRect(960-g,d+10,g*2,S),f.fillStyle="#1b130e",f.fillRect(958,d-4,4,18),f.restore(),u.save(),u.globalCompositeOperation="lighter";for(let[M,y]of Ks.bridge){let _=e-M;if(_<0||_>3)continue;let b=960+(y-56)*9+Math.sin(_*3+y)*20*_,A=d-60-_*160,x=(1-_/3)*(1-c),E=3+Math.exp(-_*5)*6,w=u.createRadialGradient(b,A,0,b,A,E*5);w.addColorStop(0,`rgba(255,236,190,${x})`),w.addColorStop(1,"rgba(255,140,60,0)"),u.fillStyle=w,u.beginPath(),u.arc(b,A,E*5,0,be),u.fill()}u.restore();let p=(()=>{let M=0;for(let y=0;y<s.length;y++)e>=s[y].t0-.2&&(M=y);return M})();if(p===0)Nd(f,e,s[0],1);else{let M=s[p],y=p<3?1-ge(s[p+1].t0-.4,s[p+1].t0,e):1-c;f.save(),f.globalAlpha=y,f.fillStyle="rgba(236,226,208,0.9)",f.textAlign="center",f.textBaseline="middle";let _=p===3?64:50;f.font=Te(p===3?_e.minchoB:_e.mincho,_);let b=p===3?170:200;Ht(f,M.text,960,b,_,p===3?8:18).forEach(x=>vt.ink(f,x,se((e-M.c[x.i]+.08)/.4),_,!1)),f.globalAlpha=y*.6*se((e-M.t0)*1.5),f.font=Te(_e.serif,24),"letterSpacing"in f&&(f.letterSpacing="6px"),f.fillText(bn(M).toUpperCase(),960,b+62),f.restore()}{let M=s[1],y=ge(M.t0-.2,M.t0+.3,e)*(1-ge(s[2].t0,s[2].t0+.5,e));if(y>0){u.save(),u.globalAlpha=y,u.strokeStyle="#ffcf8a",u.lineWidth=1.6,u.beginPath();for(let _=280;_<=1640;_+=4){let b=e-(1640-_)/1360,A=oh(b)*26*Math.sin(_*.35+e*20)*Math.exp(-Math.abs(_-960)/500);_===280?u.moveTo(_,900+A):u.lineTo(_,900+A)}u.stroke(),u.restore(),ft(f,"LAUGHTER  \xB7  VOLUME   \u25B8  \u2212\u221E dB",960,940,13,`rgba(236,226,208,${.6*y})`,"center",.4)}}{let M=s[2],y=ge(M.c[0]-.2,M.c[3]+.4,e,Oe.inOutCubic),_=ge(M.c[5]-.2,M.c[8]+.6,e,Oe.inOutCubic);if(y>0){let b=ce(1,.62,a),A=(x,E,w,R)=>{u.save(),u.translate(R,780),u.scale(b,b),u.translate(-R+w*a,-780+a*40),u.strokeStyle="#ffcf7a",u.lineWidth=2.2,u.lineJoin="round",u.globalAlpha=1-c*.6,l_(u,x,E),u.restore()};A(this.church,y,300,520),_>0&&A(this.shrine,_,-300,1370)}}if(a>0){let M=ce(1180,800,a);f.save(),f.fillStyle="#0d0a0b",f.beginPath(),f.moveTo(260,M),f.lineTo(1660,M),f.lineTo(1860,M+180),f.lineTo(60,M+180),f.closePath(),f.fill(),f.restore(),u.save(),u.strokeStyle="#f2c766",u.lineWidth=2,u.beginPath(),u.moveTo(260,M),u.lineTo(1660,M),u.moveTo(60,M+180),u.lineTo(1860,M+180),u.stroke();let y=Math.floor(xt(s[3].t0+.6)),_=se(Math.floor(xt(e))-y+1,0,8);u.globalCompositeOperation="lighter";for(let b=0;b<8&&!(b>=_);b++){let A=280+b*194,x=c?b===3?1:0:1,E=Math.exp(-((xt(e)-y-b)%8)*0)*x,w=u.createLinearGradient(A,0,A,M);w.addColorStop(0,"rgba(255,236,200,0)"),w.addColorStop(.15,`rgba(255,236,200,${.22*E})`),w.addColorStop(1,`rgba(255,190,110,${.05*E})`),u.fillStyle=w,u.beginPath(),u.moveTo(A-8,-10),u.lineTo(A+8,-10),u.lineTo(A+120,M+10),u.lineTo(A-120,M+10),u.closePath(),u.fill(),u.fillStyle=`rgba(255,240,210,${.9*E})`,u.beginPath(),u.ellipse(A,M+6,120,14,0,0,be),u.fill()}u.restore()}let v=ge(r,r+1,e)*(1-a);return f.save(),f.globalAlpha=v,f.fillStyle="#ece2d0",f.textAlign="center",f.textBaseline="middle",f.font=Te(_e.mincho,96),ln("\u9759",240,330,96).forEach(M=>f.fillText(M.ch,M.x,M.y)),ft(f,"BRIDGE  \xB7  ONE CANDLE",240,470,13,"rgba(236,226,208,0.6)","center",.4),f.restore(),this.glow.draw(i,t,{boost:1.8,scale:(l<1,1)}),this.type.draw(i,t,{}),{hudInk:"light",hud:1-c,bloom:1,bloomThresh:.8,grain:.07,vig:.85,ca:.0015,exposure:1-c*.3,contrast:1.04,sat:.95}}};var f_=`
uniform float uTime, uZ, uFlash, uRoll, uFreeze, uBank; uniform vec3 uFlashP; uniform vec2 uLook;
varying vec2 vUv;
float fbmC(vec3 p){ float s=0., a=.5; for(int i=0;i<3;i++){ s+=a*vnoise3(p); p=p*2.07+vec3(1.7,9.2,3.1); a*=.5;} return s/0.875; }
float topH(vec2 xz){ return -4.5 + fbm(xz*0.035 + vec2(0., uTime*0.02))*9.0; }
float dens(vec3 p){
  float h = topH(p.xz);
  float d = (h - p.y) * 0.8;
  d += (fbmC(p*0.16 + vec3(0., 0., uTime*0.1)) - 0.5) * 2.1;
  return clamp(d, 0., 1.);
}
void main(){
  vec2 q = (vUv - .5) * vec2(16./9., 1.);
  q = rot(uRoll) * q;
  vec3 ro = vec3(sin(uZ*0.012)*30., 5.5 + sin(uZ*0.03)*1.2, uZ);
  vec3 fw = normalize(vec3(uLook.x + uBank*0.2, -0.12 + uLook.y, -1.));
  vec3 rt = normalize(cross(fw, vec3(0.,1.,0.)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw*1.2 + rt*q.x + up*q.y);
  vec3 L = normalize(vec3(0.52, 0.2, -1.));          // the moon, low ahead-right
  // sky
  float sy = rd.y;
  vec3 sky = mix(vec3(0.42,0.12,0.22), vec3(0.04,0.025,0.1), smoothstep(-0.02, 0.3, sy));
  sky = mix(sky, vec3(0.01,0.008,0.03), smoothstep(0.3, 0.9, sy));
  float md = max(dot(rd, L), 0.);
  sky += vec3(1.0,0.9,0.78) * smoothstep(0.9993, 0.9996, md) * 2.2;          // moon disc
  sky += vec3(1.0,0.6,0.5) * pow(md, 90.) * 0.3 + vec3(0.9,0.4,0.5) * pow(md, 8.) * 0.1;
  float st = step(0.996, hash12(floor(rd.xy*800.))) * smoothstep(0.1, 0.5, sy);
  sky += st * 0.8;
  vec3 col = vec3(0.); float T = 1.;
  if(rd.y < 0.08){
    float t = (ro.y - 5.0) / max(-rd.y, 0.02);            // jump to near the cloud tops
    t = max(t, 0.5);
    t += hash12(gl_FragCoord.xy + fract(uTime)*17.) * 1.2;
    for(int i=0;i<28;i++){
      vec3 p = ro + rd*t;
      if(p.y < -14. || t > 160.) break;
      float d = dens(p);
      if(d > 0.01){
        float sh = dens(p + L*1.8 + vec3(0.,1.2,0.));
        float lit = exp(-sh*2.2);
        float fl = uFlash * exp(-length(p - uFlashP)*0.06);
        vec3 shadowC = vec3(0.025,0.02,0.07);
        vec3 litC = vec3(0.85,0.62,0.72) * 0.75;
        float rimL = pow(max(dot(normalize(vec3(rd.x, 0., rd.z)), vec3(L.x, 0., L.z)), 0.), 8.);
        vec3 lum = mix(shadowC, litC, pow(lit, 1.6)*0.9) + vec3(1.,.75,.7)*rimL*lit*0.25 + vec3(0.75,0.82,1.)*fl*3.0 + vec3(0.6,0.2,0.3)*0.12*(1.-lit);
        float a = d*0.5;
        col += T*a*lum;
        T *= 1. - a;
        if(T < 0.03) break;
      }
      t += 0.9 + t*0.035;
    }
    float far = smoothstep(60., 160., (ro.y - 2.) / max(-rd.y,0.01));
    col = mix(col, sky*(1.-T) + col, 0.) ;
    col += T*sky;
    col = mix(col, sky, far*0.7);
  } else col = sky;
  float Lm = luma(col);
  col = mix(col, vec3(Lm)*vec3(0.9,0.95,1.05), uFreeze*0.85);
  gl_FragColor = vec4(col, 1.);
}`,d_=`
uniform sampler2D tIn; varying vec2 vUv;
void main(){ gl_FragColor = vec4(texture2D(tIn, vUv).rgb, 1.); }`,Wh=class{constructor(e){this.app=e}init(){this.cloud=new It(f_,{uTime:{value:0},uZ:{value:0},uFlash:{value:0},uRoll:{value:0},uFreeze:{value:0},uBank:{value:0},uFlashP:{value:new L},uLook:{value:new ae}}),this.up=new It(d_,{tIn:{value:null}},{noNoise:!0}),this.resize(this.app.rw,this.app.rh),this.glow=new Nt(1),this.type=new Nt(0),this.wl=an("br")[0]}resize(e,t){this.rt?.dispose(),this.rt=Oi(Math.max(2,Math.round(e*.5)),Math.max(2,Math.round(t*.5)))}render(e,t){let i=this.app.renderer,[s]=ut.solo,r=ut.freeze[0],o=ge(r-.05,r+.35,e,Oe.outCubic),a=e<r?e:r+(1-Math.exp(-(e-r)*6))/6,c=-(a-s)*30,l=0,h=null,d=0;for(let x=0;x<hs.length;x++){let E=hs[x];if(E>a)break;if(!(E<a-.5||E<s)&&at(x*13+1)<.55){let w=Xs(a-E,x);w>l&&(l=w,d=x)}}let u=this.cloud.u;u.uTime.value=a,u.uZ.value=c,u.uFlash.value=l*(1-o*.7),u.uFlashP.value.set((at(d)-.5)*80,-4+at(d+1)*3,c-30-at(d+2)*60),u.uRoll.value=Math.sin(a*.45)*.16+ua(a*.5,4)*.08,u.uBank&&(u.uBank.value=Math.sin(a*.45)),u.uLook.value.set(Math.sin(a*.35)*.12,Math.sin(a*.6)*.04),u.uFreeze.value=o,this.cloud.render(i,this.rt,!0),this.up.u.tIn.value=this.rt.texture,this.up.render(i,t,!1);let f=this.glow.begin(),g=this.type.begin(),S=x=>[900+Math.sin(x*1.1)*300+Math.sin(x*2.7)*60,420+Math.sin(x*.8+1)*120-da(x)*40];f.save(),f.globalCompositeOperation="lighter";for(let[x,E]of[[16,.08],[5,.25],[1.6,.9]]){f.strokeStyle=`rgba(230,240,255,${E})`,f.lineWidth=x,f.beginPath();for(let w=0;w<60;w++){let R=a-w*.025,[I,N]=S(R),D=w*9,U=N+D*.45+Math.sin(R*9+w*.2)*Wr(R)*6,W=I+D*.25;w===0?f.moveTo(W,U):f.lineTo(W,U)}f.stroke()}let[m,p]=S(a),v=1+Dt(a,8)*.15,M=a*13,[y]=S(a-.05),_=m>=y?1:-1;for(let[x,E]of[[1.25,.08],[1.08,.16],[1,.85]])f.fillStyle=`rgba(255,255,255,${E})`,hh(f,m,p,300*x*v,M,_);for(let x=0;x<24;x++){let E=(a*1.7+x/24)%1,w=Math.floor(a*1.7+x/24)*31+x,R=m-E*500+(at(w)-.5)*200,I=p+E*300+(at(w+1)-.5)*160;f.fillStyle=`rgba(255,255,255,${(1-E)*.7})`,f.beginPath(),f.ellipse(R,I,7,2.5,E*6+w,0,be),f.fill()}f.restore(),f.save(),f.globalCompositeOperation="lighter";for(let x=0;x<70;x++){let E=at(x*7)*be,w=(a*(.9+at(x)*1.4)+at(x*3))%1,R=80+w*w*1100,I=R+40+w*160;f.strokeStyle=`rgba(210,220,255,${(1-o)*.35*w})`,f.lineWidth=1+w*1.5,f.beginPath(),f.moveTo(960+Math.cos(E)*R,500+Math.sin(E)*R*.6),f.lineTo(960+Math.cos(E)*I,500+Math.sin(E)*I*.6),f.stroke()}if(f.restore(),l>.2&&o<.5){let x=Ws(200+at(d*3)*1500,-20,200+at(d*5)*1500,400+at(d)*500,d+700,{branch:.8,depth:2,w:1.8});Qs(f,x,l*.6,1)}let b=ge(s+.2,s+1,e)*(1-o);if(g.save(),g.globalAlpha=b,g.fillStyle="#f1e8da",g.textAlign="center",g.textBaseline="middle",g.font=Te(_e.mincho,120),ln("\u72EC\u594F",230,300,120,1.1).forEach(x=>vt.ink(g,x,ge(s+.2+x.i*.2,s+.8+x.i*.2,e),120,!0)),ft(g,"SOLO  \xB7  \u30CF\u30C8  \xB7  LEAD GUITAR",230,640,14,"rgba(241,232,218,0.75)","center",.35),g.restore(),o>0){f.save(),f.globalCompositeOperation="lighter";let x=Math.max(0,e-r)*1600;f.strokeStyle=`rgba(255,255,255,${Math.max(0,1-(e-r)*1.5)*.8})`,f.lineWidth=2,f.beginPath(),f.arc(m,p,x,0,be),f.stroke(),f.restore(),Nd(g,e,this.wl,o),ft(g,"\u2014 TIME STOPS \u2014",960,1e3,13,`rgba(241,232,218,${.55*o})`,"center",.6)}return this.glow.draw(i,t,{boost:1.5}),this.type.draw(i,t,{}),{hudInk:"light",bloom:1.1,bloomThresh:.85,grain:.06+o*.04,vig:.7,ca:.003+Dt(e,10)*.006*(1-o),flash:l*.12*(1-o)+(e>r&&e<r+.08?.5:0),sat:1-o*.5,contrast:1.05}}};var co=770,Og=177.3;function p_(){let n=new Si(760,1e3,{seed:71});n.stroke([[30,90],[380,82],[730,96]],{w:46,dry:.7,t0:0,t1:.16,spatter:.6}),n.stroke([[380,110],[384,190]],{w:18,dry:.3,t0:.16,t1:.22});let e=[[330,200],[250,230],[215,330],[208,560],[200,760],[168,800]],t=e.map(([s,r])=>[760-s,r]);n.stroke(e,{w:26,dry:.5,t0:.22,t1:.46}),n.stroke(t,{w:20,dry:.65,t0:.26,t1:.5}),n.stroke([[168,800],[380,812],[592,800]],{w:18,dry:.5,t0:.5,t1:.58}),n.stroke([[330,200],[380,192],[430,200]],{w:16,dry:.4,t0:.2,t1:.24});for(let[s,r]of[[360,0],[600,1],[720,2]])n.stroke([[214,s],[380,s+4],[546,s]],{w:10,dry:.75,t0:.58+r*.04,t1:.64+r*.04,bristles:8});n.stroke([[380,360],[380,600]],{w:9,dry:.7,t0:.7,t1:.74,bristles:8});let i=Vt(4);for(let s=0;s<4;s++)for(let r=0;r<3;r++)for(let o of[262,410]){let a=o+r*30,c=230+s*30;n.fill(l=>{l.beginPath(),l.arc(a,c+0,8+i()*2,0,be),l.fill()},{t0:.74+s*.02,t1:.76+s*.02,bounds:[a-10,c-10,20,20],from:"center"})}return n.fill(s=>{s.beginPath(),s.arc(300,670,28,0,be),s.arc(300,670,16,0,be,!0),s.fill("evenodd")},{t0:.86,t1:.9,bounds:[270,640,60,60],from:"center"}),n.fill(s=>{s.globalAlpha=.18,s.beginPath(),s.moveTo(250,230),s.lineTo(510,230),s.lineTo(560,790),s.lineTo(200,790),s.closePath(),s.fill()},{t0:.6,t1:.95,bounds:[200,220,360,580],from:"top",blur:16}),n.bake()}function m_(){let n=new Si(200,300,{seed:13});return n.fill(e=>{e.save(),e.translate(70,240),e.rotate(-.4),e.beginPath(),e.ellipse(0,0,48,33,0,0,be),e.fill(),e.restore()},{t0:0,t1:.1}),n.stroke([[112,230],[116,40]],{w:14,dry:.3,t0:0,t1:.1}),n.stroke([[116,40],[150,90],[178,120],[164,190]],{w:18,dry:.6,t0:0,t1:.1}),n.bake().color}var Xh=class{constructor(e){this.app=e}init(){this.paper=new vi("#ebe1ce","#cf3320"),this.bell=new Qr(p_(),[1110,40,760,1e3],"#120d0b"),this.note=m_(),this.layer=new Nt(0),this.ls=an("out")}render(e,t){let i=this.app.renderer,[s,r]=this.ls,o=ge(178.4,179.4,e,Oe.inOutCubic);this.paper.draw(i,t,{zoom:1+(e-ut.outro[0])*.006});let a=ge(r.t0-.2,Og+.2,e,g=>g);this.bell.draw(i,t,a,{alpha:1-o*.88});let c=this.layer.begin();c.textAlign="center",c.textBaseline="middle",c.save(),c.globalAlpha=.65*(1-o*.6);let l=c.createLinearGradient(0,co-6,0,co+40);l.addColorStop(0,"rgba(18,13,11,0.0)"),l.addColorStop(.2,"rgba(18,13,11,0.35)"),l.addColorStop(1,"rgba(18,13,11,0)"),c.fillStyle=l,c.fillRect(120,co-6,1680,46),c.restore();let h=[],d=s.c[s.c.length-1];h.push({x:640,t0:d,k:1.4});for(let[g,S]of Ks.outro)h.push({x:640+(S-66)*22,t0:g+.45,k:.45});for(let g=0;g<6;g++)h.push({x:1490,t0:Og+g*.85,k:1.2-g*.15});c.save(),c.strokeStyle="#140f0d";for(let g of h){let S=e-g.t0;if(!(S<0||S>4))for(let m=0;m<3;m++){let p=S-m*.18;if(p<0)continue;let v=p*160*g.k+6;c.globalAlpha=Math.max(0,1-p/3.4)*.7*g.k,c.lineWidth=2.2*(1-p/4)+.4,c.beginPath(),c.ellipse(g.x,co,v,v*.16,0,0,be),c.stroke()}}c.restore();{let g=s.c[0]-.1,S=ge(g,d,e,Oe.inQuad);if(e>g-.2&&e<d+.2){let m=ce(-120,co-200,S);c.save(),c.globalAlpha=1-se((e-d)/.2),c.translate(640,m),c.rotate(Math.sin(e*2)*.12),c.drawImage(this.note,-100,-150),c.restore()}c.save(),c.fillStyle="#140f0d";for(let[m,p]of Ks.outro){let v=e-(m-0);if(v<0||v>.45)continue;let M=ce(220,co,Oe.inQuad(v/.45));c.beginPath(),c.ellipse(640+(p-66)*22,M,5,9,0,0,be),c.fill()}c.restore()}let u="#16100d";if(c.fillStyle=u,[s,r].forEach((g,S)=>{c.font=Te(_e.mincho,64);let m=S?980:260,p=ln(g.text,m,140,64,1.12);c.save(),c.globalAlpha=1-o,p.forEach(v=>vt.ink(c,v,se((e-g.c[v.i]+.08)/.45),64,!0)),c.globalAlpha=(1-o)*.55*se((e-g.t0)*1.5),c.translate(m-70,150),c.rotate(Math.PI/2),c.textAlign="left",c.font=Te(_e.serif,22),"letterSpacing"in c&&(c.letterSpacing="4px"),c.fillText(bn(g),0,0),c.restore()}),o>0){c.save(),c.globalAlpha=o,c.fillStyle="#c92a1c",c.font=Te(_e.brush,170),c.fillText("\u30AB\u30DF\u30CA\u30EC",960,470),c.fillStyle=u,c.font=Te(_e.mincho,32),"letterSpacing"in c&&(c.letterSpacing="22px"),c.fillText("\u795E\u9CF4\u308C",975,600),c.font=Te(_e.black,40),"letterSpacing"in c&&(c.letterSpacing="2px"),c.fillText("Kaminare",960,345),ft(c,"A REAL-TIME MUSIC VIDEO  \xB7  WEBGL / GLSL / P5.BRUSH / CANVAS",960,690,14,"rgba(22,16,13,0.75)","center",.32),ft(c,"EVERY FRAME IS DRAWN LIVE IN YOUR BROWSER",960,722,12,"rgba(22,16,13,0.5)","center",.32);let g=Oe.outBack(se((e-178.9)/.3));g>0&&(c.save(),c.translate(1400,400),c.rotate(-.08),c.scale(ce(1.6,1,g),ce(1.6,1,g)),c.fillStyle="#c92a1c",c.fillRect(-48,-48,96,96),c.globalCompositeOperation="destination-out",c.font=Te(_e.mincho,40),c.fillText("\u795E",0,-20),c.fillText("\u9CF4",0,22),c.restore()),c.restore()}this.layer.draw(i,t,{});let f=ge(181.161-1.2,181.161,e);return{hudInk:"dark",hud:1-o,bloom:.3,bloomThresh:.95,grain:.04,vig:.5+f*.4,ca:.001,hudShu:"#c92a1c",exposure:1-f*.15}}};var Vn=n=>ut[n][0],ho=[{scene:"intro",t0:0},{scene:"emaki",t0:Vn("v1"),tin:{type:3,pre:.3,post:.45}},{scene:"pre",t0:Vn("pre1"),tin:{type:5,pre:0,post:.42}},{scene:"chorus",t0:Vn("ch1"),tin:{type:3,pre:.08,post:.3}},{scene:"post",t0:Vn("post"),tin:{type:1,pre:.05,post:.5,angle:.42}},{scene:"verse2",t0:Vn("v2"),tin:{type:6,pre:.12,post:.22}},{scene:"pre",t0:Vn("pre2"),tin:{type:5,pre:0,post:.42}},{scene:"chorus",t0:Vn("ch2"),tin:{type:3,pre:.08,post:.3}},{scene:"rope",t0:Vn("inter"),tin:{type:1,pre:.05,post:.6,angle:-.35}},{scene:"solo",t0:Vn("solo"),tin:{type:4,pre:.1,post:.5}},{scene:"bridge",t0:Vn("bridge"),tin:{type:0,pre:0,post:.12}},{scene:"chorus",t0:Vn("fc"),tin:{type:3,pre:.04,post:.35}},{scene:"outro",t0:Vn("outro"),tin:{type:3,pre:.12,post:1.2}}];for(let n=0;n<ho.length;n++)ho[n].t1=ho[n+1]?ho[n+1].t0:999;var Ng={intro:uh,emaki:Bh,pre:Uh,chorus:fh,post:Gh,verse2:zh,rope:kh,solo:Wh,bridge:Vh,outro:Xh};var Yt=n=>document.querySelector(n),Qh=new URLSearchParams(location.search),Bg=Qh.has("capture")?{width:+Qh.get("w")||1280}:null;function g_(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}async function x_(){if(!g_()){Yt("#boot").style.display="none",Yt("#fallback").style.display="grid";return}let n=Yt("#loadmsg"),e=Yt("#loadbar"),t=(b,A)=>{e.style.width=`${Math.round(b*100)}%`,A&&(n.textContent=A)};t(.05,"\u66F8\u4F53\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026"),await $p();let i=new lh({shots:ho,scenes:Ng,hud:em,capture:Bg});window.PV=i;let s={intro:"\u706F\u3092\u70B9\u3057\u3066\u3044\u307E\u3059\u2026",emaki:"\u58A8\u3092\u78E8\u3063\u3066\u3044\u307E\u3059\u2026",pre:"\u6731\u3092\u6EB6\u3044\u3066\u3044\u307E\u3059\u2026",chorus:"\u785D\u5B50\u3092\u5D4C\u3081\u3066\u3044\u307E\u3059\u2026",post:"\u62CD\u3092\u6570\u3048\u3066\u3044\u307E\u3059\u2026",verse2:"\u7248\u3092\u5237\u3063\u3066\u3044\u307E\u3059\u2026",rope:"\u7E04\u3092\u7DAF\u3063\u3066\u3044\u307E\u3059\u2026",solo:"\u96F2\u3092\u96C6\u3081\u3066\u3044\u307E\u3059\u2026",bridge:"\u874B\u71ED\u3092\u7ACB\u3066\u3066\u3044\u307E\u3059\u2026",outro:"\u9418\u3092\u540A\u308B\u3057\u3066\u3044\u307E\u3059\u2026"};if(await i.init((b,A)=>t(.1+b*.85,s[A]||"\u6E96\u5099\u4E2D\u2026")),t(1,"\u6E96\u5099\u5B8C\u4E86 \u2014 \u5949\u7D0D\u3057\u3066\u518D\u751F"),Bg){document.body.classList.add("capture"),Yt("#boot").style.display="none",i.renderAt(+Qh.get("t")||0),window.__ready=!0;return}let r=Yt("#song");i.attachAudio(r);let o=+Qh.get("t")||0;i.t=o,i.start(),o&&(r.currentTime=o);let a=Yt("#play");a.disabled=!1;let c=Yt("#ui"),l=Yt("#pp"),h=async()=>{try{await r.play()}catch(b){console.warn(b)}Yt("#boot").classList.add("gone")};a.addEventListener("click",h);let d=()=>{if(Yt("#boot").classList.contains("gone")===!1)return h();r.paused?r.play():r.pause()};r.addEventListener("play",()=>l.textContent="\u275A\u275A PAUSE"),r.addEventListener("pause",()=>l.textContent="\u25B6 PLAY"),l.addEventListener("click",d),i.onEnded=()=>{c.classList.add("show")};let u=Yt("#bar");for(let[b,,A]of fa){let x=document.createElement("div");x.className="tick",x.style.left=`${ut[b][0]/181.161*100}%`,x.innerHTML=`<b>${A}</b>`,u.appendChild(x)}let f=b=>{r.currentTime=Math.max(0,Math.min(181.161-.05,b)),i.resync()},g=!1,S=b=>{let A=u.getBoundingClientRect();f((b.clientX-A.left)/A.width*181.161)};u.addEventListener("pointerdown",b=>{g=!0,u.setPointerCapture(b.pointerId),S(b)}),u.addEventListener("pointermove",b=>g&&S(b)),u.addEventListener("pointerup",()=>g=!1);let m=b=>`${String(Math.floor(b/60)).padStart(2,"0")}:${String(Math.floor(b%60)).padStart(2,"0")}`;i.onTick=b=>{let A=b/181.161*100;Yt("#fill").style.width=`${A}%`,Yt("#head").style.left=`${A}%`,Yt("#tc").textContent=`${m(b)} / ${m(181.161)}`;let x=i.chapterAt(b);Yt("#chap").textContent=`${x[2]}  ${x[1]}`};let p=0,v=()=>{Yt("#boot").classList.contains("gone")&&(c.classList.add("show"),document.body.style.cursor="",clearTimeout(p),p=setTimeout(()=>{r.paused||(c.classList.remove("show"),document.body.style.cursor="none")},2200))};window.addEventListener("pointermove",v),window.addEventListener("pointerdown",v);let M=()=>{let b=document.documentElement;document.fullscreenElement?document.exitFullscreen?.():b.requestFullscreen?.()};Yt("#fsbtn").addEventListener("click",M),Yt("#hudbtn").addEventListener("click",()=>i.hideHud=!i.hideHud);let y=[.5,.75,1],_=Yt("#qbtn");_.addEventListener("click",()=>{let b=(y.indexOf(i.quality)+1)%y.length;i.quality=y[b],_.textContent=`QUALITY ${"\u25CF".repeat(b+1)}${"\u25CB".repeat(2-b)}`,i.resize()}),window.addEventListener("keydown",b=>{if(b.code==="Space")b.preventDefault(),d();else if(b.code==="ArrowRight")f(r.currentTime+5);else if(b.code==="ArrowLeft")f(r.currentTime-5);else if(b.code==="KeyF")M();else if(b.code==="KeyH")i.hideHud=!i.hideHud;else if(/^Digit[1-9]$/.test(b.code)){let A=+b.code.slice(5)-1;f(ut[["intro","v1","pre1","ch1","v2","ch2","solo","bridge","fc"][A]][0]),Yt("#boot").classList.contains("gone")===!1&&h()}v()})}x_();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
