
// Define some constants
const int steps = 14; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 2.; // This is the maximum distance a ray can travel.
const float distThresh = 0.001;

#define PHI 1.618033988749894848204
#define PI 3.1415

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}
 
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
 
float scene(vec3 pos){
    // So this is different from the prev sphere equation in that I am
    // splitting the position into it's three different parts
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    
        
    float ground = pos.z + 0.6
        + sin(pos.x* 40. )/10. + cos(time*pos.y*0.004+pos.z*30.)/10.;

    pos = vec3(pos.x, pos.y+cos(time*0.3)*0.5, pos.z+1.+ sin(time*0.3*2.)*0.5);
    
    pos.y += time*0.1;
    pos.xy = fract(pos.xy * 2.)*2.-1.;
    
    float sphere = length(pos)-0.35;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return smin(ground,sphere, 1.8);
}

float trace( vec3 rayOrigin, vec3 dir ){
    
    vec3 ray = rayOrigin;
    float totalDist = 0.0;
    
    
    for(int i=0; i<steps; i++){
        
        float dist = scene( ray );
        ray = ray + (dist*dir*1.);
        totalDist += dist;
        
        if( dist < distThresh){
            return 1.0-totalDist/maxDist;
        }
    }
    
    return 0.;
}
 
void main() {
    
    vec2 uv = uv();

    vec3 camOrigin = vec3(0, 0, -1.);
	vec3 rayOrigin = camOrigin + vec3(uv, 1.0);
    vec3 dir = rayOrigin + camOrigin;

    float dist = trace(rayOrigin, dir);
    dist = pow( dist, 3.5 );
    vec4 color = vec4(dist);
    
    gl_FragColor = color;
    
    
}