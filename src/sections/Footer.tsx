import Link from 'next/link'
import React from 'react'
import XSocial  from "@/assets/social-x.svg"
import InstaSocial from "@/assets/social-instagram.svg"
import YTSocial from "@/assets/social-youtube.svg"
const Footer = () => {
  return (
    <footer className='py-5 border-t border-white/15'>
      <div className='container'>
        <div className='flex md:justify-between items-center md:flex-row flex-col'>
        <div>
          <h1 className='font-bold'>100xDevs</h1>
        </div>
        <div>
          <nav className="flex md:gap-8 gap-3 m-5 items-center text-sm flex-col md:flex-row">
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
        <div className='flex gap-5 text-white/40 '>
          <Link href="https://x.com/kirat_tw" className='hover:text-white'>
          <XSocial/>
          </Link>
          <Link href="https://www.instagram.com/kirat_ins/" className='hover:text-white'>
          <InstaSocial/>
          </Link>
          <Link href="https://www.youtube.com/@harkirat1" className='hover:text-white'>
          <YTSocial/>
          </Link>

        </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer