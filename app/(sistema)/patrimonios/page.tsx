'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Filter } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './patrimonios.module.css'
import { patrimoniosApi, type Patrimonio } from '@/lib/api'

export default function PatrimoniosPage() {
  const [itens, setItens] = useState<Patrimonio[]>([])
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [erro, setErro] = useState('')

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
          (!categoria || item.categoria === categoria),
      ),
    [itens, busca, categoria],
  )

  const categoriaFormatada = (value: string) =>
    value.charAt(0) + value.slice(1).toLowerCase()

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

      <div className={styles.tabelaCard}>
        {erro && <p style={{ color: '#b42318', padding: '16px' }}>{erro}</p>}
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
              </tr>
            </thead>
            <tbody>
              {filtrados.map((it) => (
                <tr key={it.id}>
                  <td className={styles.mono}>{it.tombamento}</td>
                  <td className={styles.itemNome}>{it.nome}</td>
                  <td>{categoriaFormatada(it.categoria)}</td>
                  <td>{it.quantidade}</td>
                  <td>
                    {it.unidades?.[0]?.ambiente?.nome ?? 'Sem localização'}
                  </td>
                  <td className={styles.suave}>
                    {new Date(it.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <span
                      className={`${styles.situacao} ${styles.ativo}`}
                    >
                      {it.unidades?.[0]?.estado ?? 'ATIVO'}
                    </span>
                  </td>
                </tr>
              ))}
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