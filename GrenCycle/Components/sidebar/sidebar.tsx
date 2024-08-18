import React, { useEffect, useState } from 'react';
import './sidebar.scss';
import PontoColeta from '../pontos-coletas/ponto-coleta';
import PontoColetaForm from '../forms/forms';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';
import api from '../../services/api';

const Navbar = () => {
    const [pontosColeta, setPontosColeta] = useState<LocaisReciclagemModel[]>([]);
    const [filteredPontosColeta, setFilteredPontosColeta] = useState<LocaisReciclagemModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPonto, setSelectedPonto] = useState<LocaisReciclagemModel | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        const fetchPontosColeta = async () => {
            try {
                const response = await api.get<{ dados: LocaisReciclagemModel[] }>('/api/LocaisReciclagem/BuscarLocaisReciclagem');
                if (Array.isArray(response.data.dados)) {
                    setPontosColeta(response.data.dados);
                    setFilteredPontosColeta(response.data.dados); 
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

    useEffect(() => {
        setFilteredPontosColeta(
            pontosColeta.filter(ponto =>
                ponto.identificacao.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, pontosColeta]);

    const handleEdit = (ponto: LocaisReciclagemModel) => {
        setSelectedPonto(ponto);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/LocaisReciclagem/RemoverLocal?LocalReciclagemId=${id}`);
            setPontosColeta(pontosColeta.filter(ponto => ponto.localReciclagem_Id !== id));
        } catch (error) {
            console.error("Erro ao deletar ponto de coleta:", error);
        }
    };

    const handleFormSubmit = async (data: LocaisReciclagemModel) => {
        if (selectedPonto) {
            try {
                await api.put(`/api/LocaisReciclagem/EditarLocal/`, data);
                setPontosColeta(pontosColeta.map(ponto => ponto.localReciclagem_Id === data.localReciclagem_Id ? data : ponto));
                setIsEditing(false);
                setSelectedPonto(null);
            } catch (error) {
                console.error("Erro ao atualizar ponto de coleta:", error);
            }
        } else {
            try {
                const response = await api.post('/api/LocaisReciclagem/CriarLocalReciclagem', data);
                setPontosColeta([...pontosColeta, response.data]);
                setIsEditing(false);
                setSelectedPonto(null);
            } catch (error) {
                console.error("Erro ao criar ponto de coleta:", error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setSelectedPonto(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <section id="nav-bar">
            <img src="../../src/assets/GreenCycle-Logo.svg" alt="GreenCycle Logo" />
            <div className="count-coletas">
                <h3>{filteredPontosColeta.length}</h3>
                <p>Pontos de Coleta</p>
            </div>
            <div className="coletas">
                <h4>Coletas</h4>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar pontos"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="btnCadastro" onClick={() => {
                        setSelectedPonto(null);  
                        setIsEditing(true);
                    }}>Cadastrar</button>
                </div>
            </div>
            <div className="pontos-coletas">
                {filteredPontosColeta.map(ponto => (
                    <PontoColeta
                        key={ponto.localReciclagem_Id}
                        pontoColeta={ponto}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            {isEditing && (
                <PontoColetaForm
                    isOpen={isEditing}
                    onRequestClose={handleCloseModal}
                    initialData={selectedPonto || undefined}
                    onSubmit={handleFormSubmit}
                />
            )}
        </section>
    );
};

export default Navbar;
