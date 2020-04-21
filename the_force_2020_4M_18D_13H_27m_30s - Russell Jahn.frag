


float audioLevel = 2.0;
float speed = 1.;
float radius = 0.5;



// cosine based palette, 4 vec3 params
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos( 6.28318*(c*t+d) );
}



float screenCircle(vec2 screenPosition01)
{
     return length(screenPosition01) - radius;    
}



vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(PI2 * t * c + d) *uv().x/uv().y;
}



float getRainbowComponent(float cycle, float frequency, float amplitude)
{
    return amplitude * sin(cycle + frequency*time);
}



vec4 getRainbow ()
{
    float currentTime = speed * time;
    vec4 screenSpace = vec4(uvN(), 1.0, 1.0);


    vec3 colorHSV = hsv2rgb(screenSpace.xyz);
    colorHSV.x = currentTime;
    vec4 colorRGB = vec4(colorHSV, 1.0);
    vec2 uvs = uv();
    

    vec3 rgb = vec3(
        uvs.x * getRainbowComponent(0.0, speed, 0.8), 
        getRainbowComponent(0.3, speed, 1.0), 
        uvs.y);

	return vec4(rgb, 1);
}



vec3 invert(vec3 color)
{
    return vec3(1.0 - color.x, 1.0 - color.y, 1.0 - color.z);
}



void main () 
{
    float shape = screenCircle(uv());
         
    vec3 brightness = vec3(0.2, 0.03, 0.01);
    vec3 contrast = vec3(0.4, 0.4, 0.8);
    vec3 freq = vec3(0.5);
    vec3 start = vec3(0);
    vec3 color = cosPalette(shape + time, brightness, contrast, freq, start);
    vec3 final = shape * color;
    
    // bands = vec4(low, mid-low, mid-high, high) // FFT results
    vec4 frequencies = bands;
    
    // gl_FragColor = getRainbow();
    // return;

     gl_FragColor = vec4(final, 1) * getRainbow() * audioLevel * bands;
     if (uvN().x >= 0.5)
     {
         gl_FragColor = vec4(invert(gl_FragColor.xyz), 1);
     }
}















