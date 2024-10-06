# Steel Dome
This is a simple JavaScript game where the player controls the orbital railguns defending Earth from alien ships trying to deploy their forces on the ground through drop pods. Destroy as many alien ships as possible before their forces kill all of humanity!

An important part of this little game is its simulation of orbital mechanics. Moving objects are affected by Earth being in the center of the window and as such are gravitationally accelerated to the center. Because the game has simulated physics instead of pre-defined paths, satellites and ships can naturally enter a stable-enough orbit around Earth. The first two railgun emplacements start the game in a stable orbit, but future satellites will have to be manually launched into orbit. The player gets to choose the distance and shape of the new satellite's path. This freedom also allows the player to set it up in an unstable orbit. The satellite might fall back to Earth, or even worse, collide with another satellite!

## Controls

- Orbital Railgun Emplacements

- All railguns always aim towards the mouse cursor.

- Mouse left click will cause the closest loaded railgun to fire.

  - Railguns take about 1 second to reload. Once a railgun is reloaded, it will briefly show a blue X to signal it is ready to fire.

  - It is not ideal to shoot Earth with a railgun. A safety mechanism has been put into place to prevent such occurrences.

  - However, this safety feature does not prevent a railgun from unintentionally shooting another friendly Satellite.

- Only a single railgun shot is needed to destroy an alien ship.

## Rockets

- While the spacebar is held down, the rocket will accelerate.

- Once the rocket has launched, it will point towards the mouse and accelerate in that direction.

- The rocket will convert into an orbital railgun once it has no more fuel or the 'b' button is pressed.

- If their are no rockets in play, either because the last was destroyed or successfully deployed, a new rocket will be prepared to launch on Earth after about 5 seconds.
