import { useContext, createContext } from 'react'
import { tabData, noteData } from 'resources/types'
interface CustomContextType {
  tabsData: tabData[]
  setTabsData: React.Dispatch<React.SetStateAction<tabData[]>>
  currentTab: tabData | null
  setCurrentTab: React.Dispatch<React.SetStateAction<tabData | null>>
  notes: noteData[]
  setNotes: React.Dispatch<React.SetStateAction<noteData[]>>
}
export const CustomContext = createContext<CustomContextType | null>(null)
export const useCustomContext = (): CustomContextType => {
  const context = useContext(CustomContext)
  if (!context) throw new Error('useCustomContext must be used inside a provider ')
  return context
}
