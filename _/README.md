# lenix_patrolextras
Remote to control the patrol's extras, designed for cars that has configurable siren from the extras

## About
### Introduction
Welcome to Patrol Extras.

This script is designed to enhance your server's gameplay by:
* giving the ability to your players to control their patrol's extras with a smoth UI control panel, such as toggling the siren's lights. Also this script is build with maners that doesn't heat up the device's resources, either on the client or the server, plus it can be easily integrated with your existing server setup
* not always it will change the siren's light, it depends on your patrol's extras, please test your vehicles first and make sure that you vehicle has siren light on the extras

### Instructions
 * Installation: drag and drop
 * Environment: standalone
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

## Config
```lua
  return {
      -- false: if the patrol is damaged, the officer won't be able to use some buttons
      ignoreVehicleState = false,
      -- enable the debuging command mode
      debug = false,
      -- notification locales
      notify = {
          error = {
              damaged = "Vehicle's sirens are damaged",
          },
          success = {
              closed = "Remote has been successfully turned off"
          },
      },
      -- user interactions
      controls = {
          toggleRemote = {
              commands = {
                  enabled = true,
                  command = 'extra_toggle_remote'
              },
              key = 'J',
              description = 'Toggle Patrol Extra\'s Remote'
          },
          -- configure the keybinds settings
          toggleCursor = {
              commands = {
                  enabled = true,
                  command = 'extra_toggle_cursor'
              },
              key = 'F11',
              description = 'Toggle Patrol Extra Cursor',
          }
      }
  }
```
