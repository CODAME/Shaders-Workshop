float circ(vec2 pos, float r) {
    return length(pos) - r;
}

float lineH(vec2 pos, float r) {
    return pos.y + r;
}

float lineV(vec2 pos, float r) {
    return pos.x + r;
}

// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d)
{
    return a + b*cos(PI2*(c*t+d) );
}

vec3 palette(float t) {
    vec3 brightness = vec3(.2, .03, .1);
    vec3 contrast = vec3(1., .5, 1.);
    vec3 freq = vec3(.8);
    vec3 start = vec3(0.);
    return cosPalette(t, brightness, contrast, freq, start);
}

void main()
{
    vec2 pos = uv();
    
    float circleShape = circ(pos, 2.);
    float circleShape2 = circ(pos, .8);
    float lineShape = lineH(uv(), .8);
    float lineShape2 = lineH(uv(), 1.);
    
    vec3 final = circleShape * palette(time);
    final -= circleShape2;
    final += lineShape;
    final += lineShape2;
    
    if (length(final) > 3.4) {
        final *= 0.4;
    }
    
    gl_FragColor = vec4(final, 1.);
}