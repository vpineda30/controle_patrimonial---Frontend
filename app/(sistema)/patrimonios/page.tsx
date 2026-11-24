'use client'

import { Suspense, useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Plus, Filter, Pencil, Trash2, X } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { PageLoading } from '@/components/ui/page-loading'
import { PageHeader } from '@/components/page-header'
import styles from './patrimonios.module.css'
import {
  blocosApi,
  patrimoniosApi,
  type Bloco,
  type CriarPatrimonio,
  type Patrimonio,
} from '@/lib/api'

const SEM_LOCALIZACAO = '__sem-localizacao__'
const CATEGORIAS: CriarPatrimonio['categoria'][] = [
  'ELETRÔNICO',
  'MÓVEIS',
  'MATERIAIS',
  'CLIMATIZAÇÃO',
  'HIGIENIZAÇÃO',
  'ESPORTE',
]

type FormularioEdicao = {
  tombamento: string
  nome: string
  categoria: string
  marca: string
  valor: string
  quantidade: string
  descricao: string
}

function unidadesDoFiltro(
  item: Patrimonio,
  ambienteFiltro: string,
  ambienteSelecionado: string,
  blocoSelecionado: string,
) {
  return (item.unidades ?? []).filter(
    (unidade) =>
      (!ambienteFiltro || unidade.ambienteId === ambienteFiltro) &&
      (!blocoSelecionado || unidade.ambiente?.blocoId === blocoSelecionado) &&
      (!ambienteSelecionado ||
        (ambienteSelecionado === SEM_LOCALIZACAO
          ? !unidade.ambienteId
          : unidade.ambienteId === ambienteSelecionado)),
  )
}

export default function PatrimoniosPage() {
  return (
    <Suspense fallback={<PageLoading variant="table" label="Carregando patrimônios" />}>
      <PatrimoniosConteudo />
    </Suspense>
  )
}

function PatrimoniosConteudo() {
  const searchParams = useSearchParams()
  const ambienteFiltro = searchParams.get('ambienteId') ?? ''
  const [itens, setItens] = useState<Patrimonio[]>([])
  const [blocos, setBlocos] = useState<Bloco[]>([])
  const [busca, setBusca] = useState('')
  const [ambienteSelecionado, setAmbienteSelecionado] = useState('')
  const [blocoSelecionado, setBlocoSelecionado] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [categoria, setCategoria] = useState('')
  const [erro, setErro] = useState('')
  const [erroBlocos, setErroBlocos] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [itemEditando, setItemEditando] = useState<Patrimonio | null>(null)
  const [formEdicao, setFormEdicao] = useState<FormularioEdicao>({
    tombamento: '',
    nome: '',
    categoria: '',
    marca: '',
    valor: '',
    quantidade: '',
    descricao: '',
  })
  const [erroEdicao, setErroEdicao] = useState('')
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [excluindoId, setExcluindoId] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([
      patrimoniosApi.list(),
      blocosApi.list().catch((error) => {
        setErroBlocos(
          error instanceof Error ? error.message : 'Erro ao carregar blocos',
        )
        return []
      }),
    ])
      .then(([patrimonios, listaBlocos]) => {
        setItens(patrimonios)
        setBlocos(listaBlocos)
      })
      .catch((error) =>
        setErro(error instanceof Error ? error.message : 'Erro ao carregar patrimônios'),
      )
      .finally(() => setCarregando(false))
  }, [])

  const filtrados = useMemo(
    () =>
      itens.filter((item) => {
        const unidades = item.unidades ?? []
        const unidadesFiltradas = unidadesDoFiltro(
          item,
          ambienteFiltro,
          ambienteSelecionado,
          blocoSelecionado,
        )
        const correspondeAmbiente =
          !ambienteSelecionado ||
          (ambienteSelecionado === SEM_LOCALIZACAO
            ? unidades.some((unidade) => !unidade.ambienteId) ||
              (unidades.length === 0 && item.quantidade > 0)
            : unidades.some((unidade) => unidade.ambienteId === ambienteSelecionado))
        const correspondeBloco =
          !blocoSelecionado ||
          unidades.some((unidade) => unidade.ambiente?.blocoId === blocoSelecionado)
        const correspondeSituacao =
          !filtroEstado ||
          unidadesFiltradas.some((unidade) => unidade.estado === filtroEstado) ||
          (filtroEstado === 'ATIVO' &&
            unidadesFiltradas.length === 0 &&
            item.quantidade > 0 &&
            (ambienteSelecionado === SEM_LOCALIZACAO ||
              (!ambienteFiltro && !ambienteSelecionado)))

        return (
          (item.nome.toLowerCase().includes(busca.toLowerCase()) ||
            String(item.tombamento).includes(busca)) &&
          (!categoria || item.categoria === categoria) &&
          (!ambienteFiltro ||
            unidades.some((unidade) => unidade.ambienteId === ambienteFiltro)) &&
          correspondeAmbiente &&
          correspondeBloco &&
          correspondeSituacao
        )
      }),
    [
      itens,
      busca,
      categoria,
      ambienteFiltro,
      ambienteSelecionado,
      blocoSelecionado,
      filtroEstado,
    ],
  )

  const categoriaFormatada = (value: string) =>
    value.charAt(0) + value.slice(1).toLowerCase()

  const ambientesDisponiveis = useMemo(() => {
    const ambientes = new Map<string, string>()
    for (const item of itens) {
      for (const unidade of item.unidades ?? []) {
        if (
          unidade.ambienteId &&
          (!blocoSelecionado || unidade.ambiente?.blocoId === blocoSelecionado)
        ) {
          ambientes.set(
            unidade.ambienteId,
            unidade.ambiente?.nome ?? 'Ambiente sem nome',
          )
        }
      }
    }

    return Array.from(ambientes.entries()).sort((a, b) =>
      a[1].localeCompare(b[1], 'pt-BR'),
    )
  }, [itens, blocoSelecionado])

  const ambienteDestinoNovasUnidades =
    ambienteFiltro ||
    (ambienteSelecionado !== SEM_LOCALIZACAO ? ambienteSelecionado : '')
  const nomeAmbienteDestino = ambientesDisponiveis.find(
    ([id]) => id === ambienteDestinoNovasUnidades,
  )?.[1]

  function classeSituacao(estado: string) {
    if (estado === 'MANUTENÇÃO') return styles.manutencao
    if (estado === 'DANIFICADO') return styles.danificado
    if (estado === 'EXTRAVIADO') return styles.extraviado
    return styles.ativo
  }

  function abrirEdicao(item: Patrimonio) {
    setMensagemSucesso('')
    setErroEdicao('')
    setItemEditando(item)
    setFormEdicao({
      tombamento: String(item.tombamento),
      nome: item.nome,
      categoria: item.categoria,
      marca: item.marca,
      valor: String(item.valor),
      quantidade: String(item.quantidade),
      descricao: item.descricao ?? '',
    })
  }

  async function salvarEdicao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!itemEditando) return

    setErroEdicao('')
    if (
      !formEdicao.tombamento.trim() ||
      !formEdicao.valor.trim() ||
      !formEdicao.quantidade.trim()
    ) {
      setErroEdicao('Preencha o tombamento, o valor e a quantidade.')
      return
    }
    const tombamento = Number(formEdicao.tombamento)
    const valor = Number(formEdicao.valor)
    const quantidade = Number(formEdicao.quantidade)

    if (!Number.isSafeInteger(tombamento) || tombamento < 0) {
      setErroEdicao('O tombamento deve ser um número inteiro não negativo.')
      return
    }
    if (!formEdicao.nome.trim() || !formEdicao.marca.trim()) {
      setErroEdicao('Informe o nome e a marca do patrimônio.')
      return
    }
    const categoria = CATEGORIAS.find(
      (opcao) => opcao === formEdicao.categoria,
    )
    if (!categoria) {
      setErroEdicao('Selecione uma categoria válida.')
      return
    }
    if (!Number.isFinite(valor) || valor < 0) {
      setErroEdicao('O valor deve ser um número não negativo.')
      return
    }
    if (!Number.isSafeInteger(quantidade) || quantidade < 0) {
      setErroEdicao('A quantidade deve ser um número inteiro não negativo.')
      return
    }

    const payload: Partial<CriarPatrimonio> = {
      tombamento,
      nome: formEdicao.nome.trim(),
      categoria,
      marca: formEdicao.marca.trim(),
      valor,
      quantidade,
      descricao: formEdicao.descricao.trim() || null,
    }
    if (ambienteDestinoNovasUnidades) {
      payload.ambienteId = ambienteDestinoNovasUnidades
    }

    setSalvandoEdicao(true)
    try {
      const resposta = await patrimoniosApi.update(itemEditando.id, payload)
      setMensagemSucesso(resposta.message)
      setItemEditando(null)
      try {
        setItens(await patrimoniosApi.list())
      } catch (error) {
        setErro(
          error instanceof Error
            ? `Patrimônio atualizado, mas não foi possível recarregar a lista: ${error.message}`
            : 'Patrimônio atualizado, mas não foi possível recarregar a lista.',
        )
      }
    } catch (error) {
      setErroEdicao(
        error instanceof Error ? error.message : 'Erro ao atualizar patrimônio',
      )
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function fecharEdicao() {
    if (salvandoEdicao) return
    setItemEditando(null)
    setErroEdicao('')
  }

  async function excluirPatrimonio(item: Patrimonio) {
    const confirmado = window.confirm(
      `Excluir "${item.nome}" (tombamento ${item.tombamento})? As unidades sem movimentações também serão excluídas. Itens com histórico de movimentações não podem ser excluídos.`,
    )
    if (!confirmado) return

    setErro('')
    setMensagemSucesso('')
    setExcluindoId(item.id)
    try {
      await patrimoniosApi.remove(item.id)
      setItens((atuais) => atuais.filter((atual) => atual.id !== item.id))
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir patrimônio')
    } finally {
      setExcluindoId(null)
    }
  }

  function resumoLocais(item: Patrimonio, unidades: Patrimonio['unidades'] = []) {
    const locais = new Map<string, { nome: string; quantidade: number }>()

    for (const unidade of unidades) {
      const id = unidade.ambienteId ?? 'sem-localizacao'
      const nome = unidade.ambiente?.nome ?? 'Sem localização'
      const local = locais.get(id)
      if (local) {
        local.quantidade += 1
      } else {
        locais.set(id, { nome, quantidade: 1 })
      }
    }

    const resumo = Array.from(locais.values()).map(
      ({ nome, quantidade }) => `${nome} (${quantidade})`,
    )
    const unidadesPendentes = ambienteFiltro || ambienteSelecionado || blocoSelecionado
      ? 0
      : Math.max(item.quantidade - unidades.length, 0)
    if (unidadesPendentes > 0) {
      resumo.push(`Unidades sem cadastro (${unidadesPendentes})`)
    }

    return resumo.join(', ') || 'Sem unidades cadastradas'
  }

  return (
    <MotionConfig reducedMotion="user">
    <div>
      <PageHeader
        titulo="Patrimônios"
        descricao="Todos os bens registrados, com tombamento, categoria e localização atual."
        acao={
          <Link href="/cadastro" className={styles.botaoPrimario} data-slot="page-action">
            <Plus size={17} /> Cadastrar item
          </Link>
        }
      />

      {carregando ? (
        <PageLoading variant="table" label="Carregando patrimônios" />
      ) : (
        <>
          <div className={styles.filtros}>
            <div className={styles.busca}>
              <Search size={17} />
              <input
                type="text"
                placeholder="Buscar por nome ou tombamento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <select
              className={styles.select}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              <option value="ELETRÔNICO">Eletrônico</option>
              <option value="MÓVEIS">Móveis</option>
              <option value="MATERIAIS">Materiais</option>
              <option value="CLIMATIZAÇÃO">Climatização</option>
              <option value="HIGIENIZAÇÃO">Higienização</option>
              <option value="ESPORTE">Esporte</option>
            </select>
            <button
              type="button"
              className={styles.botaoSecundario}
              aria-expanded={filtrosAbertos}
              aria-controls="filtros-avancados"
              onClick={() => setFiltrosAbertos((abertos) => !abertos)}
            >
              <Filter size={16} /> Filtros
            </button>
          </div>

          {filtrosAbertos && (
            <div className={styles.filtrosAvancados} id="filtros-avancados">
              <label className={styles.filtroCampo}>
                Bloco
                <select
                  className={styles.select}
                  value={blocoSelecionado}
                  onChange={(event) => {
                    setBlocoSelecionado(event.target.value)
                    setAmbienteSelecionado('')
                  }}
                >
                  <option value="">Todos os blocos</option>
                  {[...blocos]
                    .sort((a, b) => (a.numero ?? Infinity) - (b.numero ?? Infinity))
                    .map((bloco) => (
                      <option key={bloco.id} value={bloco.id}>
                        Bloco {bloco.numero ?? 'sem número'}
                      </option>
                    ))}
                </select>
              </label>
              <label className={styles.filtroCampo}>
                Ambiente
                <select
                  className={styles.select}
                  value={ambienteSelecionado}
                  onChange={(event) => setAmbienteSelecionado(event.target.value)}
                >
                  <option value="">Todos os ambientes</option>
                  {ambientesDisponiveis.map(([id, nome]) => (
                    <option key={id} value={id}>
                      {nome}
                    </option>
                  ))}
                  {!blocoSelecionado && (
                    <option value={SEM_LOCALIZACAO}>Sem localização</option>
                  )}
                </select>
              </label>
              <label className={styles.filtroCampo}>
                Situação
                <select
                  className={styles.select}
                  value={filtroEstado}
                  onChange={(event) => setFiltroEstado(event.target.value)}
                >
                  <option value="">Todas as situações</option>
                  <option value="ATIVO">Ativo</option>
                  <option value="MANUTENÇÃO">Em manutenção</option>
                  <option value="DANIFICADO">Danificado</option>
                  <option value="EXTRAVIADO">Extraviado</option>
                </select>
              </label>
              <button
                type="button"
                className={styles.limparFiltros}
                onClick={() => {
                  setBusca('')
                  setCategoria('')
                  setAmbienteSelecionado('')
                  setBlocoSelecionado('')
                  setFiltroEstado('')
                }}
              >
                Limpar filtros
              </button>
              {erroBlocos && <p role="alert" className={styles.erroFiltro}>{erroBlocos}</p>}
            </div>
          )}

          {ambienteFiltro && (
            <div className={styles.filtroAmbiente}>
              <span>Exibindo patrimônios do ambiente selecionado.</span>
              <Link href="/patrimonios">Limpar filtro</Link>
            </div>
          )}

          <motion.div
            className={styles.tabelaCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {erro && <p role="alert" style={{ color: '#b42318', padding: '16px' }}>{erro}</p>}
            {mensagemSucesso && (
              <p role="status" className={styles.mensagemSucesso}>
                {mensagemSucesso}
              </p>
            )}
            <div className={styles.tabelaWrap}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Tombamento</th>
                    <th>Item</th>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Ambiente</th>
                    <th>Aquisição</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.suave}>
                        {itens.length > 0
                          ? 'Nenhum patrimônio corresponde aos filtros aplicados.'
                          : ambienteFiltro
                            ? 'Nenhum patrimônio encontrado neste ambiente.'
                            : 'Nenhum patrimônio cadastrado.'}
                      </td>
                    </tr>
                  )}
                  {filtrados.map((it, indice) => {
                    const unidades = unidadesDoFiltro(
                      it,
                      ambienteFiltro,
                      ambienteSelecionado,
                      blocoSelecionado,
                    )
                    const situacao = filtroEstado || unidades[0]?.estado || 'ATIVO'
                    return (
                      <motion.tr
                        key={it.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(indice * 0.035, 0.2),
                        }}
                      >
                        <td className={styles.mono}>{it.tombamento}</td>
                        <td className={styles.itemNome}>{it.nome}</td>
                        <td>{categoriaFormatada(it.categoria)}</td>
                        <td>
                          {filtroEstado
                            ? unidades.filter((unidade) => unidade.estado === filtroEstado).length ||
                              (unidades.length === 0 && filtroEstado === 'ATIVO'
                                ? it.quantidade
                                : 0)
                            : ambienteSelecionado === SEM_LOCALIZACAO && unidades.length === 0
                              ? it.quantidade
                              : ambienteFiltro || ambienteSelecionado || blocoSelecionado
                              ? unidades.length
                              : it.quantidade}
                        </td>
                        <td>{resumoLocais(it, unidades)}</td>
                        <td className={styles.suave}>
                          {new Date(it.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td>
                          <span className={`${styles.situacao} ${classeSituacao(situacao)}`}>
                            {situacao}
                          </span>
                        </td>
                        <td>
                          <div className={styles.acoesLinha}>
                            <button
                              type="button"
                              className={styles.botaoEditar}
                              onClick={() => abrirEdicao(it)}
                              disabled={excluindoId !== null || salvandoEdicao}
                              aria-label={`Editar ${it.nome}, tombamento ${it.tombamento}`}
                            >
                              <Pencil size={15} />
                              Editar
                            </button>
                            <button
                              type="button"
                              className={styles.botaoExcluir}
                              onClick={() => excluirPatrimonio(it)}
                              disabled={excluindoId !== null || salvandoEdicao}
                              aria-label={`Excluir ${it.nome}, tombamento ${it.tombamento}`}
                            >
                              <Trash2 size={15} />
                              {excluindoId === it.id ? 'Excluindo...' : 'Excluir'}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className={styles.rodapeTabela}>
              <span>Mostrando {filtrados.length} de {itens.length} tipos de item</span>
            </div>
          </motion.div>

          {itemEditando && (
            <div
              className={styles.modalOverlay}
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) fecharEdicao()
              }}
            >
              <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="editar-patrimonio-titulo"
              >
                <header className={styles.modalHeader}>
                  <div>
                    <h2 id="editar-patrimonio-titulo">Editar patrimônio</h2>
                    <p>Atualize os dados do item selecionado.</p>
                  </div>
                  <button
                    type="button"
                    className={styles.modalFechar}
                    onClick={fecharEdicao}
                    disabled={salvandoEdicao}
                    aria-label="Fechar edição"
                  >
                    <X size={20} />
                  </button>
                </header>

                <form className={styles.modalForm} onSubmit={salvarEdicao}>
                  <label className={styles.modalCampo}>
                    Tombamento
                    <input
                      autoFocus
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={formEdicao.tombamento}
                      onChange={(event) =>
                        setFormEdicao({ ...formEdicao, tombamento: event.target.value })
                      }
                    />
                  </label>
                  <label className={styles.modalCampo}>
                    Nome
                    <input
                      type="text"
                      required
                      value={formEdicao.nome}
                      onChange={(event) =>
                        setFormEdicao({ ...formEdicao, nome: event.target.value })
                      }
                    />
                  </label>
                  <label className={styles.modalCampo}>
                    Categoria
                    <select
                      required
                      value={formEdicao.categoria}
                      onChange={(event) =>
                        setFormEdicao({ ...formEdicao, categoria: event.target.value })
                      }
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      {CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoriaFormatada(categoria)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.modalCampo}>
                    Marca
                    <input
                      type="text"
                      required
                      value={formEdicao.marca}
                      onChange={(event) =>
                        setFormEdicao({ ...formEdicao, marca: event.target.value })
                      }
                    />
                  </label>
                  <div className={styles.modalLinha}>
                    <label className={styles.modalCampo}>
                      Valor (R$)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formEdicao.valor}
                        onChange={(event) =>
                          setFormEdicao({ ...formEdicao, valor: event.target.value })
                        }
                      />
                    </label>
                    <label className={styles.modalCampo}>
                      Quantidade
                      <input
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formEdicao.quantidade}
                        onChange={(event) =>
                          setFormEdicao({ ...formEdicao, quantidade: event.target.value })
                        }
                      />
                    </label>
                  </div>
                  <p className={styles.modalAjuda}>
                    {nomeAmbienteDestino
                      ? `Ao aumentar a quantidade, as novas unidades serão cadastradas em ${nomeAmbienteDestino}.`
                      : 'Ao aumentar a quantidade sem filtrar um ambiente, as novas unidades ficarão sem localização.'}
                  </p>
                  <label className={styles.modalCampo}>
                    Descrição
                    <textarea
                      rows={3}
                      value={formEdicao.descricao}
                      onChange={(event) =>
                        setFormEdicao({ ...formEdicao, descricao: event.target.value })
                      }
                    />
                  </label>
                  {erroEdicao && (
                    <p className={styles.modalErro} role="alert">{erroEdicao}</p>
                  )}
                  <footer className={styles.modalAcoes}>
                    <button
                      type="button"
                      className={styles.modalCancelar}
                      onClick={fecharEdicao}
                      disabled={salvandoEdicao}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.botaoPrimario}
                      disabled={salvandoEdicao}
                    >
                      {salvandoEdicao ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </footer>
                </form>
              </section>
            </div>
          )}
        </>
      )}
    </div>
    </MotionConfig>
  )
}