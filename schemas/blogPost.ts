import {defineField, defineType} from 'sanity'
import {GenerateExcerptInput} from '../components/GenerateExcerpt'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'content', title: '📝 Content', default: true},
    {name: 'seo', title: '🌍 SEO & Publishing'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      group: 'content',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'title'},
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'author', type: 'string', title: 'Author', group: 'content'}),
    defineField({name: 'authorBio', type: 'string', title: 'Author Bio', group: 'content'}),
    defineField({name: 'readingTime', type: 'number', title: 'Reading Time (min)', group: 'content'}),
    defineField({name: 'isAIGenerated', type: 'boolean', title: 'Is AI Generated?', group: 'content', initialValue: true}),
    defineField({name: 'tags', type: 'array', title: 'Tags', of: [{type: 'string'}], group: 'content'}),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      group: 'content',
      options: {
        list: [
          {title: 'Training', value: 'training'},
          {title: 'Nutrition', value: 'nutrition'},
          {title: 'Product', value: 'product'},
          {title: 'Science', value: 'science'},
          {title: 'Lifestyle', value: 'lifestyle'},
          {title: 'Community', value: 'community'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: {hotspot: true},
      group: 'content',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'intro',
      type: 'text',
      title: 'Intro (Hook Paragraph)',
      rows: 3,
      group: 'content',
      description: 'Opening paragraph (60-80 words). Hook before first section.',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'sections',
      type: 'array',
      title: 'Content Sections',
      group: 'content',
      of: [
        defineField({
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({
              name: 'heading',
              type: 'string',
              title: 'Section Heading',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              type: 'text',
              title: 'Section Content',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'content'},
            prepare(selection: any) {
              return {
                title: selection.title || 'Untitled Section',
                subtitle: selection.subtitle ? selection.subtitle.substring(0, 50) + '...' : '',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'conclusion',
      type: 'text',
      title: 'Conclusion (Closing Paragraph)',
      rows: 3,
      group: 'content',
      description: 'Closing paragraph (60-90 words). No heading required.',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Legacy Content Body',
      of: [{type: 'block'}],
      group: 'content',
      description: 'Legacy field for backward compatibility. Use sections instead.',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
      components: {input: GenerateExcerptInput},
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Publish Date',
      group: 'seo',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO Settings',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'string',
          validation: (Rule) => Rule.required().min(30).max(60),
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          validation: (Rule) => Rule.required().max(155),
        }),
        defineField({
          name: 'keywords',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'faqSchema',
          type: 'object',
          title: 'FAQ Schema (JSON-LD)',
          fields: [
            defineField({name: 'context', type: 'string'}),
            defineField({name: 'type', type: 'string'}),
            defineField({
              name: 'mainEntity',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({name: 'type', type: 'string'}),
                    defineField({name: 'name', type: 'string'}),
                    defineField({
                      name: 'acceptedAnswer',
                      type: 'object',
                      fields: [
                        defineField({name: 'type', type: 'string'}),
                        defineField({name: 'text', type: 'string'}),
                      ],
                    }),
                  ],
                },
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'aiMetadata',
      type: 'object',
      title: '🤖 AI Metadata',
      group: 'seo',
      fields: [
        defineField({name: 'modelName', type: 'string'}),
        defineField({name: 'strategy', type: 'string'}),
        defineField({name: 'toneVoiceId', type: 'string'}),
        defineField({name: 'rewriteStrengthId', type: 'string'}),
        defineField({name: 'qualityScore', type: 'number'}),
        defineField({name: 'generatedAt', type: 'datetime'}),
      ],
    }),
    defineField({
      name: 'contentStrategy',
      type: 'string',
      title: 'Content Strategy',
      group: 'seo',
      options: {
        list: [
          {title: '🎯 Indirect Marketing', value: 'indirect-marketing'},
          {title: '🏋️ General Sport Content', value: 'general-sport'},
          {title: '📣 Direct Marketing', value: 'direct-marketing'},
          {title: '⚔️ App Comparison', value: 'competitor-comparison'},
          {title: '📚 Educational / How-To', value: 'educational'},
          {title: '🔥 Trending / Hot Take', value: 'trending-topic'},
          {title: '👤 User Story / Case Study', value: 'user-story'},
          {title: '✏️ Custom', value: 'custom'},
        ],
      },
    }),
    defineField({
      name: 'toneVoice',
      type: 'string',
      title: 'Tone of Voice',
      group: 'seo',
      options: {
        list: [
          {title: '🎓 Academic', value: 'academic'},
          {title: '🎩 Formal & Professional', value: 'formal'},
          {title: '🌍 Neutral & Clear', value: 'neutral'},
          {title: '💬 Natural & Conversational', value: 'conversational'},
        ],
      },
    }),
    defineField({
      name: 'rewriteStrength',
      type: 'string',
      title: 'Humanization Level',
      group: 'seo',
      options: {
        list: [
          {title: '🪶 Light (No rewrite)', value: 'light'},
          {title: '⚖️ Balanced (~25% changed)', value: 'balanced'},
          {title: '🔨 Strong (~50% restructured)', value: 'strong'},
        ],
      },
    }),
    defineField({
      name: 'targetCountry',
      type: 'string',
      title: 'Target Country (SEO)',
      group: 'seo',
      description: 'Geo-targeted keywords and cultural context',
      options: {
        list: [
          {title: '🇺🇸 United States', value: 'us'},
          {title: '🇬🇧 United Kingdom', value: 'gb'},
          {title: '🇨🇦 Canada', value: 'ca'},
          {title: '🇦🇺 Australia', value: 'au'},
          {title: '🇩🇪 Germany', value: 'de'},
          {title: '🇫🇷 France', value: 'fr'},
          {title: '🇪🇸 Spain', value: 'es'},
          {title: '🇳🇱 Netherlands', value: 'nl'},
          {title: '🇮🇹 Italy', value: 'it'},
          {title: '🇧🇷 Brazil', value: 'br'},
          {title: '🇯🇵 Japan', value: 'jp'},
          {title: '🇮🇳 India', value: 'in'},
          {title: '🇿🇦 South Africa', value: 'za'},
        ],
      },
    }),
    defineField({
      name: 'authorVoice',
      type: 'string',
      title: 'Author Voice (Optional)',
      group: 'seo',
      description:
        'Write as if you are... (e.g., "a certified strength coach with 10+ years experience")',
    }),
  ],
  preview: {
    select: {title: 'title', author: 'author', date: 'publishedAt', media: 'coverImage'},
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `${selection.author} • ${selection.date ? new Date(selection.date).toLocaleDateString() : 'Draft'}`,
        media: selection.media,
      }
    },
  },
})
