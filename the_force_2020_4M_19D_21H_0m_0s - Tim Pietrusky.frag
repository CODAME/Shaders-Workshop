float circ(vec2 position) {
    float radius = 0.5;
    return length(position) - radius;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}


vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(PI2 * t * c + d);
}

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

void main () {
    vec2 position = uv();
    
    vec3 brightness = vec3(0.4, .03, .01);
    vec3 contrast = vec3(.1, .8, .18);
    vec3 freq = vec3(.5, .25, .1);
    vec3 where = vec3(.0);
    
    // We are moving more far away from the screen to make it smaller
    position = position * 2.0;
    
    pMod2(position.yx, vec2(bands.x * 1.5));
    
   // float shape = circ(position);
   
   
    float shape = sdBox(position, vec2(2.0));
    shape = shape + fbm(uv(), 50) + (bands.z * 5.0);
    
    vec3 color = cosPalette(shape + bands.w, brightness, contrast, freq, where);
    
    pMod2(color.xy, vec2(bands.z * 1.5));
    
    //pMod2(position.yx, vec2(bands.x * 1.5));
    
    // Move it to the right
    //position = position - vec2(2.0, .0);
    
    // normalize the value
    // uv.x = resolution.x / resolution.y;

    vec3 final = shape * color;
    
	gl_FragColor = vec4(final, 1.0);
}