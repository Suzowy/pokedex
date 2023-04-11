const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
const num_pokemon = 151;

const getPokemon = async () => {
    const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
    const responseToJson = await response.json();
    let allCharacters = responseToJson.results;
    console.log(allCharacters);


    const pintaPokemons = (pokemonList = allCharacters) => {
        const ul = document.querySelector('.listado');
        let ulContent = '';
        let cont = 0;
        pokemonList.map(pokemon => {
            cont = ++cont;
            ulContent += `<li>
                          <h2>${pokemon.name}</h2>
                          <img src="${api_get_img}${cont}.png"/>
                          </li>`;
        })
        ul.innerHTML = ulContent;
    }
    pintaPokemons();

    const takeInput = () => {
        const input = document.body.querySelector("input");
        input.addEventListener("input", () =>
            searchCharacter(allCharacters, input.value)
        );
    };
    takeInput();

    const searchCharacter = (pokemonList, filtro) => {
        let filteredCharacters = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(filtro.toLowerCase())
        );
        pintaPokemons(filteredCharacters);
    };
};

getPokemon();
