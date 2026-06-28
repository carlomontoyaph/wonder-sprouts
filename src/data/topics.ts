import { Topic, CategoryKey } from '../types'

export const TOPICS: Topic[] = [
  {
    key: 'animals',
    name: 'Animals',
    color: '#7BAE7F',
    soft: '#E7F1E7',
    cat: 'nature' as CategoryKey,
    blurb: 'Creatures big and small',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="#5C8560" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="9" r="2.4"/><circle cx="18" cy="9" r="2.4"/><circle cx="9" cy="5.5" r="2.1"/><circle cx="15" cy="5.5" r="2.1"/><path d="M12 10c-3 0-5.5 2.4-5.5 5 0 2 1.8 3 3.4 2.3.7-.3 1.4-.3 2.1-.3s1.4 0 2.1.3c1.6.7 3.4-.3 3.4-2.3 0-2.6-2.5-5-5.5-5z"/></svg>',
    questions: [
      { q: 'Which animal is the tallest in the world?', a: ['Giraffe', 'Elephant', 'Horse', 'Camel'], correct: 0, art: 'giraffe', artDesc: 'the tallest animal', fact: 'A giraffe’s neck can be over 6 feet long — but it has the same number of neck bones as you: just seven!', talk: 'What other animals have very long necks?' },
      { q: 'What do bees make?', a: ['Honey', 'Milk', 'Bread', 'Juice'], correct: 0, art: 'honey', artDesc: 'what busy bees make', fact: 'Bees visit thousands of flowers to make one small jar of honey.', talk: 'Where else have you seen bees busy at work?' },
      { q: 'Which animal sleeps hanging upside down?', a: ['Bat', 'Owl', 'Cat', 'Frog'], correct: 0, art: 'bat', artDesc: 'sleeps hanging upside down', fact: 'Bats use sound to “see” in the dark. It’s called echolocation.', talk: 'What would it feel like to sleep upside down?' },
      { q: 'What is a baby kangaroo called?', a: ['Joey', 'Cub', 'Pup', 'Calf'], correct: 0, art: 'joey', artDesc: 'a baby kangaroo', fact: 'A baby kangaroo is about the size of a grape when it is born!', talk: 'What baby animal names do you know?' },
      { q: 'Which sea animal has eight arms?', a: ['Octopus', 'Shark', 'Whale', 'Crab'], correct: 0, art: 'octopus', artDesc: 'has eight wiggly arms', fact: 'An octopus has three hearts and blue blood.', talk: 'What would you do with eight arms?' },
    ],
    summaryPrompt: 'Which animal would you most like to see in real life, and why?',
  },
  {
    key: 'space',
    name: 'Space',
    color: '#7C84C4',
    soft: '#EAEBF6',
    cat: 'science' as CategoryKey,
    blurb: 'Planets, stars and beyond',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="6" fill="#7C84C4"/><ellipse cx="11" cy="11" rx="10.5" ry="3.6" fill="none" stroke="#7C84C4" stroke-width="1.8" transform="rotate(-22 11 11)"/></svg>',
    questions: [
      { q: 'Which planet is closest to the Sun?', a: ['Mercury', 'Earth', 'Mars', 'Jupiter'], correct: 0, art: 'mercury', artDesc: 'the planet closest to the Sun', fact: 'A day on Mercury is longer than a whole year on Mercury!', talk: 'If you could visit one planet, which would it be?' },
      { q: 'What do we call a shooting star?', a: ['Meteor', 'Comet', 'Planet', 'Moon'], correct: 0, art: 'meteor', artDesc: 'a shooting star', fact: 'Most shooting stars are smaller than a grain of sand.', talk: 'Have you ever made a wish on a star?' },
      { q: 'What is the name of our galaxy?', a: ['Milky Way', 'Sunny Way', 'Star Way', 'Moon Way'], correct: 0, art: 'milkyway', artDesc: 'our galaxy of stars', fact: 'Our galaxy has more than 100 billion stars.', talk: 'How many stars do you think you could count?' },
      { q: 'Which planet is known as the Red Planet?', a: ['Mars', 'Venus', 'Saturn', 'Neptune'], correct: 0, art: 'mars', artDesc: 'the Red Planet', fact: 'Mars looks red because of rusty iron in its soil.', talk: 'What color would you paint a new planet?' },
      { q: 'What do astronauts wear in space?', a: ['A spacesuit', 'A raincoat', 'A swimsuit', 'Pajamas'], correct: 0, art: 'spacesuit', artDesc: 'what astronauts wear', fact: 'A spacesuit is like a tiny spaceship that keeps astronauts safe.', talk: 'What would you pack for a trip to space?' },
    ],
    summaryPrompt: 'What do you think you would see first if you flew into space?',
  },
  {
    key: 'dinos',
    name: 'Dinosaurs',
    color: '#E8946A',
    soft: '#FBEADF',
    cat: 'nature' as CategoryKey,
    blurb: 'Giants of long ago',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="#C8744E" xmlns="http://www.w3.org/2000/svg"><path d="M3 17c1-5 3-9 8-9 1.5-3 4-4 4-4s-1 2-.5 3.2C18 8 21 11 21 16h-2c0-2.5-1.5-4-3-4.3.2 1.6-.5 3.3-2 4.3h-2l-1-2-1 2-1 1H6l1-2c-1.6.6-2.6 1.5-2 2H3z"/></svg>',
    questions: [
      { q: 'Which dinosaur had a very long neck?', a: ['Brachiosaurus', 'T. rex', 'Triceratops', 'Stegosaurus'], correct: 0, art: 'brachio', artDesc: 'the long-necked dinosaur', fact: 'Long-necked dinosaurs could reach leaves at the very top of tall trees.', talk: 'Why might a long neck be helpful?' },
      { q: 'What did T. rex use to catch its food?', a: ['Sharp teeth', 'Big wings', 'A long tail', 'Soft fur'], correct: 0, art: 'teeth', artDesc: 'big, sharp teeth', fact: 'A single T. rex tooth could be as long as a banana!', talk: 'What animals today have sharp teeth?' },
      { q: 'How do we learn about dinosaurs today?', a: ['Fossils', 'Photos', 'Videos', 'Letters'], correct: 0, art: 'fossils', artDesc: 'bones turned to stone', fact: 'Fossils are bones that slowly turned to stone over millions of years.', talk: 'What would you like to dig up as a fossil hunter?' },
      { q: 'Which dinosaur had three horns?', a: ['Triceratops', 'Velociraptor', 'Diplodocus', 'Ankylosaurus'], correct: 0, art: 'triceratops', artDesc: 'the three-horned dinosaur', fact: 'Triceratops used its horns to protect itself from predators.', talk: 'How do animals keep themselves safe today?' },
      { q: 'Did dinosaurs live at the same time as people?', a: ['No', 'Yes', 'Sometimes', 'Only at night'], correct: 0, art: 'longago', artDesc: 'long, long before people', fact: 'Dinosaurs lived millions of years before the very first people.', talk: 'What do you imagine the world looked like back then?' },
    ],
    summaryPrompt: 'If you could meet one dinosaur safely, which one would you choose?',
  },
  {
    key: 'ocean',
    name: 'Ocean',
    color: '#3E9CB0',
    soft: '#DFF0F3',
    cat: 'nature' as CategoryKey,
    blurb: 'Waves and sea life',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#2E7D8E" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><path d="M2 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M2 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"/></svg>',
    questions: [
      { q: 'Which is the largest animal in the ocean?', a: ['Blue whale', 'Shark', 'Dolphin', 'Octopus'], correct: 0, art: 'whale', artDesc: 'the largest ocean animal', fact: 'The blue whale is the biggest animal that has ever lived — even bigger than the dinosaurs!', talk: 'What other really big animals can you think of?' },
      { q: 'How many arms does an octopus have?', a: ['Eight', 'Six', 'Four', 'Ten'], correct: 0, art: 'octopus', artDesc: 'an octopus’s eight arms', fact: 'An octopus can squeeze its whole body through a hole as small as its eye.', talk: 'What would be tricky about having eight arms?' },
      { q: 'What makes ocean water taste different from a river?', a: ['Salt', 'Sugar', 'Sand', 'Soap'], correct: 0, art: 'salt', artDesc: 'what makes the sea salty', fact: 'The ocean is so salty that you float more easily in it than in a pool.', talk: 'Why do you think the sea is salty?' },
      { q: 'Which sea animal is known for its hard shell and claws?', a: ['Crab', 'Jellyfish', 'Seal', 'Eel'], correct: 0, art: 'crab', artDesc: 'hard shell and claws', fact: 'Crabs walk sideways because of the way their legs bend.', talk: 'Have you ever seen a crab at the beach?' },
      { q: 'What do we call the very deepest, darkest part of the sea?', a: ['The deep sea', 'The shallow end', 'The shore', 'The puddle'], correct: 0, art: 'submarine', artDesc: 'the deepest, darkest depths', fact: 'It is so dark deep down that some fish make their own light to see.', talk: 'Would you want to ride in a submarine to explore it?' },
    ],
    summaryPrompt: 'If you could explore the deep ocean, what would you hope to find?',
  },
  {
    key: 'body',
    name: 'Human Body',
    color: '#D67B7B',
    soft: '#F7E6E6',
    cat: 'science' as CategoryKey,
    blurb: 'Inside amazing you',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="#B85E5E" xmlns="http://www.w3.org/2000/svg"><path d="M12 20s-7-4.6-7-9.5C5 7.4 7 6 9 6c1.6 0 2.6 1 3 1.7C12.4 7 13.4 6 15 6c2 0 4 1.4 4 4.5C19 15.4 12 20 12 20z"/></svg>',
    questions: [
      { q: 'Which part of your body pumps blood?', a: ['Heart', 'Brain', 'Lungs', 'Stomach'], correct: 0, art: 'heart', artDesc: 'pumps your blood', fact: 'Your heart beats about 100,000 times every day without you even thinking about it.', talk: 'Can you feel your heartbeat after running around?' },
      { q: 'What do your lungs help you do?', a: ['Breathe', 'See', 'Hear', 'Taste'], correct: 0, art: 'lungs', artDesc: 'what your lungs help you do', fact: 'You breathe in and out about 20,000 times a day.', talk: 'What happens to your breathing when you run fast?' },
      { q: 'What part of you controls thinking and moving?', a: ['Brain', 'Heart', 'Skin', 'Bones'], correct: 0, art: 'brain', artDesc: 'thinking and moving', fact: 'Your brain uses about as much energy as a small light bulb.', talk: 'What is something amazing your brain helps you do?' },
      { q: 'What is inside your body that helps you stand up tall?', a: ['Bones', 'Air', 'Water', 'Hair'], correct: 0, art: 'bones', artDesc: 'help you stand up tall', fact: 'Babies are born with about 300 bones, and some join together as they grow up.', talk: 'Which bone do you think is the smallest?' },
      { q: 'Why do we sneeze?', a: ['To clear our nose', 'To say hello', 'To fall asleep', 'To grow taller'], correct: 0, art: 'sneeze', artDesc: 'to clear our nose', fact: 'A sneeze can shoot out faster than a car drives on the highway!', talk: 'What kinds of things make you sneeze?' },
    ],
    summaryPrompt: 'What part of the body do you think is the most amazing, and why?',
  },
  {
    key: 'weather',
    name: 'Weather',
    color: '#6FA3D6',
    soft: '#E7F0F8',
    cat: 'nature' as CategoryKey,
    blurb: 'Sun, rain and storms',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3.2" fill="#E0A63E"/><path d="M9 18a4 4 0 0 1 .4-8A5 5 0 0 1 19 11a3.5 3.5 0 0 1-.5 7H9z" fill="#5B86B0"/></svg>',
    questions: [
      { q: 'What falls from the sky when it rains?', a: ['Water', 'Sand', 'Leaves', 'Glass'], correct: 0, art: 'rain', artDesc: 'falls from the sky when it rains', fact: 'Raindrops are not shaped like teardrops — they look more like tiny buns.', talk: 'What is your favorite thing to do on a rainy day?' },
      { q: 'What do we call frozen rain that falls in winter?', a: ['Snow', 'Fog', 'Wind', 'Steam'], correct: 0, art: 'snow', artDesc: 'frozen rain in winter', fact: 'Every snowflake has six sides, and no two are exactly the same.', talk: 'Have you ever tried to catch a snowflake?' },
      { q: 'What makes the loud BOOM during a storm?', a: ['Thunder', 'Rain', 'Wind', 'Clouds'], correct: 0, art: 'thunder', artDesc: 'the loud storm BOOM', fact: 'Light travels faster than sound, so you see lightning before you hear thunder.', talk: 'How do you feel during a thunderstorm?' },
      { q: 'What shape is a rainbow?', a: ['An arch', 'A square', 'A straight line', 'A star'], correct: 0, art: 'rainbow', artDesc: 'the shape of a rainbow', fact: 'Rainbows appear when sunlight shines through tiny raindrops in the air.', talk: 'What colors can you find in a rainbow?' },
      { q: 'What do we use to stay dry in the rain?', a: ['Umbrella', 'Sunglasses', 'A fan', 'Mittens'], correct: 0, art: 'umbrella', artDesc: 'keeps you dry in the rain', fact: 'The very first umbrellas were made to block the sun, not the rain!', talk: 'What do you like to wear when it rains?' },
    ],
    summaryPrompt: 'If you could control the weather for one day, what would you choose?',
  },
  {
    key: 'bugs',
    name: 'Bugs',
    color: '#93A845',
    soft: '#EFF2DD',
    cat: 'nature' as CategoryKey,
    blurb: 'Tiny crawly creatures',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="6.5" fill="#C0492E"/><path d="M12 6.5v13" stroke="#3A2A20" stroke-width="1.6"/><circle cx="9.3" cy="11" r="1.1" fill="#3A2A20"/><circle cx="14.7" cy="11" r="1.1" fill="#3A2A20"/><circle cx="9" cy="15" r="1.1" fill="#3A2A20"/><circle cx="15" cy="15" r="1.1" fill="#3A2A20"/><circle cx="12" cy="4.5" r="2" fill="#3A2A20"/></svg>',
    questions: [
      { q: 'How many legs does an insect have?', a: ['Six', 'Four', 'Eight', 'Ten'], correct: 0, art: 'sixlegs', artDesc: 'how many legs an insect has', fact: 'Spiders have eight legs, so they are not insects — they are arachnids!', talk: 'Can you think of a bug with lots and lots of legs?' },
      { q: 'What does a caterpillar turn into?', a: ['Butterfly', 'Bird', 'Bee', 'Beetle'], correct: 0, art: 'butterfly', artDesc: 'what a caterpillar becomes', fact: 'A caterpillar makes a cocoon and completely changes its body inside it.', talk: 'What would it feel like to change your shape?' },
      { q: 'Which insect makes honey?', a: ['Bee', 'Ant', 'Fly', 'Moth'], correct: 0, art: 'bee', artDesc: 'the insect that makes honey', fact: 'Bees do a little wiggly dance to tell each other where to find flowers.', talk: 'Where have you seen bees buzzing around?' },
      { q: 'What do fireflies do that is special?', a: ['Glow in the dark', 'Sing songs', 'Swim fast', 'Dig deep holes'], correct: 0, art: 'firefly', artDesc: 'fireflies glow in the dark', fact: 'Fireflies light up to send messages to each other at night.', talk: 'What would you say if you could flash a glowing light?' },
      { q: 'Which tiny insect can carry things much heavier than itself?', a: ['Ant', 'Butterfly', 'Mosquito', 'Ladybug'], correct: 0, art: 'ant', artDesc: 'carries things heavier than itself', fact: 'Ants can lift objects many times heavier than their own body.', talk: 'What would you carry if you were that strong?' },
    ],
    summaryPrompt: 'Which bug would you like to watch up close, and why?',
  },
  {
    key: 'food',
    name: 'Food',
    color: '#C56B86',
    soft: '#F6E6EC',
    cat: 'world' as CategoryKey,
    blurb: 'Yummy things we eat',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="#A8506C" xmlns="http://www.w3.org/2000/svg"><path d="M12 7c-1-2-3-2.6-4.6-2C5.4 5.7 4.5 8 5 10.5c.6 3 2.8 7 4.6 8 .8.4 1.6.4 2.4 0 1.8-1 4-5 4.6-8C17 8 16.1 5.7 14.6 5 13 4.4 11 5 10 7" /><path d="M12 6c.3-1.4 1.3-2.4 2.6-2.6" stroke="#7BAE7F" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    questions: [
      { q: 'Where does honey come from?', a: ['Bees', 'Cows', 'Trees', 'Rocks'], correct: 0, art: 'honey', artDesc: 'honey comes from bees', fact: 'Bees visit thousands of flowers to make just one small jar of honey.', talk: 'What is your favorite sweet treat?' },
      { q: 'Which food comes from cows?', a: ['Milk', 'Bread', 'Apples', 'Rice'], correct: 0, art: 'milk', artDesc: 'milk comes from cows', fact: 'Milk is used to make cheese, butter, and yogurt too.', talk: 'What do you like to eat for breakfast?' },
      { q: 'What do we call sweet food that grows on trees?', a: ['Fruit', 'Meat', 'Bread', 'Eggs'], correct: 0, art: 'fruit', artDesc: 'sweet food that grows on trees', fact: 'Apples float in water because about a quarter of an apple is air!', talk: 'What is your favorite fruit?' },
      { q: 'What is bread mostly made from?', a: ['Wheat', 'Sand', 'Milk', 'Sugar'], correct: 0, art: 'wheat', artDesc: 'what bread is made from', fact: 'People have been baking bread for thousands of years.', talk: 'Have you ever helped make food in the kitchen?' },
      { q: 'Which of these is a vegetable?', a: ['Carrot', 'Banana', 'Cookie', 'Cheese'], correct: 0, art: 'carrot', artDesc: 'a crunchy vegetable', fact: 'Carrots used to be purple before farmers grew the orange ones we know today.', talk: 'What vegetable do you like best?' },
    ],
    summaryPrompt: 'If you could cook any meal together, what would you make?',
  },
  {
    key: 'vehicles',
    name: 'Vehicles',
    color: '#6E89A3',
    soft: '#E8EEF3',
    cat: 'science' as CategoryKey,
    blurb: 'Things that go!',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 14l1.5-4A2 2 0 0 1 6.4 8.7h7.2a2 2 0 0 1 1.7 1l2 3.3H21a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1h-1.2" fill="#54718A"/><rect x="2" y="13" width="20" height="4" rx="1.2" fill="#54718A"/><circle cx="7" cy="17.5" r="2.3" fill="#2E3F4F"/><circle cx="17" cy="17.5" r="2.3" fill="#2E3F4F"/></svg>',
    questions: [
      { q: 'What do we call a vehicle that flies in the sky?', a: ['Airplane', 'Boat', 'Bicycle', 'Train'], correct: 0, art: 'airplane2', artDesc: 'flies in the sky', fact: 'An airplane’s wings are specially shaped to help it lift up into the air.', talk: 'Where would you fly if you had your own plane?' },
      { q: 'What does a train ride along?', a: ['Tracks', 'Water', 'Roads', 'Sand'], correct: 0, art: 'tracks', artDesc: 'what a train rides along', fact: 'Some trains can travel faster than race cars!', talk: 'Have you ever ridden on a train?' },
      { q: 'Which vehicle helps put out fires?', a: ['Fire truck', 'School bus', 'Taxi', 'Tractor'], correct: 0, art: 'firetruck', artDesc: 'helps put out fires', fact: 'Fire trucks carry their own water and long ladders to reach high windows.', talk: 'What other vehicles help people in their jobs?' },
      { q: 'What floats on water to carry people?', a: ['Boat', 'Car', 'Plane', 'Scooter'], correct: 0, art: 'boat', artDesc: 'floats on water to carry people', fact: 'The biggest ships are longer than four soccer fields end to end.', talk: 'Where would you sail if you had a boat?' },
      { q: 'How many wheels does a bicycle have?', a: ['Two', 'Four', 'Three', 'One'], correct: 0, art: 'bicycle', artDesc: 'a bicycle has two wheels', fact: 'The word “bicycle” actually means “two wheels.”', talk: 'Can you ride a bike, or are you learning?' },
    ],
    summaryPrompt: 'If you could invent a brand-new vehicle, what would it do?',
  },
  {
    key: 'plants',
    name: 'Plants',
    color: '#54A05C',
    soft: '#E5F2E6',
    cat: 'nature' as CategoryKey,
    blurb: 'Seeds, leaves and trees',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="#3E7D46" xmlns="http://www.w3.org/2000/svg"><path d="M12 21V11" stroke="#3E7D46" stroke-width="2" stroke-linecap="round"/><path d="M12 12c0-3-2.4-5-5.4-5C6 10 8 12.6 12 12.6z"/><path d="M12 10c0-3 2.4-5.4 5.4-5.4C17.4 8 15 10.6 12 10.6z"/></svg>',
    questions: [
      { q: 'What do plants need to grow?', a: ['Sunlight and water', 'Only rocks', 'Only wind', 'Nothing at all'], correct: 0, art: 'sunwater1', artDesc: 'what plants need to grow', fact: 'Plants make their own food from sunlight — it is called photosynthesis.', talk: 'Have you ever grown or planted something?' },
      { q: 'Which part of a plant grows under the ground?', a: ['Roots', 'Flowers', 'Leaves', 'Fruit'], correct: 0, art: 'roots', artDesc: 'grows under the ground', fact: 'Roots drink up water and hold the plant steady in the soil.', talk: 'Why do you think roots are so important?' },
      { q: 'What can grow into a big plant or tree?', a: ['A seed', 'A rock', 'A raindrop', 'A leaf'], correct: 0, art: 'seed', artDesc: 'grows into a big plant or tree', fact: 'A tiny acorn can grow into a giant oak tree taller than a house.', talk: 'What is the biggest tree you have ever seen?' },
      { q: 'What do flowers help a plant do?', a: ['Make seeds', 'Run fast', 'Sing', 'Fly'], correct: 0, art: 'flower', artDesc: 'flowers help make seeds', fact: 'Bees and butterflies help flowers by carrying pollen from one to another.', talk: 'What is your favorite flower?' },
      { q: 'What color are most leaves?', a: ['Green', 'Blue', 'Purple', 'Black'], correct: 0, art: 'leaf', artDesc: 'the color of most leaves', fact: 'Leaves are green because of something inside them called chlorophyll.', talk: 'Why do you think leaves change color in autumn?' },
    ],
    summaryPrompt: 'If you planted a magic seed, what would you want it to grow into?',
  },
  {
    key: 'earth',
    name: 'Planet Earth',
    color: '#B0875A',
    soft: '#F1E8D8',
    cat: 'science' as CategoryKey,
    blurb: 'Mountains, deserts, seas',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8.5" fill="#5B86B0"/><path d="M5 10c2 .5 3 2 5 1.5S14 9 16 10s3 1 3 1M6 15c2-1 3 .5 5 0s2-2 4-1.5 3 .5 3 .5" stroke="#5DA05A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    questions: [
      { q: 'What do we call the very tall, rocky parts of the Earth?', a: ['Mountains', 'Puddles', 'Clouds', 'Bridges'], correct: 0, art: 'mountains', artDesc: 'tall rocky parts of the Earth', fact: 'The tallest mountain on Earth is Mount Everest, poking high into the sky.', talk: 'Have you ever climbed a really big hill?' },
      { q: 'What covers most of the Earth’s surface?', a: ['Water', 'Sand', 'Ice', 'Grass'], correct: 0, art: 'water1', artDesc: 'covers most of the Earth', fact: 'More than two-thirds of the Earth is covered by oceans.', talk: 'What do you think Earth looks like from space?' },
      { q: 'What comes out of an erupting volcano?', a: ['Lava', 'Snow', 'Sand', 'Rain'], correct: 0, art: 'lava', artDesc: 'comes out of a volcano', fact: 'Lava is rock so hot that it has melted into a glowing liquid.', talk: 'What do you think a volcano sounds like?' },
      { q: 'What can we do to help keep the Earth clean?', a: ['Recycle', 'Litter', 'Waste water', 'Cut down trees'], correct: 0, art: 'recycle1', artDesc: 'helps keep the Earth clean', fact: 'Recycling just one can saves enough energy to power a TV for hours.', talk: 'How do you help take care of the Earth?' },
      { q: 'What do we call a very dry place with lots of sand?', a: ['Desert', 'Forest', 'Ocean', 'Swamp'], correct: 0, art: 'desert', artDesc: 'a dry place with lots of sand', fact: 'Some deserts get freezing cold at night even though they are hot in the day.', talk: 'What would you pack for a trip to the desert?' },
    ],
    summaryPrompt: 'What part of our planet would you most like to visit?',
  },
  {
    key: 'shapes',
    name: 'Colors & Shapes',
    color: '#9E7BC4',
    soft: '#EFE9F7',
    cat: 'science' as CategoryKey,
    blurb: 'Mix, match and count',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7.5" cy="8" r="3.5" fill="#E0653E"/><rect x="12.5" y="4.5" width="7" height="7" rx="1.2" fill="#3E9CB0"/><path d="M11.5 21l-4-7h8z" fill="#E0A63E"/></svg>',
    questions: [
      { q: 'What do you get when you mix blue and yellow?', a: ['Green', 'Purple', 'Orange', 'Pink'], correct: 0, art: 'mixgreen', artDesc: 'blue and yellow make green', fact: 'Blue and yellow are colors that make green when you mix them together.', talk: 'What colors would you mix to paint a sunset?' },
      { q: 'How many sides does a triangle have?', a: ['Three', 'Four', 'Five', 'Two'], correct: 0, art: 'triangle', artDesc: 'a triangle has three sides', fact: 'A triangle is a very strong shape, so bridges often use triangles.', talk: 'Can you spot a triangle somewhere in the room?' },
      { q: 'What shape is a ball?', a: ['Sphere', 'Square', 'Triangle', 'Star'], correct: 0, art: 'sphere', artDesc: 'the shape of a ball', fact: 'A sphere is round all the way around, just like the sun and the moon.', talk: 'What round things can you see right now?' },
      { q: 'What do you get when you mix red and yellow?', a: ['Orange', 'Green', 'Blue', 'Purple'], correct: 0, art: 'mixorange', artDesc: 'red and yellow make orange', fact: 'Mixing red and yellow makes orange — the same color as the fruit!', talk: 'What is your very favorite color?' },
      { q: 'How many sides does a square have?', a: ['Four', 'Three', 'Six', 'Eight'], correct: 0, art: 'square', artDesc: 'a square has four sides', fact: 'All four sides of a square are exactly the same length.', talk: 'Can you find a square shape near you?' },
    ],
    summaryPrompt: 'If you could paint a picture together, what would it be?',
  },
  {
    key: 'egypt',
    name: 'Ancient Egypt',
    color: '#C9A24B',
    soft: '#F5ECCF',
    cat: 'world' as CategoryKey,
    blurb: 'Pyramids and pharaohs',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4l8 15H4z" fill="#C9A24B"/><path d="M12 4l8 15h-8z" fill="#A8842F"/><path d="M9.5 19l2.5-4.5L14.5 19z" fill="#7A5E20"/></svg>',
    questions: [
      { q: 'What giant pointy buildings did the ancient Egyptians build?', a: ['Pyramids', 'Castles', 'Towers', 'Bridges'], correct: 0, art: 'pyramids1', artDesc: 'giant pointy buildings', fact: 'The Great Pyramid was built over 4,000 years ago, all by hand.', talk: 'How do you think they lifted such heavy stones?' },
      { q: 'What were the kings of ancient Egypt called?', a: ['Pharaohs', 'Knights', 'Wizards', 'Mayors'], correct: 0, art: 'pharaoh', artDesc: 'the kings of ancient Egypt', fact: 'One famous pharaoh, Tutankhamun, became king when he was just a child.', talk: 'What would you do if you were king or queen for a day?' },
      { q: 'What did the Egyptians carefully wrap up to keep safe?', a: ['Mummies', 'Books', 'Toys', 'Boats'], correct: 0, art: 'mummy', artDesc: 'carefully wrapped up to keep safe', fact: 'Egyptians wrapped mummies in very long strips of cloth.', talk: 'Why do you think they wanted to keep things for so long?' },
      { q: 'Which big river was very important to ancient Egypt?', a: ['The Nile', 'The Amazon', 'The Thames', 'The Ganges'], correct: 0, art: 'nile2', artDesc: 'the river important to Egypt', fact: 'The Nile gave Egyptians water to drink and to grow their food.', talk: 'Why is water so important to a town or city?' },
      { q: 'Which animal was loved and protected in ancient Egypt?', a: ['Cats', 'Penguins', 'Bears', 'Kangaroos'], correct: 0, art: 'cat', artDesc: 'loved and protected in Egypt', fact: 'Egyptians loved cats so much that they made statues of them.', talk: 'Which animal would you want to protect?' },
    ],
    summaryPrompt: 'If you could visit ancient Egypt, what would you want to see?',
  },
  {
    key: 'inventions',
    name: 'Inventions',
    color: '#D9695C',
    soft: '#FBE7E3',
    cat: 'science' as CategoryKey,
    blurb: 'Clever ideas that help us',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" fill="#E8B04D"/><rect x="9.3" y="17" width="5.4" height="1.8" rx=".9" fill="#9A6B2E"/><rect x="10" y="19.3" width="4" height="1.7" rx=".85" fill="#9A6B2E"/></svg>',
    questions: [
      { q: 'What invention lights up a room at night?', a: ['Lightbulb', 'Spoon', 'Pillow', 'Shoe'], correct: 0, art: 'lightbulb', artDesc: 'lights up a room at night', fact: 'The lightbulb let people read and play long after the sun went down.', talk: 'What would life be like with no electric lights?' },
      { q: 'What round invention helps cars, bikes, and carts move?', a: ['The wheel', 'The window', 'The button', 'The cup'], correct: 0, art: 'wheel', artDesc: 'helps cars and bikes move', fact: 'The wheel was invented thousands of years ago and changed the whole world.', talk: 'What things around you use wheels?' },
      { q: 'What invention lets you talk to someone far away?', a: ['Telephone', 'Hammer', 'Chair', 'Clock'], correct: 0, art: 'telephone1', artDesc: 'talk to someone far away', fact: 'The first phones had long wires; today we carry them in our pockets.', talk: 'Who would you call if they lived far away?' },
      { q: 'What machine helps us find answers and play games?', a: ['Computer', 'Broom', 'Kettle', 'Ladder'], correct: 0, art: 'computer', artDesc: 'find answers and play games', fact: 'The very first computers were so big they filled up a whole room!', talk: 'What is your favorite thing to do on a computer?' },
      { q: 'What do we call a person who creates brand-new things?', a: ['Inventor', 'Driver', 'Singer', 'Farmer'], correct: 0, art: 'inventor', artDesc: 'creates brand-new things', fact: 'Many great inventions started as just a drawing of an idea.', talk: 'What would you like to invent one day?' },
    ],
    summaryPrompt: 'If you could invent anything to help people, what would it be?',
  },
  {
    key: 'world',
    name: 'World & Maps',
    color: '#4D9E86',
    soft: '#E2F1EC',
    cat: 'world' as CategoryKey,
    blurb: 'Countries and continents',
    iconSvg:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.6 6.5 12.5 6.5 12.5s6.5-7.9 6.5-12.5c0-3.6-2.9-6.5-6.5-6.5z" fill="#3C8770"/><circle cx="12" cy="9" r="2.4" fill="#EAF6F1"/></svg>',
    questions: [
      { q: 'What do we use to find our way to a new place?', a: ['A map', 'A spoon', 'A pillow', 'A shoe'], correct: 0, art: 'map', artDesc: 'find your way to a new place', fact: 'Long ago, sailors used the stars in the sky to find their way.', talk: 'Have you ever used a map to find somewhere?' },
      { q: 'What do we call the huge pieces of land on Earth?', a: ['Continents', 'Puddles', 'Rooms', 'Roads'], correct: 0, art: 'continents', artDesc: 'huge pieces of land on Earth', fact: 'There are seven continents on planet Earth.', talk: 'Which continent do you think you live on?' },
      { q: 'What colorful cloth stands for each country?', a: ['A flag', 'A towel', 'A blanket', 'A scarf'], correct: 0, art: 'flag', artDesc: 'stands for each country', fact: 'Every country has its own flag with special colors and shapes.', talk: 'What would your very own flag look like?' },
      { q: 'Which is the largest continent?', a: ['Asia', 'Australia', 'Europe', 'Antarctica'], correct: 0, art: 'asia', artDesc: 'the largest continent', fact: 'Asia is home to more people than any other continent.', talk: 'Where in the world would you love to travel?' },
      { q: 'What do we call the frozen continent at the bottom of the world?', a: ['Antarctica', 'Africa', 'Asia', 'Europe'], correct: 0, art: 'antarctica', artDesc: 'the frozen continent', fact: 'Antarctica is the coldest, windiest place on Earth, and penguins live there.', talk: 'What would you wear to visit Antarctica?' },
    ],
    summaryPrompt: 'If you could visit any country in the world, where would you go?',
  },
  {
    key: 'music',
    name: 'Music',
    color: '#B968A0',
    soft: '#F4E5EF',
    cat: 'world' as CategoryKey,
    blurb: 'Sounds, songs and beats',
    iconSvg:
      '<svg viewBox="0 0 24 24" fill="#9B4E82" xmlns="http://www.w3.org/2000/svg"><path d="M9 17.5V6.5l9-2v9" stroke="#9B4E82" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="15.5" cy="15.5" r="2.5"/></svg>',
    questions: [
      { q: 'Which instrument has black and white keys?', a: ['Piano', 'Drum', 'Flute', 'Trumpet'], correct: 0, art: 'piano', artDesc: 'has black and white keys', fact: 'A piano has 88 keys you can press to make different sounds.', talk: 'What instrument would you most like to play?' },
      { q: 'What do we call making sounds with your voice in a song?', a: ['Singing', 'Jumping', 'Drawing', 'Running'], correct: 0, art: 'singing', artDesc: 'making sounds with your voice', fact: 'Everyone’s singing voice sounds just a little bit different.', talk: 'What is your favorite song to sing?' },
      { q: 'Which instrument do you hit to make a beat?', a: ['Drum', 'Violin', 'Flute', 'Harp'], correct: 0, art: 'drum1', artDesc: 'hit it to make a beat', fact: 'Drums are some of the oldest instruments in the whole world.', talk: 'Can you tap out a beat right now?' },
      { q: 'What do we call a group of people playing music together?', a: ['A band', 'A team', 'A class', 'A crowd'], correct: 0, art: 'band2', artDesc: 'people playing music together', fact: 'A big orchestra can have more than 80 musicians playing at once.', talk: 'What instruments would be in your dream band?' },
      { q: 'Which instrument do you blow into to play?', a: ['Flute', 'Piano', 'Drum', 'Guitar'], correct: 0, art: 'flute', artDesc: 'blow into it to play', fact: 'Flutes can be made of metal, wood, or even bone a long time ago.', talk: 'What sound do you like best in music?' },
    ],
    summaryPrompt: 'If you could make up a song together, what would it be about?',
  },
]

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'nature', label: 'Nature & Animals' },
  { key: 'science', label: 'Science & Tech' },
  { key: 'world', label: 'World & Fun' },
]

export const CATEGORY_DOTS: Record<CategoryKey, string> = {
  all: '#B7A98E',
  nature: '#7BAE7F',
  science: '#7C84C4',
  world: '#C9A24B',
}

export function getTopicByKey(key: string): Topic {
  return TOPICS.find((t) => t.key === key) || TOPICS[0]
}

export function getActiveQuestions(topic: Topic, sessionLen: number) {
  return topic.questions.slice(0, sessionLen)
}

export function getWonderPromptPool(
  topics: Topic[],
  hiddenTopics: Record<string, boolean>,
): string[] {
  const pool: string[] = []
  topics.forEach((tp) => {
    if (hiddenTopics[tp.key]) return
    tp.questions.forEach((qq) => {
      if (qq.talk) pool.push(qq.talk)
    })
    if (tp.summaryPrompt) pool.push(tp.summaryPrompt)
  })
  return pool
}
