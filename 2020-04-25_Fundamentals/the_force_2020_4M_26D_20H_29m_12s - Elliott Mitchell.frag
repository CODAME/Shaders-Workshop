float circ(vec2 p){
    return length(p) - .50;   
}

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
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


// Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
float pModPolar(inout vec2 p, float repetitions) {
    float angle = 2.0*PI/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    float c = floor(a/angle);
    a = mod(a,angle) - angle/2.;
    p = vec2(cos(a), sin(a))*r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.0)) c = abs(c);
    return c;
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

float sdPentagon( in vec2 p, in float r )
{
    const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    return length(p-vec2(clamp(p.x,-r*k.z,r*k.z),r))*sign(p.y-r);
}




void main()
{

    vec2 position = uv();
    vec2 stN = uvN();
    float theta = atan(position.x, position.y)/PI2 +.5; float phi = log(length(position)) * .5;
    vec3 c = black;

    float d = phi * voronoi(rotate(position, vec2(0., sin(time * .3)), time * .1) *1.) - time * 1. + bands.x;
    c = sin( d * 9. + bands.y * orange);

    vec3 bb = texture2D(backbuffer, stN).rgb;
    
    float y = snoise(position * mod(time * .33, 1.) );

    pMod2(position, vec2(10, (cos(time) *71.)));
    pMod2(position, vec2(-.33, (cos(time) *2.)));
    pMod2(position, vec2(31., (sin(time) * -7.)));

    float shape = circ( position * vec2(23));
    float shape1 = pModPolar( position, sin(time)*1.);
  
    position = (position * (position * -.45) * 2.);
    
    float shape2 = sdBox(position, vec2(0.1));
    
    shape = (((shape * shape2) * 10.) * (cos(time *(cos(time * .001)))));
    
    float shape3 = pModMirror1(shape, sin(time) * .044);
    float  shape4 = sdPentagon((position - 50.), cos (time) + 10.);
    
    shape = ((max(shape2, shape4) * (min (shape, shape2)) * cos(time)) - (shape2 * shape) * .01);
    
    float shape5 = sdEquilateralTriangle(-position - .1);
    
    shape = (shape * (shape2 * shape5) - cos(time));
    shape = (((shape3  * cos(time)) * shape3) * -shape3) - shape4;

    vec3 col = cosPalette(0.5,vec3(300, -position),vec3(.01),vec3(.001),vec3(time*0.01,time*0.1,time* -.1));
    col = vec3(shape2 * -shape3);
    col = col * vec3 (0.01, -0.02,-.4);
    col = col * vec3 (-0.01, -0.01, -.4);
    col = col * -smoothstep((time* -1.), 1., (sin(time) * 0.1));
    col =  min (vec3((col.z * .4), col.x, -.1), voronoi (col));
    col = mix (voronoi (-col), vec3(col.x, col.y, col.x), .3);
    col = col * vec3 (((col.x / col.z) / col.y), .1, 0);
    col = col * vec3(col * (black + .01));
    
    gl_FragColor = vec4((col * c),1.0);
     
    
}