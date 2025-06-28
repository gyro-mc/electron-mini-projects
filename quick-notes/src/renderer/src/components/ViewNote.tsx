import React from 'react'
import { noteData } from 'resources/types'

function ViewNote({ data }: { data: noteData }): React.JSX.Element {
  return (
    <div className="m-[1%] p-3 h-full w-full border-2 border-black ">
      <div>
        <h1>title :</h1>
        <h2>{data.title}</h2>
      </div>
      <div>
        <h1>content</h1>
        <h3>{data.content}</h3>
      </div>
    </div>
  )
}
export default ViewNote
