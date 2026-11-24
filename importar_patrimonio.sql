-- Carga inicial do inventario de PATRIMONIO.MD (dados de demonstracao).
-- Execute somente em banco de desenvolvimento/teste e confirme os nomes no schema do backend.
-- Pressupoe tabelas "Bloco", "Ambiente", "Patrimonio" e "UnidadeItem";
-- IDs textuais, colunas camelCase do Prisma, e coluna UnidadeItem.estado com valor ATIVO.
-- Sala Maker nao informa responsavel no arquivo; foi registrada como "Nao informado".
-- Se os blocos 1-4 ou tombamentos 100001-100238 ja existirem, o script aborta sem inserir.

BEGIN;

CREATE TEMP TABLE seed_blocos (id text PRIMARY KEY, numero integer NOT NULL) ON COMMIT DROP;
CREATE TEMP TABLE seed_ambientes (id text PRIMARY KEY, nome text NOT NULL, responsavel text NOT NULL, bloco_id text NOT NULL) ON COMMIT DROP;
CREATE TEMP TABLE seed_patrimonios (id text PRIMARY KEY, tombamento integer UNIQUE NOT NULL, nome text NOT NULL, marca text NOT NULL, categoria text NOT NULL, valor numeric(12,2) NOT NULL, quantidade integer NOT NULL, ambiente_id text NOT NULL) ON COMMIT DROP;

INSERT INTO seed_blocos (id, numero) VALUES
    ('seed-bloco-1', 1),
    ('seed-bloco-2', 2),
    ('seed-bloco-3', 3),
    ('seed-bloco-4', 4);

INSERT INTO seed_ambientes (id, nome, responsavel, bloco_id) VALUES
    ('seed-amb-b1-sala-1', 'Sala 1', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-2', 'Sala 2', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-3', 'Sala 3', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-4', 'Sala 4', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-5', 'Sala 5', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-6', 'Sala 6', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-7', 'Sala 7', 'Coordenação', 'seed-bloco-1'),
    ('seed-amb-b1-sala-de-multimidia', 'Sala de Multimídia', 'Professores Dinele e Daniel', 'seed-bloco-1'),
    ('seed-amb-b1-sala-de-desenvolvimento-de-sistemas', 'Sala de Desenvolvimento de Sistemas', 'Professores Ricardo e André', 'seed-bloco-1'),
    ('seed-amb-b1-sala-maker', 'Sala Maker', 'Não informado', 'seed-bloco-1'),
    ('seed-amb-b2-sala-1', 'Sala 1', 'Coordenação', 'seed-bloco-2'),
    ('seed-amb-b2-sala-2', 'Sala 2', 'Coordenação', 'seed-bloco-2'),
    ('seed-amb-b2-sala-3', 'Sala 3', 'Coordenação', 'seed-bloco-2'),
    ('seed-amb-b3-refeitorio', 'Refeitório', 'Bruna', 'seed-bloco-3'),
    ('seed-amb-b3-laboratorio-lmt', 'Laboratório LMT', 'Andrey', 'seed-bloco-3'),
    ('seed-amb-b4-sala-1', 'Sala 1', 'Coordenação', 'seed-bloco-4'),
    ('seed-amb-b4-sala-2', 'Sala 2', 'Coordenação', 'seed-bloco-4'),
    ('seed-amb-b4-sala-3', 'Sala 3', 'Coordenação', 'seed-bloco-4');

INSERT INTO seed_patrimonios (id, tombamento, nome, marca, categoria, valor, quantidade, ambiente_id) VALUES
    ('seed-patr-100001', 100001, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-1'),
    ('seed-patr-100002', 100002, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100003', 100003, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-1'),
    ('seed-patr-100004', 100004, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100005', 100005, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100006', 100006, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100007', 100007, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100008', 100008, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100009', 100009, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100010', 100010, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100011', 100011, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100012', 100012, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100013', 100013, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-1'),
    ('seed-patr-100014', 100014, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-2'),
    ('seed-patr-100015', 100015, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100016', 100016, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-2'),
    ('seed-patr-100017', 100017, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100018', 100018, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100019', 100019, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100020', 100020, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100021', 100021, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100022', 100022, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100023', 100023, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100024', 100024, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100025', 100025, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100026', 100026, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-2'),
    ('seed-patr-100027', 100027, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-3'),
    ('seed-patr-100028', 100028, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100029', 100029, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-3'),
    ('seed-patr-100030', 100030, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100031', 100031, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100032', 100032, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100033', 100033, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100034', 100034, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100035', 100035, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100036', 100036, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100037', 100037, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100038', 100038, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100039', 100039, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-3'),
    ('seed-patr-100040', 100040, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-4'),
    ('seed-patr-100041', 100041, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100042', 100042, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-4'),
    ('seed-patr-100043', 100043, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100044', 100044, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100045', 100045, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100046', 100046, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100047', 100047, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100048', 100048, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100049', 100049, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100050', 100050, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100051', 100051, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100052', 100052, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-4'),
    ('seed-patr-100053', 100053, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-5'),
    ('seed-patr-100054', 100054, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100055', 100055, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-5'),
    ('seed-patr-100056', 100056, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100057', 100057, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100058', 100058, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100059', 100059, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100060', 100060, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100061', 100061, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100062', 100062, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100063', 100063, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100064', 100064, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100065', 100065, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-5'),
    ('seed-patr-100066', 100066, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-6'),
    ('seed-patr-100067', 100067, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100068', 100068, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-6'),
    ('seed-patr-100069', 100069, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100070', 100070, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100071', 100071, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100072', 100072, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100073', 100073, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100074', 100074, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100075', 100075, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100076', 100076, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100077', 100077, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100078', 100078, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-6'),
    ('seed-patr-100079', 100079, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-7'),
    ('seed-patr-100080', 100080, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100081', 100081, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b1-sala-7'),
    ('seed-patr-100082', 100082, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100083', 100083, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100084', 100084, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100085', 100085, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100086', 100086, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100087', 100087, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100088', 100088, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100089', 100089, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100090', 100090, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100091', 100091, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-7'),
    ('seed-patr-100092', 100092, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100093', 100093, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 2, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100094', 100094, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 8, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100095', 100095, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100096', 100096, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 3, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100097', 100097, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100098', 100098, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100099', 100099, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100100', 100100, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100101', 100101, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100102', 100102, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100103', 100103, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100104', 100104, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100105', 100105, 'Notebooks Estudantis', 'Dell', 'ELETRÔNICO', 2950.00, 34, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100106', 100106, 'Mouses', 'Logitech', 'ELETRÔNICO', 75.00, 34, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100107', 100107, 'Carregadores', 'Dell', 'ELETRÔNICO', 210.00, 34, 'seed-amb-b1-sala-de-multimidia'),
    ('seed-patr-100108', 100108, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100109', 100109, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 2, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100110', 100110, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 8, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100111', 100111, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100112', 100112, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 3, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100113', 100113, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100114', 100114, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100115', 100115, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100116', 100116, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100117', 100117, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100118', 100118, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100119', 100119, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100120', 100120, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100121', 100121, 'Carrinho de Notebooks', 'Marelli', 'MÓVEIS', 1800.00, 1, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100122', 100122, 'Notebooks Estudantis', 'Dell', 'ELETRÔNICO', 2950.00, 34, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100123', 100123, 'Mouses', 'Logitech', 'ELETRÔNICO', 75.00, 34, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100124', 100124, 'Carregadores', 'Dell', 'ELETRÔNICO', 210.00, 34, 'seed-amb-b1-sala-de-desenvolvimento-de-sistemas'),
    ('seed-patr-100125', 100125, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100126', 100126, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 2, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100127', 100127, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 16, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100128', 100128, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100129', 100129, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 4, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100130', 100130, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100131', 100131, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100132', 100132, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100133', 100133, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100134', 100134, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100135', 100135, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 3, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100136', 100136, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100137', 100137, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100138', 100138, 'Carrinho de Notebooks', 'Marelli', 'MÓVEIS', 1800.00, 1, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100139', 100139, 'Notebooks Estudantis', 'Dell', 'ELETRÔNICO', 2950.00, 34, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100140', 100140, 'Mouses', 'Logitech', 'ELETRÔNICO', 75.00, 34, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100141', 100141, 'Carregadores', 'Dell', 'ELETRÔNICO', 210.00, 34, 'seed-amb-b1-sala-maker'),
    ('seed-patr-100142', 100142, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b2-sala-1'),
    ('seed-patr-100143', 100143, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100144', 100144, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b2-sala-1'),
    ('seed-patr-100145', 100145, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100146', 100146, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100147', 100147, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100148', 100148, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100149', 100149, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100150', 100150, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100151', 100151, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100152', 100152, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100153', 100153, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100154', 100154, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b2-sala-1'),
    ('seed-patr-100155', 100155, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b2-sala-2'),
    ('seed-patr-100156', 100156, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100157', 100157, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b2-sala-2'),
    ('seed-patr-100158', 100158, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100159', 100159, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100160', 100160, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100161', 100161, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100162', 100162, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100163', 100163, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100164', 100164, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100165', 100165, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100166', 100166, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100167', 100167, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b2-sala-2'),
    ('seed-patr-100168', 100168, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b2-sala-3'),
    ('seed-patr-100169', 100169, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100170', 100170, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b2-sala-3'),
    ('seed-patr-100171', 100171, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100172', 100172, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100173', 100173, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100174', 100174, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100175', 100175, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100176', 100176, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100177', 100177, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100178', 100178, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100179', 100179, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100180', 100180, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b2-sala-3'),
    ('seed-patr-100181', 100181, 'Cadeiras', 'Plaxmetal', 'MÓVEIS', 180.00, 192, 'seed-amb-b3-refeitorio'),
    ('seed-patr-100182', 100182, 'Mesas', 'Marelli', 'MÓVEIS', 520.00, 48, 'seed-amb-b3-refeitorio'),
    ('seed-patr-100183', 100183, 'Ventilador', 'Arno', 'CLIMATIZAÇÃO', 280.00, 6, 'seed-amb-b3-refeitorio'),
    ('seed-patr-100184', 100184, 'Bandeja', 'Tramontina', 'MATERIAIS', 24.00, 300, 'seed-amb-b3-refeitorio'),
    ('seed-patr-100185', 100185, 'Garfos', 'Tramontina', 'MATERIAIS', 8.00, 300, 'seed-amb-b3-refeitorio'),
    ('seed-patr-100186', 100186, 'Facas', 'Tramontina', 'MATERIAIS', 10.00, 300, 'seed-amb-b3-refeitorio'),
    ('seed-patr-100187', 100187, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100188', 100188, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100189', 100189, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100190', 100190, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100191', 100191, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100192', 100192, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100193', 100193, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100194', 100194, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100195', 100195, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100196', 100196, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100197', 100197, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100198', 100198, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100199', 100199, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b3-laboratorio-lmt'),
    ('seed-patr-100200', 100200, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b4-sala-1'),
    ('seed-patr-100201', 100201, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100202', 100202, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b4-sala-1'),
    ('seed-patr-100203', 100203, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100204', 100204, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100205', 100205, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100206', 100206, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100207', 100207, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100208', 100208, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100209', 100209, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100210', 100210, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100211', 100211, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100212', 100212, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b4-sala-1'),
    ('seed-patr-100213', 100213, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b4-sala-2'),
    ('seed-patr-100214', 100214, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100215', 100215, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b4-sala-2'),
    ('seed-patr-100216', 100216, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100217', 100217, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100218', 100218, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100219', 100219, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100220', 100220, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100221', 100221, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100222', 100222, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100223', 100223, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100224', 100224, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100225', 100225, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b4-sala-2'),
    ('seed-patr-100226', 100226, 'Cadeiras Estudantis', 'Plaxmetal', 'MÓVEIS', 220.00, 32, 'seed-amb-b4-sala-3'),
    ('seed-patr-100227', 100227, 'Cadeira do Professor', 'Plaxmetal', 'MÓVEIS', 390.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100228', 100228, 'Mesas Estudantis', 'Marelli', 'MÓVEIS', 460.00, 32, 'seed-amb-b4-sala-3'),
    ('seed-patr-100229', 100229, 'Mesa do Professor', 'Marelli', 'MÓVEIS', 650.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100230', 100230, 'Armário', 'Itatiaia', 'MÓVEIS', 1250.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100231', 100231, 'Computador', 'Dell', 'ELETRÔNICO', 3800.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100232', 100232, 'Monitor', 'Dell', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100233', 100233, 'Projetor', 'Epson', 'ELETRÔNICO', 3400.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100234', 100234, 'Tela de Projeção', 'Epson', 'ELETRÔNICO', 950.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100235', 100235, 'Controle do Projetor', 'Epson', 'ELETRÔNICO', 120.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100236', 100236, 'Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 4200.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100237', 100237, 'Controle do Ar-condicionado', 'LG', 'CLIMATIZAÇÃO', 150.00, 1, 'seed-amb-b4-sala-3'),
    ('seed-patr-100238', 100238, 'Balde de Lixo', 'Sanremo', 'HIGIENIZAÇÃO', 55.00, 1, 'seed-amb-b4-sala-3');

DO $precheck$
BEGIN
    IF EXISTS (SELECT 1 FROM "Bloco" b JOIN seed_blocos s ON b."numero" = s.numero OR b."id" = s.id) THEN
        RAISE EXCEPTION 'Ja existem blocos com os numeros 1-4; use um banco vazio ou adapte o mapeamento.';
    END IF;
    IF EXISTS (SELECT 1 FROM "Ambiente" a JOIN seed_ambientes s ON a."id" = s.id) THEN
        RAISE EXCEPTION 'Ja existem IDs de ambiente desta carga; carga cancelada.';
    END IF;
    IF EXISTS (SELECT 1 FROM "Patrimonio" p JOIN seed_patrimonios s ON p."tombamento" = s.tombamento OR p."id" = s.id) THEN
        RAISE EXCEPTION 'Ja existem tombamentos entre 100001 e 100238; carga cancelada.';
    END IF;
END;
$precheck$;

INSERT INTO "Bloco" ("id", "numero")
SELECT id, numero FROM seed_blocos;

INSERT INTO "Ambiente" ("id", "nome", "responsavel", "blocoId")
SELECT id, nome, responsavel, bloco_id FROM seed_ambientes;

DO $seed_patrimonios$
DECLARE
    categoria_type text;
BEGIN
    SELECT format_type(a.atttypid, a.atttypmod)
      INTO categoria_type
      FROM pg_attribute a
     WHERE a.attrelid = '"Patrimonio"'::regclass
       AND a.attname = 'categoria'
       AND NOT a.attisdropped;
    IF categoria_type IS NULL THEN
        RAISE EXCEPTION 'Nao encontrei a coluna categoria em "Patrimonio".';
    END IF;
    EXECUTE format($sql$
        INSERT INTO "Patrimonio" ("id", "tombamento", "nome", "descricao", "valor", "categoria", "marca", "quantidade", "createdAt")
        SELECT id, tombamento, nome, NULL, valor, categoria::%s, marca, quantidade, CURRENT_TIMESTAMP
        FROM seed_patrimonios
    $sql$, categoria_type);
END;
$seed_patrimonios$;

DO $seed_units$
DECLARE
    estado_type text;
BEGIN
    SELECT format_type(a.atttypid, a.atttypmod)
      INTO estado_type
      FROM pg_attribute a
     WHERE a.attrelid = '"UnidadeItem"'::regclass
       AND a.attname = 'estado'
       AND NOT a.attisdropped;
    IF estado_type IS NULL THEN
        RAISE EXCEPTION 'Nao encontrei a coluna estado em "UnidadeItem".';
    END IF;
    EXECUTE format($sql$
        INSERT INTO "UnidadeItem" ("id", "estado", "itemId", "ambienteId")
        SELECT
            'seed-unidade-' || lpad(p.tombamento::text, 6, '0') || '-' || lpad(u.n::text, 4, '0'),
            %L::%s, p.id, p.ambiente_id
        FROM seed_patrimonios p
        CROSS JOIN LATERAL generate_series(1, p.quantidade) AS u(n)
    $sql$, 'ATIVO', estado_type);
END;
$seed_units$;

SELECT
    (SELECT count(*) FROM "Bloco" b JOIN seed_blocos s ON s.id = b."id") AS blocos_inseridos,
    (SELECT count(*) FROM "Ambiente" a JOIN seed_ambientes s ON s.id = a."id") AS ambientes_inseridos,
    (SELECT count(*) FROM "Patrimonio" p JOIN seed_patrimonios s ON s.id = p."id") AS patrimonios_inseridos,
    (SELECT count(*) FROM "UnidadeItem" u JOIN seed_patrimonios p ON p.id = u."itemId") AS unidades_inseridas;

COMMIT;
