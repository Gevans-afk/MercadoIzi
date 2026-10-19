// MercadoFácil — lógica da aplicação (MVP com localStorage)

const DIAS_ALERTA = 7; // RN-06: período de alerta de validade

// Credenciais de demonstração (RF-01)
const USUARIOS = [
  { login: 'admin', senha: 'admin123', nome: 'Proprietário', tipo: 'proprietario' },
  { login: 'func', senha: 'func123', nome: 'Funcionário', tipo: 'funcionario' }
];

// ---------- Persistência (padrão Repository simplificado) ----------
const Repo = {
  ler(chave, padrao = []) {
    try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; }
    catch { return padrao; }
  },
  salvar(chave, valor) { localStorage.setItem(chave, JSON.stringify(valor)); }
};

let produtos = Repo.ler('mf_produtos');
let clientes = Repo.ler('mf_clientes');
let movimentacoes = Repo.ler('mf_movimentacoes');
let vendas = Repo.ler('mf_vendas');
let usuarioAtual = JSON.parse(sessionStorage.getItem('mf_usuario')) || null;
let carrinho = [];

const salvarTudo = () => {
  Repo.salvar('mf_produtos', produtos);
  Repo.salvar('mf_clientes', clientes);
  Repo.salvar('mf_movimentacoes', movimentacoes);
  Repo.salvar('mf_vendas', vendas);
};

// ---------- Utilitários ----------
const $ = (sel) => document.querySelector(sel);
const gerarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const moeda = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatarData = (iso) => iso ? iso.split('-').reverse().join('/') : '—';
const hojeISO = () => new Date().toISOString().slice(0, 10);

function diasParaVencer(dataISO) {
  if (!dataISO) return null;
  const hoje = new Date(hojeISO());
  const validade = new Date(dataISO);
  return Math.round((validade - hoje) / 86400000);
}

// RF-06 / RF-07: situação da validade
function statusValidade(produto) {
  const dias = diasParaVencer(produto.dataValidade);
  if (dias === null) return 'sem';
  if (dias < 0) return 'vencido';
  if (dias <= DIAS_ALERTA) return 'alerta';
  return 'ok';
}

function toast(msg, erro = false) {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast visivel' + (erro ? ' erro' : '');
  setTimeout(() => el.className = 'toast', 2800);
}

// ---------- Navegação ----------
function mostrarTela(nome) {
  document.querySelectorAll('main .tela').forEach(t => t.classList.remove('ativa'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.toggle('ativo', m.dataset.tela === nome));
  $(`#tela-${nome}`).classList.add('ativa');
  renderizarTudo();
}

document.querySelectorAll('.menu-item').forEach(btn =>
  btn.addEventListener('click', () => mostrarTela(btn.dataset.tela))
);

// ---------- RF-01: Login ----------
$('#form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const login = $('#login-usuario').value.trim();
  const senha = $('#login-senha').value;
  const usuario = USUARIOS.find(u => u.login === login && u.senha === senha);
  if (!usuario) {
    $('#login-erro').textContent = 'Usuário ou senha inválidos.';
    return;
  }
  usuarioAtual = usuario;
  sessionStorage.setItem('mf_usuario', JSON.stringify(usuario));
  entrarNoSistema();
});

function entrarNoSistema() {
  $('#tela-login').classList.remove('ativa');
  $('#app').classList.remove('oculto');
  $('#usuario-logado').textContent = usuarioAtual.nome;
  mostrarTela('dashboard');
}

$('#btn-sair').addEventListener('click', () => {
  usuarioAtual = null;
  sessionStorage.removeItem('mf_usuario');
  $('#app').classList.add('oculto');
  $('#tela-login').classList.add('ativa');
  $('#form-login').reset();
  $('#login-erro').textContent = '';
});

// ---------- RF-03 / RF-05: Produtos ----------
$('#form-produto').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = $('#produto-id').value;
  const dados = {
    nome: $('#produto-nome').value.trim(),
    categoria: $('#produto-categoria').value,
    preco: parseFloat($('#produto-preco').value),
    quantidade: parseInt($('#produto-quantidade').value, 10),
    dataValidade: $('#produto-validade').value || null
  };
  if (dados.quantidade < 0) return toast('Quantidade não pode ser negativa.', true);

  if (id) {
    const p = produtos.find(p => p.id === id);
    Object.assign(p, dados);
    toast('Produto atualizado.');
  } else {
    produtos.push({ id: gerarId(), ...dados });
    if (dados.quantidade > 0) {
      movimentacoes.unshift({ id: gerarId(), data: new Date().toISOString(), produtoId: produtos.at(-1).id,
        tipo: 'entrada', quantidade: dados.quantidade, obs: 'Cadastro inicial' });
    }
    toast('Produto cadastrado.');
  }
  salvarTudo();
  cancelarEdicaoProduto();
  renderizarTudo();
});

function editarProduto(id) {
  const p = produtos.find(p => p.id === id);
  $('#produto-id').value = p.id;
  $('#produto-nome').value = p.nome;
  $('#produto-categoria').value = p.categoria;
  $('#produto-preco').value = p.preco;
  $('#produto-quantidade').value = p.quantidade;
  $('#produto-validade').value = p.dataValidade || '';
  $('#produto-form-titulo').textContent = 'Editar produto';
  $('#btn-cancelar-produto').classList.remove('oculto');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirProduto(id) {
  if (!confirm('Excluir este produto?')) return;
  produtos = produtos.filter(p => p.id !== id);
  salvarTudo();
  renderizarTudo();
  toast('Produto excluído.');
}

function cancelarEdicaoProduto() {
  $('#form-produto').reset();
  $('#produto-id').value = '';
  $('#produto-form-titulo').textContent = 'Cadastrar produto';
  $('#btn-cancelar-produto').classList.add('oculto');
}
$('#btn-cancelar-produto').addEventListener('click', cancelarEdicaoProduto);
$('#busca-produto').addEventListener('input', renderizarProdutos);

function renderizarProdutos() {
  const filtro = $('#busca-produto').value.toLowerCase();
  const tbody = $('#tabela-produtos');
  const lista = produtos.filter(p => p.nome.toLowerCase().includes(filtro));
  tbody.innerHTML = lista.length ? lista.map(p => {
    const st = statusValidade(p);
    const badge = { ok: 'Válido', alerta: 'Vence em breve', vencido: 'Vencido', sem: '—' }[st];
    return `<tr class="${st}">
      <td>${p.nome}</td><td>${p.categoria}</td><td>${moeda(p.preco)}</td><td>${p.quantidade}</td>
      <td>${formatarData(p.dataValidade)} ${st !== 'sem' ? `<span class="badge ${st}">${badge}</span>` : ''}</td>
      <td>
        <button class="btn btn-secundario btn-pequeno" onclick="editarProduto('${p.id}')">Editar</button>
        <button class="btn btn-perigo btn-pequeno" onclick="excluirProduto('${p.id}')">Excluir</button>
      </td></tr>`;
  }).join('') : '<tr><td colspan="6" class="vazio">Nenhum produto cadastrado.</td></tr>';
}

// ---------- RF-04: Estoque ----------
$('#form-estoque').addEventListener('submit', (e) => {
  e.preventDefault();
  const produto = produtos.find(p => p.id === $('#estoque-produto').value);
  const tipo = $('#estoque-tipo').value;
  const qtd = parseInt($('#estoque-quantidade').value, 10);
  if (!produto) return toast('Selecione um produto.', true);

  if (tipo === 'saida' && produto.quantidade - qtd < 0) {
    return toast(`Estoque insuficiente. Disponível: ${produto.quantidade}.`, true); // RN-02
  }
  produto.quantidade += tipo === 'entrada' ? qtd : -qtd;
  movimentacoes.unshift({ id: gerarId(), data: new Date().toISOString(), produtoId: produto.id,
    tipo, quantidade: qtd, obs: $('#estoque-obs').value.trim() });
  salvarTudo();
  $('#form-estoque').reset();
  renderizarTudo();
  toast(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada. Estoque atual: ${produto.quantidade}.`);
});

function renderizarMovimentacoes() {
  const tbody = $('#tabela-movimentacoes');
  tbody.innerHTML = movimentacoes.length ? movimentacoes.slice(0, 50).map(m => {
    const p = produtos.find(p => p.id === m.produtoId);
    return `<tr>
      <td>${new Date(m.data).toLocaleString('pt-BR')}</td>
      <td>${p ? p.nome : '(removido)'}</td>
      <td><span class="badge ${m.tipo}">${m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span></td>
      <td>${m.quantidade}</td><td>${m.obs || '—'}</td></tr>`;
  }).join('') : '<tr><td colspan="5" class="vazio">Nenhuma movimentação registrada.</td></tr>';
}

// ---------- RF-05 / RF-06 / RF-07: Validade ----------
$('#form-validade').addEventListener('submit', (e) => {
  e.preventDefault();
  const produto = produtos.find(p => p.id === $('#validade-produto').value);
  if (!produto) return toast('Selecione um produto.', true);
  produto.dataValidade = $('#validade-data').value;
  salvarTudo();
  $('#form-validade').reset();
  renderizarTudo();
  toast('Validade registrada.');
});

function itemValidade(p, st) {
  const dias = diasParaVencer(p.dataValidade);
  const texto = st === 'vencido' ? `Venceu há ${Math.abs(dias)} dia(s)`
    : dias === 0 ? 'Vence hoje' : `Vence em ${dias} dia(s)`;
  return `<div class="item ${st}">
    <div><strong>${p.nome}</strong><br><small>${p.categoria} · ${p.quantidade} un. em estoque</small></div>
    <div><small>${formatarData(p.dataValidade)}</small><br><strong>${texto}</strong></div>
  </div>`;
}

function renderizarValidade() {
  const grupos = { vencido: [], alerta: [], ok: [] };
  produtos.filter(p => p.dataValidade).forEach(p => grupos[statusValidade(p)].push(p));
  Object.values(grupos).forEach(g => g.sort((a, b) => a.dataValidade.localeCompare(b.dataValidade)));

  const vazio = (msg) => `<p class="vazio">${msg}</p>`;
  $('#lista-vencidos').innerHTML = grupos.vencido.map(p => itemValidade(p, 'vencido')).join('') || vazio('Nenhum produto vencido.');
  $('#lista-alertas').innerHTML = grupos.alerta.map(p => itemValidade(p, 'alerta')).join('') || vazio('Nenhum produto próximo do vencimento.');
  $('#lista-ok').innerHTML = grupos.ok.map(p => itemValidade(p, 'ok')).join('') || vazio('Nenhum produto nesta situação.');

  // Dashboard
  $('#dashboard-alertas').innerHTML =
    [...grupos.vencido.map(p => itemValidade(p, 'vencido')), ...grupos.alerta.map(p => itemValidade(p, 'alerta'))].join('')
    || vazio('Nenhum alerta de validade no momento.');
  return grupos;
}

// ---------- RF-08: Vendas ----------
$('#btn-adicionar-item').addEventListener('click', () => {
  const produto = produtos.find(p => p.id === $('#venda-produto').value);
  const qtd = parseInt($('#venda-quantidade').value, 10) || 0;
  if (!produto) return toast('Selecione um produto.', true);
  if (qtd <= 0) return toast('Informe uma quantidade válida.', true);
  if (statusValidade(produto) === 'vencido') return toast('Produto vencido não pode ser vendido.', true); // RN-01

  const existente = carrinho.find(i => i.produtoId === produto.id);
  const totalDesejado = (existente ? existente.quantidade : 0) + qtd;
  if (totalDesejado > produto.quantidade) {
    return toast(`Estoque insuficiente. Disponível: ${produto.quantidade}.`, true); // RN-02
  }
  if (existente) existente.quantidade = totalDesejado;
  else carrinho.push({ produtoId: produto.id, nome: produto.nome, quantidade: qtd, precoUnitario: produto.preco });
  renderizarCarrinho();
});

function removerItemCarrinho(idx) {
  carrinho.splice(idx, 1);
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const tbody = $('#tabela-carrinho');
  tbody.innerHTML = carrinho.length ? carrinho.map((i, idx) => `<tr>
    <td>${i.nome}</td><td>${i.quantidade}</td><td>${moeda(i.precoUnitario)}</td>
    <td>${moeda(i.quantidade * i.precoUnitario)}</td>
    <td><button class="btn btn-perigo btn-pequeno" onclick="removerItemCarrinho(${idx})">✕</button></td></tr>`).join('')
    : '<tr><td colspan="5" class="vazio">Nenhum item adicionado.</td></tr>';
  const total = carrinho.reduce((s, i) => s + i.quantidade * i.precoUnitario, 0);
  $('#venda-total').textContent = moeda(total);
}

$('#btn-finalizar-venda').addEventListener('click', () => {
  if (!carrinho.length) return toast('Adicione ao menos um item.', true);

  // RN-03: reduzir estoque
  for (const item of carrinho) {
    const p = produtos.find(p => p.id === item.produtoId);
    if (!p || p.quantidade < item.quantidade) return toast(`Estoque insuficiente para ${item.nome}.`, true);
  }
  carrinho.forEach(item => {
    const p = produtos.find(p => p.id === item.produtoId);
    p.quantidade -= item.quantidade;
    movimentacoes.unshift({ id: gerarId(), data: new Date().toISOString(), produtoId: p.id,
      tipo: 'saida', quantidade: item.quantidade, obs: 'Venda' });
  });

  const clienteId = $('#venda-cliente').value;
  const cliente = clientes.find(c => c.id === clienteId);
  vendas.unshift({
    id: gerarId(),
    data: new Date().toISOString(),
    usuario: usuarioAtual.nome,
    clienteNome: cliente ? cliente.nome : 'Não identificado',
    itens: carrinho.map(i => ({ ...i })),
    valorTotal: carrinho.reduce((s, i) => s + i.quantidade * i.precoUnitario, 0)
  });
  carrinho = [];
  salvarTudo();
  renderizarTudo();
  toast('Venda registrada e estoque atualizado.');
});

function renderizarVendas() {
  const tbody = $('#tabela-vendas');
  tbody.innerHTML = vendas.length ? vendas.slice(0, 50).map(v => `<tr>
    <td>${new Date(v.data).toLocaleString('pt-BR')}</td>
    <td>${v.clienteNome}</td>
    <td>${v.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}</td>
    <td>${moeda(v.valorTotal)}</td><td>${v.usuario}</td></tr>`).join('')
    : '<tr><td colspan="5" class="vazio">Nenhuma venda registrada.</td></tr>';
}

// ---------- RF-02: Clientes ----------
$('#form-cliente').addEventListener('submit', (e) => {
  e.preventDefault();
  clientes.push({ id: gerarId(), nome: $('#cliente-nome').value.trim(), telefone: $('#cliente-telefone').value.trim() });
  salvarTudo();
  $('#form-cliente').reset();
  renderizarTudo();
  toast('Cliente cadastrado.');
});

function excluirCliente(id) {
  if (!confirm('Excluir este cliente?')) return;
  clientes = clientes.filter(c => c.id !== id);
  salvarTudo();
  renderizarTudo();
}

function renderizarClientes() {
  const tbody = $('#tabela-clientes');
  tbody.innerHTML = clientes.length ? clientes.map(c => `<tr>
    <td>${c.nome}</td><td>${c.telefone || '—'}</td>
    <td><button class="btn btn-perigo btn-pequeno" onclick="excluirCliente('${c.id}')">Excluir</button></td></tr>`).join('')
    : '<tr><td colspan="3" class="vazio">Nenhum cliente cadastrado.</td></tr>';
}

// ---------- Selects e dashboard ----------
function preencherSelects() {
  const ordenados = [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
  const opcoes = ordenados.map(p => `<option value="${p.id}">${p.nome} (${p.quantidade} un.)</option>`).join('');
  const vazio = '<option value="">Nenhum produto cadastrado</option>';
  ['#estoque-produto', '#validade-produto', '#venda-produto'].forEach(sel => $(sel).innerHTML = opcoes || vazio);
  $('#venda-cliente').innerHTML = '<option value="">Consumidor não identificado</option>' +
    clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

function renderizarDashboard(grupos) {
  $('#res-produtos').textContent = produtos.length;
  $('#res-estoque').textContent = produtos.reduce((s, p) => s + p.quantidade, 0);
  $('#res-alertas').textContent = grupos.alerta.length;
  $('#res-vencidos').textContent = grupos.vencido.length;
  const hoje = hojeISO();
  const totalHoje = vendas.filter(v => v.data.slice(0, 10) === hoje).reduce((s, v) => s + v.valorTotal, 0);
  $('#res-vendas').textContent = moeda(totalHoje);
}

function renderizarTudo() {
  renderizarProdutos();
  renderizarMovimentacoes();
  const grupos = renderizarValidade();
  renderizarDashboard(grupos);
  renderizarVendas();
  renderizarClientes();
  renderizarCarrinho();
  preencherSelects();
}

// ---------- Inicialização ----------
if (usuarioAtual) entrarNoSistema();
