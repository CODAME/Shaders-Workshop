const int steps = 100;
const float smallNumber = 0.001;
const float maxDist = 10.;

float scene (vec3 position){
    float sphere = length(position) - 0.4;
    float ground = position.y 
          - sin(position.x*10.)/5.
          - cos(position.z *10.)/ (sin(time/5.) - 1. )
          + .5;
    return min(sphere,ground);
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

// diverging from the checkpoint code
vec4 march(vec3 rayOrigin, vec3 dir){
    
    vec3 ray = rayOrigin;
    float dist;
    float totalDist;
    
    for(int i = 0; i < steps; i++){
        dist = scene(ray);
        totalDist += dist;
        if(dist < smallNumber){
            return vec4(estimateNormal(ray).brg,1.);
            
        }
        ray += dist * dir;
        
    }
    
    return vec4(black,1.0);
}

vec3 lookAt(vec2 pos, vec3 camOrigien, vec3 camTarget){
    vec3 up = vec3(0,1.0,0);
    vec3 zAxis = normalize(camTarget - camOrigien);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis,xAxis));
    float fov = 2. ;
    //float fov = sin(time);
    vec3 dir = normalize((xAxis * pos.x) + (yAxis * pos.y) + (zAxis * fov));
    return dir;
}

void main () {
    
    vec2 pos = uv();
    
    vec3 camPos = vec3(0.,0.,-1.);
    vec3 rayOrigin = vec3(pos + camPos.xy,camPos.z + 0.5);
    vec3 camTarget = vec3(0.,sin(time),0);
    vec3 dir = lookAt(pos,camPos,camTarget);
    
    vec4 color = march(rayOrigin, dir);
    
    gl_FragColor = color;
}

