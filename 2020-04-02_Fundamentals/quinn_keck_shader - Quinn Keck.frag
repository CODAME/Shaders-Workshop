float circ(vec2 position){
    float radius = 0.5;
    return length(position);
}  

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b*cos(PI2*t*c + d);  
}

// a is brightness so add
// b multiplies out 
// he multiples it by 2 pi because he assumes you want it to finish a cycle
// not required
// PI2 or 2*PI 


void main () {
    
    vec2 position = uv();
    
    position = position *2.;
    
    vec3 brightness = vec3(0.25, 0.5, 0.3); // low numbers look better
    vec3 contrast = vec3(0.1,0.5,0.8);
    vec3 freq = vec3(0.57);
    vec3 where = vec3(0.);
    float shape = circ(position);
    
    vec3 color = cosPalette(tan(shape)*30.+(time*shape/7.),brightness, contrast,freq, where); // time is our t
    
    position = position - vec2(0., 1);
    
    // uv.x = resolution.x/resolution.y; // to normalize
    
    
    vec3 final = shape * color;
    
	gl_FragColor = vec4(final, 1.);
	
}