float circ(vec2 position) {
    float radius = 0.5;
    return length(position) - radius;
    
}

float sdEquilateralTriangle( in vec2 p )
{
    const float k = sqrt(3.0);
    
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b / cos(PI2*t*c + d);
}

void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*1.,size) - size*0.5;
    return c;
}

void main () {
    
    vec2 position = uv();
    
    // position = position * 2. * time;
    position = position * 2. * time;
    pMod2(position, vec2(2.,2.));

    pR(position,time*0.5);
    
    vec3 brightness = vec3(0.2,0.03,0.01);
    vec3 contrast = vec3(0.4,0.5,0.9);
    vec3 freq = vec3(0.1);
    vec3 where = vec3(0.);
    
    vec3 color = cosPalette(time, brightness, contrast, freq, where);
    
    vec2 mousePos = ((mouse.xy/resolution)*2.0)-2.0;
    
    position = position - vec2(0.,1) * -mousePos;
    
    float shape = circ(position);
    float shape2 = sdEquilateralTriangle(position);
    
    vec3 final = shape * color * shape2 * shape2;
    
	gl_FragColor = vec4(final,1.0);
}

// audio
// bands.a, bands.x, bands.y

