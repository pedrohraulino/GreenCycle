namespace LocalReciclagem.Dto
{
    public class CriarLocalReciclagem
    {
        public string Identificacao { get; set; } = string.Empty;
        public string? CEP { get; set; } = string.Empty;
        public string Logradouro { get; set; } = string.Empty;
        public string? NumeroEndereco { get; set; } = string.Empty;
        public string? Complemento { get; set; } = string.Empty;
        public string? Bairro { get; set; } = string.Empty;
        public string Cidade { get; set; } = string.Empty; // Cidade é obrigatória
        public float Capacidade { get; set; }
    }
}
