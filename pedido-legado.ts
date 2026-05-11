// 1. Classe de Banco de Dados Concreta
class BancoDeDadosMySQL {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// 2. Interface de tarefas do pedido
interface ITarefasPedido {
    processarPagamento(): void;
    gerarNotaFiscal(): void;
    imprimirEtiquetaFisica(): void;
}

// 3. Classe principal de Pedido
class Pedido {
    public valorTotal: number;
    public tipoCliente: string;

    constructor(valorTotal: number, tipoCliente: string) {
        this.valorTotal = valorTotal;
        this.tipoCliente = tipoCliente;
    }

    calcularDesconto(): number {
        if (this.tipoCliente === "VIP") {
            return this.valorTotal * 0.20;
        } else if (this.tipoCliente === "ESTUDANTE") {
            return this.valorTotal * 0.10;
        }
        return 0;
    }

    calcularFrete(): number {
        return 15.0;
    }

    salvarPedido(): void {
        const db = new BancoDeDadosMySQL();
        db.salvar(this);
    }

    enviarEmailConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 4. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements ITarefasPedido {
   
    calcularFrete(): number {
        throw new Error("Erro: Produtos digitais não possuem frete.");
    }

    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }

    imprimirEtiquetaFisica(): void {
        throw new Error("Erro: Não é possível imprimir etiqueta para produto digital.");
    }
}
