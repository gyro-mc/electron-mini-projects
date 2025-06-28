import { DndContext, closestCenter } from '@dnd-kit/core'
import { useState } from 'react'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from '@dnd-kit/sortable'
import Tab from './components/Tab'

interface TabData {
  id: string
  name: string
}

function App(): React.JSX.Element {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: '01', name: 'Tab 01' },
    { id: '02', name: 'Tab 02' }
  ])

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const oldIndex = tabs.findIndex((tab) => tab.id === active.id)
          const newIndex = tabs.findIndex((tab) => tab.id === over?.id)
          setTabs((items) => arrayMove(items, oldIndex, newIndex))
        }
      }}
    >
      <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
        <div className="bg-emerald-400 w-full h-[50px] flex gap-2 p-2">
          {tabs.map((tab) => (
            <Tab key={tab.id} id={tab.id} name={tab.name} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default App
