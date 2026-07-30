import Link from 'next/link'
import {
  Package,
  DoorOpen,
  ArrowLeftRight,
  Wrench,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './dashboard.module.css'

const indicadores = [
  {
    label: 'Total de patrimônios',
    valor: '1.284',
    detalhe: '+32 este mês',
    icon: Package,
  },
  {
    label: 'Ambientes mapeados',
    valor: '48',
    detalhe: '5 blocos',
    icon: DoorOpen,
  },
  {
    label: 'Movimentações',
    valor: '76',
    detalhe: 'últimos 30 dias',
    icon: ArrowLeftRight,
  },
  {
    label: 'Em manutenção',
    valor: '19',
    detalhe: '4 aguardando',
    icon: Wrench,
  },
]

const movimentacoes = [
  {
    item: 'Notebook Dell Latitude',
    tomb: 'PT-004512',
    origem: 'Almoxarifado',
    destino: 'Lab. Informática 2',
    data: '28/07',
  },
  {
    item: 'Projetor Epson X400',
    tomb: 'PT-002301',
    origem: 'Sala 12',
    destino: 'Auditório',
    data: '27/07',
  },
  {
    item: 'Cadeira Giratória',
    tomb: 'PT-008874',
    origem: 'Secretaria',
    destino: 'Coordenação',
    data: '26/07',
  },
  {
    item: 'Impressora HP LaserJet',
    tomb: 'PT-001190',
    origem: 'Sala dos Professores',
    destino: 'Secretaria',
    data: '25/07',
  },
]

const ambientes = [
  { nome: 'Laboratório de Informática 1', qtd: 42, ocupacao: 92 },
  { nome: 'Secretaria', qtd: 28, ocupacao: 74 },
  { nome: 'Biblioteca', qtd: 65, ocupacao: 58 },
  { nome: 'Auditório', qtd: 37, ocupacao: 40 },
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        titulo="Visão Geral"
        descricao="Acompanhe os bens da escola, movimentações recentes e a ocupação dos ambientes."
        acao={
          <Link href="/cadastro" className={styles.botaoPrimario}>
            Cadastrar item
          </Link>
        }
      />

      <section className={styles.indicadores}>
        {indicadores.map(({ label, valor, detalhe, icon: Icon }) => (
          <article key={label} className={styles.card}>
            <div className={styles.cardIcon}>
              <Icon size={20} />
            </div>
            <div>
              <p className={styles.cardLabel}>{label}</p>
              <p className={styles.cardValor}>{valor}</p>
              <p className={styles.cardDetalhe}>
                <TrendingUp size={13} /> {detalhe}
              </p>
            </div>
          </article>
        ))}
      </section>

      <div className={styles.grid}>
        <section className={styles.painel}>
          <div className={styles.painelTopo}>
            <h2 className={styles.painelTitulo}>Movimentações recentes</h2>
            <Link href="/movimentacao" className={styles.verMais}>
              Ver tudo <ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.tabelaWrap}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Tombamento</th>
                  <th>Origem</th>
                  <th>Destino</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((m) => (
                  <tr key={m.tomb}>
                    <td className={styles.itemNome}>{m.item}</td>
                    <td className={styles.mono}>{m.tomb}</td>
                    <td>{m.origem}</td>
                    <td>{m.destino}</td>
                    <td className={styles.data}>{m.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.painel}>
          <div className={styles.painelTopo}>
            <h2 className={styles.painelTitulo}>Ocupação por ambiente</h2>
            <Link href="/ambientes" className={styles.verMais}>
              Ver tudo <ArrowRight size={15} />
            </Link>
          </div>
          <ul className={styles.listaAmbientes}>
            {ambientes.map((a) => (
              <li key={a.nome} className={styles.ambienteItem}>
                <div className={styles.ambienteInfo}>
                  <span className={styles.ambienteNome}>{a.nome}</span>
                  <span className={styles.ambienteQtd}>{a.qtd} itens</span>
                </div>
                <div className={styles.barra}>
                  <div
                    className={styles.barraFill}
                    style={{ width: `${a.ocupacao}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
