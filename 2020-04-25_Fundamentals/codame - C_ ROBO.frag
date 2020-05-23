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

float pModMirror1(inout float p, float size) {
    float halfsize = size*0.5;
    float c = floor((p + halfsize)/size);
    p = mod(p + halfsize,size) - halfsize;
    p *= mod(c, 2.0)*2. - 1.;
    return c;
}


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



void main()
{
    //gl_FragColor = vec4(black,1.0);
    
    // VEC review 
    // float v = 0.50;
    
    // vec2 v2 = vec2(0.2,0.4);
    
    // vec3 v3 = vec3(v2,0.3);
    
    // gl_FragColor = vec4(v3,v);
    
    // moving UV position
   // vec2 position = (uv() + 1.)/2.0 ;
    //gl_FragColor = vec4(position,0,1.);
    
    
    // distance metric
    vec2 position = uv();
    position = position + vec2(sin(time),0.25);
    
    position = position * pModPolar(position,7.);
    
    // position = vec2(pModMirror1(position.y,5.0));
    
    float shape = circ( position * vec2(3.0));
    
    // position = position + vec2(cos(time),0);
    
    // float shape2 = sdBox(position, vec2(0.1));
    // shape = min(shape,shape2);    
    
    // // gl_FragColor = vec4(shape);
    
    // vec3 col = cosPalette(0.5,vec3(0.1),vec3(0.3),vec3(1),vec3(time*0.00001,time*0.0001,time*.002));
    
    vec3 col = vec3(1.0);
    
   // gl_FragColor = vec4(col,1.0);
    // lighting: darken at the center
    col = vec3(shape) * col;
    gl_FragColor = vec4(1.0 - col,1.0);
     
    // output: pixel color
    //gl_FragColor = min(vec4( col, 1.0 ), vec4(0.8));
    // we take the min of the output color and a very light grey color because The Force makes 
    // all of their controls white at the bottom all white without any sort of outline, which is 
    // silly, so you can make it vec4(col.rgb,1.0) in other softwares or if you dont care 
    // about seeing the controls
}