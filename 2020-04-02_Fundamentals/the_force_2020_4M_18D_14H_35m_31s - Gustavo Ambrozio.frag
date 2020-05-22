void main()
{
    vec2 uv = uv();
    float angle = atan(uv.y, uv.x);
    
    // output: pixel color
    gl_FragColor = vec4(cos(angle*time), sin(angle*time), sin(time), 1.0);
}