// Quasicrystal by Jon Foote 4/18/2020

// Pallete function by Inigo Quiliez
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}


float wave (vec2 pos, float angle){
    //float angle = PI/4.;
    float t = cos(angle)*pos.x + sin(angle)*pos.y;
    return sin(30.*t);
    
}
void main () {
    float c = 1.;
    vec4 v4 = vec4(.5, 0.2, 0.2, 2.);
    float r = sqrt(uv().x * uv().x + uv().y * uv().y );
    float shape;
	//gl_FragColor = vec4(sin(10.*uv().x), 0.2*r, 0, 1.0);
	shape = wave(uv(), 0.);
	shape += wave(uv(), PI/4.);
	shape += wave(uv(), PI/2.);
	shape += wave(uv(), 3.*PI/4.);
	shape = shape/4.;
	vec3 brightness = vec3(0.7, 0.3, 0.1); 
	vec3 contrast = vec3(0.4, 0.5, 0.6);
	vec3 freq = vec3(0.5);
	vec3 where = vec3(time/4.);
    vec3 color = 3.*palette(length(shape), brightness,contrast, freq, where);
    vec3 final = shape * color;
	gl_FragColor = vec4(final, 1.0);
	
}