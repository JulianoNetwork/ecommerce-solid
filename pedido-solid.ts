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
