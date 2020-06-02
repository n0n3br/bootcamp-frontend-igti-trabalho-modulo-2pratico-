const fs = require("fs").promises;

const log = (method, message) => {
    console.log(`[${method}] ${message}`);
};

const one = async () => {
    try {
        let cities = await fs.readFile("./assets/json/cidades.json");
        cities = JSON.parse(cities);
        let states = await fs.readFile("./assets/json/estados.json");
        states = JSON.parse(states);
        states.forEach(async ({ Sigla, ID }) => {
            const filename = `./assets/json/${Sigla}.json`;
            const filteredCities = cities.filter((city) => city.Estado === ID);
            await fs.writeFile(filename, JSON.stringify(filteredCities));
        });
    } catch (error) {
        log("one", error.message);
    }
};

const two = async (uf) => {
    try {
        let cities = await fs.readFile(`./assets/json/${uf}.json`);
        cities = JSON.parse(cities);
        return cities.length;
    } catch (error) {
        log("two", error.message);
    }
};

const getStatesCitiesQuantity = async () => {
    let states = await fs.readFile("./assets/json/estados.json");
    states = JSON.parse(states);
    const promises = states.map(({ Sigla }) => two(Sigla));
    const promisesResponse = await Promise.all(promises);
    states = states.map((state, index) => ({
        ...state,
        QuantidadeCidades: promisesResponse[index],
    }));
    return states;
};

const three = async () => {
    try {
        const states = await getStatesCitiesQuantity();
        const result = states
            .sort((a, b) => b.QuantidadeCidades - a.QuantidadeCidades)
            .slice(0, 5)
            .map(
                ({ Sigla, QuantidadeCidades }) =>
                    `${Sigla} - ${QuantidadeCidades.toLocaleString()}`
            );
        log("three", JSON.stringify(result));
    } catch (error) {
        log("three", error.message);
    }
};

const four = async () => {
    try {
        const states = await getStatesCitiesQuantity();
        const result = states
            .sort((a, b) => a.QuantidadeCidades - b.QuantidadeCidades)
            .slice(0, 5)
            .map(
                ({ Sigla, QuantidadeCidades }) =>
                    `${Sigla} - ${QuantidadeCidades.toLocaleString()}`
            );
        log("four", JSON.stringify(result));
    } catch (error) {
        log("four", error.message);
    }
};

const getStateCities = async () => {
    let states = await fs.readFile("./assets/json/estados.json");
    states = JSON.parse(states);
    const promises = states.map(({ Sigla }) =>
        fs.readFile(`./assets/json/${Sigla}.json`)
    );
    const promisesResponse = await Promise.all(promises);
    states = states.map((state, index) => ({
        ...state,
        cities: JSON.parse(promisesResponse[index]),
    }));
    return states;
};

const five = async (display = true) => {
    try {
        const states = await getStateCities();
        const result = states
            .map((state) => {
                let cities = state.cities.sort((a, b) =>
                    a.Nome.length === b.Nome.length
                        ? a.Nome.localeCompare(b.Nome)
                        : b.Nome.length - a.Nome.length
                );
                return {
                    ...state,
                    cities,
                };
            })
            .map(({ Sigla, cities }) => `${cities[0].Nome} - ${Sigla}`);
        if (display) log("five", JSON.stringify(result));
        return result;
    } catch (error) {
        log("five", error.message);
    }
};

const six = async (display = true) => {
    try {
        const states = await getStateCities();
        const result = states
            .map((state) => {
                let cities = state.cities.sort((a, b) =>
                    a.Nome.length === b.Nome.length
                        ? a.Nome.localeCompare(b.Nome)
                        : a.Nome.length - b.Nome.length
                );
                return {
                    ...state,
                    cities,
                };
            })
            .map(({ Sigla, cities }) => `${cities[0].Nome} - ${Sigla}`);
        if (display) log("six", JSON.stringify(result));
        return result;
    } catch (error) {
        log("six", error.message);
    }
};

const seven = async () => {
    try {
    const states = await five(false);
    const result = states
        .map((s) => ({ city: s.split("-")[0].trim(), state: s.split("-")[1].trim() }))
        .sort((a, b) =>
            a.city.length === b.city.length
                ? a.city.localeCompare(b.city)
                : b.city.length - a.city.length
        )[0];
    log("seven", `${result.city} - ${result.state}`);
        
    } catch (error) {
        log('seven', error.message)        
    }
};

const eight = async () => {
    try {
        
        const states = await six(false);
        const result = states
            .map((s) => ({ city: s.split("-")[0].trim(), state: s.split("-")[1].trim() }))
            .sort((a, b) =>
                a.city.length === b.city.length
                    ? a.city.localeCompare(b.city)
                    : a.city.length - b.city.length
            )[0];
        log("eight", `${result.city} - ${result.state}`);
    } catch (error) {
        log('eight', error.message)
    }
};

const all = async () => {
    await one();
    await three();
    await four();
    await five();
    await six();
    await seven();
    await eight();
};

all();
