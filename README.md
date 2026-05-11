# Refatoração SOLID — Sistema de Pedidos E-commerce

Refatoração de um sistema legado de pedidos aplicando os cinco princípios SOLID em TypeScript.

## Princípios aplicados

### SRP — Single Responsibility Principle
A classe `Pedido` original acumulava persistência, envio de e-mail e cálculos.
Foram extraídas as classes `ServicoEmail` e `ProcessadorPedido`, cada uma com uma única razão para mudar.

### OCP — Open/Closed Principle
O método `calcularDesconto()` usava if/else e exigia modificação a cada novo tipo de cliente.
Substituído pelo padrão Strategy com a interface `ICalculadorDesconto` — adicionar um novo tipo de cliente não exige alterar código existente.

### LSP — Liskov Substitution Principle
`PedidoProdutoDigital` lançava exceção em `calcularFrete()`, quebrando o contrato da classe base.
O método foi removido da classe base. `PedidoFisico` o implementa; `PedidoDigital` não herda o que não pode cumprir.

### ISP — Interface Segregation Principle
`ITarefasPedido` forçava `PedidoDigital` a implementar `imprimirEtiquetaFisica()` de forma inválida.
Segregada em três interfaces coesas: `IProcessaPagamento`, `IGeraNotaFiscal` e `IImprimeEtiqueta`.

### DIP — Dependency Inversion Principle
`salvarPedido()` instanciava `BancoDeDadosMySQL` diretamente, impossibilitando testes e troca de banco.
Introduzida a abstração `IRepositorioPedido` injetada no construtor de `ProcessadorPedido`.

## Tecnologia

- TypeScript

## Como executar

```bash
npx ts-node pedido-solid.ts
```
