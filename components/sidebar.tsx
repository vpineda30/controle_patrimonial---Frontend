'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  DoorOpen,
  Package,
  PlusCircle,
  ArrowLeftRight,
  Wrench,
  Menu,
  X,
} from 'lucide-react'
import styles from './sidebar.module.css'

const links = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/ambientes', label: 'Ambientes', icon: DoorOpen },
  { href: '/patrimonios', label: 'Patrimônios', icon: Package },
  { href: '/cadastro', label: 'Cadastrar Item', icon: PlusCircle },
  { href: '/movimentacao', label: 'Movimentação', icon: ArrowLeftRight },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench },
]

export function Sidebar() {
  const pathname = usePathname()
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <button
        className={styles.toggle}
        onClick={() => setAberto((v) => !v)}
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
      >
        {aberto ? <X size={22} /> : <Menu size={22} />}
      </button>

      {aberto && (
        <div className={styles.overlay} onClick={() => setAberto(false)} />
      )}

      <aside className={`${styles.sidebar} ${aberto ? styles.open : ''}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>SESI SENAI</span>
          <span className={styles.brandSub}>Controle Patrimonial</span>
        </div>

        <nav className={styles.nav}>
          {links.map(({ href, label, icon: Icon }) => {
            const ativo = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.link} ${ativo ? styles.linkAtivo : ''}`}
                onClick={() => setAberto(false)}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.rodape}>
          <div className={styles.usuario}>
            <div className={styles.avatar}>AJ</div>
            <div>
              <p className={styles.usuarioNome}>Ana Julya</p>
              <p className={styles.usuarioCargo}>Secretaria</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
