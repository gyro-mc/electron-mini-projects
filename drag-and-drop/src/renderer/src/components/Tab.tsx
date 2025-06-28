import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
function Tab({ id, name }: { id: string; name: string }): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    WebkitAppRegion: 'no-drag'
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-zinc-700 p-2 px-4 rounded-lg cursor-pointer text-white select-none"
    >
      {name}
    </div>
  )
}
export default Tab
