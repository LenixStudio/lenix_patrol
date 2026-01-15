return {
    range = 30.0,
    command = 'togglemic',
    key = 'K',
    description = 'Toggle Patrol\'s Mic',
    locales = {
        on = 'Activated',
        off = 'Deactivated',
        left = 'You left the emergency vehicle, mic turned off!',
        refused = 'You must be in an emergency vehicle to use the patrol mic!',
        unavailable = 'Patrol mic is not available right now!',
    },
    vehicleClass = {
        [18] = true,
    },
    vehicleModels = {
        [`ambulance`] = true,
        [`firetruk`] = true,
        [`police`] = true,
        [`police2`] = true,
        [`police3`] = true,
    }
}