import { client } from '@/lib/sanity'

type BeerDoc = {
  _id: string
  title: string
  abv: number | null
  description: string | null
}

export default async function TestPage() {
  const beers = await client.fetch<BeerDoc[]>(`*[_type == "beer"]{_id, title, abv, description}`)

  return (
    <main style={{ padding: 40 }}>
      <h1>Sanity Test</h1>
      {beers.map((b) => (
        <article key={b._id} style={{ marginTop: 24 }}>
          <h2>{b.title}</h2>
          <p>ABV: {b.abv}%</p>
          <p>{b.description}</p>
        </article>
      ))}
    </main>
  )
}
