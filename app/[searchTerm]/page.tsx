import getWikiResults from '@/lib/getWikiResults'
import React, { Suspense } from 'react'
import Item from './components/Item'

type Props = {
    params: {
        searchTerm: string
    }
}

export async function generateMetadata({ params: { searchTerm } }: Props) {
    const wikiData: Promise<SearchResult> = getWikiResults(searchTerm)
    const data = await wikiData
    const displayTerm = searchTerm.replaceAll('%20', ' ')

    if (!data?.query?.pages) {
        return {
            title: `${displayTerm} Not Found`
        }
    }

    return {
        title: displayTerm,
        description: `Search results for ${displayTerm}`
    }
}

export default async function SearchResults({ params: { searchTerm } }: Props) {
    const wikiData: Promise<SearchResult> = getWikiResults(searchTerm)
    const data = await wikiData
    const results: Result[] | undefined = data?.query?.pages


    const content = (
        <Suspense fallback={<h2>Loading...</h2>}>
            <main className="text-white mx-auto max-w-lg py-1 min-h-screen">
                {results
                    ? Object.values(results).map(result => {
                        return <Item key={result.pageid} result={result} />
                    })
                    : <h2 className="p-2 text-xl">{`${searchTerm} Not Found`}</h2>
                }
            </main>
        </Suspense>


    )

    return content
}
