# Projeto de Sistema de Coleta de Recicláveis GreenCycle

## Descrição

Este projeto é um sistema para gerenciamento de pontos de coleta de recicláveis. O sistema permite visualizar, adicionar, editar e excluir pontos de coleta, bem como visualizar esses pontos em um mapa. 

## Funcionalidades

- **Formulário de Ponto de Coleta:** Permite criar e editar pontos de coleta com informações como identificação, endereço, e capacidade.
- **Mapa Interativo:** Exibe os pontos de coleta em um mapa do Google Maps com marcadores e janelas de informações.
- **Lista de Pontos de Coleta:** Mostra uma lista dos pontos de coleta cadastrados com opções de editar e deletar.

## Capturas de Tela

### Formulário de Ponto de Coleta

![Formulário de Ponto de Coleta](/GrenCycle//src/assets/cadastro.png)

### Mapa Interativo

![Mapa Interativo](/GrenCycle//src/assets/map.png)

### Deletar de Pontos de Coleta

![Deletar de Pontos de Coleta](/GrenCycle//src/assets/delete.png)

## Tecnologias

- **React:** Biblioteca principal para construção da interface do usuário.
- **Google Maps API:** Para exibir o mapa e marcar os pontos de coleta.
- **Input Mask:** Para formatação do campo de CEP.
- **Axios:** Para realizar requisições HTTP.

## Configuração

1. **API Key do Google Maps:** 

   Adicione sua chave da API do Google Maps em `src/Map.tsx`. Substitua `GEOCODING_API_KEY` pela sua chave:

   ```javascript
   const GEOCODING_API_KEY = 'SUA_CHAVE_AQUI';
   ```
