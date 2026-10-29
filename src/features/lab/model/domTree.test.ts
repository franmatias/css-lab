import { describe, expect, it } from 'vitest'
import { createDomTree } from './domTree'
import { evaluateSelector } from './selectorEvaluator'

describe('createDomTree', () => {
  it('builds a sanitized hierarchy and identifies matching elements', () => {
    const evaluation = evaluateSelector({
      html: '<main class="demo"><p id="target" class="selected">Texto</p><script>alert(1)</script></main>',
      css: '',
      selector: '.selected',
    })

    expect(createDomTree(evaluation)).toEqual([
      {
        key: 2,
        label: '<body>',
        matches: false,
        children: [
          {
            key: 3,
            label: '<main class="demo">',
            matches: false,
            children: [
              {
                key: 4,
                label: '<p class="selected">',
                matches: true,
                children: [],
              },
            ],
          },
        ],
      },
    ])
  })
})
