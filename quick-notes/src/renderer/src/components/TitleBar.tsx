// TitleBar.tsx
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { VscChromeMinimize, VscChromeMaximize } from 'react-icons/vsc'
import { v4 as uuidv4 } from 'uuid'
import Tab from './Tab'
import Home from './Home'
import { IoMdAddCircle } from 'react-icons/io'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { useCustomContext } from '@renderer/hooks/UseCustomContext'
function TitleBar(): React.JSX.Element {
  const { tabsData, setTabsData, setCurrentTab } = useCustomContext()

  useEffect(() => {
    const id = uuidv4()
    const time = new Date()
    const name = 'Home'
    setTabsData([{ id: id, time: time, name: name, content: <Home /> }])
    setCurrentTab({ id: id, time: time, name: name, content: <Home /> })
  }, [])
  function handleAddTab(): void {
    const newId = uuidv4()
    const newTime = new Date()
    setTabsData((tabsData) => [
      ...tabsData,
      {
        id: newId,
        time: newTime,
        name: tabsData.length < 9 ? `Tab 0${tabsData.length + 1}` : `Tab ${tabsData.length + 1}`,
        content: <Home />
      }
    ])
    setCurrentTab({
      id: newId,
      time: newTime,
      name: 'new Tab',
      content: <Home />
    })
  }

  const handleControl = (action: 'minimize' | 'maximize' | 'close'): void => {
    window.titleBar.windowControl(action)
  }
  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const oldIndex = tabsData.findIndex((tab) => tab.id === active.id)
          const newIndex = tabsData.findIndex((tab) => tab.id === over?.id)
          setTabsData((items) => arrayMove(items, oldIndex, newIndex))
        } else {
          setCurrentTab(tabsData.find((tab) => tab.id === active.id) || null)
        }
      }}
    >
      <div
        style={{ WebkitAppRegion: 'drag' }}
        className="w-full h-12 bg-gray-100 text-white flex items-center justify-between px-2 items-center select-none"
      >
        <SortableContext items={tabsData.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-row gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
            {tabsData.map((tab) => (
              <Tab key={tab.id} id={tab.id} data={tab} />
            ))}
            <div className=" text-4xl flex flex-row items-center ">
              <IoMdAddCircle
                className="text-black cursor-pointer hover:text-gray-800"
                onClick={() => handleAddTab()}
              />
            </div>
          </div>
        </SortableContext>

        <div className="flex gap-5 text-lg" style={{ WebkitAppRegion: 'no-drag' }}>
          <button onClick={() => handleControl('minimize')} className="text-black cursor-pointer">
            <VscChromeMinimize />
          </button>
          <button onClick={() => handleControl('maximize')} className="text-black cursor-pointer">
            <VscChromeMaximize />
          </button>
          <button onClick={() => handleControl('close')} className="text-black cursor-pointer">
            <IoClose />
          </button>
        </div>
      </div>
    </DndContext>
  )
}

export default TitleBar
