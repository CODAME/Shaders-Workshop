
// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 10.; // This is the maximum distance a ray can travel.
 
float scene(vec3 position){
    // So this is different from the sphere equation above in that I am
    // splitting the position into its three different positions
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    float sphere = length(
        vec3(
            position.x + cos(time * 400.)/20., 
            position.y, 
            position.z + (sin(time*0.5)+2.))
        )-0.9;
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground = position.y + sin(position.x * 12.) * time * 0.02 
                              + cos(position.z * 17.) / 11. + 0.5;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return min(sphere,ground);
}
 
float trace (vec3 origin, vec3 direction){
    
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
            return 1. - (totalDistance / maxDist);
 
        }
        
        if (totalDistance > maxDist){
 
            return 0.; // Background color.
        }
    }
    
    return 1.;// Background color.
    // return sin(time) + rand(0.3);
}
void main() {
    
    vec2 pos = uv();

    vec3 camOrigin = vec3(0,0,-1);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = rayOrigin + camOrigin;

    vec3 color = vec3(cos(trace(rayOrigin, dir)) * 0.9, sin(time), sin(trace(rayOrigin, dir)));
    
    gl_FragColor = vec4(color, 1.0);
}