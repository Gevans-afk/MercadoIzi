# MercadoFácil

**Sistema de gerenciamento de produtos, estoque, datas de validade e vendas para um pequeno mercadinho de bairro.**

Projeto prático da disciplina de **Engenharia de Software I** — Bacharelado em Ciência da Computação, Instituto Federal do Pará (IFPA), Campus Tucuruí.

## Informações acadêmicas

- **Discente:** Geovane Evan Albuquerque Nascimento
- **Turma:** T383-4ND — 2026.2
- **Docente:** Prof. Douglas Bechara Santos
- **Projeto:** MercadoFácil
- **Tipo:** Aplicação web — MVP (Produto Mínimo Viável)

## Sobre o projeto

O MercadoFácil é uma aplicação web desenvolvida com o objetivo de auxiliar na organização e no gerenciamento das atividades de um pequeno mercadinho de bairro.

A proposta busca facilitar o controle dos produtos disponíveis, a movimentação do estoque, o acompanhamento das datas de validade e o registro das vendas.

O sistema foi idealizado para contribuir com a redução de falhas no controle de mercadorias, evitar a comercialização de produtos vencidos e tornar o atendimento mais organizado e eficiente.

## Objetivos do sistema

- Facilitar o cadastro e a consulta de produtos.
- Organizar as informações do estoque.
- Registrar entradas e saídas de mercadorias.
- Monitorar as datas de validade dos produtos.
- Alertar sobre produtos próximos do vencimento.
- Identificar produtos vencidos.
- Registrar vendas e atualizar automaticamente o estoque.
- Auxiliar na organização das atividades diárias do estabelecimento.

## Funcionalidades do MVP

| Requisito | Funcionalidade | Descrição |
|---|---|---|
| RF-01 | Login de demonstração | Permite acessar o sistema utilizando credenciais predefinidas. |
| RF-02 | Cadastro de clientes | Permite registrar e consultar informações dos clientes. |
| RF-03 | Cadastro de produtos | Permite cadastrar e consultar os produtos comercializados. |
| RF-04 | Controle de estoque | Permite registrar entradas e saídas de produtos. |
| RF-05 | Registro de validade | Permite informar e consultar as datas de validade dos produtos. |
| RF-06 | Alertas de vencimento | Destaca produtos com vencimento previsto para os próximos 7 dias. |
| RF-07 | Identificação de vencidos | Identifica produtos cuja data de validade já passou. |
| RF-08 | Registro de vendas | Registra vendas e atualiza automaticamente as quantidades em estoque. |

## Regras de negócio

- **RN-01 — Produtos vencidos:** produtos vencidos não podem ser vendidos.
- **RN-02 — Estoque mínimo:** a quantidade disponível de um produto não pode ficar abaixo de zero.
- **RN-03 — Atualização do estoque:** toda venda registrada deve reduzir automaticamente a quantidade disponível dos produtos vendidos.
- **RN-04 — Controle de validade:** cada produto que exige controle de validade deve possuir sua data de vencimento registrada.
- **RN-05 — Integridade das quantidades:** entradas e saídas devem respeitar quantidades válidas e disponíveis.
- **RN-06 — Alerta de vencimento:** produtos com validade prevista para os próximos 7 dias devem ser destacados no sistema.
- **RN-07 — Identificação de vencidos:** produtos com data de validade anterior à data atual devem ser identificados como vencidos.

*Observação: as regras descrevem o comportamento esperado do sistema e devem ser verificadas durante os testes da aplicação.*

## Tecnologias utilizadas

- **HTML5:** estrutura das páginas.
- **CSS3:** estilos, cores e organização visual da interface.
- **JavaScript (ES6+):** funcionalidades e regras de negócio.
- **LocalStorage:** armazenamento local dos dados no navegador.
- **Git e GitHub:** versionamento e hospedagem do código-fonte.
- **GitHub Pages:** opção de publicação da aplicação web.

## Estrutura do repositório

A estrutura sugerida para organizar os arquivos do projeto é:

```text
MercadoFacil/
├── index.html       # Página principal da aplicação
├── style.css        # Estilos e layout do sistema
├── script.js        # Funcionalidades e regras de negócio
└── README.md        # Documentação do projeto
```

**Importante:** os nomes acima devem corresponder aos arquivos existentes no repositório. Se o JavaScript ou o CSS estiverem em pastas diferentes, atualize a estrutura para refletir a organização real do projeto.

## Como executar o projeto

### Execução local

1. Clone o repositório ou baixe os arquivos do projeto.
2. Caso tenha baixado um arquivo ZIP, extraia seu conteúdo.
3. Abra a pasta do projeto.
4. Localize o arquivo `index.html`.
5. Abra esse arquivo em um navegador atualizado, como Google Chrome, Mozilla Firefox ou Microsoft Edge.
6. Na tela de login, utilize as credenciais de demonstração abaixo.

Não é necessário instalar dependências ou configurar um servidor backend para executar uma versão estática que utilize apenas HTML, CSS e JavaScript.

### Clonar pelo Git

Execute os comandos abaixo em um terminal com o Git instalado:

```bash
git clone https://github.com/Gevans-afk/MercadoFacil.git
cd MercadoFacil
```

Em seguida, abra o arquivo `index.html` no navegador.

## Credenciais de demonstração

Para a versão de demonstração, estão previstas as seguintes credenciais:

| Campo | Valor |
|---|---|
| Usuário | `admin` |
| Senha | `admin123` |

**Atenção:** essas credenciais devem ser utilizadas somente se estiverem configuradas no código da aplicação. Elas são destinadas à demonstração acadêmica, não a um ambiente de produção.

## Roteiro de demonstração

Para apresentar o MercadoFácil durante a avaliação da disciplina, recomenda-se seguir esta sequência:

1. Realizar o login de demonstração.
2. Acessar o painel principal (*dashboard*).
3. Cadastrar um produto.
4. Informar a quantidade e a data de validade do produto.
5. Realizar uma entrada no estoque.
6. Consultar os produtos cadastrados.
7. Verificar os alertas de produtos próximos do vencimento.
8. Consultar a identificação dos produtos vencidos.
9. Registrar uma venda de um produto válido.
10. Conferir a atualização automática do estoque.
11. Verificar se o sistema impede a venda de produtos vencidos ou sem quantidade suficiente.

## Persistência dos dados

O MVP utiliza o `localStorage` do navegador para armazenar informações localmente.

Essa abordagem permite manter os dados entre acessos realizados no mesmo navegador e perfil, desde que o armazenamento não seja apagado e que a aplicação utilize a mesma origem.

Entretanto, o `localStorage` não substitui um banco de dados centralizado. Os dados não são compartilhados automaticamente entre diferentes dispositivos ou navegadores.

## Como publicar no GitHub Pages

1. Acesse o repositório [MercadoFacil no GitHub](https://github.com/Gevans-afk/MercadoFacil).
2. Entre em **Settings**.
3. Acesse a seção **Pages**.
4. Em *Build and deployment*, selecione a opção de publicação a partir de uma branch.
5. Escolha a branch principal do projeto, normalmente `main`, e a pasta `/ (root)`, caso o `index.html` esteja na raiz.
6. Salve as configurações.
7. Aguarde a publicação e utilize o endereço disponibilizado pelo GitHub Pages.

O endereço público somente estará disponível após a configuração e a conclusão da publicação.

## Limitações conhecidas

- O armazenamento dos dados é local ao navegador.
- Não há banco de dados centralizado.
- O login é destinado à demonstração e não oferece segurança adequada para produção.
- Não existe sincronização automática entre dispositivos.
- Não há integração com sistemas externos de pagamento ou emissão fiscal.
- O sistema depende de sua implementação em JavaScript para validar as regras de negócio.
- A disponibilidade das funcionalidades depende de elas estarem efetivamente implementadas e testadas no código atual.

## Melhorias futuras

Como possibilidades de evolução do projeto, podem ser consideradas:

- Implementação de backend e banco de dados.
- Autenticação segura e gerenciamento de usuários.
- Controle de permissões para proprietários e funcionários.
- Relatórios de vendas e movimentações do estoque.
- Histórico de entradas, saídas e vendas.
- Pesquisa e filtragem de produtos.
- Cadastro de fornecedores.
- Exportação de relatórios.
- Interface responsiva aprimorada para celulares e computadores.
- Testes automatizados das regras de negócio.

## Considerações finais

O MercadoFácil propõe uma solução simples para apoiar a gestão de um pequeno mercadinho de bairro, reunindo funcionalidades de cadastro de produtos e clientes, controle de estoque, acompanhamento da validade das mercadorias e registro de vendas.

O desenvolvimento do MVP permite aplicar conceitos de Engenharia de Software, incluindo levantamento de requisitos, definição de regras de negócio, implementação, testes e documentação.

O projeto poderá evoluir futuramente com recursos mais avançados de persistência, segurança e geração de relatórios.

## Licença

Projeto desenvolvido para fins acadêmicos na disciplina de Engenharia de Software I.

A definição de uma licença de software específica poderá ser realizada posteriormente, conforme a decisão do responsável pelo projeto.
