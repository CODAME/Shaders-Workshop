
const int steps = 256;
const float smallNumber = 0.001;
const float maxDist = 10.0;


float scene(vec3 pos){

    float b = sin(time);
   
    float ground = pos.y + 0.50 + sin(pos.x*10.)/5.0 + bands.y + cos(pos.z*10.0)/10.0; 
    
    pos = vec3(pos.x + sin(time*3.), pos.y+sin(time*5.), pos.z +sin(time) + 1.);
    float sphere = length(pos) - 0.4;
  
   
    return min(ground, sphere);
}

float trace(vec3 rayOrigin, vec3 dir) {
    vec3 ray = rayOrigin;
    float dist = 0.0;
    float totalDist = 0.0;
    
    for(int i =0; i<steps; i++) {
        dist = scene(ray);
        ray = ray + (dist * dir);
        totalDist += dist;
        if(dist < smallNumber) {
            return 1. - (totalDist/maxDist);
        }
        
        if (totalDist > maxDist){
            return 0.; // Background color.
        }
    }
    
    return 0.;
}


void main () {

    vec2 pos = uv(); // origin is in center
    float r = sin(time+pos.x);
    float g = sin(time+pos.y);
  
    
    
    vec2 uv = uv();
    
    vec3 camOrigin = vec3(0,0.1,-1);
    vec3 rayOrigin = vec3(uv + camOrigin.xy,camOrigin.z+1.);
    
    vec3 dir = camOrigin+rayOrigin;
    vec3 color = vec3(trace(rayOrigin,dir));
    
    float x =  trace(rayOrigin,dir);
    
    gl_FragColor = vec4(x,x+g,x+r,1.0);
}