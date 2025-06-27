// @ts-nocheck
import './lib/copyable'

function addTranslation() {
  const template = document.getElementById('new-translation')
  const rows = document.querySelectorAll('.translation-row')

  if (!template) {
    throw new Error('Missing #new-translation element')
  }

  const templateContent = template.content.cloneNode(true)
  const newId = `translation-${rows.length}`

  const row = document.createElement('div')
  row.id = newId
  row.classList.add('translation-row')
  row.appendChild(templateContent)

  row
    .querySelectorAll('button.remove-translation')
    .forEach((removeButton) => (removeButton.dataset.translationId = newId))

  row.querySelectorAll('[name]').forEach((element) => {
    const oldName = element.getAttribute('name')

    element.setAttribute('name', oldName.replace('translations[]', `translations[${rows.length}]`))
    element.id = element.id.replace('translations--', `translations-${rows.length}-`)
  })

  row.querySelectorAll('[for]').forEach((element) => {
    const oldFor = element.getAttribute('for')
    element.setAttribute('for', oldFor.replace('translations--', `translations-${rows.length}-`))
  })

  document.getElementById('translations-empty').classList.add('d-hidden')
  document.getElementById('translation-rows').appendChild(row)

  document.getElementById(`translations-${rows.length}-locale`).focus()
}

function removeTranslation(target) {
  const translationId = target.dataset.translationId
  if (!translationId) {
    return
  }

  const translationRow = document.getElementById(translationId)
  if (translationRow && translationRow.parentNode) {
    translationRow.parentNode.removeChild(translationRow)
  }

  const rows = document.querySelectorAll('.translation-row')
  if (rows.length === 0) {
    document.getElementById('translations-empty').classList.remove('d-hidden')
  }
}

document.addEventListener('click', (event) => {
  if (!event.target) return
  if (event.target.matches('button.remove-translation')) {
    removeTranslation(event.target)
  }

  if (event.target.matches('button#add-translation')) {
    addTranslation()
  }
})
