float circ(vec2 position) {
    float radius = 0.5;
    
    return length(position) - radius;
}

float sdCircle( vec2 p, float r )
{
  return length(p) - r;
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(PI2 * t * c + d);
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
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


void main () {
    vec2 pos = uv();
    
    vec3 brightness = vec3(.2,.03,.01);
    vec3 contrast = vec3(.4, 0.5, 0.8);
    vec3 freq = vec3(.5,.5,.5);
    vec3 phase = vec3(1.2);

    float shape = sdCircle(pos, sin(time));
    float shape2 = sdEquilateralTriangle(pos);

    vec3 color = cosPalette(shape + shape2 + time + random(pos), brightness, contrast, freq, phase);
    vec3 final = shape * color;
    
	gl_FragColor = vec4(final, 1.0);
}