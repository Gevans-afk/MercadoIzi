# MercadoFácil

Sistema para auxiliar no gerenciamento de produtos, estoque, datas de validade e vendas
de um pequeno mercadinho de bairro.

Projeto prático da disciplina de **Engenharia de Software I** — Bacharelado em Ciência
da Computação, Instituto Federal do Pará, Campus Tucuruí.

## Funcionalidades do MVP

| Requisito | Funcionalidade |
|-----------|----------------|
| RF-01 | Login de demonstração |
| RF-02 | Cadastro de clientes |
| RF-03 | Cadastro de produtos |
| RF-04 | Controle de estoque (entradas e saídas) |
| RF-05 | Registro de validade |
| RF-06 | Alertas de produtos próximos do vencimento |
| RF-07 | Identificação de produtos vencidos |
| RF-08 | Registro de vendas com atualização automática do estoque |

## Como executar

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em um navegador web (Chrome, Firefox, Edge).
3. Faça login com as credenciais de demonstração.

Também é possível acessar pelo GitHub Pages após ativá-lo nas configurações do repositório.

## Credenciais de demonstração

- **Usuário:** `admin`
- **Senha:** `admin123`

## Roteiro de demonstração

1. Realizar login;
2. Acessar o dashboard;
3. Cadastrar um produto;
4. Realizar entrada no estoque;
5. Consultar validade;
6. Verificar alertas e produtos vencidos;
7. Registrar uma venda;
8. Verificar a atualização do estoque.

## Regras de negócio implementadas

- **RN-01** — Produtos vencidos não podem ser vendidos.
- **RN-02** — A quantidade em estoque nunca fica abaixo de zero.
- **RN-03** — Vendas reduzem automaticamente o estoque.
- **RN-06** — Produtos com validade em até 7 dias são destacados como alerta.

## Tecnologias

- HTML5, CSS3 e JavaScript (ES6+)
- `localStorage` para persistência dos dados

## Limitações conhecidas

- Armazenamento local no navegador (os dados ficam apenas no dispositivo usado).
- Login de demonstração, sem autenticação de produção.
- Sem banco de dados ou backend.

## Estrutura do repositório

