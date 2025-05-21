import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Provider } from './provider'

const montserrat = Montserrat({subsets: ['latin'], display: 'swap'})

export const metadata: Metadata = {
  title: 'Twiter X',
  description: 'Twiter x clone for using!',
  icons: { icon: '/images/x.svg'}
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Provider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
          {children}
        </Provider>
      </body>
    </html>
  )
}
