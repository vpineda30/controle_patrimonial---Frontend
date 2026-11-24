'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { PageLoading } from '@/components/ui/page-loading'
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
import {
  ambientesApi,
  blocosApi,
  movimentacoesApi,
  patrimoniosApi,
  type Ambiente,
  type Movimentacao,
  type Patrimonio,
} from '@/lib/api'

export default function DashboardPage() {
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [blocos, setBlocos] = useState<Awaited<ReturnType<typeof blocosApi.list>>>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([
      patrimoniosApi.list(),
      ambientesApi.list(),
      movimentacoesApi.list(),
      blocosApi.list(),
    ])
      .then(([items, rooms, moves, blocks]) => {
        setPatrimonios(items)
        setAmbientes(rooms)
        setMovimentacoes(moves)
        setBlocos(blocks)
      })
      .catch((error) =>
        setErro(error instanceof Error ? error.message : 'Erro ao carregar o painel'),
      )
      .finally(() => setCarregando(false))
  }, [])

  const totalUnidades = patrimonios.reduce(
    (total, item) => total + (item.unidades?.length ?? item.quantidade),
    0,
  )
  const emSituacao = patrimonios.reduce(
    (total, item) =>
      total +
      (item.unidades?.filter(
        (unidade) =>
          unidade.estado === 'MANUTENÇÃO' ||
          unidade.estado === 'DANIFICADO',
      ).length ?? 0),
    0,
  )
  const indicadores = [
    { label: 'Total de patrimônios', valor: totalUnidades, detalhe: `${patrimonios.length} tipos cadastrados`, icon: Package },
    { label: 'Ambientes mapeados', valor: ambientes.length, detalhe: `${blocos.length} blocos`, icon: DoorOpen },
    { label: 'Movimentações', valor: movimentacoes.length, detalhe: 'não expiradas', icon: ArrowLeftRight },
    { label: 'Em manutenção', valor: emSituacao, detalhe: 'itens com situação especial', icon: Wrench },
  ]
  const ocupacao = ambientes
    .map((ambiente) => ({
      nome: ambiente.nome,
      qtd: ambiente.unidades?.length ?? 0,
    }))
    .sort((a, b) => b.qtd - a.qtd)
    .slice(0, 5)
  const maiorQtd = Math.max(...ocupacao.map((item) => item.qtd), 1)

  return (
    <div>
      <PageHeader
        titulo="Visão Geral"
        descricao="Acompanhe os bens da escola, movimentações recentes e a ocupação dos ambientes."
        acao={
          <Link href="/cadastro" className={styles.botaoPrimario} data-slot="page-action">
            Cadastrar item
          </Link>
        }
      />

      {erro && <p style={{ color: '#b42318' }}>{erro}</p>}

      {carregando ? (
        <PageLoading variant="dashboard" label="Carregando painel" />
      ) : (
        <>
          <motion.section
            className={styles.indicadores}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {indicadores.map(({ label, valor, detalhe, icon: Icon }) => (
              <motion.article
                key={label}
                className={styles.card}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
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
              </motion.article>
            ))}
          </motion.section>

          <div className={styles.grid}>
            <motion.section
              className={styles.painel}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
            >
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
                      <th>Quantidade</th>
                      <th>Origem</th>
                      <th>Destino</th>
                      <th>Data</th>
                      <th>Expira em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentacoes.slice(0, 5).map((m, indice) => (
                      <motion.tr
                        key={m.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.25 + indice * 0.04 }}
                      >
                        <td className={styles.itemNome}>{m.item.nome}</td>
                        <td className={styles.mono}>{m.item.tombamento}</td>
                        <td>{m.quantidade}</td>
                        <td>{m.origem}</td>
                        <td>{m.destino}</td>
                        <td className={styles.data}>
                          {new Date(m.dataMovimentacao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className={styles.data}>
                          {m.expiresAt
                            ? new Date(m.expiresAt).toLocaleString('pt-BR')
                            : 'Sem vencimento'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            <motion.section
              className={styles.painel}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.28, ease: 'easeOut' }}
            >
              <div className={styles.painelTopo}>
                <h2 className={styles.painelTitulo}>Ocupação por ambiente</h2>
                <Link href="/ambientes" className={styles.verMais}>
                  Ver tudo <ArrowRight size={15} />
                </Link>
              </div>
              <ul className={styles.listaAmbientes}>
                {ocupacao.map((a) => (
                  <li key={a.nome} className={styles.ambienteItem}>
                    <div className={styles.ambienteInfo}>
                      <span className={styles.ambienteNome}>{a.nome}</span>
                      <span className={styles.ambienteQtd}>{a.qtd} itens</span>
                    </div>
                    <div className={styles.barra}>
                      <motion.div
                        className={styles.barraFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((a.qtd / maiorQtd) * 100)}%` }}
                        transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>
        </>
      )}
    </div>
  )
}