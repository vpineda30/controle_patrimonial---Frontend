'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, DoorOpen, MapPin, Package, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './ambientes.module.css'
import {
  ambientesApi,
  blocosApi,
  type Ambiente,
  type Bloco,
} from '@/lib/api'

export default function AmbientesPage() {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [blocos, setBlocos] = useState<Bloco[]>([])
  const [busca, setBusca] = useState('')
  const [blocoFiltro, setBlocoFiltro] = useState('')
  const [erro, setErro] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [blocoId, setBlocoId] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    try {
      const [rooms, blocks] = await Promise.all([
        ambientesApi.list(),
        blocosApi.list(),
      ])
      setAmbientes(rooms)
      setBlocos(blocks)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar ambientes')
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function fecharModal() {
    if (salvando) return
    setModalAberto(false)
    setErro('')
  }

  async function criarAmbiente(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await ambientesApi.create({
        id: crypto.randomUUID(),
        nome: nome.trim(),
        responsavel: responsavel.trim(),
        blocoId,
      })
      setModalAberto(false)
      setNome('')
      setResponsavel('')
      setBlocoId('')
      await carregar()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar ambiente')
    } finally {
      setSalvando(false)
    }
  }

  const filtrados = useMemo(
    () =>
      ambientes.filter(
        (ambiente) =>
          ambiente.nome.toLowerCase().includes(busca.toLowerCase()) &&
          (!blocoFiltro || ambiente.blocoId === blocoFiltro),
      ),
    [ambientes, busca, blocoFiltro],
  )

  return (
    <div>
      <PageHeader
        titulo="Ambientes"
        descricao="Mapeamento dos espaços da escola (salas, blocos, secretaria e demais locais)."
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
            <Plus size={17} /> Novo ambiente
          </button>
        }
      />

      <div className={styles.filtros}>
        <div className={styles.busca}>
          <Search size={17} />
          <input
            type="text"
            placeholder="Buscar ambiente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={blocoFiltro}
          onChange={(e) => setBlocoFiltro(e.target.value)}
        >
          <option value="">Todos os blocos</option>
          {blocos.map((bloco) => (
            <option key={bloco.id} value={bloco.id}>
              Bloco {bloco.numero ?? 'sem número'}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {erro && <p style={{ color: '#b42318' }}>{erro}</p>}
        {filtrados.map((a) => (
          <Link
            key={a.id}
            href="/patrimonios"
            className={styles.card}
          >
            <div className={styles.cardTopo}>
              <div className={styles.icone}>
                <DoorOpen size={20} />
              </div>
              <span className={styles.badge}>{a.unidades?.length ?? 0} itens</span>
            </div>
            <h3 className={styles.nome}>{a.nome}</h3>
            <div className={styles.meta}>
              <span>
                <MapPin size={14} /> Bloco {blocos.find((b) => b.id === a.blocoId)?.numero ?? 'não informado'}
              </span>
              <span>
                <Package size={14} /> {a.responsavel}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {modalAberto && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fecharModal()
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="novo-ambiente-titulo"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="novo-ambiente-titulo">Novo ambiente</h2>
                <p>Informe os dados do espaço que será cadastrado.</p>
              </div>
              <button
                type="button"
                className={styles.modalFechar}
                onClick={fecharModal}
                disabled={salvando}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </header>

            <form className={styles.modalForm} onSubmit={criarAmbiente}>
              <label className={styles.modalCampo}>
                <span>Nome do ambiente</span>
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Ex.: Laboratório de Informática"
                />
              </label>

              <label className={styles.modalCampo}>
                <span>Responsável</span>
                <input
                  required
                  maxLength={100}
                  value={responsavel}
                  onChange={(event) => setResponsavel(event.target.value)}
                  placeholder="Nome do responsável pelo ambiente"
                />
              </label>

              <label className={styles.modalCampo}>
                <span>Bloco</span>
                <select
                  required
                  value={blocoId}
                  onChange={(event) => setBlocoId(event.target.value)}
                >
                  <option value="" disabled>
                    Selecione um bloco
                  </option>
                  {blocos.map((bloco) => (
                    <option key={bloco.id} value={bloco.id}>
                      Bloco {bloco.numero ?? 'sem número'}
                    </option>
                  ))}
                </select>
                {blocos.length === 0 && (
                  <small>Nenhum bloco cadastrado. Cadastre um bloco antes de criar o ambiente.</small>
                )}
              </label>

              {erro && <p className={styles.modalErro}>{erro}</p>}

              <footer className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.modalCancelar}
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.botaoPrimario}
                  disabled={salvando || blocos.length === 0}
                >
                  {salvando ? 'Salvando...' : 'Criar ambiente'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
