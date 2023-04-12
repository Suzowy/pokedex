const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
const num_pokemon = 151;

const getPokemon = async () => {
  const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
  const responseToJson = await response.json();
  let allCharacters = responseToJson.results;
  console.log(allCharacters);

  const pintaPokemons = (pokemonList = allCharacters, imageList = []) => {
    const ul = document.querySelector('.listado');
    let ulContent = '';
    let cont = 0;
    pokemonList.map(pokemon => {
      cont = ++cont;
      ulContent += `<li>
                    <h2>${pokemon.name}</h2>
                    <img src="${imageList[cont - 1]}">
                    </li>`;
    })
    ul.innerHTML = ulContent;
  }
  
  const getAllImages = async () => {
    const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
    const responseToJson = await response.json();
    let allImages = responseToJson.results.map((pokemon) => `${api_get_img}${pokemon.url.split("/")[6]}.png`);
    return allImages;
  }

  const takeInput = async () => {
    const input = document.body.querySelector("input");
    input.addEventListener("input", async () => {
      const filteredCharacters = searchCharacter(allCharacters, input.value);
      const allImages = await getAllImages();
      const filteredImages = searchImages(allImages, filteredCharacters);
      if (filteredCharacters.length === 0) {
        alert(`El Pokemon ${input.value} no existe, vuelve a intentarlo`);
      } else {
        pintaPokemons(filteredCharacters, filteredImages);
      }
    });
  };
  
  const searchCharacter = (pokemonList, filtro) => {
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const searchImages = (imageList, pokemonList) => {
    const filteredImages = [];
    pokemonList.forEach(pokemon => {
      const index = allCharacters.findIndex(char => char.name === pokemon.name);
      filteredImages.push(imageList[index]);
    });
    return filteredImages;
  }

  const allImages = await getAllImages();
  pintaPokemons(allCharacters, allImages);
  takeInput();
};

getPokemon();
