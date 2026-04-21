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
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Content Body',
      of: [{type: 'block'}],
      group: 'content',
      validation: (Rule) => Rule.required(),
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
        defineField({name: 'metaTitle', type: 'string'}),
        defineField({name: 'metaDescription', type: 'text'}),
        defineField({name: 'keywords', type: 'array', of: [{type: 'string'}]}),
      ],
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
