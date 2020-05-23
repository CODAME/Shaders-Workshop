float circ(vec2 p, float size)
{
    return length(p) - 0.5 * size;   
}


float pMod1(inout float p, float size) 
{
    float halfsize = size*0.5;
    float c = floor((p + halfsize)/size);
    p = mod(p + halfsize, size) - halfsize;
    return c;
}

float sdEquilateralTriangle( in vec2 p, float size )
{
    const float k = sqrt(3.0);
    
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y)*size;
}

// Rotate around a coordinate axis (i.e. in a plane perpendicular to that axis) by angle <a>.
// Read like this: R(p.xz, a) rotates "x towards z".
// This is fast if <a> is a compile-time constant and slower (but still practical) if not.
void pR(inout vec2 p, float a) 
{
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}


void main()
{
    float t = time*.2;
    gl_FragColor = vec4(black,1.);
    // distance metri

    vec2 position = uv() + vec2(-sin(time*.5),cos(time*.5));
    float shape1 = 50. * circ(position, 1.0);
    
    vec2 position2 = uv();
    
    pR(position2,t);
    float shape2 = (50. * sdEquilateralTriangle(position2,sin(t)));
    
    float shape = shape2;
    pMod1(shape, 10.);
   
    vec4 col = vec4(min(uvN()[1],shape),min(uvN()[0],shape),min(uvN()[0],shape),1);
    
    //col = vec4(vec2(shape),0.4,1);
    gl_FragColor = min(col,vec4(0.8));
    
}
