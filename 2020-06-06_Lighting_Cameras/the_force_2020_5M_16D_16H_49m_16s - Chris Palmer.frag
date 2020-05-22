const int steps = 16;
const float smallNumber = 0.001;
const float maxDist = 10.;
float scene (vec3 position){
    //position.x = sin(position.x);
    float sphere = sin(time*0.5  - 1.) + length(position);
    float ground = position.y 
        - sin(position.x*10.)/5.
        - cos(position.z *10.)/5.
        + sin(time)+1.5;
    return min(sphere, ground);
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
vec4 march(vec3 rayOrigin, vec3 dir){
    vec3 ray = rayOrigin;
    float dist;
    float totalDist;
    for(int i = 0; i < steps; i++){
        dist = scene(ray);
        totalDist += dist;
        if(dist < smallNumber){
            //return vec4(1. -(totalDist/maxDist));
            return vec4(estimateNormal(ray).rbg, 1.);
        }
        ray += dist *dir;
    }
    return  vec4(sin(rayOrigin.x+time), sin(rayOrigin.y+time), rayOrigin.z+sin(time*0.2), 0.0);
    //return vec4(black, 1.);
}


vec3 lookAt(vec2 pos, vec3 camOrigin, vec3 camTarget){
    vec3 up = vec3(0, 1, 0);
    vec3 zAxis = normalize(camTarget - camOrigin);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));
    float fov = .5;
    vec3 dir = normalize((xAxis * pos.x) + (yAxis * pos.y +(xAxis*fov)));
    return dir;
}
void main () {
    vec2 pos = uv();
    vec3 camPos = vec3(0., 0., -1.);
    vec3 rayOrigin = vec3(pos + camPos.xy, camPos.z+0.5);
    vec3 camTarget = vec3(0., sin(time*0.2), 0.);
    vec3 dir = lookAt(pos, camPos, camTarget);
    vec4 color = vec4(march(rayOrigin, dir));
    gl_FragColor = color;
}
