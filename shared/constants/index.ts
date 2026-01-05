export const config: {
  ignoreVehicleState: false,
  debug: true,
  notify: {
    error: {
      damaged: "Vehicle's sirens are damaged",
    },
    success: {
      closed: "Remote has been successfuly turned off"
    },
  },
  controls: {
    toggleRemote: {
      commands: {
        enabled: true,
        command: 'extra_toggle_remote'
      },
      key: 'J',
      description: 'Toggle Patrol Extra\'s Remote'
    },
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

export const megaphone = {
  range: 30.0,
  command: 'togglemic',
  key: 'K',
  description: 'Toggle Patrol\'s Mic',
  locales: {
    on: 'Activated',
    off: 'Deactivated',
    left: 'You left the emergency vehicle, mic turned off!',
    refused: 'You must be in an emergency vehicle to use the patrol mic!',
    unavailable: 'Patrol mic is not available right now!',
  },
  vehicleClass: {
    [18]: true,
  },
  vehicleModels: {
    [`ambulance`]: true,
    [`firetruk`]: true,
    [`police`]: true,
    [`police2`]: true,
    [`police3`]: true,
  }
}