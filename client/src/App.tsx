import { useState } from 'react'
import { Button } from "@/components/ui/button"


import './App.css'

function App() {
  

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='text-4xl font-bold '>Welcome to My App</h1>
        <p className='text-lg text-gray-700 py-4'>This is a simple React app styled with Tailwind CSS.</p>
        <Button>Click me</Button>
      </div>
      
    </>
  )
}

export default App
