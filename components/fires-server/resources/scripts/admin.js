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

// ------------------------------------------------------------
// Dataset Changes UI
// ------------------------------------------------------------
const entityKindSelector = document.getElementById('entity_kind')
const entityKeyInput = document.getElementById('entity_key')
const entityKeyHint = document.getElementById('entity_key-hint')
const entityKeyValidators = {
  domain: {
    minLength: 3,
    maxLength: 256,
    pattern: '([^\\.]{1,63}\\.)+([^\\.]{1,63})',
    placeholder: 'domain.example',
    hint: 'Must be a valid domain name, special characters will be encoded automatically',
  },
  actor: {
    type: 'url',
    placeholder: 'https://social.example/actor/123',
    pattern: 'https://(.+)',
    minLength: 11,
    hint: 'Must be a valid URL using the https protocol',
  },
}

if (
  entityKeyInput instanceof HTMLInputElement &&
  entityKindSelector instanceof HTMLSelectElement &&
  entityKeyHint instanceof HTMLElement
) {
  function updateInput(selected) {
    const validator = entityKeyValidators[selected]
    if (validator) {
      entityKeyInput.setAttribute('placeholder', validator.placeholder ?? '')
      entityKeyInput.setAttribute('type', validator.type ?? 'text')

      if (validator.minLength) {
        entityKeyInput.setAttribute('minLength', validator.minLength)
      } else {
        entityKeyInput.removeAttribute('minLength')
      }

      if (validator.maxLength) {
        entityKeyInput.setAttribute('maxLength', validator.maxLength)
      } else {
        entityKeyInput.removeAttribute('maxLength')
      }

      if (validator.pattern) {
        entityKeyInput.setAttribute('pattern', validator.pattern)
      } else {
        entityKeyInput.removeAttribute('pattern')
      }

      if (validator.hint) {
        entityKeyHint.classList.remove('d-hidden')
        entityKeyHint.textContent = validator.hint
      } else {
        entityKeyHint.classList.add('d-hidden')
        entityKeyHint.textContent = ''
      }
    } else {
      entityKeyInput.setAttribute('type', 'text')
      entityKeyInput.removeAttribute('minLength')
      entityKeyInput.removeAttribute('maxLength')
      entityKeyInput.removeAttribute('pattern')
      entityKeyInput.removeAttribute('placeholder')
      entityKeyHint.classList.add('d-hidden')
    }
  }

  updateInput(entityKindSelector.value)
  entityKindSelector.addEventListener('change', function (ev) {
    updateInput(ev.currentTarget.value)
  })
}

const importReviewForm = document.getElementById('import-review')
const missingCount = document.getElementById('missing-count')
if (importReviewForm && missingCount) {
  importReviewForm.addEventListener('click', (event) => {
    if (!event.target) return
    if (event.target.classList.contains('remove-row')) {
      event.preventDefault()
      event.stopPropagation()

      const container = event.target.parentNode.parentNode

      container.removeChild(event.target.parentNode)
      if (container.children.length == 1) {
        document.getElementById('no-missing-record').classList.remove('d-hidden')
      }

      missingCount.textContent = container.children.length - 1
    }
  })
}

const accountsForm = document.getElementById('accounts-form')
if (accountsForm instanceof HTMLFormElement) {
  const passwordInput = document.getElementById('account-password')
  const passwordConfirmation = document.getElementById('password-confirmation')

  passwordConfirmation.classList.add('d-hidden')
  passwordInput.addEventListener('input', (e) => {
    if (e.target.value.length > 0) {
      passwordConfirmation.classList.remove('d-hidden')
    } else {
      passwordConfirmation.classList.add('d-hidden')
    }
  })

  // Permissions logic:
  const userIsAdmin = document.getElementById('is-user-admin')
  const userPermissions = document.getElementById('user-permissions')
  if (userIsAdmin instanceof HTMLInputElement && userPermissions instanceof HTMLDivElement) {
    if (userIsAdmin.checked) {
      userPermissions.classList.add('d-hidden')
    }

    userIsAdmin.addEventListener('change', (ev) => {
      if (userIsAdmin.checked) {
        userPermissions.classList.add('d-hidden')
      } else {
        userPermissions.classList.remove('d-hidden')
      }
    })
  }
}
