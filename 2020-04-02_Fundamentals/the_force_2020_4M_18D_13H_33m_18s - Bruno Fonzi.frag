// http://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float equiTri(vec2 p){
    float side = sqrt(2.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y +1.0/side;
    if(p.x + side*p.y > 0.0){
        p = vec2(p.x - side*p.y, -side*p.x - p.y)/2.0;
    }
    p.x -= clamp(p.x,-2.0,0.0);
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

    // distance metric
    float shape = equiTri(uv() * vec2(3.0));
    
    vec3 col = cosPalette(shape*time,vec3(0.5),vec3(0.5),vec3(1),vec3(time*0.01,time*0.1,time*.2));
    
    // lighting: darken at the center
    col = bands.xyz * vec3(shape) * col;
    //col = bands.xyz * col;
    
    // output: pixel color
    gl_FragColor = min(vec4( col.rgb, 1.0 ), vec4(0.7));
    // we take the min of the output color and a very light grey color because The Force makes 
    // all of their controls white at the bottom all white without any sort of outline, which is 
    // silly, so you can make it vec4(col.rgb,1.0) in other softwares or if you dont care 
    // about seeing the controls
}