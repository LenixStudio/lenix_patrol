# lenix_patrolextras
Remote to control the patrol's extras, designed for cars that has configurable siren from the extras

## About
### Introduction
Welcome to Patrol Extras.

This script is designed to enhance your server's gameplay by:
* giving the ability to your players to control their patrol's extras with a smoth UI control panel, such as toggling the siren's lights. Also this script is build with maners that doesn't heat up the device's resources, either on the client or the server, plus it can be easily integrated with your existing server setup
* not always it will change the siren's light, it depends on your patrol's extras, please test your vehicles first and make sure that you vehicle has siren light on the extras
* a Microphone comes integrated with your patrol vehicle so your officers can talk to anyone loudly just from the their patrol.

### Instructions
 * Installation: 
   * Node.js: make sure you have the Node.js installed on your device, to do so run: 
    ```bash
    node -v
    ```
    1. run: npm i
    2. run: npm run build
 * Environment: QB
 * Support: available

> Enjoy your improved gaming experience with Patrol Extra!

<img width="321" height="408" alt="patrolextras1" src="https://github.com/user-attachments/assets/d489bb74-db72-41cc-921a-573da6001d53" />
<img width="321" height="405" alt="patrolextras2" src="https://github.com/user-attachments/assets/e5f95b00-c4c2-40b7-b5af-9465197c9305" />

## Imports

### Exports
### toggleRemote
```lua
exports.lenix_patrolextras:toggleRemote()
```

### toggleCursor
```lua
exports.lenix_patrolextras:toggleCursor()
```

### Events
### toggleRemote
```lua
TriggerEvent('lenix_patrolextras:client:toggleRemote')
```

### toggleCursor
```lua
TriggerEvent('lenix_patrolextras:client:toggleCursor')
```

## Configuration
```ts
const extras = {
  // false: if the patrol is damaged, the officer won't be able to use some buttons
  ignoreVehicleState: false,
  // enable the debuging command mode
  debug: false,
  // notification locales
  notify: {
    error: {
      damaged: "Vehicle's sirens are damaged",
    },
    success: {
      closed: "Remote has been successfully turned off"
    },
  },
  // user interactions
  controls: {
    toggleRemote: {
      commands: {
        enabled: true,
        command: 'extra_toggle_remote'
      },
      key: 'J',
      description: 'Toggle Patrol Extra\'s Remote'
    },
    // configure the keybinds settings
    toggleCursor: {
      commands: {
        enabled: true,
        command: 'extra_toggle_cursor'
      },
      key: 'F11',
      description: 'Toggle Patrol Extra Cursor',
    }
  }
}

const megaphone: {
  /**@field Range number Voice transmission range in units when microphone is active*/
  range: 30.0,
  /**@field Command string Chat command to toggle microphone on/off*/
  command: 'togglemic',
  /**@field Key string Default keybind for microphone toggle*/
  key: 'K',
  /**@field Description string Help text displayed for the keybind/command*/
  description: 'Toggle Patrol\'s Mic',
  /**@field Locales in string update your translation*/
  locales: {
    on: 'Activated',
    off: 'Deactivated',
    left: 'You left the emergency vehicle, mic turned off!',
    refused: 'You must be in an emergency vehicle to use the patrol mic!',
    unavailable: 'Patrol mic is not available right now!',
  },
  
  vehicleClass: {
    [18]: true, // Emergency vehicles
  },
  // or
  vehicleClass: {}  // Disable class-based authorization
  
  /**@field VehicleModels table Specific vehicle models eligible for microphone system (by hash)*/
  vehicleModels: {
    [`ambulance`]: true,
    [`firetruk`]: true,
    [`police`]: true,
    [`police2`]: true,
    [`police3`]: true,
  }
}
```