
const int steps = 16;
float smallNumber = 0.5;
float maxDist = 1.;

// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d));
}

// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size, size) - size*0.5;
	return c;
}


float scene(vec3 pos){
    
    
    float ground = pos.y + 0.50 
                   + sin(pos.x * 10.)/10.
                   + cos(pos.z * 10.)/10.;
    

    pos = vec3(pos.x + sin(time * 2.), pos.y, pos.z + (sin(time/20.) + 1.));
    //vec3 pal = cosPalette(pos.x, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(2.0, 1.0, 0.0), vec3(0.50, 0.20, 0.25));
    vec3 pal = cosPalette(atan(time), vec3(0.5, smoothstep(0.5, 0.1, time), 0.5), vec3(0.5, 0.5, 0.5), vec3(2.0, 1.0, 0.0), vec3(0.50, step(0.20, tan(time)), 0.25));
    pMod3(pos, vec3(1.) / pal);
    
    float sphere = length(pos) - 1.;
    
    float torus = fTorus(pos, 0.1, 0.6);
    torus = length(torus);
    
    return mix(sphere,torus, ground);
    //return min(sphere, taurus);
}

float trace (vec3 rayOrigin, vec3 dir){
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    
    for (int i = 0; i < steps; i++){
        dist = scene(ray);
        ray = ray + (dist * dir);
        
        totalDist += dist;
        
        if (dist < smallNumber){
            // this line return the percent of maxDist that we trav;ed for this pixel
            // 
            return 1.0 - (totalDist/maxDist) * tan(ray.z * 20.);
        }
    }
    return 0.;
    
}

void main () {
    vec2 uv = uv();
    vec3 camOrigin = vec3(0,0,time);
    vec3 rayOrigin = vec3(uv + camOrigin.xy,camOrigin.z + 1.);
    
    vec3 dir = rayOrigin - camOrigin;
    
    vec3 pal1 = cosPalette(sin(time), vec3(0.5, smoothstep(0.5, 0.1, time), 0.5), vec3(0.5, 0.5, 0.5), vec3(2.0, 1.0, 0.0), vec3(0.50, step(0.20, tan(time)), 0.25));
    vec3 pal2 = cosPalette(atan(time), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(smoothstep(1.0, 0.4, uv.y), 1.0, 1.0), vec3(0.00, 0.10, 0.20));

    vec3 pal = mix(pal1, pal2, 0.5);
    vec3 color = vec3(trace(rayOrigin, dir) * pal);
    
	gl_FragColor = vec4(color, 0.5);
}

