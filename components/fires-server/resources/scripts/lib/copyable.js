document.querySelectorAll('fieldset[data-copyable]').forEach((copyableElement) => {
  const input = copyableElement.querySelector('input')
  if (!input) {
    return
  }

  const button = document.createElement('button')
  button.textContent = 'Copy'
  button.classList.add('copyable-btn', 'secondary')
  button.addEventListener('click', async (ev) => {
    ev.preventDefault()

    try {
      await navigator.clipboard.writeText(input.value)
    } catch (error) {
      console.error(error.message)
    }

    button.innerText = 'Copied!'
    setTimeout(() => {
      button.innerText = 'Copy'
    }, 1000)
  })

  copyableElement.appendChild(button)
})
