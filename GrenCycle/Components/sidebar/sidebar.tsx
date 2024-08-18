import React, { useEffect, useState } from 'react';
import './sidebar.scss';
import PontoColeta from '../pontos-coletas/ponto-coleta';
import PontoColetaForm from '../forms/forms';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';
import api from '../../services/api';

const Navbar: React.FC = () => {
    const [pontosColeta, setPontosColeta] = useState<LocaisReciclagemModel[]>([]);
    const [filteredPontosColeta, setFilteredPontosColeta] = useState<LocaisReciclagemModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPonto, setSelectedPonto] = useState<LocaisReciclagemModel | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
            setAlertMessage('Ponto de coleta deletado com sucesso!');
            setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
        } catch (error) {
            console.error("Erro ao deletar ponto de coleta:", error);
            setAlertMessage('Erro ao deletar ponto de coleta.');
            setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setSelectedPonto(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    
    const handleUpdate = async () => {
        try {
            const response = await api.get<{ dados: LocaisReciclagemModel[] }>('/api/LocaisReciclagem/BuscarLocaisReciclagem');
            if (Array.isArray(response.data.dados)) {
                setPontosColeta(response.data.dados);
                setFilteredPontosColeta(response.data.dados);
            } else {
                console.error("Os dados recebidos não são um array.");
            }
        } catch (error) {
            console.error("Erro ao atualizar dados dos pontos de coleta:", error);
        }
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
                    onUpdate={handleUpdate}
                    onSetAlertMessage={setAlertMessage}
                />
            )}
            {alertMessage && (
                <div className="alert-message">
                    {alertMessage}
                </div>
            )}
        </section>
    );
};

export default Navbar;
