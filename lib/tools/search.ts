import { searchSchema } from '@/lib/schema/search'
import {
  SearchResultImage,
  SearchResultItem,
  SearchResults,
  SearXNGResponse,
  SearXNGResult
} from '@/lib/types'
import { sanitizeUrl } from '@/lib/utils'
import { tool } from 'ai'
import Exa from 'exa-js'

export const searchTool = tool({
  description: 'Search the web for information',
  parameters: searchSchema,
  execute: async (
    { query, max_results, search_depth, include_domains, exclude_domains },
    { messages, toolCallId } = { messages: [], toolCallId: 'search' }
  ) => {
    // Tavily API requires a minimum of 5 characters in the query
    const filledQuery =
      query.length < 5 ? query + ' '.repeat(5 - query.length) : query

    // Get the last user message content to use as originalPrompt
    const lastUserMessage =
      messages.filter(m => m.role === 'user').pop()?.content || ''
    const originalPrompt =
      typeof lastUserMessage === 'string' ? lastUserMessage : ''

    let searchResult: SearchResults

    try {
      // Call the webhook with the search query
      const response = await fetch(
        'https://auto.tivis.lt/webhook/c5ddb35f-0a4f-4d85-93a3-24bf8bacd2fd',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: query,
            originalPrompt: originalPrompt || query
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          `Webhook API error: ${response.status} ${response.statusText}`
        )
      }

      // Process the webhook response
      const webhookResults = await response.json()

      // Transform webhook response to expected SearchResults format
      searchResult = {
        results: webhookResults
          .map((item: any) => ({
            title: `Result ${item.score.toFixed(2)}`,
            url: item.document.metadata.source || 'https://tivis.lt',
            content: item.document.pageContent
          }))
          .slice(0, max_results || 10),
        query: filledQuery,
        images: [],
        number_of_results: webhookResults.length
      }
    } catch (error) {
      console.error('Search API error:', error)
      searchResult = {
        results: [],
        query: filledQuery,
        images: [],
        number_of_results: 0
      }
    }

    console.log('completed search')
    return searchResult
  }
})

export async function search(
  query: string,
  maxResults: number = 10,
  searchDepth: 'basic' | 'advanced' = 'basic',
  includeDomains: string[] = [],
  excludeDomains: string[] = [],
  messages: any[] = []
): Promise<SearchResults> {
  return searchTool.execute(
    {
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      include_domains: includeDomains,
      exclude_domains: excludeDomains
    },
    {
      toolCallId: 'search',
      messages: messages
    }
  )
}

async function tavilySearch(
  query: string,
  maxResults: number = 10,
  searchDepth: 'basic' | 'advanced' = 'basic',
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not set in the environment variables')
  }
  const includeImageDescriptions = true
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: Math.max(maxResults, 5),
      search_depth: searchDepth,
      include_images: true,
      include_image_descriptions: includeImageDescriptions,
      include_answers: true,
      include_domains: includeDomains,
      exclude_domains: excludeDomains
    })
  })

  if (!response.ok) {
    throw new Error(
      `Tavily API error: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()
  const processedImages = includeImageDescriptions
    ? data.images
        .map(({ url, description }: { url: string; description: string }) => ({
          url: sanitizeUrl(url),
          description
        }))
        .filter(
          (
            image: SearchResultImage
          ): image is { url: string; description: string } =>
            typeof image === 'object' &&
            image.description !== undefined &&
            image.description !== ''
        )
    : data.images.map((url: string) => sanitizeUrl(url))

  return {
    ...data,
    images: processedImages
  }
}

async function exaSearch(
  query: string,
  maxResults: number = 10,
  _searchDepth: string,
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiKey = process.env.EXA_API_KEY
  if (!apiKey) {
    throw new Error('EXA_API_KEY is not set in the environment variables')
  }

  const exa = new Exa(apiKey)
  const exaResults = await exa.searchAndContents(query, {
    highlights: true,
    numResults: maxResults,
    includeDomains,
    excludeDomains
  })

  return {
    results: exaResults.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.highlight || result.text
    })),
    query,
    images: [],
    number_of_results: exaResults.results.length
  }
}

async function searxngSearch(
  query: string,
  maxResults: number = 10,
  searchDepth: string,
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<SearchResults> {
  const apiUrl = process.env.SEARXNG_API_URL
  if (!apiUrl) {
    throw new Error('SEARXNG_API_URL is not set in the environment variables')
  }

  try {
    // Construct the URL with query parameters
    const url = new URL(`${apiUrl}/search`)
    url.searchParams.append('q', query)
    url.searchParams.append('format', 'json')
    url.searchParams.append('categories', 'general,images')

    // Apply search depth settings
    if (searchDepth === 'advanced') {
      url.searchParams.append('time_range', '')
      url.searchParams.append('safesearch', '0')
      url.searchParams.append('engines', 'google,bing,duckduckgo,wikipedia')
    } else {
      url.searchParams.append('time_range', 'year')
      url.searchParams.append('safesearch', '1')
      url.searchParams.append('engines', 'google,bing')
    }

    // Fetch results from SearXNG
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`SearXNG API error (${response.status}):`, errorText)
      throw new Error(
        `SearXNG API error: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    const data: SearXNGResponse = await response.json()

    // Separate general results and image results, and limit to maxResults
    const generalResults = data.results
      .filter(result => !result.img_src)
      .slice(0, maxResults)
    const imageResults = data.results
      .filter(result => result.img_src)
      .slice(0, maxResults)

    // Format the results to match the expected SearchResults structure
    return {
      results: generalResults.map(
        (result: SearXNGResult): SearchResultItem => ({
          title: result.title,
          url: result.url,
          content: result.content
        })
      ),
      query: data.query,
      images: imageResults
        .map(result => {
          const imgSrc = result.img_src || ''
          return imgSrc.startsWith('http') ? imgSrc : `${apiUrl}${imgSrc}`
        })
        .filter(Boolean),
      number_of_results: data.number_of_results
    }
  } catch (error) {
    console.error('SearXNG API error:', error)
    throw error
  }
}
