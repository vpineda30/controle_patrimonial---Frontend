'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [usuario, setUsuario] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      try {
        setUsuario(JSON.parse(stored))
      } catch {
        setUsuario(null)
      }
    }
  }, [])

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
            <div className={styles.avatar}>
              {usuario?.name
                ?.split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'US'}
            </div>
            <div>
              <p className={styles.usuarioNome}>{usuario?.name || 'Usuário'}</p>
              <p className={styles.usuarioCargo}>{usuario?.role || 'Autenticado'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
