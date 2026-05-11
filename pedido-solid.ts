// ============================================================
// REFATORAÇÃO SOLID — Sistema de Pedidos E-commerce
// ============================================================
 
// ─────────────────────────────────────────────────────────────
// 1. SRP — Single Responsibility Principle
//    Antes: Pedido acumulava persistência, e-mail e cálculos.
//    Depois: cada classe tem uma única razão para mudar.
// ─────────────────────────────────────────────────────────────
 
/** Representa apenas os dados de um pedido. */
class Pedido {
  constructor(
    public readonly valorTotal: number,
    public readonly tipoCliente: string
  ) {}
}
 
/** Responsável exclusivamente pelo envio de notificações por e-mail. */
class ServicoEmail {
  enviarConfirmacao(pedido: Pedido): void {
    console.log(`Enviando e-mail de confirmação para pedido de R$ ${pedido.valorTotal}...`);
  }
}
// ─────────────────────────────────────────────────────────────
// 2. OCP — Open/Closed Principle
//    Antes: calcularDesconto() usava if/else e exigia modificação
//           a cada novo tipo de cliente.
//    Depois: cada estratégia de desconto é uma implementação
//            independente; adicionar "PREMIUM" não toca no código
//            existente.
// ─────────────────────────────────────────────────────────────
 
interface ICalculadorDesconto {
  calcular(valorTotal: number): number;
}
 
class DescontoVIP implements ICalculadorDesconto {
  calcular(valorTotal: number): number {
    return valorTotal * 0.20;
  }
}
 
class DescontoEstudante implements ICalculadorDesconto {
  calcular(valorTotal: number): number {
    return valorTotal * 0.10;
  }
}
 
/** Novo tipo de cliente adicionado sem modificar classes existentes. */
class DescontoPremium implements ICalculadorDesconto {
  calcular(valorTotal: number): number {
    return valorTotal * 0.15;
  }
}
 
class SemDesconto implements ICalculadorDesconto {
  calcular(_valorTotal: number): number {
    return 0;
  }
}
 
/** Fábrica que mapeia o tipo de cliente para a estratégia correta. */
function obterCalculadorDesconto(tipoCliente: string): ICalculadorDesconto {
  const mapa: Record<string, ICalculadorDesconto> = {
    VIP: new DescontoVIP(),
    ESTUDANTE: new DescontoEstudante(),
    PREMIUM: new DescontoPremium(),
  };
  return mapa[tipoCliente] ?? new SemDesconto();
}
 
// ─────────────────────────────────────────────────────────────
// 3. LSP — Liskov Substitution Principle
//    Antes: PedidoProdutoDigital estendia Pedido e lançava
//           exceção em calcularFrete(), quebrando contratos.
//    Depois: calcularFrete() foi removido da classe base.
//            PedidoFisico carrega essa responsabilidade; o digital
//            nunca promete o que não pode cumprir.
// ─────────────────────────────────────────────────────────────
 
class PedidoFisico extends Pedido {
  calcularFrete(): number {
    return 15.0;
  }
}
 
class PedidoDigital extends Pedido {
  // Não herda nem simula calcularFrete — contrato honrado.
}
// ─────────────────────────────────────────────────────────────
// 4. ISP — Interface Segregation Principle
//    Antes: ITarefasPedido forçava PedidoDigital a implementar
//           imprimirEtiquetaFisica() lançando erro.
//    Depois: três interfaces coesas; cada classe implementa
//            apenas o que faz sentido para ela.
// ─────────────────────────────────────────────────────────────
 
interface IProcessaPagamento {
  processarPagamento(): void;
}
 
interface IGeraNotaFiscal {
  gerarNotaFiscal(): void;
}
 
interface IImprimeEtiqueta {
  imprimirEtiquetaFisica(): void;
}
 
class ServicoPedidoDigital implements IProcessaPagamento, IGeraNotaFiscal {
  processarPagamento(): void {
    console.log("Pagamento digital processado.");
  }
  gerarNotaFiscal(): void {
    console.log("Nota fiscal digital gerada.");
  }
  // Sem imprimirEtiquetaFisica — nenhum erro lançado, nenhum contrato quebrado.
}
 
class ServicoPedidoFisico
  implements IProcessaPagamento, IGeraNotaFiscal, IImprimeEtiqueta
{
  processarPagamento(): void {
    console.log("Pagamento processado.");
  }
  gerarNotaFiscal(): void {
    console.log("Nota fiscal física gerada.");
  }
  imprimirEtiquetaFisica(): void {
    console.log("Etiqueta física impressa.");
  }
}
 
// ─────────────────────────────────────────────────────────────
// 5. DIP — Dependency Inversion Principle
//    Antes: salvarPedido() instanciava BancoDeDadosMySQL
//           diretamente, tornando testes e trocas impossíveis.
//    Depois: ProcessadorPedido depende de IRepositorioPedido
//            (abstração); a implementação concreta é injetada
//            pelo chamador (Injeção de Dependência).
// ─────────────────────────────────────────────────────────────
 
interface IRepositorioPedido {
  salvar(pedido: Pedido): void;
}
 
class RepositorioMySQL implements IRepositorioPedido {
  salvar(pedido: Pedido): void {
    console.log(`[MySQL] Salvando pedido de R$ ${pedido.valorTotal}...`);
  }
}
 
class RepositorioMongoDB implements IRepositorioPedido {
  salvar(pedido: Pedido): void {
    console.log(`[MongoDB] Salvando pedido de R$ ${pedido.valorTotal}...`);
  }
}
 
/** Repositório em memória — ideal para testes unitários. */
class RepositorioEmMemoria implements IRepositorioPedido {
  public pedidosSalvos: Pedido[] = [];
  salvar(pedido: Pedido): void {
    this.pedidosSalvos.push(pedido);
    console.log(`[Memória] Pedido armazenado.`);
  }
}
 
// ─────────────────────────────────────────────────────────────
// Orquestrador — compõe as dependências (sem violar nenhum
// princípio: depende de abstrações, tem responsabilidade única).
// ─────────────────────────────────────────────────────────────
 
class ProcessadorPedido {
  constructor(
    private readonly repositorio: IRepositorioPedido,
    private readonly email: ServicoEmail
  ) {}
 
  processar(pedido: Pedido): void {
    const calculador = obterCalculadorDesconto(pedido.tipoCliente);
    const desconto = calculador.calcular(pedido.valorTotal);
    console.log(`Desconto aplicado: R$ ${desconto.toFixed(2)}`);
 
    this.repositorio.salvar(pedido);
    this.email.enviarConfirmacao(pedido);
  }
}
 
// ─────────────────────────────────────────────────────────────
// Exemplo de uso
// ─────────────────────────────────────────────────────────────
 
const repositorio = new RepositorioMySQL();
const email = new ServicoEmail();
const processador = new ProcessadorPedido(repositorio, email);
 
const pedidoVIP = new PedidoFisico(500, "VIP");
processador.processar(pedidoVIP);
console.log(`Frete: R$ ${pedidoVIP.calcularFrete().toFixed(2)}`);
 
const pedidoDigital = new PedidoDigital(120, "ESTUDANTE");
processador.processar(pedidoDigital);
 
const servicoDigital = new ServicoPedidoDigital();
servicoDigital.processarPagamento();
servicoDigital.gerarNotaFiscal();
 
// Trocar banco sem alterar ProcessadorPedido:
const repositorioTeste = new RepositorioEmMemoria();
const processadorTeste = new ProcessadorPedido(repositorioTeste, email);
processadorTeste.processar(new PedidoDigital(80, "PREMIUM"));
console.log("Pedidos em memória:", repositorioTeste.pedidosSalvos.length);
