class SistemaCobrancaStripe {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

// 2. Interface "Faz-Tudo"
interface IModelosIA {
    gerarTexto(prompt: string): string;
    gerarImagem(prompt: string): string;
    gerarAudio(prompt: string): string;
}

// 3. A classe principal que gerencia tudo
class AssistenteOmniIA implements IModelosIA {
    public nomeModelo: string;

    constructor(nomeModelo: string) {
        this.nomeModelo = nomeModelo;
    }

    // Processador central cheio de condicionais
    processarRequisicaoUsuario(prompt: string, tipo: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        if (tipo === "TEXTO") {
            this.gerarTexto(prompt);
        } else if (tipo === "IMAGEM") {
            this.gerarImagem(prompt);
        } else if (tipo === "AUDIO") {
            this.gerarAudio(prompt);
        } else {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }
       
        // Finaliza cobrando o usuário direto aqui
        this.registrarCobranca(1.50);
    }

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }

    registrarCobranca(valor: number): void {
        const stripe = new SistemaCobrancaStripe();
        stripe.cobrar("user_999", valor);
    }
}

// 4. Um modelo específico sendo forçado a herdar o que não deve
class ModeloFocadoEmTexto extends AssistenteOmniIA {
    constructor() {
        super("ChatGPT-4");
    }

    gerarImagem(prompt: string): string {
        throw new Error("Falha Crítica: O ChatGPT-4 não gera imagens nativamente nesta versão.");
    }

    gerarAudio(prompt: string): string {
        throw new Error("Falha Crítica: Modelo de texto não pode gerar arquivos de áudio.");
    }
}
