import { onNuiCallback } from "@trippler/tr_lib/nui"
import { state } from "../states"
import { fadeIn, fadeOut, initializeUI, updateSirenIndicators } from "../modules/extras"

onNuiCallback<[boolean[], boolean[], boolean[]]>('open', (unAvailableExtras, activeExtras, inActiveExtras) =>  {
  state.unAvailableExtras = unAvailableExtras
  state.activeExtras = activeExtras
  state.inActiveExtras = inActiveExtras

  initializeUI()
  fadeIn()
})

onNuiCallback('close', () =>  {
  fadeOut()
})

onNuiCallback('sirenCheck', (sirenOn: boolean) =>  {
  if (!sirenOn) return
  state.isSirenOn = sirenOn
  updateSirenIndicators()
})
