import NoteCard from './NoteCard'
import { Button } from '@radix-ui/themes'
import { CiSearch } from 'react-icons/ci'
import { useCustomContext } from '@renderer/hooks/UseCustomContext'
import { v4 as uuidv4 } from 'uuid'
import EditNote from './EditNote'
function Home(): React.JSX.Element {

  
  const handleChooseSaveDir = (): void => {
    window.DataSave.handleChooseSaveDir()
  }
  const { setCurrentTab, setTabsData, notes } = useCustomContext()
  function handleCreateNewNote(): void {
    const id = uuidv4()
    console.log(id)
    const date = new Date()
    const name = 'edit note'
    const content = <EditNote data={null} />

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
    <div className="bg-white w-full h-full flex flex-col p-10 items-center">
      <div className="flex flex-row items-center justify-between w-[710px] gap-4">
        <div className="cursor-pointer">
          <Button size={'3'} onClick={() => handleChooseSaveDir()}>
            {' '}
            choose directroy
          </Button>
        </div>
        <div className="rounded-sm border-2 border-black py-1 w-[400px] flex flex-row justify-between px-3 text-lg">
          <input
            type="text"
            placeholder="search for notes"
            className="flex-11/12 focus:outline-none focus:ring-0 focus:border-transparent"
          />
          <button className="font-medium text-xl flex-1/12 flex flex-row justify-end items-center">
            <CiSearch className="" />
          </button>
        </div>
        <div className="cursor-pointer">
          <Button color="green" size={'3'} onClick={() => handleCreateNewNote()}>
            Add Note{' '}
          </Button>
        </div>
      </div>
      <div className="text-black  w-full mt-9 h-full flex flex-row flex-wrap gap-4 justify-center overflow-scroll ">
        {notes.length ? (
          notes.map((note, id) => <NoteCard key={id} data={note} />)
        ) : (
          <div>
            there is no avaiable note , if you want to create a note pls click on the button
            above{' '}
          </div>
        )}
      </div>
    </div>
  )
}
export default Home
