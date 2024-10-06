
let points = [];
let stars = 800;
for(i=0; i < stars; i++){
    points.push([Math.random() * 1000, Math.random() * 1000]);
}

let earth;
let launch_pad;
let shadow;
let planet_explosion;
let planet_explosion_age = 20;
let explosions;
let explosion_age = 40;

let loads;
let load_age = 20;

let aliens;
let drop_pods;
let earth_hits = 0;
let earth_health = 10;
let aliens_killed = 0;

let history_length = 60;
let shots_ready_max = 1;
let reload_rate = 0.01;
let shot_arm_time = 6;

let rocket_cooldown = 0;
let rocket_cooldown_max = 100;

let alien_max = 5;
let alien_timer_max = 400;
let alien_timer = alien_timer_max;

function setup() {
  createCanvas(1000, 1000);
  colorMode(RGB,100);

  fill(10,20,120,100);
  earth = new Sprite();
  earth.img = 'earth.png'
  earth.diameter = 64;
  earth.collider = 'kinematic';
  earth.rotationSpeed = -0.75;
  //earth.mass = 10000;
  
  launch_pad = new Sprite();
  launch_pad.width = 20;
  launch_pad.height = 2;
  launch_pad.color = 'grey';
  launch_pad.collider = 'kinematic';
  launch_pad.x = 500;
  launch_pad.y = 500;
  launch_pad.offset.y = 31;
  launch_pad.rotationSpeed = -0.75;
  //launch_pad.debug = true;

  shadow = new Sprite();
  shadow.img = 'earthshadow.png';
  shadow.collider = 'none';


  //Starting two Satellites, orbit opposite of each other
  satellites = new Group();
  satellites.img = 'Railgun.png';
  satellites.width = 36;
  satellites.height = 17;
  satellites.shots = 1;
  satellites.mass = 0.25;
  sat_history = [];
  let satellite = new satellites.Sprite();
  satellite.x = 300;
  satellite.y = 500;
  satellite.velocity.y = 8;
  sat_history.push([]);

  //satellite.debug = true;

  let satellite2 = new satellites.Sprite();
  satellite2.x = 700;
  satellite2.y = 500;
  satellite2.velocity.y = -8;
  sat_history.push([]);

  // satellite2.debug = true;
  
  //shot group
  shots = new Group();
  shots.collider = 'none';
  shots.img = 'Shot.png';
  shots.width = 20;
  shots.height = 3;
  shots.arm_time = shot_arm_time;

  //Rocket group
  rockets = new Group();
  rockets.img = 'Rocket.png';
  rockets.width = 9;
  rockets.height = 18;
  rockets.fuel = 100;
  rockets.launched = false;
  //rockets.mass = 0.5;
  rock_history = [];

  rocket = new rockets.Sprite();
  rocket.y = 550;
  rocket.x = 500;
  rocket.rotation = 90;
  rock_history.push([]);
  //rocket.direction = 90;

  //aliens group
  aliens = new Group();
  aliens.img = 'AlienShip.png';
  aliens.width = 48;
  aliens.height = 15;
  aliens.hp = 1;
  aliens.drop = 3;
  aliens.drop_cooldown = 0;
  aliens.drop_cool_max = 60;
  alien_history = [];

  al = new aliens.Sprite();
  al.x = 0;
  al.y = 0;
  al.speed = 3;
  //al.debug = true;
  alien_history.push([]);

  drop_pods = new Group();
  drop_pods.img = 'DropPod.png'
  drop_pods.width = 11;
  drop_pods.height = 9;

  //drop = new drop_pods.Sprite();
  //drop.x = 300;
  //drop.y = 200;
  //drop.debug = true;

  explosions = new Group();
  explosions.addAni(
    'Explosion1.png',
    'Explosion2.png',
    'Explosion3.png',
    'Explosion4.png');
  //explosions.noLoop();
  explosions.collider = 'none';
  explosions.age = 0;

  planet_explosion = new Sprite(-100,-100);
  planet_explosion.addAni(
    'planetExplosion1.png',
    'planetExplosion2.png',
    'planetExplosion3.png',
    'planetExplosion4.png');
  planet_explosion.collider = 'none';

  loads = new Group();
  loads.addAni(
    'load1.png',
    'load2.png',
    'load3.png');
  loads.age = 0;
  loads.collider = 'none';
  loads.scale = 1.5;

  //let l = new loads.Sprite(200,200);

}


function draw() {
    background(10,10,10,100);
    stroke(200,200,200);
    strokeWeight(2);
    for (i = 0; i < points.length; i++){
        point(points[i][0],points[i][1]);
    }

    //print(launch_pad.rotation);
    if (earth_health - earth_hits > 0){
        sat_crashed = [];
        rockets_done = [];
        alien_crashed = [];
        drop_crashed = [];
        //move all satellites in their orbits
        for (i = 0; i < satellites.length; i++){
            //satellites[i].debug = true;

            satellites[i].attractTo(earth, 5);

            if (satellites[i].shots < shots_ready_max){
                satellites[i].shots += reload_rate;
                if( satellites[i].shots >= 1){
                    let loaded = new loads.Sprite(satellites[i].x,satellites[i].y);
                }
            }

            //History start
            if (sat_history[i].length < history_length){
                sat_history[i].push([satellites[i].x,satellites[i].y]);
            }
            else{
                sat_history[i].shift();
                sat_history[i].push([satellites[i].x,satellites[i].y]);
            }

            noFill();
            strokeWeight(1);
            stroke(100,100,100,100);
            beginShape();
            for (j = 0; j < sat_history[i].length; j++){
                vertex(sat_history[i][j][0],sat_history[i][j][1]);
            }
            endShape();
            //History end

            //point towards mouse
            satellites[i].rotateTowards(mouse, 0.25, 0);

            //check for collisions;
            //earth
            if (earth.overlaps(satellites[i]) || launch_pad.overlaps(satellites[i])){
                sat_crashed.push(i);
                earth_hits += 1;
            }
            //satellites
            for (j = 0; j < satellites.length; j++){
                if (!(i == j)){
                    if (satellites[j].overlaps(satellites[i])){
                        sat_crashed.push(i);
                    }       
                }
            }
            //rockets
            for (j = 0; j < rockets.length; j++){
                if  (rockets[j].overlaps(satellites[i])){
                    sat_crashed.push(i);
                    rockets_done.push(j);
                }
            }

            //shots
            for (j = 0; j < shots.length; j++){
                if (shots[j].overlaps(satellites[i])){
                    if (shots[j].arm_time == 0){
                        sat_crashed.push(i);
                    }
                }
            }
            //aliens
            for (j = 0; j < aliens.length; j++){
                if (aliens[j].overlaps(satellites[i])){
                    sat_crashed.push(i);
                    if (aliens[j].hp > 1){
                        aliens[j].hp -= 1;
                    }
                    else{
                        alien_crashed.push(j);
                    }
                }
            }

            //drop pods
            for (j = 0; j < drop_pods.length; j++){
                if  (drop_pods[j].overlaps(satellites[i])){
                    sat_crashed.push(i);
                    drop_crashed.push(j);
                }
            }
        }

        for (i = 0; i < shots.length; i++){
            if (shots[i].arm_time > 0){
                shots[i].arm_time -= 1;
            }
        }

        sat_crashed = sat_crashed.filter(onlyUnique);
        //remove any that have crashed
        for (i = sat_crashed.length - 1; i >= 0; i--){
            let espl = new explosions.Sprite(satellites[sat_crashed[i]].x,satellites[sat_crashed[i]].y);
            satellites[sat_crashed[i]].remove();
            sat_history.splice(i,1);
        }

        //rockets
        for (i = 0; i < rockets.length; i++){
            rockets[i].attractTo(earth, 5);
            if(rockets[i].launched){ 
                rockets[i].bearing = rockets[i].angleTo(mouse);
                rockets[i].rotation = rockets[i].angleTo(mouse);
            }
            if (rockets[i].fuel <= 0){
                let sat = new satellites.Sprite();
                sat.x = rockets[i].x;
                sat.y = rockets[i].y;
                sat.vel = rockets[i].vel;
                sat_history.push([]);
                rockets_done.push(i);
            }
            else if (keyIsPressed === true){
                if (key == ' '){
                    rockets[i].fuel -= 1;
                    rockets[i].applyForce(4);
                    rockets[i].launched = true;
                }
                else if (key == 'b'){
                    rockets[i].fuel = 0;
                }
            }
            for (j = 0; j < shots.length; j++){
                if (shots[j].overlaps(rockets[i])){
                    if (shots[j].arm_time == 0){
                        rockets_done.push(i);
                    }
                }
            }
            if (rock_history[i].length < history_length){
                rock_history[i].push([rockets[i].x,rockets[i].y]);
            }
            else{
                rock_history[i].shift();
                rock_history[i].push([rockets[i].x,rockets[i].y]);
            }

            noFill();
            strokeWeight(1);
            stroke(100,100,100,100);
            beginShape();
            for (j = 0; j < rock_history[i].length; j++){
                vertex(rock_history[i][j][0],rock_history[i][j][1]);
            }
            endShape();

            //aliens
            for (j = 0; j < aliens.length; j++){
                if (aliens[j].overlaps(rockets[i])){
                    rockets_done.push(i);
                    if (aliens[j].hp > 1){
                        aliens[j].hp -= 1;
                    }
                    else{
                        alien_crashed.push(j);
                    }
                }
            }
            //drop pods
            for (j = 0; j < drop_pods.length; j++){
                if  (drop_pods[j].overlaps(rockets[i])){
                    rockets_done.push(i);
                    //drop_crashed.push(j);
                }
            }
        }

        rockets_done = rockets_done.filter(onlyUnique);
        for (i = rockets_done.length - 1; i >= 0; i--){
            rockets[rockets_done[i]].remove();
            rock_history.splice(i,1);
        }

        //aliens
        for (i = 0; i < aliens.length; i++){
            aliens[i].attractTo(earth, 5);
            aliens[i].rotation = aliens[i].direction;

            if (aliens[i].drop_cooldown > 0){
                aliens[i].drop_cooldown -= 1;
            }

            if (dist(aliens[i].x,aliens[i].y,earth.x,earth.y) < 175){
                if (aliens[i].drop > 0){
                    if(aliens[i].drop_cooldown < 1){
                        dr = new drop_pods.Sprite();
                        dr.x = aliens[i].x;
                        dr.y = aliens[i].y;
                        aliens[i].drop -= 1;
                        aliens[i].drop_cooldown = aliens[i].drop_cool_max;
                    }
                }
            }

            if (earth.overlaps(aliens[i]) || launch_pad.overlaps(aliens[i])){
                alien_crashed.push(i);
                earth_hits += 1;
            }

            for (j = 0; j < shots.length; j++){
                if (shots[j].overlaps(aliens[i])){
                    if (shots[j].arm_time == 0){
                        if (aliens[i].hp > 1){
                            aliens[i].hp -= 1;
                        }
                        else{
                            alien_crashed.push(i);
                        }
                    }
                }
            }

            if (alien_history[i].length < history_length){
                alien_history[i].push([aliens[i].x,aliens[i].y]);
            }
            else{
                alien_history[i].shift();
                alien_history[i].push([aliens[i].x,aliens[i].y]);
            }

            noFill();
            strokeWeight(1);
            stroke(100,100,100,100);
            beginShape();
            for (j = 0; j < alien_history[i].length; j++){
                vertex(alien_history[i][j][0],alien_history[i][j][1]);
            }
            endShape();
        }

        alien_crashed = alien_crashed.filter(onlyUnique);
        for (i = alien_crashed.length - 1; i >= 0; i--){
            let espl = new explosions.Sprite(aliens[alien_crashed[i]].x,aliens[alien_crashed[i]].y);
            aliens[alien_crashed[i]].remove();
            alien_history.splice(i,1);
            aliens_killed += 1;
        }

        //drop pods
        for (i = 0; i < drop_pods.length; i++){
            drop_pods[i].attractTo(earth, 5);
            drop_pods[i].rotation = drop_pods[i].angleTo(earth) + 180;

            if (earth.overlaps(drop_pods[i]) || launch_pad.overlaps(drop_pods[i])){
                drop_crashed.push(i);
                earth_hits += 1;
            }
            for (j = 0; j < shots.length; j++){
                if (shots[j].overlaps(drop_pods[i])){
                    if (shots[j].arm_time == 0){
                        drop_crashed.push(i);
                    }
                }
            }
        }

        drop_crashed = drop_crashed.filter(onlyUnique);
        for (i = drop_crashed.length - 1; i >= 0; i--){
            drop_pods[drop_crashed[i]].remove();
        }


        if (rocket_cooldown == rocket_cooldown_max){
            //spawn new rocket
            rot = launch_pad.rotation;
            while (rot < 0){
                rot += 360
            }
            if(rot <= 5 || rot >= 355){
                rocket_cooldown = 0;
                let roc = new rockets.Sprite();
                roc.y = 550;
                roc.x = 500;
                roc.rotation = 90;
                rock_history.push([]);
            }

        }
        else{
            if (rockets.length == 0){
                rocket_cooldown += 1;
            }
        }

        alien_timer -= 1;
        if (alien_timer <= 0){
            alien_timer = alien_timer_max;
            if (aliens.length < alien_max){
                side = random([0,1,2,3]);
                //print(side);
                ship = new aliens.Sprite();
                alien_history.push([]);
                if (side == 0){
                    ship.y = 0;
                    ship.x = random(1000);
                    ship.direction = random([0,1]) * 180;
                    ship.speed = random(2,4);
                }
                else if (side == 1){
                    ship.x = 1000;
                    ship.y = random(1000);
                    ship.direction = random([0,1]) * 180 + 90;
                    ship.speed = random(2,4);
                }
                else if (side == 2){
                    ship.y = 1000;
                    ship.x = random(1000);
                    ship.direction = random([0,1]) * 180;
                    ship.speed = random(2,4);
                }
                else if (side == 3){
                    ship.x = 0;
                    ship.y = random(1000);
                    ship.direction = random([0,1]) * 180 + 90;
                    ship.speed = random(2,4);
                }
            }
        }
    }
    else{
        earth.remove();
        shadow.remove();
        launch_pad.remove();
        planet_explosion.x = 500;
        planet_explosion.y = 500;
        noStroke();
        fill(255);
        textSize(50)
        text("Earth", 445, 325);
        text("is", 485, 450);
        text("Dead", 445, 625);
    }
    for(i = explosions.length -1; i >= 0; i--){
        explosions[i].age++;
        if (explosions[i].age >= explosion_age){
            explosions[i].remove();
        }
    }
    for(i = loads.length -1; i >= 0; i--){
        loads[i].age++;
        if (loads[i].age >= load_age){
            loads[i].remove();
        }
    }

    noStroke();
    fill(255);
    textSize(15);
    text("Earth's Population: " + (earth_health - earth_hits) + " Billion", 20,20);
    text("Alien Ships Destroyed: " + aliens_killed, 20,50);
}

function mousePressed(){
    closest_plat = -1;
    for (i = 0; i < satellites.length; i++){
        if (satellites[i].shots >= 1){
            blocked = false;
            tolerance = Math.atan(32 / dist(satellites[i].x,satellites[i].y,earth.x,earth.y)) * (180 / Math.PI);
            dir = satellites[i].rotation;
            ang = satellites[i].angleTo(earth);
            while (dir > 360){
                dir -= 360;
            }
            while (dir < 0){
                dir += 360;
            }
            while (ang > 360){
                ang -= 360;
            }
            while (ang < 0){
                ang += 360;
            }
            //print(ang, dir);
            if (dir > ang + tolerance || dir < ang - tolerance){
                if (closest_plat == -1){
                    closest_plat = i;
                }
                else{
                    if (dist(satellites[i].x,satellites[i].y, mouseX, mouseY) < dist(satellites[closest_plat].x,satellites[closest_plat].y,mouseX,mouseY)){
                        closest_plat = i;
                    }
                }
            }
        }
    }
    //print(satellites[closest_plat].angleTo(300,300), satellites[closest_plat].direction);
    if (closest_plat != -1){
        satellites[closest_plat].shots -= 1;
        let shot = new shots.Sprite();
        shot.x = satellites[closest_plat].x;
        shot.y = satellites[closest_plat].y;
        shot.rotation = satellites[closest_plat].rotation;
        shot.speed = 10;
    }
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}