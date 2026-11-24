'use client'

import { useEffect, useState } from 'react'
import { Wrench, AlertTriangle, Clock, MapPin, Plus, X } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { PageLoading } from '@/components/ui/page-loading'
import { PageHeader } from '@/components/page-header'
import {
  patrimoniosApi,
  unidadesApi,
  type Patrimonio,
  type UnidadeItem,
} from '@/lib/api'
import styles from './manutencao.module.css'

export default function ManutencaoPage() {
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [unidadeItemId, setUnidadeItemId] = useState('')
  const [estado, setEstado] = useState<UnidadeItem['estado']>('MANUTENÇÃO')
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      setPatrimonios(await patrimoniosApi.list())
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : 'Erro ao carregar ocorrências',
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  const unidades = patrimonios.flatMap((item) =>
    (item.unidades ?? []).map((unidade) => ({ item, unidade })),
  )
  const ocorrencias = unidades.filter(
    ({ unidade }) => unidade.estado !== 'ATIVO',
  )
  const manutencoes = ocorrencias.filter(
    ({ unidade }) => unidade.estado === 'MANUTENÇÃO',
  ).length
  const danificados = ocorrencias.filter(
    ({ unidade }) => unidade.estado === 'DANIFICADO',
  ).length
  const extraviados = ocorrencias.filter(
    ({ unidade }) => unidade.estado === 'EXTRAVIADO',
  ).length
  const resumo = [
    { label: 'Em manutenção', valor: manutencoes, icon: Wrench, cor: styles.azul },
    { label: 'Danificados', valor: danificados, icon: AlertTriangle, cor: styles.laranja },
    { label: 'Extraviados', valor: extraviados, icon: Clock, cor: styles.vermelho },
  ]

  async function atualizarEstado(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await unidadesApi.updateState(unidadeItemId, estado)
      setModalAberto(false)
      setUnidadeItemId('')
      setEstado('MANUTENÇÃO')
      await carregar()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar situação')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
    <div>
      <PageHeader
        titulo="Manutenção"
        descricao="Acompanhamento de itens danificados, extraviados ou que necessitam de manutenção."
        acao={
          <button
            type="button"
            className={styles.botaoPrimario}
            data-slot="page-action"
            onClick={() => {
              setErro('')
              setModalAberto(true)
            }}
          >
            <Plus size={17} /> Atualizar situação
          </button>
        }
      />

      {carregando ? (
        <PageLoading variant="maintenance" label="Carregando ocorrências" />
      ) : (
        <>
          {erro && <p style={{ color: '#b42318' }}>{erro}</p>}
          <motion.section
            className={styles.resumo}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {resumo.map(({ label, valor, icon: Icon, cor }) => (
              <motion.article
                key={label}
                className={styles.resumoCard}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className={`${styles.resumoIcon} ${cor}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className={styles.resumoValor}>{valor}</p>
                  <p className={styles.resumoLabel}>{label}</p>
                </div>
              </motion.article>
            ))}
          </motion.section>

          <motion.div
            className={styles.lista}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
            }}
          >
            {ocorrencias.map(({ item, unidade }) => (
              <motion.article
                key={unidade.id}
                className={styles.card}
                layout
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className={styles.cardEsq}>
                  <div className={styles.cardTopo}>
                    <h3 className={styles.cardItem}>{item.nome}</h3>
                    <span
                      className={`${styles.tag} ${
                        unidade.estado === 'MANUTENÇÃO'
                          ? styles.tagManutencao
                          : unidade.estado === 'DANIFICADO'
                            ? styles.tagDanificado
                            : styles.tagExtraviado
                      }`}
                    >
                      {unidade.estado === 'MANUTENÇÃO'
                        ? 'Manutenção'
                        : unidade.estado === 'DANIFICADO'
                          ? 'Danificado'
                          : 'Extraviado'}
                    </span>
                  </div>
                  <p className={styles.cardDesc}>{item.descricao || 'Sem observações cadastradas.'}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.mono}>{item.tombamento}</span>
                    <span>
                      <MapPin size={13} /> {unidade.ambiente?.nome || 'Sem ambiente'}
                    </span>
                    <span>
                      <Clock size={13} /> Cadastrado em{' '}
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <button className={styles.botaoDetalhe}>Ver detalhes</button>
              </motion.article>
            ))}
          </motion.div>
        </>
      )}

      {modalAberto && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !salvando) {
              setModalAberto(false)
              setErro('')
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="atualizar-situacao-titulo"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="atualizar-situacao-titulo">Atualizar situação</h2>
                <p>Selecione uma unidade e informe seu estado atual.</p>
              </div>
              <button
                type="button"
                className={styles.modalFechar}
                onClick={() => {
                  if (!salvando) {
                    setModalAberto(false)
                    setErro('')
                  }
                }}
                disabled={salvando}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </header>

            <form className={styles.modalForm} onSubmit={atualizarEstado}>
              <label className={styles.modalCampo}>
                <span>Patrimônio / unidade</span>
                <select
                  required
                  autoFocus
                  value={unidadeItemId}
                  onChange={(event) => setUnidadeItemId(event.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma unidade
                  </option>
                  {unidades.map(({ item, unidade }) => (
                    <option key={unidade.id} value={unidade.id}>
                      {item.tombamento} — {item.nome}
                      {unidade.ambiente?.nome
                        ? ` · ${unidade.ambiente.nome}`
                        : ' · Sem ambiente'}
                    </option>
                  ))}
                </select>
                {unidades.length === 0 && (
                  <small>Nenhuma unidade patrimonial cadastrada.</small>
                )}
              </label>

              <label className={styles.modalCampo}>
                <span>Situação</span>
                <select
                  required
                  value={estado}
                  onChange={(event) => {
                    const value = event.target.value
                    if (
                      value === 'ATIVO' ||
                      value === 'MANUTENÇÃO' ||
                      value === 'DANIFICADO' ||
                      value === 'EXTRAVIADO'
                    ) {
                      setEstado(value)
                    }
                  }}
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="MANUTENÇÃO">Em manutenção</option>
                  <option value="DANIFICADO">Danificado</option>
                  <option value="EXTRAVIADO">Extraviado</option>
                </select>
              </label>

              <p className={styles.modalInfo}>
                A API registra apenas a situação da unidade; observações e histórico de ocorrências não são armazenados.
              </p>
              {erro && <p className={styles.modalErro}>{erro}</p>}

              <footer className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.modalCancelar}
                  onClick={() => {
                    if (!salvando) {
                      setModalAberto(false)
                      setErro('')
                    }
                  }}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.botaoPrimario}
                  disabled={salvando || unidades.length === 0}
                >
                  {salvando ? 'Salvando...' : 'Salvar situação'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
    </MotionConfig>
  )
}
