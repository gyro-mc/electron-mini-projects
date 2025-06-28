import { noteData } from 'resources/types'
import { useCustomContext } from '@renderer/hooks/UseCustomContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
interface noteFormInputs {
  title: string
  content: string
}

function EditNote({ data }: { data: noteData | null }): React.JSX.Element {
  const { notes, setNotes, tabsData, setTabsData, currentTab, setCurrentTab } = useCustomContext()
  function handleCloseTab(id: string): void {
    const updatedTabData = tabsData.filter((tab) => tab.id !== id)

    setTabsData(updatedTabData)
    if (updatedTabData.length < 1) {
      console.log('the app shoud be closed')
      window.titleBar.closeAppWhenTabsEqualZero()
    }
    setCurrentTab(updatedTabData[updatedTabData.length - 1])
  }
  const { register, handleSubmit } = useForm<noteFormInputs>()
  const onSubmit: SubmitHandler<noteFormInputs> = (data) => {
    setNotes([
      ...notes,
      { id: uuidv4(), title: data.title, time: new Date(), content: data.content }
    ])
    handleCloseTab(currentTab?.id ?? '')
  }
  return (
    <div className="rounded-sm border-2 h-full m-2 p-4">
      {
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
          <div>
            <h1>title : </h1>
            <input
              value={data ? notes[notes.findIndex((note) => note.id == data.id)].title : undefined}
              {...register('title', { required: true, maxLength: 20 })}
              className="border-2 border-black p-2"
            />
          </div>
          <div>
            <h1>content :</h1>
            <input
              value={
                data ? notes[notes.findIndex((note) => note.id == data.id)].content : undefined
              }
              {...register('content', { required: true })}
              className="border-2 border-black w-[80vw] align-top h-20"
            />
          </div>
          <input type="submit" className="bg-green-400 p-2 rounded-sm cursor-pointer w-[30%]" />
        </form>
      }
    </div>
  )
}
export default EditNote
