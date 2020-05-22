const int steps = 16;
const float smallNumber = 0.001;
const float maxDist = 2.;
const vec3 size = vec3(2.001);
    
// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  float m = p.x+p.y+p.z-s;
  vec3 q;
       if( 3.0*p.x < m ) q = p.xyz;
  else if( 3.0*p.y < m ) q = p.yzx;
  else if( 3.0*p.z < m ) q = p.zxy;
  else return m*0.57735027;
    
  float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
  return length(vec3(q.x,q.y-s+k,q.z-k)); 
}

// Returns a color in the xyz components, the distance in the w component.
vec4 scene(vec3 pos) {
    
    float ground = (pos.y + 0.5 ) * ((sin(bands.z) * 10. + 10.))
        + sin(pos.x * 15. + time) / 10. 
        + cos(pos.z * 10.) / 10. ;
    
    vec3 spherePos = vec3(pos.x + noise(time), pos.y, pos.z + (sin(time) + 2.) * -0.4);
    //pMod3(spherePos, size);
    float sphere = length(spherePos) - 0.4;
    
    vec3 torusPos = vec3(pos.x + cos(time) * 0.2, pos.y, pos.z - (cos(time) + 1.) * -0.4);
    pMod3(torusPos, size);
    //float torus = sdTorus(pos, vec2(.3, .4));
    float torus = sdOctahedron(torusPos, 0.3 * bands.y + .7);
    
    float result = ground;
    
    if (ground < sphere && ground < torus) {
        return vec4(.4, 0.4, 0.8, ground);
    } else if (sphere < torus) {
        return vec4(0., .7, 0.75, sphere);
    } else {
        return vec4(0.76, .241, 0.2, torus);
    }
}

vec4 trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    
    for (int i = 0; i < steps; i++) {
        vec4 obj = scene(ray);
        dist = obj.w;
        ray = ray + dist * dir;
        totalDist += dist;
        if (dist < smallNumber) {
            return vec4(obj.xyz * (1. - totalDist / maxDist), 1.);
        }
    }
    
    return vec4(0.);
}

void main () {
    vec2 uv = uv(); // position
    
    // vec3 camOrigin = vec3(0., 0., sin(time * .12  -1.));
    vec3 camOrigin = vec3(0., 0., (-1.));
    
    //vec3 rayOrigin = vec3(uv, sin(time* -0.4));
    vec3 rayOrigin = vec3(uv + camOrigin.xy, camOrigin.z + 1.);
    
    vec3 dir = rayOrigin - camOrigin;
    
    vec4 color = vec4(trace(rayOrigin, dir).xyz, 1.);
    
	gl_FragColor = color;
} 