// float circ(vec2 p){
//     return length(p) - 0.5;   
// }

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
// vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
// {
//     return a + b*cos( 6.28318*(c*t+d) );
// }

float circ(vec2 position) {
    float radius = 0.5;
   return length(position) - radius;
   //return position.y; // plane or floor
}

vec3 cosPallette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b*cos(PI2*t*c + d);
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}

void main()
{
   // gl_FragColor = vec4(uv(),0.2,1.0);
   vec2 position = uv();
   
    position = position*20.;
    
    vec3 brightness = vec3(0,0.3,0.1);
    vec3 contrast = vec3(1,0,0.8);
    vec3 freq = vec3(2000);
    vec3 where = vec3(0.0);
    
    pMod2(position,vec2(10,100));
    
    float shape = circ(position) + bands.x + bands.y + bands.z;
    
    vec3 colour = cosPallette(shape, brightness, contrast, freq, where);
    
//   position = position - vec2(0.,1.);
  
   vec3 final = shape * colour;
   
   gl_FragColor = vec4(final,1.);
}