'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { patrimoniosApi, type CriarPatrimonio } from '@/lib/api'
import styles from './cadastro.module.css'

export default function CadastroPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    tombamento: '',
    categoria: '',
    marca: '',
    valor: '',
    quantidade: '1',
    descricao: '',
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      const payload: CriarPatrimonio = {
        nome: form.nome,
        tombamento: Number(form.tombamento),
        categoria: form.categoria as CriarPatrimonio['categoria'],
        marca: form.marca,
        valor: Number(form.valor),
        quantidade: Number(form.quantidade),
        descricao: form.descricao || null,
      }
      await patrimoniosApi.create(payload)
      router.push('/patrimonios')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar patrimônio')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Cadastrar Item"
        descricao="Registre um novo bem adquirido pela escola e vincule-o a um ambiente."
      />

      <form className={styles.form} onSubmit={submit}>
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Identificação</h2>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="nome">Nome do item</label>
              <input
                id="nome"
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Notebook Dell Latitude"
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="tomb">Nº de tombamento</label>
              <input
                id="tomb"
                type="number"
                min="0"
                required
                value={form.tombamento}
                onChange={(e) => setForm({ ...form, tombamento: e.target.value })}
                placeholder="4512"
              />
            </div>
          </div>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                required
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="ELETRÔNICO">Eletrônico</option>
                <option value="MÓVEIS">Móveis</option>
                <option value="MATERIAIS">Materiais</option>
                <option value="CLIMATIZAÇÃO">Climatização</option>
                <option value="HIGIENIZAÇÃO">Higienização</option>
                <option value="ESPORTE">Esporte</option>
              </select>
            </div>
            <div className={styles.campo}>
              <label htmlFor="marca">Marca / Modelo</label>
              <input
                id="marca"
                type="text"
                required
                value={form.marca}
                onChange={(e) => setForm({ ...form, marca: e.target.value })}
                placeholder="Ex: Dell / Latitude 5440"
              />
            </div>
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Aquisição</h2>
          <div className={styles.linha}>
            <div className={styles.campo}>
              <label htmlFor="quantidade">Quantidade</label>
              <input
                id="quantidade"
                type="number"
                min="0"
                required
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="valor">Valor (R$)</label>
              <input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="0,00"
              />
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
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Informações adicionais, estado de conservação, número de série, etc."
            />
          </div>
        </section>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario} onClick={() => router.push('/patrimonios')}>
            <X size={17} /> Cancelar
          </button>
          {erro && <p style={{ color: '#b42318', marginRight: 'auto' }}>{erro}</p>}
          <button type="submit" className={styles.botaoPrimario} disabled={salvando}>
            <Save size={17} /> {salvando ? 'Salvando...' : 'Salvar item'}
          </button>
        </div>
      </form>
    </div>
  )
}
