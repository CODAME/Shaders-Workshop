float circ(vec2 p){
    return length(p) - (bands.x);   
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
    vec2 d = abs(p)-bands.x;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}


void main()
{
 //   float v = 0.5;
    vec2 position = uv();
    position = position -vec2(sin(time),0);
 //   gl_FragColor = vec4(position, 0,);
    // distance metric
    float shape = circ(position * vec2(3.0));

    position = position + vec2(cos(time),0);
    float shape2 = sdBox(position, vec2(1,1));
    
    shape = min(shape, shape2);
    //gl_FragColor = vec4(shape);
    vec3 col = cosPalette(0.5,vec3(bands.y),vec3(bands.z),vec3(1),vec3(time*0.01,time*0.1,time*.2));
        gl_FragColor = vec4(col/shape, 0.);

//         gl_FragColor = vec4(col*shape, 0.);

    // lighting: darken at the center
    //col = vec3(shape) * col;
    
    // output: pixel color
    //gl_FragColor = min(vec4( col.rgb, 1.0 ), vec4(0.8));
    // we take the min of the output color and a very light grey color because The Force makes 
    // all of their controls white at the bottom all white without any sort of outline, which is 
    // silly, so you can make it vec4(col.rgb,1.0) in other softwares or if you dont care 
    // about seeing the controls
}