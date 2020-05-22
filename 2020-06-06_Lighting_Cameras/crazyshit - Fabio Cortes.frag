#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

const int steps = 160;
const float smallNumber = 0.0001;
const float maxDist = 10.0;
const float disp = 3.0;

float sdSphere( vec3 p, float s ) {
  return length(p)-s;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

//noise algorithme from Morgan McGuire
//https://www.shadertoy.com/view/4dS3Wd
float noise(vec2 st){
  vec2 ist = floor(st);
  vec2 fst = fract(st);

  //get 4 corners of the pixel
  float bl = random(ist);
  float br = random(ist + vec2(1.0, 0.0));
  float tl = random(ist + vec2(0.0, 1.0));
  float tr = random(ist + vec2(1.0, 1.0));

  //smooth interpolation using cubic function
  vec2 si = fst * fst * (3.0 - 2.0 * fst);

  //mix the four corner to get a noise value
  return mix(bl, br, si.x) +
         (tl - bl) * si.y * (1.0 - si.x) +
         (tr - br) * si.x * si.y;
}

float scene(vec3 position){

    vec3 sphere1Position = vec3(position.x + 1.2, position.yz);
    float sphere1 =  sdSphere(sphere1Position, 0.3);
    float sphere1Displacement = cos(disp*position.x)*sin(disp*position.y)*tan(disp*position.x) * (sin(u_time*0.5));
    float displacedSp1 = sphere1 + sphere1Displacement;

    float sphere2 = sdSphere(position, 0.3);
    float sphere2Displacement = cos(disp*position.x)*sin(disp*position.z)*asin(disp*position.z) * sin(u_time*0.5);
    float displacedSp2 = sphere2 + sphere2Displacement;

    vec3 Sphere3Position = vec3(position.x - 1.2, position.yz);
    float Sphere3 = sdSphere(Sphere3Position, 0.3);
    float sphere3Displacement = cos(disp*position.y)*sin(disp*position.x)*acos(disp*position.z) * sin(u_time*0.5);
    float displacedSp3 = Sphere3 + sphere3Displacement;

    float ground =  position.y
                    - sin(position.x * 10.0) / 10.0
                    - cos(position.z *10.0) /10.0
                    + 1.;
    float ceil =  - position.y
                    - sin(position.x * 10.0) / 10.0 *sin(u_time)
                    - cos(position.z *10.0) /10.
                    + 1.;
   
    return min(ceil, min(displacedSp3, min(displacedSp2, min(displacedSp1, ground))));
}

 vec3 estimateNormal(vec3 p) {
    vec3 n = vec3(
    scene(vec3(p.x + smallNumber, p.yz)) -
    scene(vec3(p.x - smallNumber, p.yz)),
    scene(vec3(p.x, p.y + smallNumber, p.z)) -
    scene(vec3(p.x, p.y - smallNumber, p.z)),
    scene(vec3(p.xy, p.z + smallNumber)) -
    scene(vec3(p.xy, p.z - smallNumber))
);
// poke around the point to get the line perpandicular
// to the surface at p, a point in space.
return normalize(n);
}

vec4 lighting(vec3 pos){
    vec3 lightPos = vec3(.5,1.0,0.0);
    // light moves left to right
    
    vec3 normal = estimateNormal(pos);
    float mag = dot(normal,lightPos);

    
    return vec4(mag);
}

vec3 lookAt (vec2 uv, vec3 camOrigin, vec3 camTarget) {
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 zAxis = normalize(camTarget - camOrigin);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));
    float fov = 2.0;
    vec3 dir = (normalize((uv.x * xAxis) + (uv.y * yAxis) + (zAxis * fov)));
    
    return dir;
}

vec4 march(vec3 rayOrigin, vec3 direction) {
    
    vec3 ray = rayOrigin;
    float dist;
    float totalDist;
    
    for(int i = 0; i < steps; i++){
        dist = scene(ray);
        totalDist += dist;
        ray += dist * direction;
        
        if (dist < smallNumber) {
            vec3 normals = estimateNormal(ray);
            // vec3 col = vec3(noise(normals.xy * u_time), cos(normals.y), sin(normals.x+0.3) );
            return vec4(normals.gbr, 1.0);
           //return lighting(ray);
        }
        
    }
    vec3 background = vec3(0.0);
    return vec4(background, 1.0);
}

void main() {
    
    vec2 pos = 0.4*gl_FragCoord.xy / u_resolution;

    pos = (pos-.5)*1.1912+.5;
    if (u_resolution.y > u_resolution.x ) {
        pos.y *= u_resolution.y/u_resolution.x;
        pos.y -= (u_resolution.y*.5-u_resolution.x*.5)/u_resolution.x;
    } else {
        pos.x *= u_resolution.x/u_resolution.y;
        pos.x -= (u_resolution.x*.5-u_resolution.y*.5)/u_resolution.y;
    }
    
    vec3 camPos = vec3(0.0, 0.0, -10.0);
	vec3 rayOrigin = vec3(pos + camPos.xy, camPos.z + 0.5);
	vec3 camTarget = vec3(0.5, -0.8, 1.0);
	vec3 camOrigin = vec3(0, -0.2,-5);
	
	vec3 dir = lookAt(pos, camOrigin, camTarget);
	
	

    vec4 color = march(rayOrigin, dir);
    
    gl_FragColor = color;
    
    
}