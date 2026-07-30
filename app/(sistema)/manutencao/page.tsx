import { Wrench, AlertTriangle, Clock, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './manutencao.module.css'

type Tipo = 'Manutenção' | 'Danificado' | 'Extraviado'

const resumo = [
  { label: 'Em manutenção', valor: 12, icon: Wrench, cor: styles.azul },
  { label: 'Danificados', valor: 7, icon: AlertTriangle, cor: styles.laranja },
  { label: 'Aguardando análise', valor: 4, icon: Clock, cor: styles.vermelho },
]

const ocorrencias: {
  item: string
  tomb: string
  ambiente: string
  tipo: Tipo
  descricao: string
  abertura: string
}[] = [
  { item: 'Impressora HP LaserJet Pro', tomb: 'PT-001190', ambiente: 'Secretaria', tipo: 'Manutenção', descricao: 'Falha na alimentação de papel, atolamento recorrente.', abertura: '20/07/2026' },
  { item: 'Tablet Samsung Galaxy Tab', tomb: 'PT-007781', ambiente: 'Almoxarifado', tipo: 'Extraviado', descricao: 'Não localizado durante inventário do trimestre.', abertura: '18/07/2026' },
  { item: 'Cadeira Escolar Estofada', tomb: 'PT-005530', ambiente: 'Sala 12', tipo: 'Danificado', descricao: 'Estrutura da base quebrada, sem condições de uso.', abertura: '15/07/2026' },
  { item: 'Ventilador de Parede', tomb: 'PT-004098', ambiente: 'Biblioteca', tipo: 'Manutenção', descricao: 'Motor com ruído excessivo, precisa de revisão.', abertura: '12/07/2026' },
  { item: 'Notebook Acer Aspire', tomb: 'PT-006201', ambiente: 'Lab. Informática 1', tipo: 'Danificado', descricao: 'Tela trincada após queda acidental.', abertura: '08/07/2026' },
]

const tipoClasse: Record<Tipo, string> = {
  Manutenção: styles.tagManutencao,
  Danificado: styles.tagDanificado,
  Extraviado: styles.tagExtraviado,
}

export default function ManutencaoPage() {
  return (
    <div>
      <PageHeader
        titulo="Manutenção"
        descricao="Acompanhamento de itens danificados, extraviados ou que necessitam de manutenção."
        acao={<button className={styles.botaoPrimario}>Registrar ocorrência</button>}
      />

      <section className={styles.resumo}>
        {resumo.map(({ label, valor, icon: Icon, cor }) => (
          <article key={label} className={styles.resumoCard}>
            <div className={`${styles.resumoIcon} ${cor}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className={styles.resumoValor}>{valor}</p>
              <p className={styles.resumoLabel}>{label}</p>
            </div>
          </article>
        ))}
      </section>

      <div className={styles.lista}>
        {ocorrencias.map((o) => (
          <article key={o.tomb} className={styles.card}>
            <div className={styles.cardEsq}>
              <div className={styles.cardTopo}>
                <h3 className={styles.cardItem}>{o.item}</h3>
                <span className={`${styles.tag} ${tipoClasse[o.tipo]}`}>
                  {o.tipo}
                </span>
              </div>
              <p className={styles.cardDesc}>{o.descricao}</p>
              <div className={styles.cardMeta}>
                <span className={styles.mono}>{o.tomb}</span>
                <span>
                  <MapPin size={13} /> {o.ambiente}
                </span>
                <span>
                  <Clock size={13} /> Aberto em {o.abertura}
                </span>
              </div>
            </div>
            <button className={styles.botaoDetalhe}>Ver detalhes</button>
          </article>
        ))}
      </div>
    </div>
  )
}
