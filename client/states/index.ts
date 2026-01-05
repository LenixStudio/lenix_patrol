export let isUiOpen = false
export let inVehicle = false
export let vehicle: number = 0

export const setState = {
  remoteBusy: (state: boolean) => { getState.remoteBusy = state },
  vehicleBusy: (state: boolean) => { getState.vehicleBusy = state },
  vehicleHandle: (handle: number) => { getState.vehicleHandle = handle },

  micNotBusy: (state: boolean) => { getState.micNotBusy = state },
  micFilter: (filter: any) => { getState.micFilter = filter },
  micBusy: (state: boolean) => { getState.micBusy = state },
  micCurrentlyBusy: (state: boolean) => { getState.micCurrentlyBusy = state },
}

export const getState = {
  remoteBusy: false,
  vehicleBusy: false,
  vehicleHandle: 0,

  micNotBusy: true,
  micFilter: null,
  micBusy: false,
  micCurrentlyBusy: false,
}

// WTF BRO, did you see what i see? maaan hemmmm