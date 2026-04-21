import {NextResponse} from 'next/server'
import {GoogleGenerativeAI} from '@google/generative-ai'
import {createClient} from '@sanity/client'

// Initialize clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

// Helper: Convert markdown section → PortableText blocks
function markdownToPortableText(md: string) {
  // In production, use @portabletext/markdown or a robust parser
  // Simplified example:
  const lines = md.split('\n').filter(Boolean)
  return lines.map((line) => {
    if (line.startsWith('# '))
      return {_type: 'block', style: 'h1', children: [{_type: 'span', text: line.slice(2)}]}
    if (line.startsWith('## '))
      return {_type: 'block', style: 'h2', children: [{_type: 'span', text: line.slice(3)}]}
    return {_type: 'block', style: 'normal', children: [{_type: 'span', text: line}]}
  })
}

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'})

    // 1. Fetch existing headlines for context
    const existingPosts = await sanity.fetch(
      '*[_type == "blogPost" && defined(slug.current)] { title, "slug": slug.current }',
    )
    const contextHeadlines = existingPosts.map((p: any) => `- ${p.title}`).join('\n')

    // 2. Generate outline first
    const outlinePrompt = `You are a sport-tech content strategist. Generate a fresh blog post outline that does NOT duplicate these existing topics:\n${contextHeadlines}\n\nOutput ONLY a JSON array of section titles (H1, then H2s).`
    const outlineRes = await model.generateContent(outlinePrompt)
    const outlineText = outlineRes.response.text()
    const sections = JSON.parse(outlineText.match(/\[.*\]/s)?.[0] || '[]')

    if (!sections || sections.length < 3) throw new Error('Invalid outline generated')

    // 3. Generate each section (block-by-block)
    const bodyBlocks: any[] = []
    for (const section of sections) {
      const sectionPrompt = `Write content for: "${section}". Use clear, actionable sport-tech advice. Output ONLY markdown.`
      const sectionRes = await model.generateContent(sectionPrompt)
      const markdown = sectionRes.response.text()
      bodyBlocks.push(...markdownToPortableText(markdown))
    }

    // 4. Assemble & create draft in Sanity
    const draftId = `drafts.${Date.now()}`
    await sanity.createOrReplace({
      _id: draftId,
      _type: 'blogPost',
      title: sections[0], // Use H1 as title
      slug: {
        _type: 'slug',
        current: sections[0]
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      },
      body: bodyBlocks,
      publishedAt: new Date().toISOString(),
      author: 'AI Assistant',
    })

    return NextResponse.json({success: true, draftId})
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}
