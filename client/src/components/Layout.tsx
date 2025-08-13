import NavBar from './NavBar'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <NavBar/>
        {children}
    </div>
  )
}

export default Layout