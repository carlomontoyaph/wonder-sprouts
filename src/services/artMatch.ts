import { ILLUSTRATIONS } from '../components/AnswerArt/AnswerArt'

const KIND_KEYS = Object.keys(ILLUSTRATIONS)

const SYNONYMS: Record<string, string> = {
  puppy: 'cat',
  kitten: 'cat',
  dog: 'cat',
  pup: 'cat',
  cow: 'milk',
  goat: 'milk',
  moon: 'mercury',
  star: 'meteor',
  stars: 'meteor',
  sun: 'sunwater',
  planet: 'mars',
  rocket: 'spacesuit',
  tree: 'leaf',
  forest: 'leaf',
  garden: 'flower',
  petal: 'flower',
  river: 'water',
  sea: 'water',
  ocean: 'water',
  lake: 'water',
  pond: 'water',
  fish: 'whale',
  shark: 'whale',
  dolphin: 'whale',
  turtle: 'crab',
  car: 'firetruck',
  truck: 'firetruck',
  van: 'firetruck',
  plane: 'airplane2',
  jet: 'airplane2',
  train: 'tracks',
  bus: 'firetruck',
  bike: 'bicycle',
  bird: 'butterfly',
  wing: 'butterfly',
  wings: 'butterfly',
  moth: 'butterfly',
  insect: 'bee',
  spider: 'ant',
  ladybug: 'bee',
  book: 'inventor',
  read: 'inventor',
  story: 'inventor',
  hat: 'pharaoh',
  crown: 'pharaoh',
  king: 'pharaoh',
  queen: 'pharaoh',
  prince: 'pharaoh',
  princess: 'pharaoh',
  song: 'singing',
  sing: 'singing',
  music: 'piano',
  drum: 'drum1',
  drums: 'drum1',
  guitar: 'band',
  bone: 'bones',
  skull: 'bones',
  tooth: 'teeth',
  circle: 'sphere',
  ball: 'sphere',
  box: 'square',
  cube: 'square',
  map: 'map',
  earth: 'continents',
  world: 'continents',
  globe: 'continents',
  ice: 'antarctica',
  snowflake: 'snow',
  cloud: 'rain',
  lightning: 'thunder',
  storm: 'thunder',
  bowl: 'fruit',
  apple: 'fruit',
  banana: 'fruit',
  bread: 'wheat',
  vegetable: 'carrot',
  seed: 'seed',
  root: 'roots',
  leaf: 'leaf',
  volcano: 'lava',
  mountain: 'mountains',
  hill: 'mountains',
  sand: 'desert',
}

/**
 * Pick an AnswerArt kind for a given correct-answer string.
 *
 * Order: synonym override → exact match → substring either direction → miss.
 * A miss returns an intentionally-unknown string so AnswerArt renders its
 * sparkle placeholder without any extra logic.
 */
export function pickArtKind(answer: string): string {
  const w = (answer || '').toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 'book-fallback'
  if (SYNONYMS[w]) return SYNONYMS[w]
  if (KIND_KEYS.includes(w)) return w
  const hit = KIND_KEYS.find((k) => w.includes(k) || k.includes(w))
  if (hit) return hit
  return 'book-fallback'
}
