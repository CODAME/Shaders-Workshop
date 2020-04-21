float circ(vec2 position){
    float radius = 0.23;
    return length(position)-radius;
    
}

float sdPentagon( in vec2 p, in float r )
{
    const vec3 k = vec3(0.1,0.587785252,0.5);
    p.x = abs(p.x);
    p -= 3.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 3.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    return length(p-vec2(clamp(p.x,-r*k.z,r*k.z),r))*sign(p.y-r);
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a+b*cos(6.28318*(c*t+d));
}

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
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

void main () {

    vec2 position = uv();
    position = position *2.;
    position = pMod2(position, vec2(1.0,1.0));
    float shape = sdCross(position, vec2(sin(time*0.3)),1.0);
    vec3 brightness = vec3(0.1,0.1,0.04);
    vec3 contrast = vec3(0.6,0.5,0.9);
    vec3 freq = vec3(0.3);
    vec3 where = vec3(0.);
    
  
    vec3 color = cosPalette(shape+sin(shape-time),brightness, contrast, freq, where);
    position = position - vec2(0.,1);
    
   // uv.x = resolution.x/resolution.y;
    vec3 final = shape * color;
    
	gl_FragColor = vec4(final,1.0);
	
}