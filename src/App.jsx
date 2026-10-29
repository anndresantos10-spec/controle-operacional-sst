import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Share2, 
  Plus, 
  Search, 
  AlertTriangle, 
  UserX, 
  Flame, 
  Clock, 
  Calendar,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  Play,
  RotateCcw,
  Sun,
  Download,
  Share,
  UserCheck
} from 'lucide-react';

export default function App() {
  const responsaveisPadrao = ['André', 'Carlos', 'Misael'];

  const [tarefas, setTarefas] = useState(() => {
    const saved = localStorage.getItem('salacontrol_tarefas');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        categoria: 'MANUTENÇÃO/CALIBRAÇÃO',
        prioridade: 'URGENTE',
        titulo: 'Calibrar aparelhos de medição da bancada',
        descricao: 'Aparelhos no armário B. Precisa de nota fiscal de remessa.',
        responsavel: '',
        dataCriacao: '2026-10-25',
        data: '2026-10-28',
        status: 'AFAZER',
        atrasado: true
      },
      {
        id: '2',
        categoria: 'COMPRAS',
        prioridade: 'Média',
        titulo: 'Comprar etiquetas para organização do estoque',
        descricao: 'Verificar com o financeiro antes de comprar.',
        responsavel: 'Carlos',
        dataCriacao: '2026-10-26',
        data: '2026-10-31',
        status: 'ANDAMENTO',
        atrasado: false
      },
      {
        id: '3',
        categoria: 'DOCUMENTAÇÃO',
        prioridade: 'Baixa',
        titulo: 'Atualizar planilha de controle de presença da sala',
        descricao: 'Finalizado e arquivado.',
        responsavel: 'André',
        dataCriacao: '2026-10-27',
        data: '2026-10-29',
        status: 'CONCLUIDO',
        atrasado: false
      }
    ];
  });

  const [busca, setBusca] = useState('');
  const [filtroResponsavel, setFiltroResponsavel] = useState('TODOS');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);

  const [novaTarefa, setNovaTarefa] = useState({
    categoria: 'MANUTENÇÃO/CALIBRAÇÃO',
    prioridade: 'Média',
    titulo: '',
    descricao: '',
    responsavel: '',
    data: ''
  });

  useEffect(() => {
    localStorage.setItem('salacontrol_tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const tarefasAtrasadas = tarefas.filter(t => t.atrasado && t.status !== 'CONCLUIDO').length;
  const semResponsavel = tarefas.filter(t => !t.responsavel && t.status !== 'CONCLUIDO').length;
  const urgentes = tarefas.filter(t => (t.prioridade === 'URGENTE' || t.prioridade === 'Alta') && t.status !== 'CONCLUIDO').length;
  const emAndamento = tarefas.filter(t => t.status === 'ANDAMENTO').length;

  const abrirModalNovo = () => {
    setTarefaEmEdicao(null);
    setNovaTarefa({
      categoria: 'MANUTENÇÃO/CALIBRAÇÃO',
      prioridade: 'Média',
      titulo: '',
      descricao: '',
      responsavel: '',
      data: ''
    });
    setModalAberto(true);
  };

  const abrirModalEdicao = (tarefa) => {
    setTarefaEmEdicao(tarefa.id);
    setNovaTarefa({
      categoria: tarefa.categoria,
      prioridade: tarefa.prioridade,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      responsavel: tarefa.responsavel,
      data: tarefa.data
    });
    setModalAberto(true);
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    if (!novaTarefa.titulo) return;

    const hoje = new Date().toISOString().split('T')[0];

    if (tarefaEmEdicao) {
      setTarefas(tarefas.map(t => t.id === tarefaEmEdicao ? { ...t, ...novaTarefa } : t));
    } else {
      const item = {
        ...novaTarefa,
        id: Date.now().toString(),
        dataCriacao: hoje,
        status: 'AFAZER',
        atrasado: false
      };
      setTarefas([...tarefas, item]);
    }

    setModalAberto(false);
    setTarefaEmEdicao(null);
    setNovaTarefa({
      categoria: 'MANUTENÇÃO/CALIBRAÇÃO',
      prioridade: 'Média',
      titulo: '',
      descricao: '',
      responsavel: '',
      data: ''
    });
  };

  const moverStatus = (id, novoStatus) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, status: novoStatus } : t));
  };

  const removerTarefa = (id) => {
    if (confirm('Deseja excluir este recado/tarefa?')) {
      setTarefas(tarefas.filter(t => t.id !== id));
    }
  };

  const formatarDataBR = (dataStr) => {
    if (!dataStr) return '';
    const partes = dataStr.split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const copiarWhatsApp = () => {
    let texto = `*Resumo da SalaControl - Acordos Internos*\n\n`;
    texto += `🚨 *Atrasadas:* ${tarefasAtrasadas}\n`;
    texto += `⚠️ *Sem Responsável:* ${semResponsavel}\n`;
    texto += `🔥 *Urgentes:* ${urgentes}\n\n`;
    
    texto += `*Avisos / A Fazer:*\n`;
    tarefas.filter(t => t.status === 'AFAZER').forEach(t => {
      texto += `- ${t.titulo} (${t.responsavel || 'Sem dono'}) [Criado: ${formatarDataBR(t.dataCriacao)}]\n`;
    });

    texto += `\n*Em Andamento:*\n`;
    tarefas.filter(t => t.status === 'ANDAMENTO').forEach(t => {
      texto += `- ${t.titulo} (${t.responsavel}) [Criado: ${formatarDataBR(t.dataCriacao)}]\n`;
    });

    navigator.clipboard.writeText(texto);
    alert('Resumo copiado para a área de transferência! Cole no WhatsApp.');
  };

  const tarefasFiltradas = tarefas.filter(t => {
    const atendeBusca = t.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                        t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                        t.categoria.toLowerCase().includes(busca.toLowerCase());
    const atendeResp = filtroResponsavel === 'TODOS' || (filtroResponsavel === 'SEM' ? !t.responsavel : t.responsavel === filtroResponsavel);
    const atendeCat = filtroCategoria === 'TODAS' || t.categoria === filtroCategoria;
    return atendeBusca && atendeResp && atendeCat;
  });

  const afazer = tarefasFiltradas.filter(t => t.status === 'AFAZER');
  const andamento = tarefasFiltradas.filter(t => t.status === 'ANDAMENTO');
  const concluido = tarefasFiltradas.filter(t => t.status === 'CONCLUIDO');

  const todosResponsaveis = Array.from(new Set([...responsaveisPadrao, ...tarefas.map(t => t.responsavel).filter(Boolean)]));
  const categoriasUnicas = Array.from(new Set(tarefas.map(t => t.categoria)));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#0284c7] p-2.5 rounded-xl text-white shadow-sm">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SalaControl</h1>
              <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md">Local</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Acompanhamento e cobrança de acordos internos</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={copiarWhatsApp}
            className="bg-[#059669] hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition shadow-sm"
          >
            <Share2 className="w-4 h-4" /> Copiar p/ WhatsApp
          </button>
          <button 
            onClick={abrirModalNovo}
            className="bg-[#0284c7] hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Novo Recado / Tarefa
          </button>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 text-slate-400">
            <button className="p-1.5 hover:text-slate-600 rounded-md"><Sun className="w-4 h-4" /></button>
            <button className="p-1.5 hover:text-slate-600 rounded-md"><Download className="w-4 h-4" /></button>
            <button className="p-1.5 hover:text-slate-600 rounded-md"><Share className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Tarefas Atrasadas</span>
            <span className="text-2xl font-bold text-red-600">{tarefasAtrasadas}</span>
          </div>
          <div className="bg-red-50 p-3 rounded-xl text-red-500 border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Sem Responsável</span>
            <span className="text-2xl font-bold text-amber-600">{semResponsavel}</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl text-amber-500 border border-amber-100">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Urgentes / Alta Prioridade</span>
            <span className="text-2xl font-bold text-orange-600">{urgentes}</span>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl text-orange-500 border border-orange-100">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Em Andamento</span>
            <span className="text-2xl font-bold text-sky-600">{emAndamento}</span>
          </div>
          <div className="bg-sky-50 p-3 rounded-xl text-sky-500 border border-sky-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row gap-3 mb-6 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar recado, aparelho, etc..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full bg-slate-100/70 border border-slate-200/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={filtroResponsavel}
            onChange={e => setFiltroResponsavel(e.target.value)}
            className="bg-slate-100/70 border border-slate-200/80 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="TODOS">Todos os Responsáveis</option>
            <option value="SEM">Ninguém assumiu</option>
            {todosResponsaveis.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select 
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="bg-slate-100/70 border border-slate-200/80 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="TODAS">Todas as Categorias</option>
            {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button 
            onClick={() => { setBusca(''); setFiltroResponsavel('TODOS'); setFiltroCategoria('TODAS'); }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            title="Limpar Filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#f1f5f9]/70 rounded-2xl p-4 border border-slate-200/60">
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase">AVISOS / A FAZER</h2>
            </div>
            <span className="bg-slate-200/80 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {afazer.length}
            </span>
          </div>

          <div className="space-y-3">
            {afazer.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-tight">
                    {item.categoria}
                  </span>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {item.prioridade}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-medium mb-2">
                  Criado em: {formatarDataBR(item.dataCriacao)}
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-1 leading-snug">{item.titulo}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.descricao}</p>

                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-amber-100/80 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                    {item.responsavel ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />} 
                    {item.responsavel || 'NINGUÉM ASSUMIU'}
                  </span>
                  <span className="text-red-600 text-[11px] font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatarDataBR(item.data)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-400">
                  <div className="flex gap-2">
                    <button onClick={() => moverStatus(item.id, 'ANDAMENTO')} className="hover:text-sky-600" title="Iniciar">
                      <Play className="w-4 h-4" />
                    </button>
                    <button onClick={() => moverStatus(item.id, 'CONCLUIDO')} className="hover:text-emerald-600" title="Concluir">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => abrirModalEdicao(item)} className="hover:text-slate-600" title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removerTarefa(item.id)} className="hover:text-red-500" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f1f5f9]/70 rounded-2xl p-4 border border-slate-200/60">
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase">EM ANDAMENTO</h2>
            </div>
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {andamento.length}
            </span>
          </div>

          <div className="space-y-3">
            {andamento.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-tight">
                    {item.categoria}
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.prioridade}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-medium mb-2">
                  Criado em: {formatarDataBR(item.dataCriacao)}
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-1 leading-snug">{item.titulo}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.descricao}</p>

                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> {item.responsavel || 'Sem responsável'}
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatarDataBR(item.data)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-400">
                  <div className="flex gap-2">
                    <button onClick={() => moverStatus(item.id, 'AFAZER')} className="hover:text-slate-600" title="Voltar">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => moverStatus(item.id, 'CONCLUIDO')} className="hover:text-emerald-600" title="Concluir">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => abrirModalEdicao(item)} className="hover:text-slate-600" title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removerTarefa(item.id)} className="hover:text-red-500" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f1f5f9]/70 rounded-2xl p-4 border border-slate-200/60">
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase">CONCLUÍDO</h2>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {concluido.length}
            </span>
          </div>

          <div className="space-y-3">
            {concluido.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-tight">
                    {item.categoria}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.prioridade}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-medium mb-2">
                  Criado em: {formatarDataBR(item.dataCriacao)}
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-1 leading-snug">{item.titulo}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.descricao}</p>

                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> {item.responsavel || 'Sem responsável'}
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatarDataBR(item.data)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-400">
                  <div className="flex gap-2">
                    <button onClick={() => moverStatus(item.id, 'ANDAMENTO')} className="hover:text-slate-600" title="Voltar para Andamento">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => moverStatus(item.id, 'AFAZER')} className="hover:text-sky-600" title="Reiniciar">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => abrirModalEdicao(item)} className="hover:text-slate-600" title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removerTarefa(item.id)} className="hover:text-red-500" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {tarefaEmEdicao ? 'Editar Recado / Tarefa' : 'Novo Recado / Tarefa'}
            </h3>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título</label>
                <input 
                  type="text"
                  required
                  value={novaTarefa.titulo}
                  onChange={e => setNovaTarefa({...novaTarefa, titulo: e.target.value})}
                  placeholder="Ex: Calibrar aparelhos de medição"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria</label>
                  <input 
                    type="text"
                    value={novaTarefa.categoria}
                    onChange={e => setNovaTarefa({...novaTarefa, categoria: e.target.value})}
                    placeholder="Ex: COMPRAS"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prioridade</label>
                  <select 
                    value={novaTarefa.prioridade}
                    onChange={e => setNovaTarefa({...novaTarefa, prioridade: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="URGENTE">URGENTE</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Responsável</label>
                <select 
                  value={novaTarefa.responsavel}
                  onChange={e => setNovaTarefa({...novaTarefa, responsavel: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="">Selecione o responsável (ou deixe sem)</option>
                  {responsaveisPadrao.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Data Limite</label>
                <input 
                  type="date"
                  value={novaTarefa.data}
                  onChange={e => setNovaTarefa({...novaTarefa, data: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição / Detalhes</label>
                <textarea 
                  rows="3"
                  value={novaTarefa.descricao}
                  onChange={e => setNovaTarefa({...novaTarefa, descricao: e.target.value})}
                  placeholder="Observações adicionais..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-[#0284c7] hover:bg-sky-700 text-white rounded-lg shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
