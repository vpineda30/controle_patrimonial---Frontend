import { Save, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import styles from './cadastro.module.css'

export default function CadastroPage() {
  return (
    <div>
      <PageHeader
        titulo="Cadastrar Item"
        descricao="Registre um novo bem adquirido pela escola e vincule-o a um ambiente."
      />

      <form className={styles.form}>
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Identificação</h2>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="nome">Nome do item</label>
              <input id="nome" type="text" placeholder="Ex: Notebook Dell Latitude" />
            </div>
            <div className={styles.campo}>
              <label htmlFor="tomb">Nº de tombamento</label>
              <input id="tomb" type="text" placeholder="PT-000000" />
            </div>
          </div>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" defaultValue="">
                <option value="" disabled>
                  Selecione...
                </option>
                <option>Informática</option>
                <option>Mobiliário</option>
                <option>Áudio e Vídeo</option>
                <option>Climatização</option>
                <option>Outros</option>
              </select>
            </div>
            <div className={styles.campo}>
              <label htmlFor="marca">Marca / Modelo</label>
              <input id="marca" type="text" placeholder="Ex: Dell / Latitude 5440" />
            </div>
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Aquisição e localização</h2>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="data">Data de aquisição</label>
              <input id="data" type="date" />
            </div>
            <div className={styles.campo}>
              <label htmlFor="valor">Valor (R$)</label>
              <input id="valor" type="number" placeholder="0,00" />
            </div>
          </div>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="ambiente">Ambiente</label>
              <select id="ambiente" defaultValue="">
                <option value="" disabled>
                  Selecione o ambiente...
                </option>
                <option>Laboratório de Informática 1</option>
                <option>Secretaria</option>
                <option>Biblioteca</option>
                <option>Auditório</option>
                <option>Almoxarifado</option>
              </select>
            </div>
            <div className={styles.campo}>
              <label htmlFor="situacao">Situação</label>
              <select id="situacao" defaultValue="Ativo">
                <option>Ativo</option>
                <option>Em manutenção</option>
                <option>Extraviado</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Observações</h2>
          <div className={styles.campo}>
            <label htmlFor="obs">Descrição e condições do item</label>
            <textarea
              id="obs"
              rows={4}
              placeholder="Informações adicionais, estado de conservação, número de série, etc."
            />
          </div>
        </section>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario}>
            <X size={17} /> Cancelar
          </button>
          <button type="submit" className={styles.botaoPrimario}>
            <Save size={17} /> Salvar item
          </button>
        </div>
      </form>
    </div>
  )
}
