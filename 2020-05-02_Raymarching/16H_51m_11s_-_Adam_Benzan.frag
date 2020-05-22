const int steps = 18;
const float smallNumber = 0.0001;

float scene(vec3 pos) {
    float s = length(vec3(sin(pos.x + time), cos(pos.y + time), sin(pos.z + time))) - 0.4;
    float ground = sin(pos.y)
    + sin(pos.x * 10.) / 10.
    + cos(pos.z * 10. - time * 5.) / 10.
    + 0.5;
    return min(s, ground);
}

float trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.;
    float total = 0.;
    float maxDist = 5.;
   
    for (int i = 0; i < steps; i++) {
        dist = scene(ray);
        ray = ray + dist + dir;
        total += dist;
        if (dist < smallNumber) {
            return 0.7 - total / maxDist;
        }
    }
    return 0.;
}

void main () {
    vec2 pos = uv();
    vec3 camOrigin = vec3(0., 0., -1.);
    vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
    vec3 dir = camOrigin + rayOrigin;
   
    vec3 color = vec3(0.01, 0.5, 0.75) * vec3(trace(rayOrigin, dir));
gl_FragColor = clamp(vec4(color, 1.0), 0., 0.9);
}
