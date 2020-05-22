// Nikolas Diamant

#define MAX_STEPS 1000
#define EPSILON 0.01
#define MAX_DIST 100.0

float soft_min( float a, float b, float f ) {
    if (abs(a - b) < f) {
        float factor = ((a - b) / f + 1.0) / 2.;
        return b * factor*factor + (1.0 - factor*factor) * a;
    }
    else {
        return min(a, b);
    }
}

float sphere (vec3 position) {
    return length(position) - 0.4;
}

float wavy_floor( vec3 location ) {
    return (sin(location.x * sin(time)) + cos(location.y - 5. * time)) * 4. + 5.0 + location.z;
}

float get_dist( vec3 location ) {
    //loocation of nearest sphere in this block's space:
    vec3 block = floor( abs(location) / 3.0 ) * 3.0;
    float n = noise( block );
    vec3 center = vec3( 1.5, 1.5, 1.5);
    
    return soft_min(distance( mod(location, 3.0), center ) - 0.5, wavy_floor(location), 5.5);
}

vec3 get_normal( vec3 location ) {
    float dist = get_dist( location );
    vec3 n = vec3(
        dist - get_dist( location - vec3(EPSILON, 0, 0) ),
        dist - get_dist( location - vec3(0, EPSILON, 0) ),
        dist - get_dist( location - vec3(0, 0, EPSILON) ) 
        );
    return normalize( n );
}

float ray_march( vec3 origin, vec3 direction ) {
    float dist = 0.0; // total distance traveled from origin to objects in scene
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 location = origin + dist * direction;
        float d_dist = get_dist( location ); // step size
        dist += d_dist;
        if (d_dist < EPSILON || d_dist > MAX_DIST) {
            break;
        }
    }
    return dist;
}

void main () {
    vec2 UV = uv();
    
    vec3 col = vec3(0.0);
    
    // Ray origin, direction
    vec3 origin = vec3(0., time * 3., sin(time));
    mat3 rotation = mat3( vec3(sin(time/2.), cos(time/2.), 0.0), vec3(cos(time/2.), -sin(time/2.), 0.), vec3(.0, 0.0, 1.0) );
    float fov = 0.5;
    vec3 direction = rotation * normalize(vec3(UV.x, fov, UV.y));
    
    
    float dist = ray_march( origin, direction );
    vec3 location = origin + dist * direction;
    vec3 local_color = vec3( noise(location + vec3(-time, 0., 0.)), noise(location * 10.0), noise(location *  3.0));
    vec3 normal = get_normal( location );
    float light = clamp( dot( normal, vec3(0.0, -1.0, 1.0) ), 0.5, 1.0) * 2.0;
    col = local_color * vec3( dist / 100.0 + light );
    
	gl_FragColor = vec4(col, 1.0);
}