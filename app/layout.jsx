import '@styles/globals.css';
import {ImageProvider} from '@/components/ImageContext';

export const metadata ={
    title: "Recylink",
    description: "A Digital platform that facilitates seamless reporting and resolution of waste management"
}

const Rootlayout = ({children}) => {
  return (
    <html lang='en'>
      <ImageProvider>
      <body className='app'>
        {children}
      </body>
      </ImageProvider>
    </html>
  )
}

export default Rootlayout;
