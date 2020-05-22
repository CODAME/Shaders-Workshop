const int steps = 20;
float smallNumber = 0.0001;
float maxDist = 1.;

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}


// Torus in the XZ-plane
float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}


float scene(vec3 pos) {
    
    float ground = pos.y + .5
                   + sin(pos.x * 10.) / 10.
                   + cos(pos.z * 10.) / 10.;
                   
    
    pos = vec3(pos.x, pos.y, pos.z + (sin(time) + 1.) * 0.4);
    //pMod3(pos, vec3(1.));
    //float sphere = length(pos) - 0.3;
    //return min(ground, sphere);
    
    
    pMod3(pos, vec3(1.));
    float sphere = fTorus(pos, 0.1, 0.3);
    return min(ground, sphere);
}

float trace(vec3 rayOrigin, vec3 dir) {
  vec3 ray = rayOrigin;
  float dist = 0.;
  float totalDist = 0.;
  for (int i = 0; i < steps; i++) {
    dist = scene(ray);
    ray = ray + dist * dir;
    totalDist += dist;
    if (dist < smallNumber) {
        // percent of maxDist that we travelled for this pixel
        return 1. - totalDist / maxDist;
    }
  }
  return 0.;
}

void main () {
    vec2 uv = uv();
    
    vec3 camOrigin = vec3(0.1, 0.3, -1.2);
    vec3 rayOrigin = vec3(uv + camOrigin.xy - (mouse.xy / resolution.xy / 1.) + vec2(0.5, 0.5), camOrigin.z + 1.2);
    
    // ray origin - how far we are from 3d thing
    
    vec3 dir = camOrigin + rayOrigin;
    
    vec3 color = vec3(trace(rayOrigin, dir));
    
    gl_FragColor = vec4(color / 1.5 + vec3(0.2, 0.3, 0.7), 1.0);
}