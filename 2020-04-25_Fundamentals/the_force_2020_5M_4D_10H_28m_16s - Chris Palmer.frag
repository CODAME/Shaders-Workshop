const int steps = 20;
float smallNumber = 0.001;
float maxDist = 1.;

float circ(vec2 p){
    return length(p) - 0.1;   
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 pMod3(inout vec3 p, vec3 size) {
  vec3 c = floor((p + size*0.5)/size);
  p = mod(p + size*0.5, size) - size*0.5;
  return c;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float scene(vec3 pos) {
    float ground = pos.y + 0.50
                   + sin(pos.x * 10.)/10.
                   + cos(pos.z * 10.)/10.;
    pos = vec3(pos.x + sin(time/5. * 2.), pos.y, pos.z + (sin(time/3.) + 1.) * 0.4);
    float sphere = length(pos) - 0.4;
    return min(ground,sphere);
}

float trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    for (int i = 0; i < steps; i++) {
        dist = scene(ray);
        ray = ray + (dist * dir);
        totalDist += dist;
        if (dist < smallNumber) {
            return maxDist - totalDist/maxDist;
        }
    }
    return random(vec2(rayOrigin.x, time*0.1)) * 0.4;
}

void main () {
    vec2 uv = uv();
    vec3 camOrigin = vec3(0,0,-1);
    vec3 rayOrigin = vec3(uv + camOrigin.xy,camOrigin.z+1.);

    vec3 dir = rayOrigin + camOrigin;

    //vec3 color = vec3(cosPalette(trace(rayOrigin, dir), vec3(sin(time)), vec3(sin(time)), vec3(sin(time)) ) ) ;
    vec3 color = cosPalette( trace(rayOrigin, dir), vec3(trace(rayOrigin, dir)/2.), vec3(trace(rayOrigin, dir)/2.), vec3(trace(rayOrigin, dir)/2.), vec3(trace(rayOrigin, dir)/2.) );
    color.x = mod(color.x, sin(time*0.4)*2.);
    color.y = mod(color.y, sin(time*0.3)*3.);
    color.z = mod(color.y, sin(time*1.)*4.);
    gl_FragColor = vec4(color+0.1, 1.0);
}