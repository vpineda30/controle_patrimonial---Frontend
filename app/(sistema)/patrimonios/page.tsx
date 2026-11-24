'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Plus, Filter, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './patrimonios.module.css'
import { patrimoniosApi, type Patrimonio } from '@/lib/api'

export default function PatrimoniosPage() {
  return (
    <Suspense fallback={<div>Carregando patrimônios...</div>}>
      <PatrimoniosConteudo />
    </Suspense>
  )
}

function PatrimoniosConteudo() {
  const searchParams = useSearchParams()
  const ambienteFiltro = searchParams.get('ambienteId') ?? ''
  const [itens, setItens] = useState<Patrimonio[]>([])
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [erro, setErro] = useState('')
  const [excluindoId, setExcluindoId] = useState<string | null>(null)

  useEffect(() => {
    patrimoniosApi
      .list()
      .then(setItens)
      .catch((error) =>
        setErro(error instanceof Error ? error.message : 'Erro ao carregar patrimônios'),
      )
  }, [])

  const filtrados = useMemo(
    () =>
      itens.filter(
        (item) =>
          (item.nome.toLowerCase().includes(busca.toLowerCase()) ||
            String(item.tombamento).includes(busca)) &&
          (!categoria || item.categoria === categoria) &&
          (!ambienteFiltro ||
            item.unidades?.some((unidade) => unidade.ambienteId === ambienteFiltro)),
      ),
    [itens, busca, categoria, ambienteFiltro],
  )

  const categoriaFormatada = (value: string) =>
    value.charAt(0) + value.slice(1).toLowerCase()

  async function excluirPatrimonio(item: Patrimonio) {
    const confirmado = window.confirm(
      `Excluir "${item.nome}" (tombamento ${item.tombamento})? As unidades sem movimentações também serão excluídas. Itens com histórico de movimentações não podem ser excluídos.`,
    )
    if (!confirmado) return

    setErro('')
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

  function unidadesVisiveis(item: Patrimonio) {
    const unidades = item.unidades ?? []
    return ambienteFiltro
      ? unidades.filter((unidade) => unidade.ambienteId === ambienteFiltro)
      : unidades
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
    const unidadesPendentes = ambienteFiltro
      ? 0
      : Math.max(item.quantidade - unidades.length, 0)
    if (unidadesPendentes > 0) {
      resumo.push(`Unidades sem cadastro (${unidadesPendentes})`)
    }

    return resumo.join(', ') || 'Sem unidades cadastradas'
  }

  return (
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
          <option>Climatização</option>
        </select>
        <button className={styles.botaoSecundario}>
          <Filter size={16} /> Filtros
        </button>
      </div>

      {ambienteFiltro && (
        <div className={styles.filtroAmbiente}>
          <span>Exibindo patrimônios do ambiente selecionado.</span>
          <Link href="/patrimonios">Limpar filtro</Link>
        </div>
      )}

      <div className={styles.tabelaCard}>
        {erro && <p role="alert" style={{ color: '#b42318', padding: '16px' }}>{erro}</p>}
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
                    {ambienteFiltro
                      ? 'Nenhum patrimônio encontrado neste ambiente.'
                      : 'Nenhum patrimônio cadastrado.'}
                  </td>
                </tr>
              )}
              {filtrados.map((it) => {
                const unidades = unidadesVisiveis(it)
                return (
                  <tr key={it.id}>
                    <td className={styles.mono}>{it.tombamento}</td>
                    <td className={styles.itemNome}>{it.nome}</td>
                    <td>{categoriaFormatada(it.categoria)}</td>
                    <td>{ambienteFiltro ? unidades.length : it.quantidade}</td>
                    <td>{resumoLocais(it, unidades)}</td>
                    <td className={styles.suave}>
                      {new Date(it.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span className={`${styles.situacao} ${styles.ativo}`}>
                        {unidades[0]?.estado ?? 'ATIVO'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.botaoExcluir}
                        onClick={() => excluirPatrimonio(it)}
                        disabled={excluindoId !== null}
                        aria-label={`Excluir ${it.nome}, tombamento ${it.tombamento}`}
                      >
                        <Trash2 size={15} />
                        {excluindoId === it.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.rodapeTabela}>
          <span>Mostrando {filtrados.length} de {itens.length} tipos de item</span>
        </div>
      </div>
    </div>
  )
}