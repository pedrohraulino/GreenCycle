using LocalReciclagem.Dto;
using LocaisReciclagem.Model;
using Microsoft.EntityFrameworkCore;
using ResponseModel.Model;
using LocaisReciclagem.Services;
using LocaisReciclagem.Data;

namespace SistemaAluguelCarros.Services.Carro
{
    public class LocalReciclagemService : ILocaisReciclagem
    {
        private readonly AppDbContext _context;

        public LocalReciclagemService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel<List<LocaisReciclagemModel>>> BuscarLocaisReciclagem()
        {
            ResponseModel<List<LocaisReciclagemModel>> resposta = new ResponseModel<List<LocaisReciclagemModel>>();

            try
            {
                var locais = await _context.Local.ToListAsync();
                resposta.Dados = locais;
                resposta.Mensagem = "Todos os locais foram listados";
                resposta.Status = true;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = ex.Message;
                resposta.Status = false;
            }
            return resposta;
        }

        public async Task<ResponseModel<List<LocaisReciclagemModel>>> CriarLocalReciclagem(CriarLocalReciclagem criarLocalReciclagem)
        {
            ResponseModel<List<LocaisReciclagemModel>> resposta = new ResponseModel<List<LocaisReciclagemModel>>();
            try
            {
                var local = new LocaisReciclagemModel()
                {
                    Identificacao = criarLocalReciclagem.Identificacao,
                    CEP = criarLocalReciclagem.CEP,
                    Logradouro = criarLocalReciclagem.Logradouro,
                    NumeroEndereco = criarLocalReciclagem.NumeroEndereco,
                    Complemento = criarLocalReciclagem.Complemento,
                    Bairro = criarLocalReciclagem.Bairro,
                    Cidade = criarLocalReciclagem.Cidade,
                    Capacidade = criarLocalReciclagem.Capacidade
                };

                _context.Add(local);
                await _context.SaveChangesAsync();

                resposta.Dados = await _context.Local.ToListAsync();
                resposta.Mensagem = "Carro Criado com Sucesso";
                return resposta;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = ex.Message;
                resposta.Status = false;
                return resposta;
            }
        }

        public async Task<ResponseModel<List<LocaisReciclagemModel>>> EditarLocalReciclagem(EditarLocalReciclagem editarLocalReciclagem)
        {
            ResponseModel<List<LocaisReciclagemModel>> resposta = new ResponseModel<List<LocaisReciclagemModel>>();
            try
            {
                var local = await _context.Local.FirstOrDefaultAsync(localBanco => localBanco.LocalReciclagem_Id == editarLocalReciclagem.LocalReciclagem_Id);
                if (local == null)
                {
                    resposta.Mensagem = "Nenhum local localizado";
                    resposta.Status = false;
                    return resposta;
                }

                local.Identificacao = editarLocalReciclagem.Identificacao;
                local.CEP = editarLocalReciclagem.CEP;
                local.Logradouro = editarLocalReciclagem.Logradouro;
                local.NumeroEndereco = editarLocalReciclagem.NumeroEndereco;
                local.Complemento = editarLocalReciclagem.Complemento;
                local.Bairro = editarLocalReciclagem.Bairro;
                local.Cidade = editarLocalReciclagem.Cidade;
                local.Capacidade = editarLocalReciclagem.Capacidade;

                _context.Update(local);
                await _context.SaveChangesAsync();

                resposta.Dados = await _context.Local.ToListAsync();
                resposta.Mensagem = "Dados Atualizados com Sucesso";
                return resposta;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = ex.Message;
                resposta.Status = false;
                return resposta;
            }
        }


        public async Task<ResponseModel<List<LocaisReciclagemModel>>> RemoverLocalReciclagem(int LocalReciclagem_Id)
        {
            ResponseModel<List<LocaisReciclagemModel>> resposta = new ResponseModel<List<LocaisReciclagemModel>>();
            try
            {
                var local = await _context.Local
                .FirstOrDefaultAsync(localBanco => localBanco.LocalReciclagem_Id == LocalReciclagem_Id);
                if (local == null)
                {
                    resposta.Mensagem = "Nenhum local Localizado";
                    return resposta;
                }
                _context.Remove(local);
                await _context.SaveChangesAsync();
                resposta.Dados = await _context.Local.ToListAsync();
                return (resposta);
            }
            catch (Exception ex)
            {
                resposta.Mensagem = ex.Message;
                resposta.Status = false;
            }
            return resposta;
        }
    }
}
