// the cube is symmetric under reflection along the x, y, z axes. the octahedron
// has the same symmetries. surprisingly, the dodecahedron and the icosahedron
// have these symmetries too! i've used them to write short SDFs for all the
// platonic solids
//
// (the octahedron, dodecahedron, and icosahedron also share the rotational
// symmetries of the cube. the tetrahedron has half the symmetries of the cube,
// because of the way it shares half the cube's vertices)

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

//----------------------CIE Lab----------------------
// from nmz's 3d color space visualization
// https://www.shadertoy.com/view/XddGRN

// map colors from Lab space to RGB space. see explore-lab/explore-lab-l.frag
// to learn more

const vec3 wref =  vec3(.95047, 1.0, 1.08883);

float xyzR(float t){ return mix(t*t*t , 0.1284185*(t - 0.139731), step(t,0.20689655)); }

vec3 lab2rgb(in vec3 c)
{   
    float lg = 1./116.*(c.x + 16.);
    vec3 xyz = vec3(wref.x*xyzR(lg + 0.002*c.y),
                    wref.y*xyzR(lg),
                    wref.z*xyzR(lg - 0.005*c.z));
    vec3 rgb = xyz*mat3( 3.2406, -1.5372,-0.4986,
                        -0.9689,  1.8758, 0.0415,
                         0.0557, -0.2040, 1.0570);
    return rgb;
}

// --- marcher ---

const int steps = 256;
const float eps = 0.001;
const float horizon = 30.0;

float quart(float t) {
    t *= t;
    t *= t;
    return t;
}

float smoothstair(float t, float n) { return t + sin(n*t)/n; }

float triplestair(float t, float n) {
    for (int cnt = 0; cnt < 3; cnt++) {
        t = smoothstair(t, n);
    }
    return t;
}

vec2 cis(float t) { return vec2(cos(t), sin(t)); }

vec3 radiance(aug_dist dist, vec3 sky_color) {
    return mix(sky_color, dist.color, (1.+dot(dist.normal, vec3(1.)/sqrt3))/2.);
}

const vec3 dark = vec3(0.5);
const vec3 mint = vec3(0.7, 0.9, 0.7);
const vec3 light = vec3(1.0);

const float sqrt5 = 2.*phi-1.;

// with these inradii, the platonic solids interlock as follows.
// - the dodecahedron encages the icosahedron
// - the icosahedron encages the tetrahedron and the cube
// - the intersection of the cube and the dodecahedron encages the octahedron
const float r_icosa = sqrt5/sqrt3;
const float r_dodeca = sqrt5/(hyp*(phi-2./3.));
const float r_octa = r_icosa/(phi-2./3.) - 1./(phi*sqrt3);
const float r_tetra = 5.*(2./phi-1.)/sqrt3;

vec3 ray_color(vec3 place, vec3 dir) {
    // easing function
    float t = time*PI2/40.;
    float waver = (1.+cos(4.*t))/2.;
    float pop = quart((1. + cos(4.*t)) / 2.);
    vec2 sweep = cis(triplestair(t, 4.));
    
    // at lightness 51, an RGB monitor can display all colors with chroma <=
    // 29.94. you can verify this with the `chromawheel` function in
    // `find-chromasphere.jl`. hat tip to Math.SE user joeytwiddle for the
    // smooth stair function
    //
    //   https://math.stackexchange.com/a/2970318/16063
    //
    vec3 sky_color = lab2rgb(vec3(51., 29.94*sweep));
    
    float r = 0.0;
    for (int step_cnt = 0; step_cnt < steps; step_cnt++) {
        vec3 p_scene = place + r*dir;
        aug_dist poly = cube_sdf(p_scene, waver, dark);
        float selector = mod(time, 40.);
        if (selector < 10.) {
            poly = min(poly, tetra_sdf(p_scene, r_tetra*(1.-pop), light));
        } else if (selector < 20.) {
            poly = min(poly, octa_sdf(p_scene, r_octa*(1.-pop),  light));
        } else if (selector < 30.) {
            poly = min(poly, dodeca_sdf(p_scene, r_dodeca*(1.-pop), light));
        } else {
            poly = min(poly, icosa_sdf(p_scene, r_icosa*(1.-pop), light));
        }
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
