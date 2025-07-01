import { ClipLoader } from 'react-spinners'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { GoFileDirectory } from 'react-icons/go'
import { Button } from '@radix-ui/themes'
function App(): React.JSX.Element {
  const [selectedDir, setSelectedDir] = useState<string | null>(null)
  console.log(selectedDir)
  async function handleClickButton(): Promise<void> {
    const result = await window.api.chooseDir()
    if (result) {
      setSelectedDir(result)
      console.log('Selected directory:', result)
    } else {
      console.log('User cancelled the dialog')
    }
  }
  const [intro, setIntro] = useState<boolean>(true)
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 5000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="">
      {intro ? (
        <div className="flex flex-col items-center gap-44">
          <motion.h1
            className="text-6xl font-bold h-auto bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent loading-[3rem] text-center p-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, y: -100 }}
            transition={{
              delay: 4,
              duration: 1
            }}
          >
            Welcome to <br />
            File Organizer
          </motion.h1>
          <motion.div
            initial={{}}
            animate={{ opacity: 0 }}
            transition={{
              delay: 4,
              duration: 1
            }}
          >
            <ClipLoader size={100} color="pink" />
          </motion.div>
        </div>
      ) : (
        <div className="text-4xl flex flex-row gap-5">
          <h1>Please choose a directory</h1>
          <Button className="cursor-pointer " onClick={() => handleClickButton()}>
            <GoFileDirectory />
          </Button>
        </div>
      )}
    </div>
  )
}
export default App
