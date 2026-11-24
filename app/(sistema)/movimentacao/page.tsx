'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { PageHeader } from '@/components/page-header'
import {
  ambientesApi,
  blocosApi,
  movimentacoesApi,
  patrimoniosApi,
  type Ambiente,
  type Bloco,
  type Movimentacao,
  type Patrimonio,
} from '@/lib/api'
import styles from './movimentacao.module.css'

const SEM_LOCALIZACAO = '__sem-localizacao__'

type SaldoAmbiente = {
  id: string
  ambienteId: string | null
  nome: string
  quantidade: number
}

function dataHoraLocalMinima() {
  const agora = new Date()
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset())
  return agora.toISOString().slice(0, 16)
}

function obterSaldos(item?: Patrimonio): SaldoAmbiente[] {
  if (!item) return []

  const saldos = new Map<string, SaldoAmbiente>()
  for (const unidade of item.unidades ?? []) {
    const id = unidade.ambienteId ?? SEM_LOCALIZACAO
    const saldo = saldos.get(id)
    if (saldo) {
      saldo.quantidade += 1
    } else {
      saldos.set(id, {
        id,
        ambienteId: unidade.ambienteId,
        nome: unidade.ambiente?.nome ?? 'Sem localização',
        quantidade: 1,
      })
    }
  }

  return Array.from(saldos.values())
}

function CarregamentoMovimentacao() {
  return (
    <motion.div
      className={styles.layout}
      role="status"
      aria-label="Carregando dados da movimentação"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.form} aria-hidden="true">
        <div className={`${styles.esqueleto} ${styles.esqueletoTitulo}`} />
        {[0, 1, 2, 3].map((campo) => (
          <div className={styles.esqueletoCampo} key={campo}>
            <div className={`${styles.esqueleto} ${styles.esqueletoLabel}`} />
            <div className={`${styles.esqueleto} ${styles.esqueletoControle}`} />
          </div>
        ))}
      </div>
      <div className={styles.historico} aria-hidden="true">
        <div className={`${styles.esqueleto} ${styles.esqueletoTitulo}`} />
        {[0, 1, 2].map((evento) => (
          <div className={styles.esqueletoEvento} key={evento}>
            <div className={`${styles.esqueleto} ${styles.esqueletoEventoTitulo}`} />
            <div className={`${styles.esqueleto} ${styles.esqueletoEventoTexto}`} />
            <div className={`${styles.esqueleto} ${styles.esqueletoEventoMeta}`} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function MovimentacaoPage() {
  const [historico, setHistorico] = useState<Movimentacao[]>([])
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [blocos, setBlocos] = useState<Bloco[]>([])
  const [blocoId, setBlocoId] = useState('')
  const [ambienteId, setAmbienteId] = useState('')
  const [itemId, setItemId] = useState('')
  const [destinoId, setDestinoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [expiraEm, setExpiraEm] = useState('')
  const [resp, setResp] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const itemSelecionado = patrimonios.find((item) => item.id === itemId)
  const saldos = obterSaldos(itemSelecionado)
  const saldoOrigem = saldos.find((saldo) => saldo.ambienteId === ambienteId)
  const ambientesDoBloco = ambientes.filter((ambiente) => ambiente.blocoId === blocoId)
  const itensDoAmbiente = patrimonios.filter((item) =>
    obterSaldos(item).some((saldo) => saldo.ambienteId === ambienteId),
  )

  async function carregar() {
    setCarregando(true)
    try {
      const [moves, items, rooms, blocks] = await Promise.all([
        movimentacoesApi.list(),
        patrimoniosApi.list(),
        ambientesApi.list(),
        blocosApi.list(),
      ])
      setHistorico(moves)
      setPatrimonios(items)
      setAmbientes(rooms)
      setBlocos(blocks)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar movimentações')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function selecionarBloco(id: string) {
    setBlocoId(id)
    setAmbienteId('')
    setItemId('')
    setDestinoId('')
    setQuantidade('1')
  }

  function selecionarAmbiente(id: string) {
    setAmbienteId(id)
    setItemId('')
    setDestinoId('')
    setQuantidade('1')
  }

  function selecionarItem(id: string) {
    setItemId(id)
    setDestinoId('')
    setQuantidade('1')
  }

  async function registrar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')

    const quantidadeNumerica = Number(quantidade)
    if (!saldoOrigem || !Number.isSafeInteger(quantidadeNumerica) ||
      quantidadeNumerica < 1 || quantidadeNumerica > saldoOrigem.quantidade) {
      setErro('Informe uma quantidade disponível no ambiente de origem.')
      return
    }

    const dataExpiracao = new Date(expiraEm)
    if (!expiraEm || Number.isNaN(dataExpiracao.getTime()) ||
      dataExpiracao.getTime() <= Date.now()) {
      setErro('Informe uma data e hora de expiração futuras.')
      return
    }

    setSalvando(true)
    try {
      await movimentacoesApi.create({
        itemId,
        origemAmbienteId: saldoOrigem.ambienteId,
        destinoAmbienteId: destinoId,
        quantidade: quantidadeNumerica,
        resp,
        expiresAt: dataExpiracao.toISOString(),
      })
      setBlocoId('')
      setAmbienteId('')
      setItemId('')
      setDestinoId('')
      setQuantidade('1')
      setExpiraEm('')
      setResp('')
      await carregar()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao registrar movimentação')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div>
        <PageHeader
          titulo="Movimentação"
          descricao="Transfira uma quantidade de itens entre ambientes."
        />

        <AnimatePresence mode="wait" initial={false}>
          {carregando ? (
            <CarregamentoMovimentacao key="carregando" />
          ) : (
            <motion.div
              key="conteudo"
              className={styles.layout}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
                <form className={styles.form} onSubmit={registrar}>
                  <h2 className={styles.formTitulo}>Nova movimentação</h2>

                  <div className={styles.campo}>
                    <label htmlFor="bloco">Bloco</label>
                    <select
                      id="bloco"
                      required
                      value={blocoId}
                      onChange={(event) => selecionarBloco(event.target.value)}
                    >
                      <option value="" disabled>Selecione um bloco</option>
                      {blocos.map((bloco) => (
                        <option key={bloco.id} value={bloco.id}>
                          Bloco {bloco.numero ?? 'sem número'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.campo}>
                    <label htmlFor="origem">Ambiente de origem</label>
                    <select
                      id="origem"
                      required
                      value={ambienteId}
                      onChange={(event) => selecionarAmbiente(event.target.value)}
                      disabled={!blocoId}
                    >
                      <option value="" disabled>Selecione um ambiente</option>
                      {ambientesDoBloco.map((ambiente) => (
                        <option key={ambiente.id} value={ambiente.id}>
                          {ambiente.nome}
                        </option>
                      ))}
                    </select>
                    {blocoId && ambientesDoBloco.length === 0 && (
                      <small>Este bloco não possui ambientes cadastrados.</small>
                    )}
                  </div>

                  <div className={styles.campo}>
                    <label htmlFor="item">Item / Tombamento</label>
                    <select
                      id="item"
                      required
                      value={itemId}
                      onChange={(event) => selecionarItem(event.target.value)}
                      disabled={!ambienteId}
                    >
                      <option value="" disabled>
                        {ambienteId ? 'Selecione um item' : 'Selecione primeiro um ambiente'}
                      </option>
                      {itensDoAmbiente.map((item) => {
                        const saldo = obterSaldos(item).find((atual) => atual.ambienteId === ambienteId)
                        return (
                          <option key={item.id} value={item.id}>
                            {item.tombamento} - {item.nome} ({saldo?.quantidade ?? 0} disponíveis)
                          </option>
                        )
                      })}
                    </select>
                    {ambienteId && itensDoAmbiente.length === 0 && (
                      <small>Não há itens disponíveis para movimentar neste ambiente.</small>
                    )}
                  </div>

                  <div className={styles.trajeto}>
                    <div className={styles.campo}>
                      <span>Origem selecionada</span>
                      <div className={styles.origemSelecionada}>
                        {saldoOrigem?.nome ?? 'Selecione o item'}
                      </div>
                    </div>
                    <div className={styles.seta}>
                      <ArrowRight size={20} />
                    </div>
                    <div className={styles.campo}>
                      <label htmlFor="destino">Destino</label>
                      <select
                        id="destino"
                        required
                        value={destinoId}
                        onChange={(event) => setDestinoId(event.target.value)}
                        disabled={!saldoOrigem}
                      >
                        <option value="" disabled>Novo ambiente...</option>
                        {ambientes
                          .filter((ambiente) => ambiente.id !== saldoOrigem?.ambienteId)
                          .map((ambiente) => (
                            <option key={ambiente.id} value={ambiente.id}>
                              {ambiente.nome}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.campo}>
                    <label htmlFor="quantidade">Quantidade a transferir</label>
                    <input
                      id="quantidade"
                      type="number"
                      min="1"
                      max={saldoOrigem?.quantidade}
                      step="1"
                      required
                      value={quantidade}
                      onChange={(event) => setQuantidade(event.target.value)}
                      disabled={!saldoOrigem}
                    />
                    {saldoOrigem && (
                      <small>{saldoOrigem.quantidade} unidade(s) disponíveis na origem.</small>
                    )}
                  </div>

                  <div className={styles.campo}>
                    <label htmlFor="expiraEm">Data e hora de expiração</label>
                    <input
                      id="expiraEm"
                      type="datetime-local"
                      min={dataHoraLocalMinima()}
                      required
                      value={expiraEm}
                      onChange={(event) => setExpiraEm(event.target.value)}
                    />
                    <small>Após esse horário, a movimentação deixa de aparecer no histórico.</small>
                  </div>

                  <div className={styles.campo}>
                    <label htmlFor="resp">Responsável</label>
                    <input
                      id="resp"
                      type="text"
                      required
                      value={resp}
                      onChange={(event) => setResp(event.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>

                  {erro && <p role="alert" style={{ color: '#b42318', margin: 0 }}>{erro}</p>}
                  <button
                    type="submit"
                    className={styles.botaoPrimario}
                    disabled={salvando || !itemId || !saldoOrigem || !destinoId}
                  >
                    <Check size={17} /> {salvando ? 'Registrando...' : 'Confirmar movimentação'}
                  </button>
                </form>

                <motion.section
                  className={styles.historico}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08, ease: 'easeOut' }}
                >
                  <h2 className={styles.histTitulo}>Histórico recente</h2>
                  <ul className={styles.timeline}>
                    {historico.map((movimentacao, indice) => (
                      <motion.li
                        key={movimentacao.id}
                        className={styles.evento}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, delay: Math.min(indice * 0.04, 0.2) }}
                      >
                        <div className={styles.ponto} />
                        <div className={styles.eventoBody}>
                          <div className={styles.eventoTopo}>
                            <span className={styles.eventoItem}>{movimentacao.item.nome}</span>
                            <span className={styles.eventoData}>
                              {new Date(movimentacao.dataMovimentacao).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className={styles.trajetoTexto}>
                            {movimentacao.origem} <ArrowRight size={13} /> {movimentacao.destino}
                          </p>
                          <p className={styles.eventoMeta}>
                            <span className={styles.mono}>{movimentacao.item.tombamento}</span>
                            {' · '}{movimentacao.quantidade} unidade(s) · {movimentacao.resp}
                            {' · '}Expira em {movimentacao.expiresAt
                              ? new Date(movimentacao.expiresAt).toLocaleString('pt-BR')
                              : 'Sem vencimento'}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
