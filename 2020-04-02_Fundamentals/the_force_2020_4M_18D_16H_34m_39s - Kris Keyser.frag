
float circ(vec2 position){
   float radius = 0.5;
   return length (position) - radius;
}

/*vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
   return a + b* cos(PI2*t*c +d);
*/
vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
   return a + b * cos(PI2 * t * c + d) *uv().x/uv().y;
}


void main () {
   vec2 position = uv();
position = (position *2. + time);

vec3 brightness = vec3(sin(time), .03, .01) ;
vec3 contrast =  vec3(.4, 0.5, 0.8);
vec3 freq = vec3 (4);
vec3 where = vec3(cos(time));
float shape = circ (position);
vec3 color = cosPalette(shape-time, brightness, contrast, freq, where);


vec3 final = vec3(shape) * color;

   gl_FragColor = vec4(abs(final/time), 1.0);
   
   
}
