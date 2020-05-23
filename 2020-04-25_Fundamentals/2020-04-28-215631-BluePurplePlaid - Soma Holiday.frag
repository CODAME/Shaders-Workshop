float stroke(float x, float s, float w) {
    float feather = 0.005;
    // float d = step(s, x + w*0.5) - step(s, x - w*0.5);
    float d = smoothstep(s - feather, s + feather, x + w*0.5) - smoothstep(s - feather, s + feather, x - w*0.5);
    return clamp(d, 0., 1.);
}

float sinN(float x) {
    return (sin(x) + 1.) / 2.;
}

void main() {
    vec2 pos = uv();
    
    vec3 color = vec3(0.);
    
    float color_divisor = 8.;
    float w_max = .1;
    float nudge = .05;
    
    for (int i = 0; i < 10; i++) {
        float w = sinN(time * 1.5 + pos.x - pos.y) * w_max;
        
        float sdf = (pos.x + float(i) * (w_max + nudge) - pos.y);
        color += stroke(sdf, 0., w) / color_divisor;
        
        sdf = (pos.x - float(i) * (w_max + nudge) - pos.y);
        color += stroke(sdf, 0., w) / color_divisor;
    }
    
    for (int i = 0; i < 10; i++) {
        float w = sinN(time * 1.5 + pos.x + pos.y) * w_max;
        
        float sdf_inv = (pos.x + float(i) * (w_max + nudge) + pos.y);
        color += stroke(sdf_inv, 0., w) / color_divisor;
        
        sdf_inv = (pos.x - float(i) * (w_max + nudge) + pos.y);
        color += stroke(sdf_inv, 0., w) / color_divisor;
    }
    
    color *= vec3(sinN(time * 0.65 + pos.y) * 0.65, 0., 0.5);
    
    
    // https://learnopengl.com/Advanced-Lighting/Gamma-Correction
    float gamma = 1.8;
    color = pow(color, vec3(1.0/gamma));
    
    gl_FragColor = vec4(color, 1.);
    
}