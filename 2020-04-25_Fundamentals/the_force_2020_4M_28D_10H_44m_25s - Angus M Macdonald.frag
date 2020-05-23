float circ(vec2 p){
    return length(p) - .70;   
}

float sdCross( in vec2 p, in vec2 b, float r ) 
{
    p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
    
    vec2  q = p - b;
    float k = max(q.y,q.x);
    vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
    return sign(k)*length(max(w,0.0)) + r;
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
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

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
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
      vec2 st = gl_FragCoord.xy;
          float rnd = random (st);
          //rnd = cos(rnd);
          rnd = rnd+0.1;
    vec2 position = uv();
    position = position + vec2(cos(time*0.1),sin(time*0.1));

    pMod2(position, vec2(rnd));
    
    float shape = circ( position * vec2(3.0));
    float shape3 = sdCross(position, vec2(0.5,0.5), cos(time));
    position = position + vec2(cos(time),0);
    
    float shape2 = sdBox(position, vec2(0.1));
    shape = min(shape,shape);    
    shape = max(shape3, shape);
    //gl_FragColor = vec4(shape);
    
    vec3 col = cosPalette(1.,vec3(0.1),vec3(0.3),vec3(0.1,rnd,1),vec3(time*0.01,time*0.1,time*.2));
    
   // gl_FragColor = vec4(col,1.0);
    // lighting: darken at the center
     col = vec3(shape) / col;
     //gl_FragColor = vec4(col,1.0);
     
    // output: pixel color
    gl_FragColor = min(vec4( col.rgb, 0.9 ), vec4(0.5));
    // we take the min of the output color and a very light grey color because The Force makes 
    // all of their controls white at the bottom all white without any sort of outline, which is 
    //silly, so you can make it vec4(col.rgb,1.0) in other softwares or if you dont care 
    // about seeing the controls
}