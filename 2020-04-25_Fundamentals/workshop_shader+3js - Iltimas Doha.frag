float circ(vec2 p){
    return length(p);   
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

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}


void main()

{
    float v=0.5;
    float xoff=cos(time);
    float yoff=sin(time);
    vec2 pos = uv()+vec2(xoff,yoff);
    float mag =50.0;
    float shape = sdEquilateralTriangle(pos * vec2(mag));
    gl_FragColor = vec4(shape);
    // distance metric
    //float shape = circ(uv() * vec2(3.0));
    
    vec3 col = cosPalette(
        sin(time),
        vec3(vec2(pos),pos.x),
        vec3(vec2(pos),pos.y),
        vec3(vec2(pos),length(pos)),
        vec3(time*.001,time*1.001,time*2.2)
    )+0.1;
    
    // lighting: darken at the center
    col = vec3(shape) * col;
    
    // output: pixel color
   // gl_FragColor = min(vec4( col.rgb, 1.0 ), vec4(0.8));
    gl_FragColor = vec4(col,1.0);
    // we take the min of the output color and a very light grey color because The Force makes 
    // all of their controls white at the bottom all white without any sort of outline, which is 
    // silly, so you can make it vec4(col.rgb,1.0) in other softwares or if you dont care 
    // about seeing the controls
}