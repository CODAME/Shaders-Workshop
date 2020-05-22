// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 10.; // This is the maximum distance a ray can travel.

// Repeat in three dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}


float sdHexPrism( vec3 p, vec2 h )
{
  const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
  p = abs(p);
  p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
  vec2 d = vec2(
       length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x), h.x))*sign(p.y-h.x),
       p.z-h.y );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
 
float scene(vec3 position){
                      
    vec2 dPos = vec2(position.x, position.y);                           
    // Repeat in two dimensions
    pMod2(dPos, vec2(2.));
    position.x = dPos.x;
    position.y = dPos.y;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    //return min(sphere,ground);
    
    return sdHexPrism(vec3(
        position.x+snoise(vec2(time/3., position.x)), 
        position.y+snoise(vec2(time/4., position.y)), 
        position.z), 
        vec2(.2, bands.x*10.));
}
 
vec4 trace (vec3 origin, vec3 direction){
    
    float dist = 0.;
    float totalDistance = 0.;
    vec3 positionOnRay = origin;
    
    for(int i = 0 ; i < steps; i++){
        
        dist = scene(positionOnRay);
        
        // Advance along the ray trajectory the amount that we know the ray
        // can travel without going through an object.
        positionOnRay += dist * direction;
        
        // Total distance is keeping track of how much the ray has traveled
        // thus far.
        totalDistance += dist;
        
        // If we hit an object or are close enough to an object,
        if (dist < smallNumber){
            // return the distance the ray had to travel normalized so be white
            // at the front and black in the back.
            return 1. - (vec4((totalDistance / maxDist), .5, .0, 1.));
 
        }
        
        if (totalDistance > maxDist){
 
            vec4(0.2, noise(origin/.3+cos(time)), 1., .5); // Background color.
        }
    }
    
    return vec4(noise(origin/.2+sin(time/2.)), 0.2, 0.5, .5);// Background color.
}
void main() {
    
    vec2 pos = uv();

    vec3 camOrigin = vec3(0,0,-1);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(trace(rayOrigin,dir));
    
    gl_FragColor = color;
    
    
}