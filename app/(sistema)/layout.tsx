import { Sidebar } from '@/components/sidebar'
import styles from './layout.module.css'

export default function SistemaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={styles.app}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
