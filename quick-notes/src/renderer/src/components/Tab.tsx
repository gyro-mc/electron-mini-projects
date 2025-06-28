// Tab.tsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IoMdClose } from 'react-icons/io'
import { tabData } from 'resources/types'
import { useCustomContext } from '@renderer/hooks/UseCustomContext'
function Tab({ id, data }: { id: string; data: tabData }): React.JSX.Element {
  function handleCloseTab(id: string): void {
    const updatedTabData = tabsData.filter((tab) => tab.id !== id)

    setTabsData(updatedTabData)
    if (updatedTabData.length < 1) {
      console.log('the app shoud be closed')
      window.titleBar.closeAppWhenTabsEqualZero()
    }
    setCurrentTab(updatedTabData[updatedTabData.length - 1])
  }
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const { tabsData, currentTab, setTabsData, setCurrentTab } = useCustomContext()
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    WebkitAppRegion: 'no-drag'
  }

  // Determine if this tab is the current tab by comparing with context
  const isActive = currentTab?.id === data.id

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={` p-2 px-3 rounded-lg cursor-pointer text-white select-none flex flex-row gap-2 items-center ${isActive ? 'bg-zinc-950' : 'bg-zinc-600'}`}
    >
      {data.name}
      <button onMouseDown={() => handleCloseTab(data.id)} className="cursor-pointer">
        <IoMdClose />
      </button>
    </div>
  )
}

export default Tab
