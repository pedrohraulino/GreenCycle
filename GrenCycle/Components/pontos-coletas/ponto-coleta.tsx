import React from "react";
import './ponto-coleta.scss';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';

interface PontoColetaProps {
    pontoColeta: LocaisReciclagemModel;
}

const PontoColeta: React.FC<PontoColetaProps> = ({ pontoColeta }) => {
    return (
        <section id="ponto-coleta">
            <div className="m3">
                <img src="../../src/assets/ponto-coleta.svg" alt="Ponto de Coleta" />
                <span>{pontoColeta.capacidade} m³</span>
            </div>
            <div className="dados-coleta">
                <h4>{pontoColeta.identificacao}</h4>
                <p>{`${pontoColeta.logradouro}, ${pontoColeta.numeroEndereco} - ${pontoColeta.bairro}, ${pontoColeta.cidade}, ${pontoColeta.cep}`}</p>
                <div className="btns">
                    <button className="delet">Deletar</button>
                    <button className="edit">Editar</button>
                </div>
            </div>
        </section>
    );
};

export default PontoColeta;
