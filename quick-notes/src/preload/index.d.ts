import { ElectronAPI } from '@electron-toolkit/preload'
import { noteData } from 'resources/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    titleBar: {
      windowControl: (action: 'minimize' | 'maximize' | 'close') => void
      closeAppWhenTabsEqualZero: () => void
    }
    DataSave: {
      handleChooseSaveDir: () => void
      handleSaveNotes: (notes: noteData[]) => void
    }
  }
}
