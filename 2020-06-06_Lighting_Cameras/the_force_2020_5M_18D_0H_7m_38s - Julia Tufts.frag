
// Define some constants
const int steps = 128; // This is the maximum amount a ray can march.
const float smallNumber = 0.001;
const float maxDist = 10.; // This is the maximum distance a ray can travel.
 
float scene(vec3 position){
    float sphere = length(
        vec3(
            position.x + cos(time + PI)*3., 
            position.y - 2., 
            position.z + sin(time + PI)*3. - 2.)
        ) + snoise(position) - 1.;
    float sphere2 = length(
        vec3(
            position.x + cos(time)*3., 
            position.y - 2., 
            position.z + sin(time)*3. - 2.)
        ) + snoise(position) - 1.;
    
    float ground = position.y + sin(position.x * 10. + time*2.) / 10. 
                              + cos(position.z * 10. + time*2.) / 10. + 1. + snoise(position);
                              
    return min(sphere2, min(sphere,ground));
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
    vec3 lightPos = vec3(cos(time),0,-1);
    vec3 normal = estimateNormal(pos);
    float mag = dot(normal,lightPos);

    return (1. - mag) * vec4(normal.rbg, 1.);
}
 
 
vec4 trace (vec3 origin, vec3 direction){
    
    float dist = 0.;
    float totalDistance = 0.;
    vec3 positionOnRay = origin;
    
    for(int i = 0 ; i < steps; i++){
        
        dist = scene(positionOnRay);
        positionOnRay += dist * direction;
        totalDistance += dist;

        if (dist < smallNumber){
            return lighting(-positionOnRay);
        }
        
        if (totalDistance > maxDist){
            return vec4(0.);
            return lighting(positionOnRay);
        }
    }
    
    return vec4(0.);
}

vec3 lookAt(vec2 uv, vec3 camOrigin, vec3 camTarget){
    vec3 zAxis = normalize(camTarget - camOrigin);
    vec3 up = vec3(0,1,0);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));
    
    float fov = 2.;

    vec3 dir = (normalize((uv.x * xAxis) + (uv.y * yAxis) + (zAxis * fov)));
    
    return dir;
}

void main() {
    
    vec2 pos = uv();

    vec3 camOrigin = vec3(0,2., -5.);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
	vec3 target = vec3(0,1.5,0);
	vec3 dir = lookAt(pos,camOrigin, target);
    vec4 color = vec4(trace(rayOrigin,dir));
    
    gl_FragColor = color;
    // gl_FragColor = vec4(0.);
    
}