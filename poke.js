const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
const num_pokemon = 151;

const getPokemon = async () => {
    const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
    const responseToJson = await response.json();
    let allCharacters = responseToJson.results;

   
    const pintaPokemons = () => {
        const ul = document.querySelector('.listado');
        let ulContent = '';

        let cont = 0;
        allCharacters.map(pokemon => {
            cont = ++cont;
            ulContent += `<li>
                          <h2>${pokemon.name}</h2>
                          <img src="${api_get_img}${cont}.png"/>
                        </li>`;
        })
        ul.innerHTML = ulContent;
    }
   pintaPokemons();
  };

getPokemon();

const takeInput = (allCharacters) => {
  console.log(allCharacters);
  const input = document.body.querySelector("input");
  input.addEventListener("input",() =>
    searchCharacter(pokemon, input.value)
  );
  console.log(input);
};

const searchCharacter = (pokemon, filtro) => {
  let filteredCharacters = pokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filtro.toLowerCase())
  );

  pintaPokemons(filteredCharacters);
};

