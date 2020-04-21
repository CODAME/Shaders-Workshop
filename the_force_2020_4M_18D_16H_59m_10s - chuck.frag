float circ(vec2 position){
    float radius = 0.5;
    return length(position)-radius;
    
}

float sdHexagram( in vec2 p, in float r )
{
    const vec4 k = vec4(-0.5,0.86602540378,0.57735026919,1.73205080757);
    
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
    p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
    return length(p)*sign(p.y);
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
    
  
    
    position = position * 5.;
    position += 1.;
    
    pMod2(position, vec2(5.));
    pR(position,time*cos(1.));
    
    vec3 brightness = vec3(.5, -.23, .5);
    vec3 contrast = vec3(-.7,.1,.1);
    vec3 freq = vec3(1);
    vec3 where = vec3(1.);
    // float shape = circ(position);
    float shape = sdHexagram(position, .5);
    vec3 color = cosPalette(shape + time, brightness, contrast, freq, where);
    
    position = position - vec2(0.,1);

    // how to normalize resolution in other programs: uv.x = resolution.x/resolution.y;
    
    
    vec3 final = shape * color;
    
	gl_FragColor = vec4(final,1.0);
}

