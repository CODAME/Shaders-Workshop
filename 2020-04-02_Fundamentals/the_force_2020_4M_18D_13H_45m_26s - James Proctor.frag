float circ(vec2 position, float scale) {
    float radius = .5;
    return length(position) * scale - radius;
}

vec3 palette (float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos( PI2 * (c * t + d) );
}

// float sdBox(vec2 p)

vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}


void main () {
    // float c = 0.2;
    // vec4 v4 = vec4(c, c * 1.2, c * .9, c * 1.5);
    vec2 position = uv();
    
    // vec2 offset = vec2(width * 0.25, height * 0.25);
    
    // vec2 offset = vec2(resolution.x / 2, resolution.y / 2);
    
    // float slowTime = time / 1.0;
    float slowTime = time / 0.1;
    // position
    
    vec2 offset = vec2(1, -1);
    vec2 normalizedMouse = vec2(offset.x - (mouse.x / resolution.x), offset.y + (mouse.y / resolution.y));
    
    // float circleShape = circ(position + normalizedMouse, 0.001); // PI2 * PI);
    float circleShape = circ(position + normalizedMouse, PI); // PI2 * PI);
    vec2 v2Circle = vec2(circleShape);
    // pMod2(v2Circle, vec2(PI2, PI));
    
    // vec3 cir

    gl_FragColor = vec4(palette(slowTime, vec3(position, slowTime * 2.0), vec3(slowTime / 2.0, normalizedMouse), vec3(circleShape), vec3(circleShape / slowTime / 3.0)), 1.0);
    
    
    vec3 brightness = vec3(0.25, 0.025, 0.01);
    vec3 contrast = vec3(0.4, 0.5, 0.8);
    vec3 hue = vec3(position.x, position.y, slowTime);
    vec3 phase = vec3(0.0);
    
    
    vec3 color = palette(circleShape + time, brightness, contrast, hue, phase);
    vec3 final = color * circleShape;
    gl_FragColor += vec4(final, 0.1);
    
    // gl_FragColor = vec4(circleShape);
    // gl_FragColor = vec4(v2Circle, v2Circle);
    
    gl_FragColor += vec4(circleShape + normalizedMouse.x, circleShape + normalizedMouse.y, circleShape, 0.0);
    gl_FragColor *= vec4(v2Circle.x + normalizedMouse.x, v2Circle.y + normalizedMouse.y, circleShape, 0.0);
    
}

// fun stuff

// 	gl_FragColor = vec4(cos(time), sin(time / 2.0), sin(time / 3.0) * cos(time / 4.0), 1.0) * vec4(.1);
    // 	gl_FragColor += vec4(voronoi(uv() - vec2(sin(time * 0.2), cos(time * 0.2)) * uv() / (1.5 + cos(time) * 0.25)));