namespace LocalReciclagem.Dto
{
  public class EditarLocalReciclagem
  {
    public long LocalReciclagem_Id { get; set; }
    public string Identificacao { get; set; } = "";
    public string? CEP { get; set; } = string.Empty;
    public string Logradouro { get; set; } = string.Empty;
    public string? NumeroEndereco { get; set; } = string.Empty;
    public string? Complemento { get; set; } = string.Empty;
    public string? Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = "";
    public float Capacidade { get; set; }

  }
}