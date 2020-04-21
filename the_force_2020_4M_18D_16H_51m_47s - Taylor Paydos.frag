float circ(vec2 position){
    float radius= 0.1;
    return length(position)-radius;
}

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a+ b* cos(PI2*t*c+d);
    // a adding brightness b is stretching so multiply c is how frequent it oscillates so that is multiplied by t, multiplie by PI2 bc it goes through a whole cycle, d shifts cosine pallete on y axis thats why its added
}

//used to rotate 
void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// Repeat in two dimensions
vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}





void main () {
    vec2 position=uv()+ vec2(sin(time), cos(time));
  
 
    
    
    position= position *2.;
    //making bigger or smaller by multiplication
    
     // pMod2(position, vec2(2.,3.));
    
    
    position= position- vec2(0.,0.);
     float shape = circ(position);
    //moving left and right^^^ can use just a number or vec 2 ( x axis , y axis )
    //uv.x=resolution.x/resolution.y;
   
   vec3 brightness= vec3(1.,.01,.05);
   vec3 contrast= vec3(.2,.5,.8);
   vec3 freq= vec3(bands.xyz);
   vec3 where=vec3(.9);
   vec3 color=cosPalette(time/shape, brightness,contrast,freq,where);
   
  
    vec3 final= shape*color;
	gl_FragColor = vec4(final,1.0);
}