
const int steps = 20;
const float smallNumber = 0.001;
float maxDist = 1.0;

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}



// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
	vec2 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5,size) - size*0.5;
	return c;
}

vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return fbm(vec2(length(p.xz) - largeRadius, p.y),9) - smallRadius;
}


float scene(vec3 pos) {
//  float sphere = length(
//         vec3(
//             pos.x + cos(time)/10., 
//             pos.y, 
//             pos.z+ sin(time) +1.)
//         )-0.5;
 //pos = vec3(pos2.x, pos.y, pos2.y);
 // pMod3(pos, vec3(0.1));
 float ground = pos.y + 0.9; //  + sin(pos.x * 10.0) / 20.0 + cos(pos.z * 30.0) / 10.0 + 1.0;


pos.y += sin(time * 0.2);
pos.x += cos(time * 0.2);
// pMod2(pos.xy, vec2(0.7));


//float sphere = fbm(length(pos) - 0.4, 10);
  pMod3(pos, vec3(1., 1.5, 1.));
 //float sphere = fbm(vec3(pos.x + sin(time), pos.y +0.23, pos.z), 10) - 0.5;
 //sphere = fbm(sphere*10., 10);
 // Repeat in two dimensions
 
 float torus = fTorus(pos+0.15, 0.3+sin(time)*0.05, 0.1);
 //torus = fbm(torus, 5);

 //sphere = mod(sphere, 0.2);
 //sphere = mod(sphere, 6.0);
 // return min(min(10000., ground), torus);
 return min(torus, ground);
 
}

float trace(vec3 origin, vec3 direction) {
    vec3 ray = origin;
    float dist = 0.; // This could also be unitialized.
    float totalDist = 0.;
    for (int i = 0; i < steps; i++) {
        dist = scene(ray);
        ray += dist * direction;
        totalDist += dist;
        if (dist < smallNumber) {
            
            
            return maxDist - totalDist / maxDist;
            //return vec4(1., 1., 1., 1.);
        }
    }
    return noise(ray);
    //return fbm(origin+time*0.1 ,1)*1.0;
}



void main() {
    vec2 pos = uv();
    pos.x = mod(sin(pos.x*2.), 0.8);
    //pos.y = mod(pos.y, 2.0);
    vec3 camOrigin = vec3(0., 0., -1.3);
    vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.6);
    vec3 dir = camOrigin + rayOrigin;
    
     vec3 ca = vec3(0.6, 0.2, 0.5);
    vec3 cb = vec3(0.9, noise(time*0.1), 0.4);
    vec3 cc = vec3(0.22, 0.9, 0.2);
    vec3 cd = vec3(0.6, 1.2, 0.6);
    
    float gray = trace(rayOrigin, dir);
    //gray = gray + fbm(gray, 10) * -0.2;
    
    vec3 color = cosPalette(gray, ca, cb, cc, cd);
    gl_FragColor = vec4(color, 1.0);
}