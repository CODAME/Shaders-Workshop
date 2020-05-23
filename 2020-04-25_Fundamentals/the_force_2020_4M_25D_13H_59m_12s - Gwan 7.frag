uniform sampler2D tex;
uniform sampler2D tex2;

float radius = .5;

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}


float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}


void main()
{
	float t = clamp(sin(time), 0., 1.);

	vec2 coords = uvN();
	vec2 dir = coords - vec2(.5);
	
	float dist = distance(coords, vec2(.5));
	vec2 offset = dir * (sin(dist * 50. - time*15.) + .5)/5. ;

	vec2 texCoord = coords + offset;
	
	pR(texCoord,.5);
	vec4 diffuse = vec4(.5,.6,.7,1)*sdBox(texCoord,vec2(0.1,0.5));
	//+ map(mouse[0],0.,resolution.x,0.,0.5);

	vec4 mixin = vec4(0.1,0,1,1);

 	gl_FragColor =  diffuse * (1. - t);
 	
}
