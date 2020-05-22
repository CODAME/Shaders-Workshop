/*

I added the kale function to the sphere, nad voroni to the ground.

Also put some band to respond to the microphone.

Mustafa (f00f.live)

*/

const int steps = 20;
float smallNumber = 0.001;
float maxDist = 1.;

float scene(vec3 pos){
    
    float ground = pos.y + 0.50
                    + sin(pos.x * 10.)/10.
                    + sin( (5.0+bands.z/1000.) *time + pos.z * 10.)/10.;
                    
    
    // sphere
    //pos = vec3(pos.x + sin(time*2.), pos.yz);
    float sphere = length(pos) -  kale(vec2(pos.x, pos.y), 0.7) * 2. * bands.z;
    // sphere +=);
    
    float v = voronoi(pos.xy*vec2(tan(time/5.)));
    ground += v*1.;
    return min(ground, sphere);
   

}

vec4 trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    
    for (int i=0; i < steps; i++) {
        dist = scene(ray);
        ray = ray + (dist * dir);
        totalDist += dist;
        if (dist < smallNumber) {
            // return totalDist/maxDist;
            return vec4(maxDist - totalDist/maxDist, bands.y, bands.x, 0.);
        }
    }
    
    return vec4(0.);
}


void main() {
    
    vec2 uv = uv();
    gl_FragCoord.x;

    // z goes away from camera
    vec3 camOrigin = vec3(0,-0.3,-1.);
	vec3 rayOrigin = vec3(uv + camOrigin.xy, camOrigin.z+1.);

    vec3 dir = rayOrigin + camOrigin;
    
    // vec4 color = vec4(trace(rayOrigin, dir));
    vec4 color = trace(rayOrigin, dir);
    
    //= vec4 color = vec4(scene(rayOrigin));
    
    gl_FragColor = color;
    
    
}

