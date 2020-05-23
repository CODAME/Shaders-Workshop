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


vec4 overlay () {
    vec2 f=uv();
	vec2 R = resolution * vec2(bands[3] * 0.0001);
    vec2 u = f+R;
         
    vec2 v = bands[0]*.1+u*.5;
    u = abs( u* mat2(cos( time*.1 + sin(v).x*cos(v).y + vec4(0,33,11,0) ) )) / R;
    
    return cos( vec4(0,1,2,0) + step(.001, u = min(u, u.y) - .1 ).x /.1 *u.x );
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
    
    
    pR(position, (bands[0]*.5) *  PI/1.1);
    
    
    float shape2 = abs(pModMirror1(position.x, 0.2110) * 1.2);
    
    shape = fract(shape) ;
    //shape2 = noise(shape2);
    shape = max(shape, fract(shape2));
    
    
    
    
    vec3 col = cosPalette(shape,vec3(0.5),vec3(0.5),vec3(1),vec3(time*0.01,time*0.1,time*.2));
    
    //col = col * voronoi(col);
    col = vec3(shape) * col;
    
    vec4 finalcol = min(vec4(col, 1.0), overlay());
    
    
    gl_FragColor = min(finalcol /bands * vec4(.8) , vec4(0.8));

}