import * as styles from './index.styles'
import NewsLogo from '../../assets/jpnews.png'
import { FaSearch } from 'react-icons/fa'
import { NavbarProps } from './index.types'
import { useState } from 'react'
import { Sidebar } from '../Sidebar'

export const Navbar: React.FC<NavbarProps> = () => {
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.logo}>
        <img src={NewsLogo} alt="news logo" />
      </div>
      <div className={styles.rightNavbar}>
        <div className={styles.subscribeButton}>
          <div>NewsLetter</div>
          <div>Sign in</div>
          <button>Subscribe</button>
        </div>
        <div>
          <div
            onClick={() => setSearchVisible(true)}
            className="cursor-pointer"
          >
            <FaSearch className={'h-5 w-5'} />
          </div>
        </div>
      </div>
    </div>
  )
}
