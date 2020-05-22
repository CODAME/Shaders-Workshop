float circ(vec2 position) {
    
    float radius = 0.5;
    return length(position) - radius;
    
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(PI2 * t * c + d);
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*43758.5453123);
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

void main () {
    vec2 position = uv();
    
    vec3 brightness = vec3(0.1, 0.2, 0.01);
    vec3 contrast = vec3(0.4, 0.9, 0.8);
    vec3 freq = vec3(0.5);
    vec3 phase = vec3(0.);
    
    float shape = circ(position);
    vec3 color = cosPalette(kale(position, time), brightness, contrast, freq, phase);
    
    vec3 final = shape * color;
	gl_FragColor = vec4(final, 1.0);
}