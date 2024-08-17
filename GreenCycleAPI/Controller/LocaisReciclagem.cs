using Microsoft.AspNetCore.Mvc;
using LocaisReciclagem.Services;
using ResponseModel.Model;
using LocaisReciclagem.Model;
using LocalReciclagem.Dto;

namespace LocaisReciclagem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocaisReciclagemController : ControllerBase
    {
        private readonly ILocaisReciclagem _LocaisReciclagemInterface;

        public LocaisReciclagemController(ILocaisReciclagem carronInterface)
        {
            _LocaisReciclagemInterface = carronInterface;
        }

        [HttpGet("BuscarLocaisReciclagem")]
        public async Task<ActionResult<ResponseModel<List<LocaisReciclagemModel>>>> BuscarLocaisReciclagem()
        {
            var locais = await _LocaisReciclagemInterface.BuscarLocaisReciclagem();
            if (locais.Status)
            {
                return Ok(locais);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, locais);
            }
        }

        [HttpPost("CriarLocal")]
        public async Task<ActionResult<List<ResponseModel<LocaisReciclagemModel>>>> CriarLocalReciclagem(CriarLocalReciclagem CriarLocalReciclagemDto)
        {
            var carro = await _LocaisReciclagemInterface.CriarLocalReciclagem(CriarLocalReciclagemDto);
            if (carro.Status)
            {
                return Ok(carro);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, carro);
            }
        }

        [HttpPut("EditarLocal")]
        public async Task<ActionResult<List<ResponseModel<LocaisReciclagemModel>>>> EditarLocalReciclagem(EditarLocalReciclagem editarLocalReciclagemDto)
        {
            var local = await _LocaisReciclagemInterface.EditarLocalReciclagem(editarLocalReciclagemDto);
            if (local.Status)
            {
                return Ok(local);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, local);
            }
        }

        [HttpDelete("RemoverLocal")]
        public async Task<ActionResult<List<ResponseModel<LocaisReciclagemModel>>>> RemoverLocalReciclagem(int LocalReciclagemId)
        {
            var local = await _LocaisReciclagemInterface.RemoverLocalReciclagem(LocalReciclagemId);
            if (local.Status)
            {
                return Ok(local);
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, local);
            }
        }

    }
}

