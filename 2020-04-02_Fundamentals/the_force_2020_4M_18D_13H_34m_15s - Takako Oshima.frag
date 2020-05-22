float circ(vec2 position) {
    float radius = 0.8; 
    return length(position) - radius;
} 

float flower(vec2 position) {
    return pow(sin(circ(position)),2.);
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a+b*cos(PI2*t*c+d);
}

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

void main () {
    vec2 position = uv();
    position *= 2.;
    
    //pMod2(position, vec2(1.,2.));
    //pR(position,time*20.);
    position -= vec2(sin(time),cos(time));
    vec3 brightness = vec3(.02,.03,.01);
    vec3 contrast = vec3(.4,.5,.8);
    vec3 freq = vec3(.5);
    vec3 where = vec3(0.);
    
    vec3 color = cosPalette(noise(time), brightness, contrast, freq, where);
    
    float shape = circ(position);
    float shape2 = flower(position);
	vec3 final = shape * color;

	gl_FragColor = vec4(final,1.);
}