// Define some constants
const int steps = 100; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 10.; // This is the maximum distance a ray can travel.

// cosine based palette, 4 vec3 params
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
 
float scene(vec3 position){
    // So this is different from the sphere equation above in that I am
    // splitting the position into its three different positions
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    float sphere = fbm(
        vec3(
            position.x + sin(time*.05), 
            position.y + cos(time*.5), 
            position.z + time*.5+1.0), 3
        )-sin(time*.3)*.1-.3;
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    //float ground = position.y + sin(position.x * 5.) / 10. 
    //                          + cos(position.z * 10.) / 10. + 1.0;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    return sphere;
}
 
 // Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
float pModPolar(inout vec2 p, float repetitions) {
    float angle = 2.0*PI/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    float c = floor(a/angle);
    a = mod(a,angle) - angle/2.;
    p = vec2(cos(a), sin(a))*r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.0)) c = abs(c);
    return c;
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
            return 1.0 - vec4(totalDistance / maxDist);
 
        }
        
        if (totalDistance > maxDist){
 
            return vec4(0.); // Background color.
        }
    }
    
    return vec4(0.);// Background color.
}
void main() {
    
    vec2 pos = uv();
    
    //pModPolar(pos,4.0);
    
    vec3 camOrigin = vec3(0,0,-1);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = rayOrigin - camOrigin;
	
	vec4 dist = trace(rayOrigin,dir);
    //palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
    vec4 color = vec4(palette(dist.x, vec3(.5),vec3(.5),vec3(1.0),vec3(0.0,.33,.67)), dist.yzw);
    
    gl_FragColor = color;
    
    
}