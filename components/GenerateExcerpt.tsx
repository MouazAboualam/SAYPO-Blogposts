import {useFormValue} from 'sanity'
import {Button, Stack} from '@sanity/ui'

export function GenerateExcerptInput(props: any) {
  const title = useFormValue(['title']) as string

  const handleGenerate = () => {
    if (!title) return
    const excerpt = title.length > 150 ? title.slice(0, 147) + '...' : title
    props.onChange(excerpt)
  }

  return (
    <Stack space={2}>
      <Button mode="ghost" tone="primary" onClick={handleGenerate} disabled={!title}>
        ✨ Auto-generate from title
      </Button>
      {props.renderDefault(props)}
    </Stack>
  )
}
