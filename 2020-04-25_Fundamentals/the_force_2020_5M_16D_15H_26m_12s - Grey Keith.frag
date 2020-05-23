const int steps = 32;
const float minDist = 0.001;
const float maxDist = 50.;

float sphere(vec3 position) {
    float radius = .4;
    
    return length(position) - radius;
}

float ground(vec3 position) {
    // this sin makes the floor wavy
    return position.y
    - (sin(position.x * 10.) * .1 + sin(position.x + time))
    - (cos(position.z * 10.) * .1 + sin(position.z + time))
    + 1.;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float scene(vec3 rayOrigin) {
    float sphereDist = sphere(rayOrigin);
    float groundDist = ground(rayOrigin);
    return smin(sphereDist, groundDist, 0.5);
}

vec3 estimateNormal(vec3 p) {
    vec3 n = vec3(
    scene(vec3(p.x + minDist, p.yz)) -
    scene(vec3(p.x - minDist, p.yz)),
    scene(vec3(p.x, p.y + minDist, p.z)) -
    scene(vec3(p.x, p.y - minDist, p.z)),
    scene(vec3(p.xy, p.z + minDist)) -
    scene(vec3(p.xy, p.z - minDist))
);
// poke around the point to get the line perpandicular
// to the surface at p, a point in space.
return normalize(n);
}

vec3 lighting(vec3 pos) {
    vec3 lightPos = vec3(cos(time), 0, sin(time));
    
    vec3 normal = estimateNormal(pos);
    float mag = dot(normal, lightPos);
    
    return vec3(mag);
}

vec4 color(vec3 pos) {
    return vec4(estimateNormal(pos), 1.0);
}

vec4 march(vec3 rayOrigin, vec3 rayDirection) {
    float dist = 0.;
    float totalDist = 0.;
    vec3 rayPos = rayOrigin;

    for(int i = 0; i< steps; i++) {
        dist = scene(rayPos);
        rayPos += dist * rayDirection;
        totalDist += dist;
        
        if (dist < minDist) {
            return vec4(lighting(rayPos), 1.) * color(rayPos);
            return vec4(estimateNormal(rayPos), 1.);
            return vec4(1. - totalDist / maxDist);
        }
        
        if (totalDist > maxDist) {
            return vec4(black, 1.);
        }
    }
    
    return vec4(black, 1.0);
}

vec3 lookAt(vec2 pixelPos, vec3 camOrigin, vec3 camTarget) {
    // cross product: given 2 axes, returns the 3rd axis perpendicular
    // if you define an x axis with a vec3 and a y axis with a vec, it'll return the z axis
    // get our z axis the same we we get the rayDir going straight out from camera
    vec3 up = vec3(sin(time),1,sin(time * 1.1));
    vec3 zAxis = normalize(camTarget - camOrigin);
    // cross product of two vectors produces a third vector that is 
    // orthogonal to the first two (if you were to make a plane
    // with the first two vectors the third is perpendicular to that
    // plane. Which direction is determined by the 'right hand rule'
    // It is not communicative, so the order here matters.
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));
    // normalizing makes the vector of length one by dividing the
    // vector by the sum of squares (the norm).
    float fov = sin(time * 0.4) + 2.;
    
    vec3 dir = normalize((xAxis * pixelPos.x) + (yAxis * pixelPos.y) + (zAxis * fov));
    
    return dir;
}

void main () {
    // char says "you never really understand math, you just get used to it"
    // get pos, uv() is built into The_Force, return -1 <-> 1;
    vec2 pos = uv();
    vec3 camPos = vec3(cos(time *1.1), cos(time) + 0.5, sin(time)* 2. - 5.);

    vec3 camTarget = vec3(cos(time), sin(time), 0.);
    vec3 rayDir = lookAt(pos, camPos, camTarget);
    
    
    vec4 color = vec4(march(camPos, rayDir));
    
	gl_FragColor = vec4(color);
}