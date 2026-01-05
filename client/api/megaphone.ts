import { info } from "@trippler/tr_lib/shared"
import { toggleMegaphone } from "../modules/megaphone"

export const Bridge = {
  drawtext: {
    show: (key: string | null, text: string) => {
      info`you haven't set your drawtext function yet :(`
    },
    hide: () => {
      info`you haven't set your drawtext function yet :(`
    },
  },
  voice: {
    clearProximityOverride: exports["pma-voice"].clearProximityOverride(),
    overrideProximityRange: (range: number, _: boolean) => exports["pma-voice"].overrideProximityRange(range, _)

  },
  notify: (message: string, type?: string, duration?: number) => exports['qb-core'].Notify(message, type, duration)
}

onNet('lenix_patrolmegaphone:client:toggle', toggleMegaphone)