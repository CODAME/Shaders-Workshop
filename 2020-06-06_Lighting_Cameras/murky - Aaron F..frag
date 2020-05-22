// playing with lighting and camera movement techniques from the may 16
// "explorations in raymarching" workshop. i threw in two physics goodies. the
// halo around the sun comes from a model for scattering off atmospheric haze.
// the camera orientation is determined from the camera's path by pretending the
// camera is on an airplane making perfectly banked turns

float sphere(vec3 p) {
    return length(mod(p, vec3(2.)) - vec3(1., 1., 1.)) - 0.2;
}

float ground(vec3 p) {
    return p.y - 0.1*(cos(PI*p.x) + cos(PI*p.z)) + 1.1;
}

float scene(vec3 p) {
    return min(sphere(p), ground(p));
}

const float eps = 0.001;

vec3 scene_grad(vec3 p) {
    vec2 step = vec2(0.02, 0.);
    return vec3(
        scene(p + step.stt) - scene(p - step.stt),
        scene(p + step.tst) - scene(p - step.tst),
        scene(p + step.tts) - scene(p - step.tts)
    );
}

const int steps = 1024;
const float horizon = 60.;
const float dust_horizon = 30.;

const float SQRT2 = sqrt(2.);
const float SQRT3 = sqrt(3.);

// sky parameters
const float g = 0.6; // scattering anisotropy. runs from 0 to 1
const float h = (1.-g)/(1.+g); // the cube root of the scattering phase opposite the sun
const float scat_frac = 0.4;
vec3 sun_color = vec3(1.);
vec3 sky_base = vec3(0.0, 0.2, 0.3);
vec3 sky_color = mix(sky_base, sun_color, scat_frac*h*h*h);
vec3 sun_dir = normalize(vec3(cos(time/SQRT2), -0.5, sin(time/SQRT2)));

float dotplus(vec3 a, vec3 b) { return max(dot(a, b), 0.); }

// if we're looking straight at the sun, we see the color of the sun. otherwise,
// we see a mixture of Mie-scattered sunlight and other skylight.
//
// the angular size of the sun, as seen from Earth, is around acos(0.99999). the
// sun looks small in the scene because we're using a very wide field of view.
//
// Mie scattering is scattering off large particles, like atmospheric haze. a
// scattering process is described by its the phase function, which gives the
// intensity of scattered light at each scattering angle. i'm using
// Scratchapixel's approximate phase function for Mie scattering.
//
//   https://www.scratchapixel.com/lessons/procedural-generation-virtual-worlds/simulating-sky
//
// i don't know where Scratchapixel got it from, but it's the product of the
// Rayleigh scattering phase function and the Henyey-Greenstein phase function,
// an approximate phase function for scattering off interstellar dust.
//
//   https://www.oceanopticsbook.info/index.php/view/scattering/the-henyey-greenstein-phase-function
//
//   L. G. Henyey and J. L. Greenstein. "Diffuse radiation in the galaxy"
//   https://ui.adsabs.harvard.edu/abs/1941ApJ....93...70H/abstract
//
vec3 skylight(vec3 dir) {
    float sun_cos = dotplus(dir, -sun_dir);
    if (sun_cos > 0.99999) {
        return sun_color;
    } else {
        float rayleigh_phase = (1.+sun_cos*sun_cos)/2.;
        float hg_phase = pow((1.-g)*(1.-g) / (1. - 2.*g*sun_cos + g*g), 1.5);
        return mix(sky_base, sun_color, scat_frac * rayleigh_phase * hg_phase);
    }
}

vec3 radiance(vec3 color, vec3 normal, vec3 view_dir) {
    vec3 ambient = color * sky_color;
    vec3 diffuse = color * sun_color * dotplus(-normal, sun_dir);
    
    // `spec_dir` is the viewing direction with the strongest specular highlight
    vec3 spec_dir = -reflect(sun_dir, normal);
    vec3 specular = sun_color * pow(dotplus(view_dir, spec_dir), 32.);
    
    return ambient + diffuse + specular;
}

vec3 ray_color(vec3 eye, vec3 dir) {
    float r = 0.;
    for (int cnt = 0; cnt < steps; cnt++) {
        // find ray position
        vec3 p = eye + r*dir;
        
        // find scene distance
        float dist = scene(p);
        
        // march
        if (dist < eps) {
            vec3 normal = normalize(scene_grad(p));
            vec3 rad = radiance(vec3(1.0, 0.4, 0.5), normal, dir);
            
            // this is a kludgy way to deal with the fact that the spheres cover
            // the whole sky. the idea is that faraway spheres act like dust
            // that contributes to atmospheric perspective, rather than distinct
            // objects that block out the sky. the implementation probably isn't
            // very physical; i just picked something that looked all right
            vec3 atm_color;
            if (r < dust_horizon) {
                atm_color = sky_color;
            } else {
                atm_color = mix(skylight(dir), sky_color, exp(-0.05*(r-dust_horizon)));
            }
            return mix(atm_color, rad, exp(-0.2*r));
        } else if (r > horizon) {
            return skylight(dir);
        } else {
            r += dist;
        }
    }
    
    // if you see lime green, we ran out of steps
    return vec3(0., 1., 0.);
}

vec3 cam_pos(float t) {
    return vec3(SQRT3*sin(t), (1.+sin(2.*t)), 6.*t);
}

vec3 cam_vel(float t) {
    return vec3(SQRT3*cos(t), 2.*cos(2.*t), 6.);
}

vec3 cam_accel(float t) {
    return vec3(-SQRT3*sin(t), -4.*sin(2.*t), 0.);
}

vec3 ray_dir(vec2 screen_pt, float t) {
    // let's pretend the camera's on an airplane. point the yaw axis along the
    // lift vector for a perfect banked turn
    const vec3 gravity = vec3(0., -120., 0.);
    vec3 roll_ax = normalize(cam_vel(t));
    vec3 thrust_lift = cam_accel(t) - gravity;
    vec3 lift = thrust_lift - dot(roll_ax, thrust_lift)*roll_ax;
    vec3 yaw_ax = normalize(lift);
    vec3 pitch_ax = cross(roll_ax, yaw_ax);
    
    vec3 screen_dir = normalize(vec3(uv(), -1.));
    return mat3(pitch_ax, yaw_ax, -roll_ax) * screen_dir;
}

void main() {
    float t = time/6.;
    vec3 pos = cam_pos(t);
    vec2 jiggle = vec2(0.5/resolution.y);
    vec3 color_sum = vec3(0.);
    for (int sgn_x = 0; sgn_x < 2; sgn_x++) {
        for (int sgn_y = 0; sgn_y < 2; sgn_y++) {
            vec3 dir = ray_dir(uv() + jiggle, t);
            color_sum += ray_color(pos, dir);
            jiggle.y = -jiggle.y;
        }
        jiggle.x = -jiggle.x;
    }
    gl_FragColor = vec4(color_sum/4., 1.);
}
