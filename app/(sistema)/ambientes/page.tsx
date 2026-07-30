import Link from 'next/link'
import { Search, Plus, DoorOpen, MapPin, Package } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './ambientes.module.css'

const ambientes = [
  { nome: 'Laboratório de Informática 1', bloco: 'Bloco A', itens: 42, resp: 'Coord. TI' },
  { nome: 'Laboratório de Informática 2', bloco: 'Bloco A', itens: 38, resp: 'Coord. TI' },
  { nome: 'Secretaria', bloco: 'Bloco Central', itens: 28, resp: 'Secretaria' },
  { nome: 'Coordenação', bloco: 'Bloco Central', itens: 15, resp: 'Coordenação' },
  { nome: 'Biblioteca', bloco: 'Bloco B', itens: 65, resp: 'Bibliotecária' },
  { nome: 'Auditório', bloco: 'Bloco B', itens: 37, resp: 'Direção' },
  { nome: 'Sala dos Professores', bloco: 'Bloco Central', itens: 22, resp: 'Coordenação' },
  { nome: 'Almoxarifado', bloco: 'Bloco C', itens: 118, resp: 'Almoxarifado' },
  { nome: 'Sala 12', bloco: 'Bloco A', itens: 19, resp: 'Coordenação' },
]

export default function AmbientesPage() {
  return (
    <div>
      <PageHeader
        titulo="Ambientes"
        descricao="Mapeamento dos espaços da escola (salas, blocos, secretaria e demais locais)."
        acao={
          <button className={styles.botaoPrimario}>
            <Plus size={17} /> Novo ambiente
          </button>
        }
      />

      <div className={styles.filtros}>
        <div className={styles.busca}>
          <Search size={17} />
          <input type="text" placeholder="Buscar ambiente..." />
        </div>
        <select className={styles.select} defaultValue="">
          <option value="">Todos os blocos</option>
          <option>Bloco A</option>
          <option>Bloco B</option>
          <option>Bloco C</option>
          <option>Bloco Central</option>
        </select>
      </div>

      <div className={styles.grid}>
        {ambientes.map((a) => (
          <Link
            key={a.nome}
            href="/patrimonios"
            className={styles.card}
          >
            <div className={styles.cardTopo}>
              <div className={styles.icone}>
                <DoorOpen size={20} />
              </div>
              <span className={styles.badge}>{a.itens} itens</span>
            </div>
            <h3 className={styles.nome}>{a.nome}</h3>
            <div className={styles.meta}>
              <span>
                <MapPin size={14} /> {a.bloco}
              </span>
              <span>
                <Package size={14} /> {a.resp}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
