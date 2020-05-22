
// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 10.; // This is the maximum distance a ray can travel.

float scene(vec3 position){
    float sphere = length(
        vec3(
            position.x + cos(time*1.3)/2.5, 
            position.y, 
            position.z + (sin(time*1.3)+2.0))
        )-0.9;
    

    float ground = position.y + sin(position.x * -8.) / 4. 
                              + cos(position.z * -19.) / 3. + 0.9;

    return min(sphere,ground);
}
 
vec4 trace (vec3 origin, vec3 direction){
    
    float dist = 0.;
    float totalDistance = 0.;
    vec3 positionOnRay = origin;
    
    for(int i = 0 ; i < steps; i++){
        
        dist = scene(positionOnRay);

        positionOnRay += dist * direction;
        
        totalDistance += dist*3.0;
        
        if (dist < smallNumber){
            return 1. - (vec4(totalDistance, 5.3, 0.5, 1.) / maxDist);
        }
        
        if (totalDistance > maxDist){
            return vec4(1., 0.41, 0.71, 1.);
        }
    }
    
    return vec4(0.);
}
void main() {
    
    vec2 pos = uv();

    vec3 camOrigin = vec3(0,0,-1);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 0.9);
	vec3 dir = camOrigin + rayOrigin;

    vec4 color = vec4(trace(rayOrigin,dir));
    
    gl_FragColor = color;
}