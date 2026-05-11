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
