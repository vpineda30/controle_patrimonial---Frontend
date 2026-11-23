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

export default function MovimentacaoPage() {
  const [historico, setHistorico] = useState<Movimentacao[]>([])
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [unidadeItemId, setUnidadeItemId] = useState('')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [resp, setResp] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

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

  function selecionarUnidade(id: string) {
    setUnidadeItemId(id)
    const unidade = patrimonios
      .flatMap((item) => item.unidades ?? [])
      .find((candidate) => candidate.id === id)
    setOrigem(unidade?.ambiente?.nome ?? '')
  }

  async function registrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await movimentacoesApi.create({
        unidadeItemId,
        origem,
        destino,
        resp,
      })
      setUnidadeItemId('')
      setOrigem('')
      setDestino('')
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
        descricao="Registre a transferência de um item entre ambientes, com baixa na origem e entrada no destino."
      />

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={registrar}>
          <h2 className={styles.formTitulo}>Nova movimentação</h2>

          <div className={styles.campo}>
            <label htmlFor="item">Item / Tombamento</label>
            <select
              id="item"
              required
              value={unidadeItemId}
              onChange={(e) => selecionarUnidade(e.target.value)}
            >
              <option value="" disabled>Selecione uma unidade</option>
              {patrimonios.flatMap((item) =>
                (item.unidades ?? []).map((unidade) => (
                  <option key={unidade.id} value={unidade.id}>
                    {item.tombamento} - {item.nome}
                  </option>
                )),
              )}
            </select>
          </div>

          <div className={styles.trajeto}>
            <div className={styles.campo}>
              <label htmlFor="origem">Origem</label>
              <select
                id="origem"
                required
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
              >
                <option value="" disabled>
                  Ambiente atual...
                </option>
                {ambientes.map((ambiente) => (
                  <option key={ambiente.id} value={ambiente.nome}>
                    {ambiente.nome}
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
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              >
                <option value="" disabled>
                  Novo ambiente...
                </option>
                {ambientes.map((ambiente) => (
                  <option key={ambiente.id} value={ambiente.nome}>
                    {ambiente.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="resp">Responsável</label>
            <input
              id="resp"
              type="text"
              required
              value={resp}
              onChange={(e) => setResp(e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>

          {erro && <p style={{ color: '#b42318', margin: 0 }}>{erro}</p>}
          <button type="submit" className={styles.botaoPrimario} disabled={salvando}>
            <Check size={17} /> {salvando ? 'Registrando...' : 'Confirmar movimentação'}
          </button>
        </form>

        <section className={styles.historico}>
          <h2 className={styles.histTitulo}>Histórico recente</h2>
          <ul className={styles.timeline}>
            {historico.map((h) => (
              <li key={h.id} className={styles.evento}>
                <div className={styles.ponto} />
                <div className={styles.eventoBody}>
                  <div className={styles.eventoTopo}>
                    <span className={styles.eventoItem}>{h.unidadeItem.item.nome}</span>
                    <span className={styles.eventoData}>
                      {new Date(h.dataMovimentacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className={styles.trajetoTexto}>
                    {h.origem} <ArrowRight size={13} /> {h.destino}
                  </p>
                  <p className={styles.eventoMeta}>
                    <span className={styles.mono}>{h.unidadeItem.item.tombamento}</span> · {h.resp}
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
