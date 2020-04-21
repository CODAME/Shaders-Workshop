float circ(vec2 position) {
    float radius = 0.5;
    return length(position) - radius/2.;
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(PI * 2.0 * t * c + d);
}

void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

void main () {
    vec2 position = uv();
    position = position;
    position += 5.;
    //pMod2(position, vec2(2., 5.));
    //pR(position, time);
    float k = kale(uv(), kale(uv(), .1));
    float v = fbm(0.01, 5);
    float x = bands.x/2.;
    vec3 brightness = vec3(0.4*v, 0.3*k, 9.*k); //a
    vec3 contrast = vec3(v, k, .45); //b
    vec3 freq = vec3(.5*v*20.); //c
    vec3 phaseShift = vec3(10.*v); //d
    float shape = circ(position);    
    vec3 color = cosPalette(time*shape, brightness, contrast/shape, freq, phaseShift);
    
    
    position = position - vec2(5., 1.);
    // if we want smaller circle, uv needs to be a bigger range
    
    vec3 final = vec3(shape) * color;
	gl_FragColor = vec4(final, 1.);
}