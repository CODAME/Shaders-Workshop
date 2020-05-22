const int steps = 8;
float smallNumber = 0.001;
float maxDist = 2.;

float positionx(){
    return mouse.x/resolution.x;
}

float positiony(){
    return mouse.y/resolution.y;
}


float scene(vec3 pos) {
    float ground = pos.y + 0.50
                   + sin(pos.x * 10.)/10.
                   + tan(pos.z * 10.)/10.;
    pos = vec3(pos.x - positionx(), pos.y - positiony(), pos.z + (sin(time/2.) + 1.) * 0.4);
    float sphere = length(pos) - 0.4;
    return min(ground,sphere);
}

float trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    for (int i = 0; i < steps; i++) {
        dist = scene(ray);
        ray = ray + (dist * dir);
        totalDist += dist;
        if (dist < smallNumber) {
            return maxDist - (totalDist/maxDist);
        }
    }
    return 0.;
}

void main () {
    vec2 uv = uv();
    vec3 camOrigin = vec3(0,0,-1);
    vec3 rayOrigin = vec3(uv + camOrigin.xy,camOrigin.z+1.);

    vec3 dir = rayOrigin + camOrigin;

    vec3 color = vec3(trace(rayOrigin, dir));
    color.x = positionx();
    color.y = positiony();

    gl_FragColor = vec4(color, 1.0);
}