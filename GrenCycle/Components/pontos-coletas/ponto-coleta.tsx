import React from "react";
import './ponto-coleta.scss';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';

interface PontoColetaProps {
    pontoColeta: LocaisReciclagemModel;
    onEdit: (ponto: LocaisReciclagemModel) => void;
    onDelete: (id: number) => void;
}

const PontoColeta: React.FC<PontoColetaProps> = ({ pontoColeta, onEdit, onDelete }) => {
    const formatAddress = () => {
        const { logradouro, numeroEndereco, complemento, bairro, cidade, cep } = pontoColeta;
        let address = `${logradouro}`;
    
        if (numeroEndereco) {
            address += `, ${numeroEndereco}`;
        }
    
        if (complemento) {
            address += `, ${complemento}`;
        }
    
        if (bairro || cidade) {
            address += ` - ${bairro || ''}${bairro && cidade ? ', ' : ''}${cidade || ''}`;
        }
    
        if (cep) {
            address += `, ${cep}`;
        }
    
        return address;
    };

    return (
        <section id="ponto-coleta">
            <div className="m3">
                <img src="../../src/assets/ponto-coleta.svg" alt="Ponto de Coleta" />
                <span>{pontoColeta.capacidade} m³</span>
            </div>
            <div className="dados-coleta">
                <h4>{pontoColeta.identificacao}</h4>
                <p>{formatAddress()}</p>
                <div className="btns">
                    <button className="delet" onClick={() => onDelete(pontoColeta.localReciclagem_Id)}>Deletar</button>
                    <button className="edit" onClick={() => onEdit(pontoColeta)}>Editar</button>
                </div>
            </div>
        </section>
    );
};

export default PontoColeta;
