float circ(vec2 p){
    return length(p) - 0.5;   
}

float sdPentagon( in vec2 p, in float r )
{
    const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    return length(p-vec2(clamp(p.x,-r*k.z,r*k.z),r))*sign(p.y-r);
}

// Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
float pModPolar(inout vec2 p, float repetitions) {
    float angle = 2.*PI/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    float c = floor(a/angle);
    a = mod(a,angle) - angle/2.;
    p = vec2(cos(a), sin(a))*r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.)) c = abs(c);
    return c;
}

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

// Same, but mirror every second cell so they match at the boundaries
float pModMirror1(inout float p, float size) {
    float halfsize = size*0.5;
    float c = floor((p + halfsize)/size);
    p = mod(p + halfsize,size) - halfsize;
    p *= mod(c, 2.0)*2. - 1.;
    return c;
}


float sdCross( in vec2 p, in vec2 b, float r ) 
{
    p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
    
    vec2  q = p - b;
    float k = max(q.y,q.x);
    vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
    return sign(k)*length(max(w,0.0)) + r;
}

void main()
{
    // VEC review
    // float v = 0.0;
    // vec2 v2 = vec2(0.7, 0.1);
    // vec3 v3 = vec3(0,0,0);
    // gl_FragColor = vec4(v3, 1.0);
    
    
    //vec2 position = (uv() + 1.) / 2.0;
    //vec2 position = uv();
    
    //gl_FragColor = vec4(position, mouse.x / resolution.x, 1.);
    
    // gl_FragColor = vec4(black, 1.0);
    
    
    // distance metric
    vec2 position = (uv() + vec2(sin(time), 0));
    pMod2(position, vec2(2.0));
    //pModPolar(position, 10.);

    float shape = sdPentagon( position * vec2(3.0), 0.9);
    float shape2 = circ((uv() + vec2(0, cos(time))) * vec2(3.0));
    //float shape3 = sdCross(uv(), uv() + vec2(0.1, 0.1), .1);
    
    // gl_FragColor = vec4(shape);
    shape = min(shape, shape2);
    
    vec2 m = mouse.xy / resolution.xy;
    
    //vec3 col = cosPalette(0.5,vec3(m.x),vec3(m.y),vec3(0.6),vec3(time*0.01,time*0.1,time*.2));    
    vec3 col = cosPalette(shape*shape*shape*shape,vec3(0.3),vec3(0.7),vec3(0.6),vec3(time*0.01,time*0.1,time*.2));
    // gl_FragColor = vec4(col, 1.0);
    
    // lighting: darken at the center
    col = vec3(shape) * col;
    gl_FragColor = vec4(col, 1.0);
    
    // output: pixel color
    //gl_FragColor = min(vec4( col.rgb, 1.0 ), vec4(0.8));
    // we take the min of the output color and a very light grey color because The Force makes 
    // all of their controls white at the bottom all white without any sort of outline, which is 
    // silly, so you can make it vec4(col.rgb,1.0) in other softwares or if you dont care 
    // about seeing the controls
}