const int steps = 10;
float smallNumber = .1;
float maxDist = 100.5;

// Repeat in three dimensions
vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

vec3 cosPalette(  float t,  vec3 a,  vec3 b,  vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

float pModPolar(inout vec2 p, float repetitions) {
	float angle = 2.*PI/repetitions;
	float a = atan(p.y, p.x) + angle/2.;
	float r = length(p);
	float c = floor(a/angle);
	a = mod(a,angle) - angle/2.;
	p = vec2(cos(a), sin(a))*r;
	// For an odd number of repetitions, fix cell index of the cell in -x direction
	// (cell index would be e.g. -5 and 5 in the two halves of the cell):
	if (abs(c) >= (repetitions/2.)) c = abs(c);
	return c;
}

float smin( float a, float b, float k )
{
    float h = clamp(3.5+.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(5.0-h);
}


float scene(vec3 pos){
    float ground = pos.y/sin(0.1) - 0.25
                        + sin(pos.x + time * 1.)/.2
                        + cos(sqrt(cos(pos.z + time * -1.)))/.1;
                        


    pos = vec3(pos.x + sin(time*0.3), pos.y +0.001 + tan(time*0.01), pos.z + sin(time*0.03));
    pMod3(pos, vec3(.666,.3,.333));       


        
    float sphere = length(pos) + .0015 + sin(time * pos.x * 0.0002);
    return smin(ground, sphere, 2.);
}

vec3 trace(vec3 rayOrigin, vec3 dir){
    vec3 ray = rayOrigin;   
    float dist = 0.;
    float totalDist = 0.;
    
    for (int i = 0; i < steps; i++){
        dist = scene(ray);
        ray = ray + (dist * dir);
        
        totalDist += dist;
        
        if (dist < smallNumber){
            // this returns the percent of maxDist travelled for this pixel
            // 
            vec3 one = vec3(1.,1.,5.);
            vec3 two = vec3(.5,.5,.5);
            vec3 three = vec3(0.5,0.5,0.5);
            vec3 four = vec3(maxDist,totalDist/maxDist,0.);
            return cosPalette(time, one, two, three, four);
            //return vec3(maxDist * 1. - totalDist/maxDist,0.5*sin(.5),time * totalDist/maxDist);
            
        }
    }
    
}

void main () {
    vec2 uv = uv();
    vec3 camOrigin = vec3(0,0.5,-1);
    vec3 rayOrigin = vec3(uv/0.3 + camOrigin.xy, camOrigin.z + 1.);
    vec3 dir = camOrigin + rayOrigin;
    
    vec3 color = vec3(trace(rayOrigin, dir));
    
    gl_FragColor = clamp(vec4(color,1.0),0.,0.8);
	
}