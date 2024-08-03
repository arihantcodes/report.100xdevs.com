import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <h1 className='font-bold'>100xDevs</h1>
        </div>
        <div>
          <nav className="flex gap-8 text-sm ">
            <Link
              className="text-white/70 hover:text-white transition"
              href="https://harkirat.classx.co.in/terms"
            >
              Terms & Conditions
            </Link>
            <Link
              className="text-white/70 hover:text-white transition"
              href="https://harkirat.classx.co.in/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-white/70 hover:text-white transition"
              href="https://harkirat.classx.co.in/refund-policy"
            >
              Refunds & Cancellation Policy
            </Link>
          </nav>
        </div>
        <div>
          
        </div>
        
      </div>
    </footer>
  )
}

export default Footer