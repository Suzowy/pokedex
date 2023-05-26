const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`;
const num_pokemon = 150;

const getPokemon = async () => {
  const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
  const { results: todosPokemon } = await response.json();

  const pintaPokemons = (pokemonLista = todosPokemon, imagenLista = []) => {
    const ul = document.querySelector(".listado");
    let ulContent = "";
    pokemonLista.forEach((pokemon, index) => {
        const imagen = imagenLista[index];
        ulContent += `<li>
          <h2>${pokemon.name}</h2>
          <img src="${imagen.url}" data-name="${pokemon.name}" class="pokemon-img">
        </li>`;
      });
    ul.innerHTML = ulContent;
  };

  function seleccionarPokemon(pokemonName) {
    const pokemon1 = todosPokemon.find(pokemon => pokemon.name === pokemonName);
    if (pokemon1) {
      const [pokemon2] = getRandomPokemon();
      luchaPokemon(pokemon1, pokemon2);
    } else {
      console.log("No se encontró un Pokémon con ese nombre.");
    }
  }


  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("pokemon-img")) {
      const pokemonName = event.target.getAttribute("data-name");
      seleccionarPokemon(pokemonName);
    }
  });
  
  const getRandomPokemon = () => {
    const index1 = Math.floor(Math.random() * todosPokemon.length);
    let index2 = Math.floor(Math.random() * todosPokemon.length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * todosPokemon.length);
    }
    return [todosPokemon[index1], todosPokemon[index2]];
  };

  const luchaPokemon = async (pokemon1, pokemon2) => {
    const [response1, response2] = await Promise.all([
      fetch(pokemon1.url),
      fetch(pokemon2.url)
    ]);
    const [pokemonData1, pokemonData2] = await Promise.all([
      response1.json(),
      response2.json()
    ]);
  
    const nombre1 = pokemonData1.name;
    const nombre2 = pokemonData2.name;
    let vida1 = pokemonData1.stats[0].base_stat;
    let vida2 = pokemonData2.stats[0].base_stat;
  
    console.log(`¡Comienza la batalla entre ${nombre1} y ${nombre2}!`);
    document.getElementById("pokemon-img1").src = `${api_get_imagen}${pokemon1.url.split("/")[6]}.png`;
    document.getElementById("pokemon-img2").src = `${api_get_imagen}${pokemon2.url.split("/")[6]}.png`;
  
    const resultadoLuchaElement = document.getElementById("resultado-lucha");
    resultadoLuchaElement.innerHTML = '';
  
    while (vida1 > 0 && vida2 > 0) {
      const ataque1 = pokemonData1.moves[Math.floor(Math.random() * pokemonData1.moves.length)];
      const ataque2 = pokemonData2.moves[Math.floor(Math.random() * pokemonData2.moves.length)];
  
      const daño1 = ataque1.power;
      const daño2 = ataque2.power;
  
      vida2 -= daño1;
      vida1 -= daño2;
  
      const textoLucha = `${nombre1} usa ${ataque1.name} y causa ${daño1} de daño.<br>
                          ${nombre2} usa ${ataque2.name} y causa ${daño2} de daño.<br>
                          ${nombre1} tiene ${vida1} puntos de vida restantes.<br>
                          ${nombre2} tiene ${vida2} puntos de vida restantes.<br>`;
  
      console.log(textoLucha);
      resultadoLuchaElement.innerHTML += textoLucha;
    }
  
    if (vida1 <= 0 && vida2 <= 0) {
      const textoResultado = "¡Es un empate!";
      resultadoLuchaElement.innerHTML += textoResultado;
    } else if (vida1 <= 0) {
      const textoResultado = `${nombre2} es el ganador.`;
      resultadoLuchaElement.innerHTML += textoResultado;
    } else {
      const textoResultado = `${nombre1} es el ganador.`;
      resultadoLuchaElement.innerHTML += textoResultado;
    }
  };

  const inputElement = document.getElementById("pokemon-input");
  const buttonElement = document.getElementById("pokemon-button");

  buttonElement.addEventListener("click", () => {
    const pokemonName = inputElement.value.toLowerCase();
    const pokemon1 = todosPokemon.find(pokemon => pokemon.name === pokemonName);
    if (pokemon1) {
      const [pokemon2] = getRandomPokemon();
      luchaPokemon(pokemon1, pokemon2);
    } else {
      console.log("No se encontró un Pokémon con ese nombre.");
    }
  });

  pintaPokemons(todosPokemon, todosPokemon.map((pokemon, index) => ({ url: `${api_get_imagen}${index + 1}.png` })));
};

getPokemon();
