import { MdModeEditOutline } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { FaExpandAlt } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { noteData } from 'resources/types'
import { useCustomContext } from '@renderer/hooks/UseCustomContext'
import ViewNote from './ViewNote'
import EditNote from './EditNote'
function NoteCard({ data }: { data: noteData }): React.JSX.Element {
  const { notes, setNotes, setTabsData, setCurrentTab } = useCustomContext()
  const handleDeleteNote = (id: string): void => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
  }
  const handleEditNote = (data: noteData): void => {
    const id = uuidv4()
    console.log(id)
    const date = new Date()
    const name = 'edit note'
    const content = <EditNote data={data} />

    setTabsData((tabsData) => [
      ...tabsData,
      {
        id: id,
        time: date,
        name: name,
        content: content
      }
    ])
    setCurrentTab({ id: id, time: date, name: name, content: content })
  }
  const handleExpandNote = (noteId: string): void => {
    const id = uuidv4()
    console.log(id)
    const date = new Date()
    const name = 'edit note'
    const content = <ViewNote data={notes[notes.findIndex((note) => note.id === noteId)]} />

    setTabsData((tabsData) => [
      ...tabsData,
      {
        id: id,
        time: date,
        name: name,
        content: content
      }
    ])
    setCurrentTab({ id: id, time: date, name: name, content: content })
  }
  return (
    <div className="relative group w-[500px] h-[500px]">
      {/* Default view (visible unless hovering) */}
      <div
        className="rounded-sm border-2 border-black z-10 w-full h-full p-4 
                      group-hover:opacity-0 transition-opacity duration-200"
      >
        <h1>title : {data.title}</h1>
        <p>content : {data.content}</p>
      </div>

      {/* Hover view (hidden unless hovering) */}
      <div
        className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100  rounded-sm border-2 border-black
                      backdrop-blur-lg  text-5xl flex flex-row items-center 
                      gap-10 justify-center transition-opacity duration-200"
      >
        <button className="text-green-400 cursor-pointer" onClick={() => handleEditNote(data)}>
          <MdModeEditOutline />
        </button>
        <button
          className="text-yellow-200 cursor-pointer"
          onClick={() => handleExpandNote(data.id)}
        >
          <FaExpandAlt />
        </button>
        <button className="text-red-400 cursor-pointer" onClick={() => handleDeleteNote(data.id)}>
          <MdDelete />
        </button>
      </div>
    </div>
  )
}

export default NoteCard
