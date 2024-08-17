namespace LocaisReciclagem.Model
{
    public class LocaisReciclagemModel
    {
        public long LocalReciclagem_Id { get; set; }
        public string Identificacao { get; set; } = "";
        public string CEP { get; set; } = "";
        public string Logradouro { get; set; } = "";
        public string NumeroEndereco { get; set; } = "";
        public string Complemento { get; set; } = "";
        public string Bairro { get; set; } = "";
        public string Cidade { get; set; } = "";
        public float Capacidade { get; set; }

    }
}