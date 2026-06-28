import { FC } from 'react'
import styles from './AnswerArt.module.css'

// Import all illustration components
import { GiraffeArt, HoneyArt, BatArt, JoeyArt, OctopusArt } from './illustrations/artAnimals'
import { MercuryArt, MeteorArt, MilkywayArt, MarsArt, SpacesuitArt } from './illustrations/artSpace'
import { BrachioArt, TeethArt, FossilsArt, TriceratopsArt, LongagoArt } from './illustrations/artDinos'
import { WhaleArt, SaltArt, CrabArt, SubmarineArt } from './illustrations/artOcean'
import { HeartArt, LungsArt, BrainArt, BonesArt, SneezeArt } from './illustrations/artBody'
import { RainArt, SnowArt, ThunderArt, RainbowArt, UmbrellaArt } from './illustrations/artWeather'
import { SixlegsArt, ButterflyArt, BeeArt, FireflyArt, AntArt } from './illustrations/artBugs'
import { HoneyArt2, MilkArt, FruitArt, WheatArt, CarrotArt } from './illustrations/artFood'
import { Airplane2Art, TracksArt, FiretruckArt, BoatArt, BicycleArt } from './illustrations/artVehicles'
import { Sunwater1Art, RootsArt, SeedArt, FlowerArt, LeafArt } from './illustrations/artPlants'
import { MountainsArt, Water1Art, LavaArt, Recycle1Art, DesertArt } from './illustrations/artEarth'
import { MixgreenArt, TriangleArt, SphereArt, MixorangeArt, SquareArt } from './illustrations/artShapes'
import { Pyramids1Art, PharaohArt, MummyArt, Nile2Art, CatArt } from './illustrations/artEgypt'
import { LightbulbArt, WheelArt, Telephone1Art, ComputerArt, InventorArt } from './illustrations/artInventions'
import { MapArt, ContinentsArt, FlagArt, AsiaArt, AntarcticaArt } from './illustrations/artWorld'
import { PianoArt, SingingArt, Drum1Art, Band2Art, FluteArt } from './illustrations/artMusic'

// Registry mapping kind strings to illustration components
const ILLUSTRATIONS: Record<string, FC> = {
  // Animals
  giraffe: GiraffeArt,
  honey: HoneyArt,
  bat: BatArt,
  joey: JoeyArt,
  octopus: OctopusArt,
  // Space
  mercury: MercuryArt,
  meteor: MeteorArt,
  milkyway: MilkywayArt,
  mars: MarsArt,
  spacesuit: SpacesuitArt,
  // Dinosaurs
  brachio: BrachioArt,
  teeth: TeethArt,
  fossils: FossilsArt,
  triceratops: TriceratopsArt,
  longago: LongagoArt,
  // Ocean
  whale: WhaleArt,
  salt: SaltArt,
  crab: CrabArt,
  submarine: SubmarineArt,
  // Body
  heart: HeartArt,
  lungs: LungsArt,
  brain: BrainArt,
  bones: BonesArt,
  sneeze: SneezeArt,
  // Weather
  rain: RainArt,
  snow: SnowArt,
  thunder: ThunderArt,
  rainbow: RainbowArt,
  umbrella: UmbrellaArt,
  // Bugs
  sixlegs: SixlegsArt,
  butterfly: ButterflyArt,
  bee: BeeArt,
  firefly: FireflyArt,
  ant: AntArt,
  // Food
  honey2: HoneyArt2,
  milk: MilkArt,
  fruit: FruitArt,
  wheat: WheatArt,
  carrot: CarrotArt,
  // Vehicles
  airplane2: Airplane2Art,
  tracks: TracksArt,
  firetruck: FiretruckArt,
  boat: BoatArt,
  bicycle: BicycleArt,
  // Plants
  sunwater1: Sunwater1Art,
  roots: RootsArt,
  seed: SeedArt,
  flower: FlowerArt,
  leaf: LeafArt,
  // Earth
  mountains: MountainsArt,
  water1: Water1Art,
  lava: LavaArt,
  recycle1: Recycle1Art,
  desert: DesertArt,
  // Shapes
  mixgreen: MixgreenArt,
  triangle: TriangleArt,
  sphere: SphereArt,
  mixorange: MixorangeArt,
  square: SquareArt,
  // Egypt
  pyramids1: Pyramids1Art,
  pharaoh: PharaohArt,
  mummy: MummyArt,
  nile2: Nile2Art,
  cat: CatArt,
  // Inventions
  lightbulb: LightbulbArt,
  wheel: WheelArt,
  telephone1: Telephone1Art,
  computer: ComputerArt,
  inventor: InventorArt,
  // World
  map: MapArt,
  continents: ContinentsArt,
  flag: FlagArt,
  asia: AsiaArt,
  antarctica: AntarcticaArt,
  // Music
  piano: PianoArt,
  singing: SingingArt,
  drum1: Drum1Art,
  band2: Band2Art,
  flute: FluteArt,
}

// Tile background colors by topic key
const TILE_COLORS: Record<string, string> = {
  animals: '#E7F1E7',
  space: '#EAEBF6',
  dinos: '#FBEADF',
  ocean: '#DFF0F3',
  body: '#F7E6E6',
  weather: '#E7F0F8',
  bugs: '#EFF2DD',
  food: '#F6E6EC',
  vehicles: '#E8EEF3',
  plants: '#E5F2E6',
  earth: '#F1E8D8',
  shapes: '#EFE9F7',
  egypt: '#F5ECCF',
  inventions: '#FBE7E3',
  world: '#E2F1EC',
  music: '#F4E5EF',
}

interface AnswerArtProps {
  kind: string
  theme?: string
}

export function AnswerArt({ kind, theme }: AnswerArtProps) {
  const Art = ILLUSTRATIONS[kind]

  if (!Art) {
    return (
      <div className={styles.placeholder}>
        ✨
      </div>
    )
  }

  const bgColor = (theme && TILE_COLORS[theme]) || '#EAEBF6'

  return (
    <div className={styles.container} style={{ background: bgColor }}>
      <Art />
    </div>
  )
}
