using LocalReciclagem.Dto;
using LocaisReciclagem.Model;
using ResponseModel.Model;

namespace LocaisReciclagem.Services
{
  public interface ILocaisReciclagem
  {
    Task<ResponseModel<List<LocaisReciclagemModel>>> BuscarLocaisReciclagem();
    Task<ResponseModel<List<LocaisReciclagemModel>>> CriarLocalReciclagem(CriarLocalReciclagem criarLocalReciclagem);
    Task<ResponseModel<List<LocaisReciclagemModel>>> EditarLocalReciclagem(EditarLocalReciclagem editarLocalReciclagem);
    Task<ResponseModel<List<LocaisReciclagemModel>>> RemoverLocalReciclagem(int LocalReciclagemId);
  }
}
