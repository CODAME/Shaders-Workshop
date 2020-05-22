const int STEPS = 512;
const float EPSILON = 0.001;
const float MAX_DIST = 20.;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  float m = p.x+p.y+p.z-s;
  vec3 q;
       if( 0.0*p.x < m ) q = p.xyz;
  else if( 3.0*p.y < m ) q = p.yzx;
  else if( 3.0*p.z < m ) q = p.zxy;
  else return m*0.17735027;
    
  float k = clamp(time*(q.z-q.y+s),0.2,s); 
  return length(vec3(q.x,q.y-s+k,q.z-k)); 
}


float scene(vec3 pos) {
    // float sphere = length(pos) - 0.2 + sin(time) * 0.1;
    // sphere = atan(sphere , 2.);
    float floor = pos.y + sin(time * 0.03 + pos.x * 1.0) / 1.0 + cos(pos.z * 3.) / 4. + 2. + sin(time * 0.03);
    // float s = min(sphere, floor);
    float octa = sdOctahedron(pos + vec3(sin(time*0.01) * 0.2, -0.1, -0.2), 0.4);
    // octa = mod(octa, 0.5);
     floor = mod(floor, 2. + noise(pos*0.01)*0.1);
     float s = min(floor, octa*1000.);
    //  float s = octa;
    return s;
}


 vec3 estimateNormal(vec3 p) {
    vec3 n = vec3(
    scene(vec3(p.x + EPSILON, p.yz)) -
    scene(vec3(p.x - EPSILON, p.yz)),
    scene(vec3(p.x, p.y + EPSILON, p.z)) -
    scene(vec3(p.x, p.y - EPSILON, p.z)),
    scene(vec3(p.xy, p.z + EPSILON)) -
    scene(vec3(p.xy, p.z - EPSILON))
);
// poke around the point to get the line perpandicular
// to the surface at p, a point in space.
return normalize(n);
}

vec4 lighting(vec3 pos){
    vec3 lightPos = vec3(cos(time),0.,2.);
    // light moves left to right
    
    vec3 normal = estimateNormal(pos);
    float mag = dot(normal,lightPos);
    // dot is one vector projected onto another,
    // when the vectors are similar the dot is stronger
    // when the normal is facing the light the mag is
    // stronger
    vec3 ca = vec3(sin(time * 0.2) * 0.3);
    vec3 cb = vec3(0.5, 0.2, 0.35);
    vec3 cc = vec3(1.0, 1., 1.);
    vec3 cd = vec3(1.0, 1.0, 1.);
    vec3 color = palette(mag, ca, cb, cc, cd);
    
    return vec4(mag);
    // return vec4(color, 1.);
}

vec4 trace(vec3 origin, vec3 direction) {
    float dist = 0.;
    vec3 ray = origin;
    float totalDist;
    for (int i = 0; i < STEPS; i++) {
        dist = scene(ray);
        ray += dist * direction;
        totalDist += dist;
        if (dist < EPSILON) {
            // return vec4(1. - totalDist / MAX_DIST);
            // return vec4(estimateNormal(ray), 1.);
            return lighting(ray);
        }
        if (totalDist > MAX_DIST) {
            return vec4(0.);
        }
    }
}
 

vec3 lookAt(vec2 pos, vec3 camOrigin, vec3 camTarget) {
    vec3 zAxis = normalize(camTarget - camOrigin);
    vec3 up = vec3(0., 1., 0.);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = normalize(cross(zAxis, xAxis));
    float fov = 2.;
    vec3 dir = normalize(xAxis * pos.x + yAxis * pos.y + zAxis * fov);
    return dir;

}

void main () {
    vec2 pos = uv();
    // vec3 camOrigin = vec3(sin(time*0.002)*0.5, 0., -0.3);
    vec3 camOrigin = vec3(0., 0., -1.);
    // vec3 camOrigin = vec3(-mouse.x / resolution.x * 2., mouse.y / resolution.y * 2., -1.);
    vec3 rayOrigin = vec3(pos + camOrigin.xy, camOrigin.z + 1.);
    vec3 camTarget = vec3(0., sin(time*0.01) * 0.2, 0.);
    // vec3 camTarget = vec3(mouse.x/resolution.x, mouse.y/resolution.y - 0.5, 0.);
    vec3 dir = lookAt(pos, camOrigin, camTarget);
    //vec3 dir = camOrigin + rayOrigin;
    vec4 color = trace(camOrigin, dir);
	gl_FragColor = color;
}