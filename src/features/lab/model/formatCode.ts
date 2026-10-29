export interface FormattingOptions {
  useTabs: boolean
  tabWidth: number
}

function expandBlockBoundaries(code: string): string {
  const blocks = new Set(
    'address article aside blockquote body caption dd details dialog div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header html li main nav ol p pre section summary table tbody td tfoot th thead tr ul'.split(
      ' ',
    ),
  )
  const protectedTags = new Set(['pre', 'textarea', 'script', 'style'])
  const tokens = code.matchAll(/<!--[\s\S]*?-->|<\/?[a-zA-Z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/g)
  const breaks: number[] = []
  let previousEnd = -1
  let previousName = ''
  let protectedTag: string | null = null
  for (const token of tokens) {
    const name = /^<\/?([\w:-]+)/.exec(token[0])?.[1]?.toLowerCase() ?? ''
    const closing = token[0].startsWith('</')
    if (
      !protectedTag &&
      previousEnd === token.index &&
      blocks.has(previousName) &&
      blocks.has(name)
    )
      breaks.push(token.index!)
    if (protectedTag && closing && name === protectedTag) protectedTag = null
    else if (!protectedTag && !closing && protectedTags.has(name)) protectedTag = name
    previousEnd = token.index! + token[0].length
    previousName = name
  }
  let result = code
  for (const index of breaks.reverse()) result = `${result.slice(0, index)}\n${result.slice(index)}`
  return result
}

export async function formatCode(
  code: string,
  language: 'html' | 'css',
  options: FormattingOptions,
): Promise<string> {
  const { format } = await import('prettier/standalone')
  const plugin =
    language === 'html'
      ? await import('prettier/plugins/html')
      : await import('prettier/plugins/postcss')
  return format(language === 'html' ? expandBlockBoundaries(code) : code, {
    parser: language === 'html' ? 'html' : 'css',
    plugins: [plugin],
    useTabs: options.useTabs,
    tabWidth: options.tabWidth,
    printWidth: 72,
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf',
  })
}
