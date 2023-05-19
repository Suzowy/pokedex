const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`;
const num_pokemon = 150;

const getPokemon = async () => {
  const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
  const responseToJson = await response.json();
  let todosPokemon = responseToJson.results;

  const pintaPokemons = async (pokemonLista = todosPokemon, imagenLista = []) => {
    const ul = document.querySelector(".listado");
    let ulContent = "";
    let cont = 0;
    for (const [index, pokemon] of pokemonLista.entries()) {
      cont++;
      const imagen = imagenLista[index];
      const tipo = imagen.tipo;
      const colorFondo =
        tipo === "grass"
          ? "#128512"
          : tipo === "fire"
          ? "#ff7801"
          : tipo === "water"
          ? "#6495ed "
          : tipo === "bug"
          ? "#f791c4"
          : tipo === "normal"
          ? "burlywood"
          : tipo === "poison"
          ? "#860c9e"
          : tipo === "electric"
          ? "yellow"
          : tipo === "ground"
          ? "#75351999"
          : tipo === "fairy"
          ? "fuchsia"
          : tipo === "rock"
          ? "grey"
          : tipo === "ghost"
          ? "white"
          : tipo === "fighting"
          ? "#0e7957"
          : tipo === "psychic"
          ? "silver"
          : tipo === "ice"
          ? "#80ebd6ec "
          : tipo === "dragon"
          ? "crimson"
          : tipo;

      const pokemonDataResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonDataResponse.json();
      const habilidades = pokemonData.abilities.map((ability) => ability.ability.name);
      const ataquesResponse = await fetch(pokemonData.moves[0].move.url);
   
      

      ulContent += `
        <li>
          <h2>${pokemon.name}</h2>
          <img src="${imagen.url}" data-name="${pokemon.name}" class="pokemon-img">
          <p style="background-color: ${colorFondo};">${tipo}</p>
    </li>`;
    }
    ul.innerHTML = ulContent;
  };

  const buscador = async () => {
    const input = document.body.querySelector("input");
    input.addEventListener("input", async () => {
      const filtraPoke = buscaPokemon(todosPokemon, input.value);
      const fotos = await muestraImagen();
      const filtraImg = buscaImagen(fotos, filtraPoke);
      if (filtraPoke.length === 0) {
        const imagenError = document.createElement("img");
        imagenError.src = "error.gif";
        imagenError.classList.add("error-image");
        const ul = document.querySelector(".listado");
        ul.innerHTML = "";
        ul.appendChild(imagenError);
        const textoError = document.createElement("h1");
        textoError.textContent = "Oh no... ese Pokémon no existe, prueba otra vez.";
        textoError.classList.add("error-text");
        ul.appendChild(textoError);
      } else {
        pintaPokemons(filtraPoke, filtraImg);
      }
    });
  };

  const filtraPorTipo = async (pokemonLista, tipo) => {
    if (tipo === "") {
      return pokemonLista;
    } else {
      const pokemonesFiltrados = await Promise.all(
        pokemonLista.map(async (pokemon) => {
          const pokemonDataResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonDataResponse.json();
          const tipoPokemon = pokemonData.types[0].type.name;
          return tipoPokemon === tipo ? pokemon : null;
        })
      );
      return pokemonesFiltrados.filter((pokemon) => pokemon !== null);
    }
  };

  const seleccionarPokemon = (pokemonName) => {
    const pokemon1 = todosPokemon.find((pokemon) => pokemon.name === pokemonName);
    if (pokemon1) {
      const [pokemon2] = getRandomPokemon();
      luchaPokemon(pokemon1, pokemon2);
      scrollToBattle();
    } else {
      console.log("No se encontró un Pokémon con ese nombre.");
    }
  };
  const scrollToBattle = () => {
    const battleDiv = document.getElementById("div-lucha");
    battleDiv.scrollIntoView({ behavior: "smooth" });
  };



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
    const response1 = await fetch(pokemon1.url);
    const response2 = await fetch(pokemon2.url);
    const pokemonData1 = await response1.json();
    const pokemonData2 = await response2.json();

    const nombre1 = pokemonData1.name;
    const nombre2 = pokemonData2.name;

    let vida1 = pokemonData1.stats[0].base_stat;
    let vida2 = pokemonData2.stats[0].base_stat;

    
    document.getElementById("pokemon-img1").src = `${api_get_imagen}${pokemon1.url.split("/")[6]}.png`;
    document.getElementById("pokemon-img2").src = `${api_get_imagen}${pokemon2.url.split("/")[6]}.png`;

    const resultadoLuchaElement = document.getElementById("resultado-lucha");
    resultadoLuchaElement.innerHTML = "";
    const escribirResultado = (texto, tiempo) => {
      return new Promise((resolve) => {
        let index = 0;
        const interval = setInterval(() => {
          resultadoLuchaElement.innerHTML += texto[index];
          index++;
          if (index === texto.length) {
            clearInterval(interval);
            resolve();
          }
        }, tiempo);
      });
    };

    
    while (vida1 > 0 && vida2 > 0) {
      const ataqueIndex1 = Math.floor(Math.random() * pokemonData1.moves.length);
      const ataqueIndex2 = Math.floor(Math.random() * pokemonData2.moves.length);
      const ataque1 = pokemonData1.moves[ataqueIndex1].move.name;
      const ataque2 = pokemonData2.moves[ataqueIndex2].move.name;
      const daño1 = Math.floor(Math.random() * 50) + 1;
      const daño2 = Math.floor(Math.random() * 50) + 1;

      vida2 -= daño1;
      vida1 -= daño2;

      

      const textoLucha = `
        ${nombre1} usa ${ataque1} y causa ${daño1} de daño.<br>
        ${nombre2} usa ${ataque2} y causa ${daño2} de daño.<br>
        ${nombre1} tiene ${vida1} de vida.<br>
        ${nombre2} tiene ${vida2} de vida.<br>
        <br>`;

      resultadoLuchaElement.innerHTML += textoLucha;
    }
    if (vida1 <= 0 && vida2 <= 0) {
      const textoResultado = "¡Es un empate!";
      console.log(textoResultado);
      resultadoLuchaElement.innerHTML += textoResultado;
    } else if (vida1 <= 0) {
      const textoResultado = `${nombre2} es el ganador!`;
      console.log(textoResultado);
      resultadoLuchaElement.innerHTML += textoResultado;
    } else {
      const textoResultado = `${nombre1} es el ganador!`;
      console.log(textoResultado);
      resultadoLuchaElement.innerHTML += textoResultado;
    }
  };
  const borrarResultadoLucha = () => {
    const resultadoLuchaElement = document.getElementById("resultado-lucha");
    resultadoLuchaElement.innerHTML = "";
  };

  const buscaImagen = (imagenLista, pokemonList) => {
    const filtraImg = [];
    pokemonList.forEach((pokemon) => {
      const index = todosPokemon.findIndex((poke) => poke.name === pokemon.name);
      filtraImg.push(imagenLista[index]);
    });
    return filtraImg;
  };

  const muestraImagen = async () => {
    const fotos = await Promise.all(
      responseToJson.results.map(async (pokemon) => {
        const pokemonDataResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonDataResponse.json();
        const tipo = pokemonData.types[0].type.name;
        return {
          url: `${api_get_imagen}${pokemon.url.split("/")[6]}.png`,
          tipo: tipo,
        };
      })
    );
    return fotos;
  };

  const buscaPokemon = (pokemonLista, filtro) => {
    return pokemonLista.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const buscadorTipo = async () => {
    const select = document.getElementById("filtro-tipo");
    const btnBuscar = document.getElementById("btn-buscar");

    btnBuscar.addEventListener("click", async () => {
      const tipo = select.value;
      const pokemonesFiltrados = await filtraPorTipo(todosPokemon, tipo);
      const fotosFiltradas = buscaImagen(fotos, pokemonesFiltrados);
      pintaPokemons(pokemonesFiltrados, fotosFiltradas);
      borrarResultadoLucha();
    });
  };

  const fotos = await muestraImagen();
  pintaPokemons(todosPokemon, fotos);
  buscador();
  buscadorTipo();

  const btnLuchar = document.getElementById("btn-luchar");
  btnLuchar.addEventListener("click", () => {
    const [pokemon1, pokemon2] = getRandomPokemon();
    luchaPokemon(pokemon1, pokemon2);
    borrarResultadoLucha();
    pintaPokemons(
      todosPokemon,
      todosPokemon.map((pokemon, index) => ({
        url: `${api_get_imagen}${index + 1}.png`,
      }))
    );
  });
};

getPokemon();
