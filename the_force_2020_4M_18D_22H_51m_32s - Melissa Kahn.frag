float circ(vec2 position){
    float radius = 0.5;
    return length(position)-radius;
    
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    
    return a+ b* cos(PI2*t*c + d);
    
}
void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}
void main () {
    
    vec2 position = uv();
    
  
    
    position = position * 2.;
    position += 1.;
    
    pMod2(position, vec2(2.,2.));
    
    pR(position,time*20.);
    
    vec3 brightness = vec3(0.2,0.03,0.01);
    vec3 contrast = vec3(0.4,0.5,0.8);
    vec3 freq = vec3(0.5);
    vec3 where = vec3(0.);
    float shape = circ(position);
    
    vec3 color = cosPalette(shape * time ,brightness,contrast,freq,where);
    
    position = position - vec2(0.,1) ;

    // how to normalize resolution in other programs: uv.x = resolution.x/resolution.y;
    
    
    vec3 final = shape * color;
    
    gl_FragColor = vec4(final * time,1.0);
}

