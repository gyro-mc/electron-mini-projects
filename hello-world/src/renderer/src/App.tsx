import React, { useEffect, useState } from 'react';

function App(): React.JSX.Element {
  const [sentence, setSentence] = useState('');

  useEffect(() => {
    window.helloWorldApi.printHelloWorld('Abderrahmane').then((msg: string) => {
      setSentence(msg);
    });
  }, []);

  return (
    <>
      <h1>{sentence}</h1>
    </>
  );
}

export default App;
