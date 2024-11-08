import { atom } from 'jotai'

export const isLoadingAtom = atom<boolean>(false)
export const errorAtom = atom<string | null>(null)

export type ViewState = 'dm' | 'group' | null

export const currentViewAtom = atom<ViewState>(null)

export type Selection = {
  view: ViewState;
  id: string | null;
}

export const selectionAtom = atom<Selection>({
  view: 'dm',
  id: null
})

export const setSelection = (view: ViewState, id: string | null = null): Selection => {
  return {
    view,
    id
  }
}
