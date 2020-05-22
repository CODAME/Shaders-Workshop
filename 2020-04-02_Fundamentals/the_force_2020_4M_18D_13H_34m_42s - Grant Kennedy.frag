float circ(vec2 position) {
    float radius = 0.5;
    return length(position) - radius;
    
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b* tan(PI2 *t*c +d);
}

void main () {
	vec2 position = uv();
	position = position * 2.;
	
	vec3 brightness = vec3(0.1, 0., 0.5);
	vec3 contrast = vec3(0.4,0.5,0.5);
	vec3 freq = vec3(0.5);
	vec3 where = vec3(time + 0.5);
	float shape = circ(position);
	vec3 color = cosPalette(shape*shape* (time*shape/50.), brightness, contrast, freq, where);
	
	position = position;
	//uv.x = resolution.x/resolution.y;
	
	vec3 final = shape * color;
	gl_FragColor = vec4(final, 1.0);
}