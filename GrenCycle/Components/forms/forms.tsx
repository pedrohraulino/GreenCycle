import Modal from 'react-modal';
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import './forms.scss';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';
import api from '../../services/api';

interface FormsProps {
  isOpen: boolean;
  onRequestClose: () => void;
  initialData?: LocaisReciclagemModel;
  onUpdate: () => void;
  onSetAlertMessage: (message: string | null) => void;
}

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

const Forms: React.FC<FormsProps> = ({ isOpen, onRequestClose, initialData, onUpdate, onSetAlertMessage }) => {
  const [identificacao, setIdentificacao] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [logradouro, setLogradouro] = useState<string>('');
  const [numeroEndereco, setNumeroEndereco] = useState<string>('');
  const [complemento, setComplemento] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [capacidade, setCapacidade] = useState<string>('');
  const [isCepValid, setIsCepValid] = useState<boolean>(true);
  const [cepError, setCepError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setIdentificacao(initialData.identificacao || '');
      setCep(initialData.cep || '');
      setLogradouro(initialData.logradouro || '');
      setNumeroEndereco(initialData.numeroEndereco || '');
      setComplemento(initialData.complemento || '');
      setBairro(initialData.bairro || '');
      const [cidade, estado] = (initialData.cidade || '').split(' - ');
      setCidade(cidade || '');
      setEstado(estado || '');
      setCapacidade(initialData.capacidade ? formatCapacidade(initialData.capacidade) : '');
      setIsCepValid(true);
      setCepError('');
    } else {
      setIdentificacao('');
      setCep('');
      setLogradouro('');
      setNumeroEndereco('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
      setCapacidade('');
      setIsCepValid(true);
      setCepError('');
    }
  }, [initialData]);

  const validateCep = (value: string): boolean => {
    const cep = /^\d{5}-\d{3}$/;
    return value === '' || cep.test(value);
  };

  const formatCapacidade = (value: number): string => {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseCapacidade = (value: string): number => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validCep = validateCep(cep);
    setIsCepValid(validCep);

    if (cep && !validCep) {
      setCepError('Por favor, preencha o CEP corretamente.');
      setIsSubmitted(true);
      return;
    } else {
      setCepError('');
    }

    setIsSubmitted(true);

    const cidadeEstado = `${cidade.trim()} - ${estado.trim()}`;
    const formData: LocaisReciclagemModel = {
      localReciclagem_Id: initialData ? initialData.localReciclagem_Id : 0,
      identificacao,
      cep,
      logradouro,
      numeroEndereco,
      complemento,
      bairro,
      cidade: cidadeEstado,
      capacidade: parseCapacidade(capacidade),
    };

    try {
      if (initialData) {
        await api.put('/api/LocaisReciclagem/EditarLocal', formData);
        onSetAlertMessage('Ponto de coleta editado com sucesso!');
        setTimeout(() => {
          onSetAlertMessage(null);
        }, 3000);
      } else {
        await api.post('/api/LocaisReciclagem/CriarLocal', formData);
        onSetAlertMessage('Ponto de coleta criado com sucesso!');
        setTimeout(() => {
          onSetAlertMessage(null);
        }, 3000);
      }
      onUpdate();
      onRequestClose();
    } catch (error) {
      console.error('Erro ao salvar o local:', error);
      onSetAlertMessage('Ocorreu um erro ao salvar o local.');
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
              className={`form-control ${!isCepValid && isSubmitted ? 'invalid' : ''}`}
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            {!isCepValid && cep && isSubmitted && (
              <p className="error-message">{cepError}</p>
            )}
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
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                className="form-control"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">Selecione o estado</option>
                {estadosBrasileiros.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
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
                if (/^[0-9.,]*$/.test(value)) {
                  setCapacidade(value);
                }
              }}
              required
            />
          </div>
        </div>

        <div className="form-flex-end">
          <button type="button" className="cancel-button" onClick={onRequestClose}>
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            {initialData ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Forms;


