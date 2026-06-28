import { FC } from 'react'
import { AnswerArt } from '../../components/AnswerArt/AnswerArt'
import styles from './ArtGalleryScreen.module.css'

const TOPICS: { title: string; tileColor: string; kinds: string[] }[] = [
  { title: 'Space',           tileColor: '#EAEBF6', kinds: ['mercury','meteor','milkyway','mars','spacesuit'] },
  { title: 'Dinosaurs',       tileColor: '#FBEADF', kinds: ['brachio','teeth','fossils','triceratops','longago'] },
  { title: 'Animals',         tileColor: '#E7F1E7', kinds: ['giraffe','honey','bat','joey','octopus'] },
  { title: 'Ocean',           tileColor: '#DFF0F3', kinds: ['whale','salt','crab','submarine'] },
  { title: 'Human Body',      tileColor: '#F7E6E6', kinds: ['heart','lungs','brain','bones','sneeze'] },
  { title: 'Weather',         tileColor: '#E7F0F8', kinds: ['rain','snow','thunder','rainbow','umbrella'] },
  { title: 'Bugs',            tileColor: '#EFF2DD', kinds: ['sixlegs','butterfly','bee','firefly','ant'] },
  { title: 'Food',            tileColor: '#F6E6EC', kinds: ['milk','fruit','wheat','carrot'] },
  { title: 'Vehicles',        tileColor: '#E8EEF3', kinds: ['airplane2','tracks','firetruck','boat','bicycle'] },
  { title: 'Plants',          tileColor: '#E5F2E6', kinds: ['sunwater','roots','seed','flower','leaf','sunwater1'] },
  { title: 'Planet Earth',    tileColor: '#F1E8D8', kinds: ['mountains','water','lava','desert','water1','recycle1'] },
  { title: 'Colors & Shapes', tileColor: '#EFE9F7', kinds: ['mixgreen','triangle','sphere','mixorange','square'] },
  { title: 'Ancient Egypt',   tileColor: '#F5ECCF', kinds: ['pyramids1','pharaoh','mummy','nile2','cat'] },
  { title: 'Inventions',      tileColor: '#FBE7E3', kinds: ['lightbulb','wheel','telephone1','computer','inventor'] },
  { title: 'World & Maps',    tileColor: '#E2F1EC', kinds: ['map','continents','flag','asia','antarctica'] },
  { title: 'Music',           tileColor: '#F4E5EF', kinds: ['piano','singing','band','drum1','band2','flute'] },
]

const KINDS = TOPICS.flatMap(t => t.kinds)
const TOTAL = KINDS.length

export function ArtGalleryScreen() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Answer Art — All {TOTAL} Illustrations</h1>
        <p className={styles.subtitle}>
          Compare against <code>answer-art-reference.html</code>
        </p>
      </header>

      {TOPICS.map((topic) => (
        <section key={topic.title} className={styles.section}>
          <h2 className={styles.topicTitle}>{topic.title}</h2>
          <p className={styles.topicInfo}>
            tile color <code>{topic.tileColor}</code> · {topic.kinds.length} answers
          </p>
          <div className={styles.grid}>
            {topic.kinds.map((kind) => (
              <figure key={kind} className={styles.card}>
                <div className={styles.tile}>
                  <AnswerArt kind={kind} />
                </div>
                <figcaption className={styles.caption}>{kind}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
