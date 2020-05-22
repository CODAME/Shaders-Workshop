float circ(vec2 position) {
    float radius = 2.5;
    return length(position) - radius;
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
    position += 4.;
    //pMod2(position, vec2(2., 5.));
    //pR(position, time);
    float k = kale(uv(), kale(uv(), .1));
    float v = fbm(0.01, 5);
    vec3 brightness = vec3(0.05*v, .9*k, v*.7); //a
    vec3 contrast = vec3(v*.5, k*.9, 0.2); //b
    vec3 freq = vec3(.5*v*2.); //c
    vec3 phaseShift = vec3(1.*v); //d
    float shape = circ(position);    
    vec3 color = cosPalette(time*shape*shape, brightness, contrast/shape, freq, phaseShift);
    
    
    position = position - vec2(2., .5);
    // if we want smaller circle, uv needs to be a bigger range
    
    vec3 final = vec3(shape) * color * 10.;
	gl_FragColor = vec4(final, 5.);
}