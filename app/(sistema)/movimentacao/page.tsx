'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import {
  ambientesApi,
  movimentacoesApi,
  patrimoniosApi,
  type Ambiente,
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

export default function MovimentacaoPage() {
  const [historico, setHistorico] = useState<Movimentacao[]>([])
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [itemId, setItemId] = useState('')
  const [origemId, setOrigemId] = useState('')
  const [destinoId, setDestinoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [expiraEm, setExpiraEm] = useState('')
  const [resp, setResp] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const itemSelecionado = patrimonios.find((item) => item.id === itemId)
  const saldos = obterSaldos(itemSelecionado)
  const saldoOrigem = saldos.find((saldo) => saldo.id === origemId)

  async function carregar() {
    try {
      const [moves, items, rooms] = await Promise.all([
        movimentacoesApi.list(),
        patrimoniosApi.list(),
        ambientesApi.list(),
      ])
      setHistorico(moves)
      setPatrimonios(items)
      setAmbientes(rooms)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar movimentações')
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function selecionarItem(id: string) {
    const item = patrimonios.find((atual) => atual.id === id)
    const saldosDoItem = obterSaldos(item)
    setItemId(id)
    setOrigemId(saldosDoItem[0]?.id ?? '')
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
      setItemId('')
      setOrigemId('')
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
    <div>
      <PageHeader
        titulo="Movimentação"
        descricao="Transfira uma quantidade de itens entre ambientes."
      />

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={registrar}>
          <h2 className={styles.formTitulo}>Nova movimentação</h2>

          <div className={styles.campo}>
            <label htmlFor="item">Item / Tombamento</label>
            <select
              id="item"
              required
              value={itemId}
              onChange={(event) => selecionarItem(event.target.value)}
            >
              <option value="" disabled>Selecione um item</option>
              {patrimonios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tombamento} - {item.nome}
                </option>
              ))}
            </select>
            {itemSelecionado && saldos.length === 0 && (
              <small>Este item não possui unidades registradas para movimentar.</small>
            )}
          </div>

          <div className={styles.trajeto}>
            <div className={styles.campo}>
              <label htmlFor="origem">Origem</label>
              <select
                id="origem"
                required
                value={origemId}
                onChange={(event) => {
                  setOrigemId(event.target.value)
                  setDestinoId('')
                  setQuantidade('1')
                }}
                disabled={!itemSelecionado || saldos.length === 0}
              >
                <option value="" disabled>Selecione a origem</option>
                {saldos.map((saldo) => (
                  <option key={saldo.id} value={saldo.id}>
                    {saldo.nome} ({saldo.quantidade} disponíveis)
                  </option>
                ))}
              </select>
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

        <section className={styles.historico}>
          <h2 className={styles.histTitulo}>Histórico recente</h2>
          <ul className={styles.timeline}>
            {historico.map((movimentacao) => (
              <li key={movimentacao.id} className={styles.evento}>
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
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
