// in this demo, the five platonic solids are scaled to interlock as follows.
// - the dodecahedron encages the icosahedron
// - the icosahedron encages the tetrahedron and the cube
// - the intersection of the cube and the dodecahedron encages the octahedron

// --- euler angles ---

mat3 rot_xy(float t) {
    return mat3(
         cos(t), sin(t), 0.0,
        -sin(t), cos(t), 0.0,
            0.0,    0.0, 1.0
    );
}

mat3 rot_yz(float t) {
    return mat3(
        1.0,     0.0,    0.0,
        0.0,  cos(t), sin(t),
        0.0, -sin(t), cos(t)
    );
}

// attitude = vec3(precession, nutation spin)
mat3 euler_rot(vec3 attitude) {
    return rot_xy(attitude[0]) * rot_yz(attitude[1]) * rot_xy(attitude[2]);
}

// --- augmented signed distances ---

struct aug_dist {
    float dist;
    vec3 normal;
    vec3 color;
};

aug_dist min(aug_dist a, aug_dist b) {
    if (a.dist < b.dist) return a; else return b;
}

aug_dist max(aug_dist a, aug_dist b) {
    if (a.dist > b.dist) return a; else return b;
}

// --- polyhedra ---

vec3 msign(vec3 v) {
    return vec3(
        v.x > 0. ? 1. : -1.,
        v.y > 0. ? 1. : -1.,
        v.z > 0. ? 1. : -1.
    );
}

float argmax(vec3 v) {
   return max(v.x, max(v.y, v.z));
}

aug_dist plane_sdf(vec3 p, vec3 normal, float offset, vec3 color) {
    return aug_dist(
        dot(p, normal) - offset,
        normal,
        color
    );
}

const float sqrt3 = sqrt(3.);

// tetrahedron
aug_dist tetra_sdf(vec3 p_scene, float inradius, vec3 color) {
    vec3 attitude = vec3(1./(2.+PI), 1./PI, 1./2.) * vec3(time);
    mat3 orient = euler_rot(attitude);
    vec3 p = p_scene * orient; // = transpose(orient) * p_scene
    
    // write down normals
    vec3 normals [4];
    normals[0] = vec3(-1., -1., -1.) / sqrt3;
    normals[1] = vec3(-1.,  1.,  1.) / sqrt3;
    normals[2] = normals[1].zxy;
    normals[3] = normals[2].zxy;
    
    // find the side closest to p
    aug_dist dist =  plane_sdf(p, normals[0], inradius, color);
    for (int j = 1; j < 4; j++) {
        dist = max(dist, plane_sdf(p, normals[j], inradius, color));
    }
    dist.normal = orient * dist.normal;
    return dist;
}

// cube. inspired by Inigo Quilez's box SDF,
//
//   https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
//   https://www.iquilezles.org/www/articles/boxfunctions/boxfunctions.htm
//
// but different. in particular, this one is only a bound
aug_dist cube_sdf(vec3 p_scene, float inradius, vec3 color) {
    vec3 attitude = vec3(1./(2.+PI), 1./PI, 1./2.) * vec3(time);
    mat3 orient = euler_rot(attitude);
    vec3 p = p_scene * orient; // = transpose(orient) * p_scene
    
    vec3 p_abs = abs(p);
    vec3 normal = msign(p) * vec3(
        p_abs.x >= p_abs.y && p_abs.x >= p_abs.z ? 1. : 0.,
        p_abs.y >= p_abs.z && p_abs.y >= p_abs.x ? 1. : 0.,
        p_abs.z >= p_abs.x && p_abs.z >= p_abs.y ? 1. : 0.
    );
    
    return aug_dist(
        argmax(p_abs - vec3(inradius)),
        orient * normal,
        color
    );
}

// octahedron
aug_dist octa_sdf(vec3 p_scene, float inradius, vec3 color) {
    vec3 attitude = vec3(1./(2.+PI), 1./PI, 1./2.) * vec3(time);
    mat3 orient = euler_rot(attitude);
    vec3 p = p_scene * orient; // = transpose(orient) * p_scene
    
    // take the side normal in the positive orthant
    vec3 normal = vec3(1.) / sqrt3;
    
    // reflect it into the orthant of p
    normal *= msign(p);
    
    // now it's the normal of the side closest to p
    aug_dist dist = plane_sdf(p, normal, inradius, color);
    dist.normal = orient * dist.normal;
    return dist;
}

const float phi = (1.+sqrt(5.))/2.;
const float hyp = sqrt(2.+phi); // = sqrt(1+phi^2)

// dodecahedron
aug_dist dodeca_sdf(vec3 p_scene, float inradius, vec3 color) {
    vec3 attitude = vec3(1./(2.+PI), 1./PI, 1./2.) * vec3(time);
    mat3 orient = euler_rot(attitude);
    vec3 p = p_scene * orient; // = transpose(orient) * p_scene
    
    // take the side normals in the positive orthant
    vec3 normals [3];
    normals[0] = vec3(0., 1., phi) / hyp;
    normals[1] = normals[0].zxy;
    normals[2] = normals[1].zxy;
    
    // reflect them into the orthant of p
    for (int k = 0; k < 3; k++) {
        normals[k] *= msign(p);
    }
    
    // now, one of them is the normal of the side closest to p
    aug_dist dist =  plane_sdf(p, normals[0], inradius, color);
    dist = max(dist, plane_sdf(p, normals[1], inradius, color));
    dist = max(dist, plane_sdf(p, normals[2], inradius, color));
    dist.normal = orient * dist.normal;
    return dist;
}

// icosahedron
aug_dist icosa_sdf(vec3 p_scene, float inradius, vec3 color) {
    vec3 attitude = vec3(1./(2.+PI), 1./PI, 1./2.) * vec3(time);
    mat3 orient = euler_rot(attitude);
    vec3 p = p_scene * orient; // = transpose(orient) * p_scene
    
    // take the side normals in the positive orthant
    vec3 normals [4];
    normals[0] = vec3(1.) / sqrt3;
    normals[1] = vec3(0., phi-1., phi) / sqrt3;
    normals[2] = normals[1].zxy;
    normals[3] = normals[2].zxy;
    
    // reflect them into the orthant of p
    for (int k = 0; k < 4; k++) {
        normals[k] *= msign(p);
    }
    
    // now, one of them is the normal of the side closest to p
    aug_dist dist =  plane_sdf(p, normals[0], inradius, color);
    for (int j = 1; j < 4; j++) {
        dist = max(dist, plane_sdf(p, normals[j], inradius, color));
    }
    dist.normal = orient * dist.normal;
    return dist;
}

// --- marcher ---

const int steps = 256;
const float eps = 0.001;
const float horizon = 30.0;

float plateau(float t, float width) {
    const float margin = 1./12.;
    t = mod(t, 3.);
    if (t < margin) {
        float s = 1.-t/margin;
        return 1. - s*s;
    } else if (t < width-margin) {
        return 1.;
    } else if (t < width) {
        float s = 1. - (width-t)/margin;
        return 1. - s*s;
    } else {
        return 0.;
    }
}

vec3 radiance(aug_dist dist, vec3 sky_color) {
    return mix(sky_color, dist.color, (1.+dot(dist.normal, vec3(1.)/sqrt3))/2.);
}

const vec3 sky_color = vec3(0.1, 0.1, 0.3);
const vec3 dark = vec3(0.5);
const vec3 neonlime = vec3(0.75, 0.90, 0.00);
const vec3 light = vec3(1.0);

const float sqrt5 = 2.*phi-1.;

// with these inradii, the platonic solids interlock as desired
const float r_icosa = sqrt5/sqrt3;
const float r_dodeca = sqrt5/(hyp*(phi-2./3.));
const float r_octa = r_icosa/(phi-2./3.) - 1./(phi*sqrt3);
const float r_tetra = 5.*(2./phi-1.)/sqrt3;

vec3 ray_color(vec3 place, vec3 dir) {
    float r = 0.0;
    for (int step_cnt = 0; step_cnt < steps; step_cnt++) {
        // calculate easing functions
        float t = time / 10.;
        float dodeca_pop = plateau(t,    2.);
        float octa_pop   = plateau(t,    1.);
        float icosa_pop  = plateau(t-1., 2.);
        float cube_pop   = plateau(t-2., 2.);
        float tetra_pop  = plateau(t-2., 1.);
        
        // find scene distance
        vec3 p_scene = place + r*dir;
        aug_dist poly = dodeca_sdf(p_scene, r_dodeca * dodeca_pop, neonlime);
        poly = min(poly, octa_sdf(p_scene, r_octa * octa_pop,  light));
        poly = min(poly, icosa_sdf(p_scene, r_icosa * icosa_pop, light));
        poly = min(poly, cube_sdf(p_scene, (1.-eps)*cube_pop, dark));
        poly = min(poly, tetra_sdf(p_scene, r_tetra * tetra_pop, neonlime));
        
        // march
        if (poly.dist < eps) {
            return radiance(poly, sky_color);
        } else if (r > horizon) {
            return sky_color;
        } else {
            r += poly.dist;
        }
    }
    return sky_color;
}

// --- main ---

const vec3 place = vec3(0., 0., 9.);

void main() {
    vec2 jiggle = vec2(0.5/resolution.y);
    vec3 color_sum = vec3(0.);
    for (int sgn_x = 0; sgn_x < 2; sgn_x++) {
        for (int sgn_y = 0; sgn_y < 2; sgn_y++) {
            vec3 dir = normalize(vec3(uv() + jiggle, -3.5));
            color_sum += ray_color(place, dir);
            jiggle.y = -jiggle.y;
        }
        jiggle.x = -jiggle.x;
    }
    gl_FragColor = vec4(color_sum/4., 1.);
}
