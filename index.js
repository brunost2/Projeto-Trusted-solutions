const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let clientes = [];
let produtos = [];
let vendas = [];

function cadastrarCliente() {
    rl.question('Insira o ID do cliente: ', (id) => {
        rl.question('Insira o nome do cliente: ', (nome) => {
            clientes.push({ id: id, nome: nome });
            console.log("Cliente cadastrado com sucesso!");
            cadastrarProduto();
        });
    });
}

function cadastrarProduto() {
    rl.question('Insira o ID do produto: ', (id) => {
        rl.question('Insira o nome do produto: ', (nome) => {
            rl.question('Insira o preço do produto: ', (preco) => {
                produtos.push({ id: id, nome: nome, preco: parseFloat(preco) });
                console.log("Produto cadastrado com sucesso!");
                cadastrarPedido();
            });
        });
    });
}

function cadastrarPedido() {
    rl.question('Selecione o ID do cliente: ', (clienteId) => {
        let cliente = clientes.find(cli => cli.id === clienteId);
        if (!cliente) {
            console.log("Cliente não encontrado.");
            rl.close();
            return;
        }

        let itensPedido = [];

        const inserirProduto = () => {
            rl.question('Insira o ID do produto (ou "fim" para encerrar): ', (produtoId) => {
                if (produtoId.toLowerCase() === "fim") {
                    const totalPedido = calcularTotalPedido(itensPedido);
                    vendas.push({ cliente: cliente, itens: itensPedido, total: totalPedido });
                    console.log("Pedido cadastrado com sucesso!");
                    apresentarTodasAsVendas();
                    rl.close();
                } else {
                    const produtoEncontrado = produtos.find(prod => prod.id === produtoId);
                    if (!produtoEncontrado) {
                        console.log("Produto não encontrado.");
                        inserirProduto();
                    } else {
                        rl.question('Insira a quantidade desejada: ', (quantidade) => {
                            const quantidadeInt = parseInt(quantidade);
                            if (isNaN(quantidadeInt) || quantidadeInt <= 0) {
                                console.log("Quantidade inválida.");
                                inserirProduto();
                            } else {
                                itensPedido.push({ produtoId: produtoId, quantidade: quantidadeInt });
                                inserirProduto();
                            }
                        });
                    }
                }
            });
        };

        inserirProduto();
    });
}

function calcularTotalPedido(itensPedido) {
    return itensPedido.reduce((total, item) => {
        const produto = produtos.find(prod => prod.id === item.produtoId);
        return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);
}

function apresentarTodasAsVendas() {
    vendas.forEach((venda, index) => {
        console.log(`Venda ${index + 1}:`);
        console.log(`Cliente: ${venda.cliente.nome}`);
        console.log("Itens:");
        venda.itens.forEach(item => {
            const produto = produtos.find(prod => prod.id === item.produtoId);
            console.log(`- Produto: ${produto.nome}, Quantidade: ${item.quantidade}, Preço Unitário: R$ ${produto.preco.toFixed(2)}, Total: R$ ${(produto.preco * item.quantidade).toFixed(2)}`);
        });
        console.log(`Total da Venda: R$ ${venda.total.toFixed(2)}`);
        console.log("--------------------");
    });
}

cadastrarCliente();
