import { useEffect, useState } from 'react'
import TitleBar from './components/TitleBar'
import { CustomContext } from './hooks/UseCustomContext'
import { tabData } from 'resources/types'
import { noteData } from 'resources/types'
import toast, { Toaster } from 'react-hot-toast'
function App(): React.JSX.Element {
  const [tabsData, setTabsData] = useState<tabData[]>([])
  const [currentTab, setCurrentTab] = useState<null | tabData>(null)
  const [notes, setNotes] = useState<noteData[]>([])
  // useEffect(() => {
  //   const save = async (): Promise<void> => {
  //     await window.DataSave.handleSaveNotes(notes)
  //   }
  //
  //   save()
  // }, [notes])

  return (
    <CustomContext.Provider
      value={{ tabsData, setTabsData, currentTab, setCurrentTab, notes, setNotes }}
    >
      <div className="h-[100vh] w-full flex flex-col text-black overflow-hidden">
        <div>
          <TitleBar />
        </div>
        {currentTab ? currentTab.content : null}
      </div>
    </CustomContext.Provider>
  )
}

export default App
