const int steps = 16;
float smallNumber = 0.001;
float maxDist = 1.;

void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}

float scene(vec3 pos){

    float ground =  pos.y + 0.50
                    + sin(pos.x * 10.)/10.
                    + cos(pos.z * 10.)/10.;

    
    pos = vec3(pos.x + sin(time/2. * 2.), pos.y, pos.z + ((sin(time/2.) + 1.0)) * 0.4);

    
    // pMod3(pos, vec3(1.));
    pMod3(pos, vec3(2.));
    float sphere = length(pos) - 0.4;
    // float sphere = fTorus(pos, .5, 1.5);
   
    return min(sphere, ground);
}

float trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    
    for (int i = 0; i < steps; i++) {
        dist = scene(ray);
        ray = ray + (dist * dir);
        // totalDist = dist * float(i + 1);
        totalDist += dist;
        if (dist < smallNumber) {
            // return maxDist - (totalDist/maxDist);
            // return maxDist - totalDist/maxDist;
            return maxDist - totalDist/maxDist * tan(time/2.) + 0.5;
        }
    }
    return 0.;
}

void main() {
    vec2 uv = uv();
    pR(uv, time / 3.0);
    vec3 camOrigin = vec3(0., 15.0, time / 2.);
	vec3 rayOrigin = vec3(uv + camOrigin.xy, camOrigin.z + sin(time / 4.) + tan(time / 2.0));

    vec3 dir = rayOrigin - camOrigin;

    vec3 color = vec3(trace(rayOrigin, dir));
    
    gl_FragColor = clamp(vec4(color, 1.0), 0.0, 1.0);
    
    
}