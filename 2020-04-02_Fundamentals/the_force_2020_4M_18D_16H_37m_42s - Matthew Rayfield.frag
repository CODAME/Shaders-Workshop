float circ(vec2 position) {
    float radius = 0.5;
    return length(position) - radius;
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(PI2 * t * c + d);
}

void main() {
    float c = 1.;
    vec4 v4 = vec4(2., 2., .2, 1.);
    
    vec2 position = uv();
    position *= 2.;// * sin(time*5.);
    
    vec3 brightness = vec3(.6, .4, .01);
    vec3 contrast = vec3(.4, .5+(sin(time)), .2);
    vec3 freq = vec3(.5);
    vec3 where = vec3(0.);
    
    float shape = circ(position);
    
    //vec3 color = cosPalette(time*(0.001*sin(time*3.)+(0.010*mouse.x/resolution.x)) / shape, brightness, contrast, freq, where);
    //vec3 color = cosPalette(time*(0.001*sin(time*3.)+(0.010*mouse.x/resolution.x)) / shape, brightness, contrast, freq, where);
    vec3 color = cosPalette(time*(0.001*sin(time*3.)+(0.010*mouse.x/resolution.x)) / shape, brightness, contrast, freq, where);
    
    vec3 final = vec3(shape) * color;
    
    //gl_FragColor = vec4(uvN()+mod(time/2., 1.), 1.0+(shape*2.), 1.0);
    gl_FragColor = vec4(final, 1.0);
}