float circ(vec2 p){
    return length(p) - 0.5;   
}

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( ( PI * 4.0) *(c*t+d) );
}


// Repeat space along one axis. Use like this to repeat along the x axis:
// <float cell = pMod1(p.x,5);> - using the return value is optional.
float pMod1(inout float p, float size) {
    float halfsize = size*0.5;
    float c = floor((p + halfsize)/size);
    p = mod(p + halfsize, size) - halfsize;
    return c;
}

float pModMirror1(inout float p, float size) {
    float halfsize = size*0.5;
    float c = floor((p + halfsize)/size);
    p = mod(p + halfsize,size) - halfsize;
    p *= mod(c, 2.0)*2.0 - 1.0;
    return c;
}


// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

float easeOutBounce(float x){
float n1 = 7.5625;
float d1 = 2.75;

if (x < 1. / d1) {
    return n1 * x * x;
} else if (x < 2. / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
} else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
} else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
}
}

float easeInOutBounce( float x) {
return x < 0.5 ? (1. - easeOutBounce(1. - 2. * x)) / 2. : (1. + easeOutBounce(2. * x - 1.)) / 2.;
}

void main()
{
    float v = 1.0;
    vec2 v2 = vec2(1,0);
    vec3 color = green;
    //gl_FragColor = vec4(color   ,v);
    //vec2 position = vec2( (uv().y/0.01), abs(mod(uv().y, 0.01)));
    
    //gl_FragColor = vec4(position, uv().y,0);
    //distance metric;
    vec2 position = uv();
    
    
    position = position + vec2( cos(time * .1) , 0);
    float shape = circ(position / vec2(bands[2] * 2.));
    
    position = uv() + vec2(bands[3] * .2, 0);
    
    
    
  // position = pMod2(position, vec2(1));
    pR(position, (bands[0]*.2) *  PI/1.1);
    
    
    float shape2 = abs(pModMirror1(position.x, 0.2110) * 1.2);
    
    
    
    
    //float shape = pMod1(position.x, 1.);
    //gl_FragColor = vec4(shape);
    shape = fract(shape) ;
    //shape2 = noise(shape2);
    shape = min(shape, fract(shape2));
    
    
    
    
    vec3 col = cosPalette(shape,vec3(0.5),vec3(0.5),vec3(1),vec3(time*0.01,time*0.1,time*.2));
    
    //col = col * voronoi(col);
    col = vec3(shape) * col;
    
    gl_FragColor = min(vec4(col, 1.0) /bands * vec4(.8) , vec4(0.8));

}