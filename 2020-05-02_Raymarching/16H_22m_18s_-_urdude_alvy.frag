const int steps = 8;
float smallNumber = 0.001;
float maxDist = 3.0;



float fBlob(vec3 p) {
	p = abs(p);
	if (p.x < max(p.y, p.z)) p = p.yzx;
	if (p.x < max(p.y, p.z)) p = p.yzx;
	float b = max(max(max(
		dot(p, normalize(vec3(1, 1, 1))),
		dot(p.xz, normalize(vec2(PI+1., 1)))),
		dot(p.yx, normalize(vec2(1, PI)))),
		dot(p.xz, normalize(vec2(1, PI))));
	float l = length(p);
	return l - 1.5 - 0.2 * (1.5 / 2.)* cos(min(sqrt(1.01 - b / l)*(PI / 0.25), PI));
}

float scene(vec3 pos){
    
    float ground =  pos.y + (.5 + sin(time)); 
                    + sin(pos.x * 10.)/10.
                    + cos(pos.z * 10.)/10.;
    
    pos = vec3(pos.x + sin(time * 2.) , pos.y, pos.z + (sin(time) + 1.) * 0.4);
    float sphere = fBlob(vec3(pos));
    
    return ground / sphere;
    
}

float trace(vec3 rayOrigin, vec3 dir){
    vec3 ray = rayOrigin;
    float dist = 0.;
    float totalDist = 0.;
    
    for(int i = 0; i < steps; i++){
        dist = scene(ray);
        ray = ray + (dist * dir);
        totalDist += dist;
        if(dist < smallNumber)
        {
            return maxDist - totalDist/maxDist; 
        }
    }
    return 0.2;
}


void main () {
    vec2 uv = uv();

    // origin of our camera
    vec3 camOrigin = vec3(0.,0.,-1);
    
    // we need to set the rayOrigin as a function of our camera, so were always looking through the scene slice when we move the camera;
    vec3 rayOrigin = vec3(uv + camOrigin.xy ,camOrigin.z + 1.5);
    // ray origin indicates how far we are from 3d things in the scene

    // linear algebra ahoy, you can get a direction by adding two points in space
    vec3 dir = rayOrigin - camOrigin;
    
    vec3 color = vec3(trace(rayOrigin, dir));

	gl_FragColor = clamp(vec4(color,1.0),.0,0.7);
}