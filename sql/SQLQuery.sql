CREATE TABLE tbProdutos1
(
    ID int IDENTITY,
    Codigo varchar(20) UNIQUE,
    Descricao varchar(100),
    Grupo varchar(10),
    Preco money,
    PRIMARY KEY(ID)
);

CREATE TABLE tbClientes1
(
    CPF varchar(20) NOT NULL,
    Nome varchar(50),
    Cidade varchar(30),
    Bairro varchar(30),
    PRIMARY KEY(CPF)
);

CREATE TABLE tbPedidos1
(
    ID int IDENTITY PRIMARY KEY,
    Pedido varchar(20) UNIQUE,
    Data DateTime,
    ClienteCPF varchar(20) NULL,
    FOREIGN KEY(ClienteCPF) REFERENCES tbClientes1(CPF) ON DELETE SET NULL
);

CREATE TABLE tbPedidos1Itens1
(
    PedidoID int,
    ProdutoID int,
    Qtde int,
    Unitario money,
    Desconto money,
    PRIMARY KEY(PedidoID, ProdutoID),
    FOREIGN KEY(PedidoID) REFERENCES tbPedidos1(ID),
    FOREIGN KEY(ProdutoID) REFERENCES tbProdutos1(ID)
);


--- questão 1

INSERT INTO tbProdutos1 (Codigo, Descricao, Grupo, Preco)
VALUES
    ('0001', 'Produto Teste 01', 'CELULARES', 30.00),
    ('0002', 'Produto Teste 02', 'CELULARES', 35.00),
    ('0003', 'Produto Teste 03', 'CAPAS', 40.00),
    ('0004', 'Produto Teste 04', 'CAPAS', 45.00),
    ('0005', 'Produto Teste 05', 'CELULARES', 50.00);


--- questão 2

INSERT INTO tbClientes1 (CPF, Nome, Cidade, Bairro)
VALUES
    ('0000001', 'Cliente 01', 'Cidade 01', 'Bairro 01');

INSERT INTO tbPedidos1 (Pedido, Data, ClienteCPF)
VALUES
    ('0001', '2024-08-19 09:32:20', '0000001');

INSERT INTO tbPedidos1Itens1 (PedidoID, ProdutoID, Qtde, Unitario, Desconto)
VALUES
    (1, 1, 10, 30.00, 0),
    (1, 2, 5, 35.00, 0);


--- questão 3

INSERT INTO tbClientes1 (CPF, Nome, Cidade, Bairro)
VALUES
    ('0000002', 'Cliente 02', 'Cidade 02', 'Bairro 02');

INSERT INTO tbPedidos1 (Pedido, Data, ClienteCPF)
VALUES
    ('0002', '2024-08-15 10:42:20', '0000002');

INSERT INTO tbPedidos1Itens1 (PedidoID, ProdutoID, Qtde, Unitario, Desconto)
VALUES
    (2, 2, 10, 35.00, 0);

INSERT INTO tbPedidos1Itens1 (PedidoID, ProdutoID, Qtde, Unitario, Desconto)
VALUES
    (2, 3, 10, 40.00, 10);


--- questão 4

SELECT
    cliente.CPF AS Cliente,
    cliente.Nome,
    cliente.Bairro,
    cliente.Cidade,
    pedido.Pedido,
    pedido.Data,
    produto.Codigo,
    produto.Descricao,
    item.Qtde,
    item.Unitario,
    item.Desconto,
    item.Qtde * (item.Unitario - item.Desconto) AS totalItem
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59';



--- questão 5

SELECT
    pedido.Data,
    pedido.Pedido,
    cliente.CPF AS Cliente,
    cliente.Nome,
    cliente.Bairro,
    cliente.Cidade,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Desconto * item.Qtde) AS totalDescontos,
    SUM((item.Unitario - item.Desconto) * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59'
GROUP BY pedido.Data, pedido.Pedido, cliente.CPF, cliente.Nome, cliente.Bairro, cliente.Cidade;


--- questão 6

SELECT
    pedido.Data,
    pedido.ClienteCPF AS Cliente,
    cliente.Cidade,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Unitario * item.Qtde) AS totalDescontos,
    SUM((item.Unitario - item.Desconto) * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59'
GROUP BY pedido.Data, pedido.ClienteCPF, cliente.Cidade;


--- questão 7

SELECT
    cliente.CPF AS Cliente,
    cliente.Cidade,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Unitario * item.Qtde) AS totalDescontos,
    SUM((item.Unitario - item.Desconto) * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59'
GROUP BY cliente.CPF, cliente.Cidade;


--- questão 8

SELECT
    cliente.Cidade,
    cliente.Bairro,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Unitario * item.Qtde) AS totalDescontos,
    SUM((item.Unitario - item.Desconto) * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
GROUP BY cliente.Cidade, cliente.Bairro;


--- questão 9

SELECT
    produto.Descricao AS produto,
    produto.Grupo,
    SUM(item.Qtde) AS qtdeVendido,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Desconto * item.Qtde) AS Descontos,
    SUM((item.Unitario - item.Desconto) * item.Qtde) AS totalLiquido,
    AVG(item.Unitario - item.Desconto) AS valorMedioVendas
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
GROUP BY produto.Descricao, produto.Grupo
ORDER BY produto.Descricao ASC;


--- questão 10

DELETE FROM tbClientes1 WHERE CPF = '0000001';


--- questão 11

DELETE item
FROM tbPedidos1Itens1 item
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE produto.Codigo = '0001';
CREATE TABLE tbProdutos1
(
    ID int IDENTITY,
    Codigo varchar(20) UNIQUE,
    Descricao varchar(100),
    Grupo varchar(10),
    Preco money,
    PRIMARY KEY(ID)
);

CREATE TABLE tbClientes1
(
    CPF varchar(20) NOT NULL,
    Nome varchar(50),
    Cidade varchar(30),
    Bairro varchar(30),
    PRIMARY KEY(CPF)
);

CREATE TABLE tbPedidos1
(
    ID int IDENTITY PRIMARY KEY,
    Pedido varchar(20) UNIQUE,
    Data DateTime,
    ClienteCPF varchar(20) NULL,
    FOREIGN KEY(ClienteCPF) REFERENCES tbClientes1(CPF) ON DELETE SET NULL
);

CREATE TABLE tbPedidos1Itens1
(
    PedidoID int,
    ProdutoID int,
    Qtde int,
    Unitario money,
    Desconto money,
    PRIMARY KEY(PedidoID, ProdutoID),
    FOREIGN KEY(PedidoID) REFERENCES tbPedidos1(ID),
    FOREIGN KEY(ProdutoID) REFERENCES tbProdutos1(ID)
);


--- questão 1

INSERT INTO tbProdutos1 (Codigo, Descricao, Grupo, Preco)
VALUES
    ('0001', 'Produto Teste 01', 'CELULARES', 30.00),
    ('0002', 'Produto Teste 02', 'CELULARES', 35.00),
    ('0003', 'Produto Teste 03', 'CAPAS', 40.00),
    ('0004', 'Produto Teste 04', 'CAPAS', 45.00),
    ('0005', 'Produto Teste 05', 'CELULARES', 50.00);


--- questão 2

INSERT INTO tbClientes1 (CPF, Nome, Cidade, Bairro)
VALUES
    ('0000001', 'Cliente 01', 'Cidade 01', 'Bairro 01');

INSERT INTO tbPedidos1 (Pedido, Data, ClienteCPF)
VALUES
    ('0001', '2024-08-19 09:32:20', '0000001');

INSERT INTO tbPedidos1Itens1 (PedidoID, ProdutoID, Qtde, Unitario, Desconto)
VALUES
    (1, 1, 10, 30.00, 0),
    (1, 2, 5, 35.00, 0);


--- questão 3

INSERT INTO tbClientes1 (CPF, Nome, Cidade, Bairro)
VALUES
    ('0000002', 'Cliente 02', 'Cidade 02', 'Bairro 02');

INSERT INTO tbPedidos1 (Pedido, Data, ClienteCPF)
VALUES
    ('0002', '2024-08-15 10:42:20', '0000002');

INSERT INTO tbPedidos1Itens1 (PedidoID, ProdutoID, Qtde, Unitario, Desconto)
VALUES
    (2, 2, 10, 35.00, 0);

INSERT INTO tbPedidos1Itens1 (PedidoID, ProdutoID, Qtde, Unitario, Desconto)
VALUES
    (2, 3, 10, 40.00, 10);


--- questão 4

SELECT
    cliente.CPF AS Cliente,
    cliente.Nome,
    cliente.Bairro,
    cliente.Cidade,
    pedido.Pedido,
    pedido.Data,
    produto.Codigo,
    produto.Descricao,
    item.Qtde,
    item.Unitario,
    item.Desconto,
    item.Qtde * (item.Unitario - item.Desconto) AS totalItem
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59';



--- questão 5

SELECT
    pedido.Data,
    pedido.Pedido,
    cliente.CPF AS Cliente,
    cliente.Nome,
    cliente.Bairro,
    cliente.Cidade,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Unitario * item.Qtde) AS totalDescontos,
    SUM(item.Unitario * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59'
GROUP BY pedido.Data, pedido.Pedido, cliente.CPF, cliente.Nome, cliente.Bairro, cliente.Cidade;


--- questão 6

SELECT
    pedido.Data,
    pedido.ClienteCPF AS Cliente,
    cliente.Cidade,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Unitario * item.Qtde) AS totalDescontos,
    SUM(item.Unitario * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59'
GROUP BY pedido.Data, pedido.ClienteCPF, cliente.Cidade;


--- questão 7

SELECT
    cliente.CPF AS Cliente,
    cliente.Cidade,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM(item.Unitario * item.Qtde) AS totalDescontos,
    SUM(item.Unitario  * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE pedido.Data >= '2024-08-14 23:59:59' AND pedido.Data <= '2024-08-20 23:59:59'
GROUP BY cliente.CPF, cliente.Cidade;


--- questão 8

SELECT
    cliente.Cidade,
    cliente.Bairro,
    SUM(item.Qtde) AS qtdePedidos,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM((item.Unitario * (CAST(item.Desconto / 100 AS numeric))) * item.Qtde) AS totalDescontos,
    SUM((item.Unitario * (1 - CAST(item.Desconto / 100 AS numeric))) * item.Qtde) AS totalLiquido
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
GROUP BY cliente.Cidade, cliente.Bairro;


--- questão 9

SELECT
    produto.Descricao AS produto,
    produto.Grupo,
    SUM(item.Qtde) AS qtdeVendido,
    SUM(item.Unitario * item.Qtde) AS TotalBruto,
    SUM((item.Unitario * (CAST(item.Desconto / 100 AS numeric))) * item.Qtde) AS Descontos,
    SUM(item.Unitario * item.Qtde) AS totalLiquido,
    SUM(item.Unitario * item.Qtde) / SUM(item.Qtde) AS valorMedioVendas
FROM tbPedidos1 pedido
    INNER JOIN tbClientes1 cliente ON pedido.ClienteCPF = cliente.CPF
    INNER JOIN tbPedidos1Itens1 item ON item.PedidoID = pedido.ID
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
GROUP BY produto.Descricao, produto.Grupo
ORDER BY produto.Descricao ASC;


--- questão 10

DELETE FROM tbClientes1 WHERE CPF = '0000001';


--- questão 11

DELETE item
FROM tbPedidos1Itens1 item
    INNER JOIN tbProdutos1 produto ON item.ProdutoID = produto.ID
WHERE produto.Codigo = '0001';
