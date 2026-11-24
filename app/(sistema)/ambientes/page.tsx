'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, DoorOpen, MapPin, Package, X } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { PageLoading } from '@/components/ui/page-loading'
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
  const [erroBloco, setErroBloco] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalBlocoAberto, setModalBlocoAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [blocoId, setBlocoId] = useState('')
  const [numeroBloco, setNumeroBloco] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [salvandoBloco, setSalvandoBloco] = useState(false)

  async function carregar(mostrarCarregamento = false) {
    if (mostrarCarregamento) setCarregando(true)
    try {
      const [rooms, blocks] = await Promise.all([
        ambientesApi.list(),
        blocosApi.list(),
      ])
      setAmbientes(rooms)
      setBlocos(blocks)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar ambientes')
    } finally {
      if (mostrarCarregamento) setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(true)
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

  function fecharModalBloco() {
    if (salvandoBloco) return
    setModalBlocoAberto(false)
    setErroBloco('')
  }

  async function criarBloco(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErroBloco('')

    const numero = numeroBloco.trim() ? Number(numeroBloco) : null
    if (numero !== null && (!Number.isSafeInteger(numero) || numero < 1)) {
      setErroBloco('Informe um número inteiro maior que zero.')
      return
    }

    setSalvandoBloco(true)
    try {
      const bloco = await blocosApi.create(numero)
      setBlocos((atuais) => [...atuais, bloco])
      setBlocoId(bloco.id)
      setNumeroBloco('')
      setModalBlocoAberto(false)
    } catch (error) {
      setErroBloco(error instanceof Error ? error.message : 'Erro ao criar bloco')
    } finally {
      setSalvandoBloco(false)
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
    <MotionConfig reducedMotion="user">
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

      {!carregando && (
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
      )}

      {carregando ? (
        <PageLoading variant="grid" label="Carregando ambientes" />
      ) : (
        <>
          {erro && <p style={{ color: '#b42318' }}>{erro}</p>}
          <motion.div
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {filtrados.map((a) => (
              <motion.div
                key={a.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <Link
                  href={`/patrimonios?ambienteId=${encodeURIComponent(a.id)}`}
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
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

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

              <div className={styles.modalCampo}>
                <label htmlFor="ambiente-bloco">Bloco</label>
                <select
                  id="ambiente-bloco"
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
                <button
                  type="button"
                  className={styles.linkCadastro}
                  onClick={() => {
                    setErroBloco('')
                    setModalBlocoAberto(true)
                  }}
                >
                  <Plus size={14} /> Cadastrar novo bloco
                </button>
              </div>

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

      {modalBlocoAberto && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fecharModalBloco()
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="novo-bloco-titulo"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="novo-bloco-titulo">Novo bloco</h2>
                <p>Informe o número do bloco que será cadastrado.</p>
              </div>
              <button
                type="button"
                className={styles.modalFechar}
                onClick={fecharModalBloco}
                disabled={salvandoBloco}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </header>

            <form className={styles.modalForm} onSubmit={criarBloco}>
              <label className={styles.modalCampo}>
                <span>Número do bloco</span>
                <input
                  autoFocus
                  type="number"
                  min="1"
                  step="1"
                  value={numeroBloco}
                  onChange={(event) => setNumeroBloco(event.target.value)}
                  placeholder="Ex.: 1"
                />
                <small>Opcional. Deixe em branco para cadastrar sem número.</small>
              </label>

              {erroBloco && <p className={styles.modalErro}>{erroBloco}</p>}

              <footer className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.modalCancelar}
                  onClick={fecharModalBloco}
                  disabled={salvandoBloco}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.botaoPrimario}
                  disabled={salvandoBloco}
                >
                  {salvandoBloco ? 'Salvando...' : 'Criar bloco'}
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
