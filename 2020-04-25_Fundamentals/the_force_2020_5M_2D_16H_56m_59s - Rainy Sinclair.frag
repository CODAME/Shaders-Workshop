const int steps = 32;
float smallNumber = .001;
float maxDist = 1.;
float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
float scene(vec3 pos){
    float ground = pos.y + .5
                    +sin(pos.x *10.)/ 10.
                    +sin(pos.z *10.) / 10. * sin(time/3.);
                    + cos(pos.x * 10.) / 10. * cos(time/5.);
    float ceiling = 1.;// +-.6*pos.y + sin(pos.x*4.)/4. + sin(pos.z*10.)/10. / 3. * sin(time*2.) ;
    pos = vec3(pos.x + sin(time),
                pos.y + cos(time)*.3, 
                (pos.z + (cos(time) + 6.) *.4)
            );                
    float s = length(pos) - .4;
    pos = vec3(cos(time/30.)*pos.x + sin(time) + cos(time),
                -1.*pos.y + cos(time*3.)*.3,
                -1.*(pos.z + (cos(time) + 6.) * .01)
            );                
    float s2 = length(pos) - .4;
    
    return min(min(ground,s), s2);
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
           return 1.1 - (totalDist / maxDist);
       }
    }
    return 0.1;
}

void main() {
    
    vec2 pos = uv();
    vec3 camOrigin = vec3(0,0, -1.);
	vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + .1);
	  
    vec3 dir = camOrigin + rayOrigin;
    vec3 color = vec3(trace(rayOrigin, dir));
    
    gl_FragColor = vec4(color, 1.);
    
    
}