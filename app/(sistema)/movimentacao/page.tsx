import { ArrowRight, Check } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './movimentacao.module.css'

const historico = [
  { item: 'Notebook Dell Latitude', tomb: 'PT-004512', origem: 'Almoxarifado', destino: 'Lab. Informática 2', resp: 'Iggor Cruz', data: '28/07/2026' },
  { item: 'Projetor Epson X400', tomb: 'PT-002301', origem: 'Sala 12', destino: 'Auditório', resp: 'Eduardo Mairena', data: '27/07/2026' },
  { item: 'Cadeira Giratória', tomb: 'PT-008874', origem: 'Secretaria', destino: 'Coordenação', resp: 'Ana Julya', data: '26/07/2026' },
  { item: 'Impressora HP LaserJet', tomb: 'PT-001190', origem: 'Sala dos Professores', destino: 'Secretaria', resp: 'Vinícius Silveira', data: '25/07/2026' },
  { item: 'Monitor LG 24"', tomb: 'PT-006755', origem: 'Almoxarifado', destino: 'Lab. Informática 1', resp: 'Iggor Cruz', data: '22/07/2026' },
]

export default function MovimentacaoPage() {
  return (
    <div>
      <PageHeader
        titulo="Movimentação"
        descricao="Registre a transferência de um item entre ambientes, com baixa na origem e entrada no destino."
      />

      <div className={styles.layout}>
        <form className={styles.form}>
          <h2 className={styles.formTitulo}>Nova movimentação</h2>

          <div className={styles.campo}>
            <label htmlFor="item">Item / Tombamento</label>
            <input id="item" type="text" placeholder="Buscar por nome ou PT-000000" />
          </div>

          <div className={styles.trajeto}>
            <div className={styles.campo}>
              <label htmlFor="origem">Origem</label>
              <select id="origem" defaultValue="">
                <option value="" disabled>
                  Ambiente atual...
                </option>
                <option>Almoxarifado</option>
                <option>Secretaria</option>
                <option>Biblioteca</option>
              </select>
            </div>
            <div className={styles.seta}>
              <ArrowRight size={20} />
            </div>
            <div className={styles.campo}>
              <label htmlFor="destino">Destino</label>
              <select id="destino" defaultValue="">
                <option value="" disabled>
                  Novo ambiente...
                </option>
                <option>Lab. Informática 1</option>
                <option>Auditório</option>
                <option>Coordenação</option>
              </select>
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="resp">Responsável</label>
            <input id="resp" type="text" placeholder="Nome do responsável" />
          </div>

          <div className={styles.campo}>
            <label htmlFor="motivo">Motivo da movimentação</label>
            <textarea id="motivo" rows={3} placeholder="Ex: realocação para novo laboratório" />
          </div>

          <button type="submit" className={styles.botaoPrimario}>
            <Check size={17} /> Confirmar movimentação
          </button>
        </form>

        <section className={styles.historico}>
          <h2 className={styles.histTitulo}>Histórico recente</h2>
          <ul className={styles.timeline}>
            {historico.map((h) => (
              <li key={h.tomb + h.data} className={styles.evento}>
                <div className={styles.ponto} />
                <div className={styles.eventoBody}>
                  <div className={styles.eventoTopo}>
                    <span className={styles.eventoItem}>{h.item}</span>
                    <span className={styles.eventoData}>{h.data}</span>
                  </div>
                  <p className={styles.trajetoTexto}>
                    {h.origem} <ArrowRight size={13} /> {h.destino}
                  </p>
                  <p className={styles.eventoMeta}>
                    <span className={styles.mono}>{h.tomb}</span> · {h.resp}
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
