// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.01;
const float maxDist = 5.; // This is the maximum distance a ray can travel.
 
 
 // Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}


float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  float m = p.x+p.y+p.z-s;
  vec3 q;
       if( 3.0*p.x < m ) q = p.xyz;
  else if( 3.0*p.y < m ) q = p.yzx;
  else if( 3.0*p.z < m ) q = p.zxy;
  else return m*0.57735027;
    
  float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
  return length(vec3(q.x,q.y-s+k,q.z-k)); 
}

float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}

float unionSDF(float distA, float distB) {
    return min(distA, distB);
}

float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}

float scene(vec3 position){
    // So this is different from the sphere equation above in that I am
    // splitting the position into its three different positions
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    
    float shape = sdOctahedron(position, 0.2);
    vec3 spherepos =  vec3(
            position.x + cos(time)/10., 
            position.y, 
            position.z + (sin(time)+2.));
        
    pMod3(spherepos,vec3(3.0));
        
        
    float sphere = length(
        spherepos
    
       
        
        )-0.3;
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground = position.y + sin(position.x * 10.) / 10. 
                              + cos(position.z * 10.) / 10. + 1.;
    
    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    float addTwo = unionSDF(sphere,ground);
    return unionSDF(addTwo,shape);
}
 

vec4 scenecolor(vec3 position){
    // So this is different from the sphere equation above in that I am
    // splitting the position into its three different positions
    // and adding a 10th of a cos wave to the x position so it oscillates left 
    // to right and a (positive) sin wave to the z position
    // so it will go back and forth.
    float sphere = length(
        vec3(
            position.x + cos(time)/10., 
            position.y, 
            position.z + (sin(time)+2.))
        )-0.5;
    
    // This is different from the ground equation because the UV is only 
    // between -1 and 1 we want more than 1/2pi of a wave per length of the 
    // screen so we multiply the position by a factor of 10 inside the trig 
    // functions. Since sin and cos oscillate between -1 and 1, that would be 
    // the entire height of the screen so we divide by a factor of 10.
    float ground = position.y + sin(position.x * 10.) / 10. 
                              + cos(position.z * 10.) / 10. + 1.;
    
    vec3 sphere3d = hsv2rgb(vec3(sphere,0.5,0.5));
    // vec3 sphere3d = (vec3(sphere,sphere,sphere));
    vec3 ground3d = hsv2rgb(vec3(ground,0.5,0.5));
    // vec3 ground3d = (vec3(ground,0.0,0.0));

    // We want to return whichever one is closest to the ray, so we return the 
    // minimum distance.
    vec3 color = min(sphere3d,ground3d);
    return vec4(color.x,color.y,color.z,1.0);
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
            return 1. - (vec4(totalDistance) / vec4(maxDist));
 
        }
        
        if (totalDistance > maxDist){
 
            return vec4(0.); // Background color.
        }
    }
    
    return vec4(0.);// Background color.
}

 
vec4 trace3d (vec3 origin, vec3 direction){
    
    vec4 dist = vec4(0.);
    vec4 totalDistance = vec4(0.);
    vec3 positionOnRay = origin;
    
    for(int i = 0 ; i < steps; i++){
        
        dist = scenecolor(positionOnRay);
        
        // Advance along the ray trajectory the amount that we know the ray
        // can travel without going through an object.
        positionOnRay += dist.xyz * direction;
        
        // Total distance is keeping track of how much the ray has traveled
        // thus far.
        totalDistance += dist;
        
        // If we hit an object or are close enough to an object,
        if (length(dist) < smallNumber){
            // return the distance the ray had to travel normalized so be white
            // at the front and black in the back.
            return vec4(1.) - (vec4(totalDistance) / vec4(maxDist));
            // return dist;
 
        }
        
        if (length(totalDistance) > maxDist){
 
            return vec4(0.); // Background color.
        }
    }
    
    return vec4(0.);// Background color.
}


// Use this function to replace the defninition of dir to be able to look at the camera target
vec3 lookAt(vec2 uv, vec3 camOrigin, vec3 camTarget){
    vec3 zAxis = normalize(camTarget - camOrigin);
    vec3 up = vec3(0,1,0);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));
    
    float fov = 2.;
    
    vec3 dir = (normalize(uv.x * xAxis + uv.y * yAxis + zAxis * fov));
    
    return dir;
}


void main() {
    
    vec2 pos = uv();

float x = 0.0;
// x = sin(time/5.0);
    vec3 camOrigin = vec3(x,0,-1);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 dir = camOrigin + rayOrigin;
// 	dir = lookAt(pos, camOrigin, rayOrigin);

    vec4 color = vec4(trace(rayOrigin,dir));


    vec4 tracer = trace3d(rayOrigin,dir);
    // color = color* scenecolor(dir);
    // color = color* scenecolor(camOrigin);
    color = color* scenecolor(rayOrigin);
    
    //color = vec3(trace(rayOrigin, dir), .5, .5);
    //Matt I gotchu: https://gist.github.com/MatthewRayfield/41c9831884aaa7c5af33e0ea9c113793
    //about colouring, I just found this: http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/
    
    gl_FragColor = color;
    
    
}