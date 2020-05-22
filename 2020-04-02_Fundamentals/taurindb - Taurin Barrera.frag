// taurin barrera
// @myspacebooktube

float circ(vec2 position){
    float radius = 0.3;
    return length(position) - radius;
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    
    return a + b * cos(PI2*t*c+d);
}

 float sdEquilateralTriangle( in vec2 p ) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
    }

vec2 mousePos = ((mouse.xy/resolution)*2.0)-2.0;


void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

void main () {
    
    vec2 position = uv();
    
    position = position * 2.0 - vec2(0.0, 0);
    
    vec3 brightness = vec3(.2,.001,.2);
    vec3 contrast = vec3(0.4,1.0, .8); 
    vec3 freq = vec3(0.5);
    vec3 where = vec3(0);
    
    float shape = sdEquilateralTriangle (position*mousePos);

     
    vec3 color = cosPalette(shape * time, brightness, contrast, freq, where*time);
    
    float c = 1.0;
    
    //uv.x = uv(resolution.x/resolution.y);
    
    vec3 final = shape * color;

	gl_FragColor = vec4(final , 1.0);
}