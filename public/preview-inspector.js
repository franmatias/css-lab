const token = document.querySelector('meta[name="csslab-inspection-token"]')?.content

document.addEventListener('click', (event) => {
  const node = event.target instanceof Element && event.target.closest('[data-csslab-node]')
  if (!node || !token) return
  event.preventDefault()
  parent.postMessage(
    {
      type: 'csslab-inspect',
      token,
      key: Number(node.getAttribute('data-csslab-node')),
    },
    '*',
  )
})
