

// http://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float equiTri(vec2 p){
    float side = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y +1.0/side;
    if(p.x + side*p.y > 0.0){
        p = vec2(p.x - side*p.y, -side*p.x - p.y)/2.0;
    }
    p.x -= clamp(p.x,-2.0,0.0);
    return -length(p)*sign(p.y);
}

void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}


// http://www.iquilezles.org/www/articles/palettes/palettes.htm
// As t runs from 0 to 1 (our normalized palette index or domain), 
//the cosine oscilates c times with a phase of d. 
//The result is scaled and biased by a and b to meet the desired constrast and brightness.
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 3.78318*(c*t+d) );
}

// void main () {
//     vec2 position = uv();
//     position *= 2.0;
// 	//gl_FragColor = vec4(vec3(.2,(position.y*.3),0), 1.0);
// 	float shape = equiTri(position);
// 	gl_FragColor = vec4(clamp(shape, 0.,0.75),vec3(.2,(position.y*.3),0));
// }

float sdCircle( vec2 p, float r )
{
  return length(p) - r;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}



void main () {
    //triangle
    vec2 positionTri = uv();
    positionTri *= 1.0;
    pR(positionTri,time*cos(100.1));
	//gl_FragColor = vec4(vec3(.2,(position.y*.3),0), 1.0);
	float shape = equiTri(positionTri);
	
	//ball
    vec2 positionBall = uv();
    positionBall *= 0.1;
	positionBall += sin((time*200.1));
	shape = smin(sdCircle(positionBall, (0.1/time)),shape,0.2);

	//ball
    vec2 positionBall2 = uv();
    positionBall2 *= 0.3;
	positionBall2 += cos((time*10.0));
	shape = smin(sdCircle(positionBall2, -0.6),shape,-10.9);
	
    //color cycle
	vec3 a = vec3(0.5,0.5,0.5);
	vec3 b = vec3(0.5,0.5,0.5);
	vec3 c = vec3(2.0,1.0,0.0);
	vec3 d = vec3(0.5,0.2,0.25);
	vec3 color = cosPalette(shape+time*-1.0,a,b,c,d);
	
	gl_FragColor = vec4(color,1);
}
