float circ(vec2 position){
    float radius = 0.5;
    return length(position) - radius;
    
}

float sdPentagon( in vec2 p, in float r )
{
    const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    return length(p-vec2(clamp(p.x,-r*k.z,r*k.z),r))*sign(p.y-r);
}

float sdCross( in vec2 p, in vec2 b, float r ) 
{
    p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
    
    vec2  q = p - b;
    float k = max(q.y,q.x);
    vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
    return sign(k)*length(max(w,0.0)) + r;
}

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}


vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos(PI2*(c*t+d) );
    return a+ b* cos(PI2*t*c + d);

}

void main () {
    vec2 position = uv();
    position = position * 2.;
    // position = position - vec2(0., 1.);
    
    // Manipulate the space so you get nice little squares
    position = pMod2(position, vec2(1.0, 1.0));
    // Get a cross shape going
    float shape = sdCross(position, vec2(sin(time * 0.3)), 1.0);
    // Use FBM noise. This is an add-on function in The Force.
    // https://en.wikipedia.org/wiki/Fractional_Brownian_motion
    shape = shape + fbm(uv()+time*0.1, 100) * 3.0;
    
    
    vec3 brightness = vec3(0.9, 0.03, 0.04);
    vec3 contrast = vec3(0.4, 0.5, 0.8);
    vec3 freq = vec3(0.5);
    vec3 where = vec3(0.);
    
    vec3 color = palette(shape + time * 0.1, brightness* sin(time * 1.) , contrast , freq , where );
	gl_FragColor = vec4(color, 1.);
}
