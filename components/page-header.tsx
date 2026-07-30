import type { ReactNode } from 'react'
import styles from './page-header.module.css'

interface PageHeaderProps {
  titulo: string
  descricao?: string
  acao?: ReactNode
}

export function PageHeader({ titulo, descricao, acao }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.titulo}>{titulo}</h1>
        {descricao && <p className={styles.descricao}>{descricao}</p>}
      </div>
      {acao && <div className={styles.acao}>{acao}</div>}
    </header>
  )
}
