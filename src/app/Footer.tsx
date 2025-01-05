import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='text-white font-sans pt-20 pb-10'>
      <div className='flex flex-col md:flex-row text-center justify-around'>
        <span>Copyright © 2025 <Link href="https://www.mohamedmehdi.me/" target='_blank' className='font-medium'>Mohamed Mehdi</Link></span>
        <span>Powered by <Link href="https://www.mohamedmehdi.me/" target='_blank' className='font-medium'>Mohamed Mehdi</Link></span>
      </div>
    </div>
  )
}
