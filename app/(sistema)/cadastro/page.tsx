'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { PageLoading } from '@/components/ui/page-loading'
import { PageHeader } from '@/components/page-header'
import {
  ambientesApi,
  blocosApi,
  patrimoniosApi,
  type Ambiente,
  type Bloco,
  type CriarPatrimonio,
} from '@/lib/api'
import styles from './cadastro.module.css'

export default function CadastroPage() {
  const router = useRouter()
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [blocos, setBlocos] = useState<Bloco[]>([])
  const [blocoId, setBlocoId] = useState('')
  const [erroAmbientes, setErroAmbientes] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState({
    nome: '',
    tombamento: '',
    categoria: '',
    marca: '',
    valor: '',
    quantidade: '1',
    ambienteId: '',
    descricao: '',
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    Promise.all([ambientesApi.list(), blocosApi.list()])
      .then(([rooms, blocks]) => {
        setAmbientes(rooms)
        setBlocos(blocks)
      })
      .catch((error) =>
        setErroAmbientes(error instanceof Error ? error.message : 'Erro ao carregar ambientes'),
      )
      .finally(() => setCarregando(false))
  }, [])

  const ambientesDoBloco = ambientes.filter((ambiente) => ambiente.blocoId === blocoId)

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
        ambienteId: form.ambienteId || null,
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
    <MotionConfig reducedMotion="user">
    <div>
      <PageHeader
        titulo="Cadastrar Item"
        descricao="Registre um novo bem adquirido pela escola e vincule-o a um ambiente."
      />

      {carregando ? (
        <PageLoading variant="form" label="Carregando dados do cadastro" />
      ) : (
      <motion.form
        className={styles.form}
        onSubmit={submit}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.section
          className={styles.secao}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
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
        </motion.section>

        <motion.section
          className={styles.secao}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
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
          <div className={styles.campo}>
            <label htmlFor="bloco-inicial">Bloco</label>
            <select
              id="bloco-inicial"
              value={blocoId}
              onChange={(e) => {
                setBlocoId(e.target.value)
                setForm({ ...form, ambienteId: '' })
              }}
            >
              <option value="">Selecione um bloco</option>
              {blocos.map((bloco) => (
                <option key={bloco.id} value={bloco.id}>
                  Bloco {bloco.numero ?? 'sem número'}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.campo}>
            <label htmlFor="ambiente">Ambiente inicial (opcional)</label>
            <select
              id="ambiente"
              value={form.ambienteId}
              onChange={(e) => setForm({ ...form, ambienteId: e.target.value })}
              disabled={!blocoId}
            >
              <option value="">Sem localização (atribuir depois)</option>
              {ambientesDoBloco.map((ambiente) => (
                <option key={ambiente.id} value={ambiente.id}>
                  {ambiente.nome}
                </option>
              ))}
            </select>
            <small>As unidades da quantidade informada serão vinculadas a este ambiente.</small>
            {blocoId && ambientesDoBloco.length === 0 && (
              <small>Este bloco não possui ambientes cadastrados.</small>
            )}
            {erroAmbientes && <small role="alert">{erroAmbientes}</small>}
          </div>
        </motion.section>

        <motion.section
          className={styles.secao}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
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
        </motion.section>

        <motion.div
          className={styles.acoes}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <button type="button" className={styles.botaoSecundario} onClick={() => router.push('/patrimonios')}>
            <X size={17} /> Cancelar
          </button>
          {erro && <p style={{ color: '#b42318', marginRight: 'auto' }}>{erro}</p>}
          <button type="submit" className={styles.botaoPrimario} disabled={salvando}>
            <Save size={17} /> {salvando ? 'Salvando...' : 'Salvar item'}
          </button>
        </motion.div>
      </motion.form>
      )}
    </div>
    </MotionConfig>
  )
}
