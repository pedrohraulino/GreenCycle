import React, { useEffect, useState } from "react";
import './sidebar.scss';
import PontoColeta from '../pontos-coletas/ponto-coleta';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';
import api from '../../services/api'; 

const Navbar = () => {
    const [pontosColeta, setPontosColeta] = useState<LocaisReciclagemModel[]>([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchPontosColeta = async () => {
            try {
                const response = await api.get<{ dados: LocaisReciclagemModel[] }>('/api/LocaisReciclagem/BuscarLocaisReciclagem');
                console.log(response.data); 
                if (Array.isArray(response.data.dados)) {
                    setPontosColeta(response.data.dados);
                } else {
                    console.error("Os dados recebidos não são um array.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados dos pontos de coleta:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchPontosColeta();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <section id="nav-bar">
            <img src="../../src/assets/GreenCycle-Logo.svg" alt="GreenCycle Logo" />
            <div className="count-coletas">
                <h3>{pontosColeta.length}</h3>
                <p>Pontos de Coleta</p>
            </div>
            <div className="coletas">
                <h4>Coletas</h4>
                <div className="search-bar">
                    <input type="text" placeholder="Buscar pontos" />
                    <button className="btn">Cadastrar</button>
                </div>
            </div>
            <div className="pontos-coletas">
                {pontosColeta.map(ponto => (
                    <PontoColeta key={ponto.localReciclagem_Id} pontoColeta={ponto} />
                ))}
            </div>
        </section>
    );
};

export default Navbar;
