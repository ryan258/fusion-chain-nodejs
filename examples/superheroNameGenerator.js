// examples/superheroNameGenerator.js

const PipelineChain = require('../src/chain/PipelineChain');

// 🦸‍♀️ Welcome to the Superhero Name Generator! 🦸‍♂️
// This amazing machine will turn you into a superhero with just a few pieces of information!

// First, let's create some super-duper helper functions!

// 🎨 This function picks a cool color for your superhero costume
const pickSuperheroColor = (favoriteThing) => {
    const colors = ['Red', 'Blue', 'Green', 'Purple', 'Gold', 'Silver', 'Black'];
    // We'll use the length of your favorite thing to pick a color
    return colors[favoriteThing.length % colors.length];
};

// 💪 This function chooses an awesome superpower based on your name
const chooseSuperpower = (name) => {
    const powers = ['Flight', 'Super Strength', 'Invisibility', 'Telekinesis', 'Time Control', 'Shapeshifting'];
    // We'll use the first letter of your name to pick a power
    return powers[name.charCodeAt(0) % powers.length];
};

// 🦹 This function creates a silly villain name to be your archnemesis
const createVillainName = (superheroName) => {
    const prefixes = ['Evil', 'Doctor', 'Captain', 'Mister', 'Professor'];
    const suffixes = ['Doom', 'Chaos', 'Mayhem', 'Trouble', 'Mischief'];
    // We'll use parts of your superhero name to create your villain's name
    const prefix = prefixes[superheroName.length % prefixes.length];
    const suffix = suffixes[superheroName.charCodeAt(0) % suffixes.length];
    return `${prefix} ${suffix}`;
};

// Now, let's build our Superhero Generator Pipeline!
const superheroGenerator = new PipelineChain();

superheroGenerator
    // Step 1: Create your superhero name
    .addStep((input, context) => {
        console.log("🌟 Creating your superhero name...");
        const words = input.name.split(' ');
        const superheroName = words.map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
        context.superheroName = `The ${superheroName}`;
        return input;  // Pass the entire input object to the next step
    })
    // Step 2: Choose your superpower
    .addStep((input, context) => {
        console.log("💥 Choosing your amazing superpower...");
        context.superpower = chooseSuperpower(input.name);
        return input;  // Pass the entire input object to the next step
    })
    // Step 3: Pick your costume color
    .addStep((input, context) => {
        console.log("🎨 Picking a fantastic color for your costume...");
        context.costumeColor = pickSuperheroColor(input.favoriteThing);
        return input;  // Pass the entire input object to the next step
    })
    // Step 4: Create your archnemesis
    .addStep((input, context) => {
        console.log("🦹 Creating your archnemesis...");
        context.villainName = createVillainName(context.superheroName);
        return input;  // Pass the entire input object to the next step
    })
    // Step 5: Put it all together in a cool superhero story!
    .addStep((input, context) => {
        console.log("📖 Writing your superhero story...");
        return `
        Behold! ${context.superheroName} has arrived to save the day!
        With the incredible power of ${context.superpower},
        and wearing a stunning ${context.costumeColor} costume,
        our hero bravely faces the dastardly villain known as ${context.villainName}.
        Will ${context.superheroName} save the city? Of course they will!
        Because they love ${input.favoriteThing}, and that makes them extra awesome!
        `;
    });

// Let's run our Superhero Generator!
async function createSuperhero(name, favoriteThing) {
    console.log("🚀 Superhero Generator is powering up!");
    console.log(`Name: ${name}`);
    console.log(`Favorite Thing: ${favoriteThing}`);

    const context = {};
    const result = await superheroGenerator.run({ name, favoriteThing }, context);

    console.log("\n🦸 Your Superhero Identity Is Ready!");
    console.log(result);
    console.log("🎉 Go forth and save the world!");
}

// Test our Superhero Generator with a fun example
createSuperhero("Alex Thunder", "skateboarding")
    .catch(console.error);

// Now it's your turn! Try changing the name and favorite thing to create your own superhero!
// For example: createSuperhero("Alex Thunder", "skateboarding");