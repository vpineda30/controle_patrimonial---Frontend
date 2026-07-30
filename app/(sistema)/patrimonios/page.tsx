import Link from 'next/link'
import { Search, Plus, Filter } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './patrimonios.module.css'

type Situacao = 'Ativo' | 'Manutenção' | 'Extraviado'

const itens: {
  tomb: string
  nome: string
  categoria: string
  ambiente: string
  aquisicao: string
  situacao: Situacao
}[] = [
  { tomb: 'PT-004512', nome: 'Notebook Dell Latitude 5440', categoria: 'Informática', ambiente: 'Lab. Informática 2', aquisicao: '12/03/2024', situacao: 'Ativo' },
  { tomb: 'PT-002301', nome: 'Projetor Epson PowerLite X400', categoria: 'Áudio e Vídeo', ambiente: 'Auditório', aquisicao: '05/08/2023', situacao: 'Ativo' },
  { tomb: 'PT-008874', nome: 'Cadeira Giratória Presidente', categoria: 'Mobiliário', ambiente: 'Coordenação', aquisicao: '22/01/2025', situacao: 'Ativo' },
  { tomb: 'PT-001190', nome: 'Impressora HP LaserJet Pro', categoria: 'Informática', ambiente: 'Secretaria', aquisicao: '30/11/2022', situacao: 'Manutenção' },
  { tomb: 'PT-006755', nome: 'Monitor LG 24" Full HD', categoria: 'Informática', ambiente: 'Lab. Informática 1', aquisicao: '12/03/2024', situacao: 'Ativo' },
  { tomb: 'PT-003420', nome: 'Ar-condicionado Split 12000 BTUs', categoria: 'Climatização', ambiente: 'Biblioteca', aquisicao: '18/06/2023', situacao: 'Ativo' },
  { tomb: 'PT-009012', nome: 'Mesa de Reunião 8 Lugares', categoria: 'Mobiliário', ambiente: 'Sala dos Professores', aquisicao: '02/02/2021', situacao: 'Ativo' },
  { tomb: 'PT-007781', nome: 'Tablet Samsung Galaxy Tab', categoria: 'Informática', ambiente: 'Almoxarifado', aquisicao: '15/09/2024', situacao: 'Extraviado' },
]

const situacaoClasse: Record<Situacao, string> = {
  Ativo: styles.ativo,
  Manutenção: styles.manutencao,
  Extraviado: styles.extraviado,
}

export default function PatrimoniosPage() {
  return (
    <div>
      <PageHeader
        titulo="Patrimônios"
        descricao="Todos os bens registrados, com tombamento, categoria e localização atual."
        acao={
          <Link href="/cadastro" className={styles.botaoPrimario}>
            <Plus size={17} /> Cadastrar item
          </Link>
        }
      />

      <div className={styles.filtros}>
        <div className={styles.busca}>
          <Search size={17} />
          <input type="text" placeholder="Buscar por nome ou tombamento..." />
        </div>
        <select className={styles.select} defaultValue="">
          <option value="">Todas as categorias</option>
          <option>Informática</option>
          <option>Mobiliário</option>
          <option>Áudio e Vídeo</option>
          <option>Climatização</option>
        </select>
        <button className={styles.botaoSecundario}>
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className={styles.tabelaCard}>
        <div className={styles.tabelaWrap}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Tombamento</th>
                <th>Item</th>
                <th>Categoria</th>
                <th>Ambiente</th>
                <th>Aquisição</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((it) => (
                <tr key={it.tomb}>
                  <td className={styles.mono}>{it.tomb}</td>
                  <td className={styles.itemNome}>{it.nome}</td>
                  <td>{it.categoria}</td>
                  <td>{it.ambiente}</td>
                  <td className={styles.suave}>{it.aquisicao}</td>
                  <td>
                    <span
                      className={`${styles.situacao} ${situacaoClasse[it.situacao]}`}
                    >
                      {it.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.rodapeTabela}>
          <span>Mostrando 8 de 1.284 itens</span>
          <div className={styles.paginacao}>
            <button className={styles.pagBtn}>Anterior</button>
            <button className={`${styles.pagBtn} ${styles.pagAtivo}`}>1</button>
            <button className={styles.pagBtn}>2</button>
            <button className={styles.pagBtn}>3</button>
            <button className={styles.pagBtn}>Próximo</button>
          </div>
        </div>
      </div>
    </div>
  )
}
