import React from 'react';
import Modal from 'react-modal';
import InputMask from 'react-input-mask';
import './froms.scss';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';
import api from '../../services/api';

interface FormsProps {
  isOpen: boolean;
  onRequestClose: () => void;
  initialData?: LocaisReciclagemModel;
  onSubmit: (data: LocaisReciclagemModel) => void;
}

const Forms: React.FC<FormsProps> = ({ isOpen, onRequestClose, initialData, onSubmit }) => {
  const [identificacao, setIdentificacao] = React.useState<string>('');
  const [cep, setCep] = React.useState<string>('');
  const [logradouro, setLogradouro] = React.useState<string>('');
  const [numeroEndereco, setNumeroEndereco] = React.useState<string>('');
  const [complemento, setComplemento] = React.useState<string>('');
  const [bairro, setBairro] = React.useState<string>('');
  const [cidade, setCidade] = React.useState<string>('');
  const [capacidade, setCapacidade] = React.useState<string>(''); // Manter como string para manipulação

  React.useEffect(() => {
    if (initialData) {
      setIdentificacao(initialData.identificacao || '');
      setCep(initialData.cep || '');
      setLogradouro(initialData.logradouro || '');
      setNumeroEndereco(initialData.numeroEndereco || '');
      setComplemento(initialData.complemento || '');
      setBairro(initialData.bairro || '');
      setCidade(initialData.cidade || '');
      setCapacidade(initialData.capacidade ? formatCapacidade(initialData.capacidade) : '');
    } else {
      setIdentificacao('');
      setCep('');
      setLogradouro('');
      setNumeroEndereco('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setCapacidade('');
    }
  }, [initialData]);

  const formatCapacidade = (value: number): string => {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseCapacidade = (value: string): number => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData: LocaisReciclagemModel = {
      localReciclagem_Id: initialData ? initialData.localReciclagem_Id : 0,
      identificacao,
      cep,
      logradouro,
      numeroEndereco,
      complemento,
      bairro,
      cidade,
      capacidade: parseCapacidade(capacidade),
    };

    try {
      if (initialData) {
        await api.put('/api/LocaisReciclagem/EditarLocal', formData);
        alert('Local editado com sucesso!');
      } else {
        await api.post('/api/LocaisReciclagem/CriarLocal', formData);
        alert('Local criado com sucesso!');
      }
      onSubmit(formData);
      onRequestClose();
    } catch (error) {
      console.error('Erro ao salvar o local:', error);
      alert('Ocorreu um erro ao salvar o local.');
    }
  };



  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Formulário de Ponto de Coleta"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>{initialData ? 'Editar Ponto de Coleta' : 'Cadastrar Ponto de Coleta'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="identificacao">Identificação:</label>
          <input
            id="identificacao"
            type="text"
            className="form-control"
            value={identificacao}
            onChange={(e) => setIdentificacao(e.target.value)}
            required
          />
        </div>
        <div className='form-flex'>
          <div className='input-width'>
            <label htmlFor="logradouro">Logradouro:</label>
            <input
              id="logradouro"
              type="text"
              className="form-control"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              required
            />
          </div>
          <div className='number-input'>
            <label htmlFor="numeroEndereco">Número:</label>
            <input
              id="numeroEndereco"
              type="text"
              className="form-control"
              value={numeroEndereco}
              onChange={(e) => setNumeroEndereco(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="complemento">Complemento:</label>
          <input
            id="complemento"
            type="text"
            className="form-control"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>

        <div className='form-flex'>
          <div className='form-group'>
            <label htmlFor="cep">CEP:</label>
            <InputMask
              id="cep"
              mask="99999-999"
              className="form-control"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label htmlFor="bairro">Bairro:</label>
            <input
              id="bairro"
              type="text"
              className="form-control"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
        <div className='form-flex'>
          <div className='form-group'>
            <label htmlFor="cidade">Cidade:</label>
            <input
              id="cidade"
              type="text"
              className="form-control"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="capacidade">Capacidade:</label>
            <input
              id="capacidade"
              type="text"
              className="form-control"
              value={capacidade}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9.]*$/.test(value)) {
                  setCapacidade(value);
                }
              }}
              required
            />

          </div>
        </div>
        <div className='form-flex-end'>
          <button className='cancel-button' type="button" onClick={onRequestClose}>Cancelar</button>
          <button className='submit-button' type="submit">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default Forms;
