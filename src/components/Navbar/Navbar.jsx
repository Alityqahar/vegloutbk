import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.left}>
                    <div className={styles.logo}>
                        <Link to="/">VegloUTBK</Link>
                    </div>
                    <ul className={styles.menu}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/materi">Materi</Link>
                        </li>
                        <li>
                            <Link to="/latsol">Latsol</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.right}>
                    <Link to="/login" className={styles.loginBtn}>
                        Login
                    </Link>
                    <Link to="/register" className={styles.loginBtn}>
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}