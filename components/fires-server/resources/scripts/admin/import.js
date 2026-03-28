;(() => {
  const reviewForm = document.getElementById('import-review')
  const manageLabelsDialog = document.getElementById('import-manage-labels')
  if (!(reviewForm instanceof HTMLFormElement && manageLabelsDialog instanceof HTMLDialogElement)) {
    return
  }

  const html = document.documentElement

  const isOpenClass = 'modal-is-open'

  /**
   * @type {HTMLDialogElement|null}
   */
  let visibleModal = null

  /**
   *
   * @param {HTMLDialogElement} modal
   */
  const openModal = (modal) => {
    html.classList.add(isOpenClass)
    modal.showModal()
    visibleModal = modal
  }

  /**
   *
   * @param {HTMLDialogElement} modal
   */
  const closeModal = (modal) => {
    handleClose(modal)
    modal.close('cancel')
  }
  /**
   * @param {HTMLDialogElement} modal
   */
  const handleClose = (modal) => {
    html.classList.remove(isOpenClass)
    visibleModal = null
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && visibleModal) {
      closeModal(visibleModal)
    }
  })

  document.addEventListener('click', (event) => {
    if (!event.target || !(event.target instanceof HTMLButtonElement)) return

    // open modal button
    if (!visibleModal && event.target.dataset.row) {
      event.preventDefault()

      const row = event.target.dataset.row
      const rowComment = event.target.dataset.rowComment
      const labelInput = document.getElementById(`${row}-labels`)
      const commentInput = document.getElementById(`${row}-comment`)

      if (!(labelInput instanceof HTMLInputElement)) {
        return
      }

      const labels = labelInput.value.split(',').filter((v) => v !== '')

      manageLabelsDialog.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        if (!(input instanceof HTMLInputElement)) return
        if (labels.includes(input.value)) {
          input.setAttribute('checked', 'checked')
          input.checked = true
        } else {
          input.removeAttribute('checked')
          input.checked = false
        }
      })

      const commentTextarea = manageLabelsDialog.querySelector('input[name="comment"]')
      if (commentTextarea instanceof HTMLInputElement && commentInput instanceof HTMLInputElement) {
        commentTextarea.value = commentInput.value ?? ''
      }

      const rowCommentSection = manageLabelsDialog.querySelector('#manage-row-comment')
      const rowCommentField = manageLabelsDialog.querySelector('#manage-row-comment-text')
      if (rowCommentField instanceof HTMLParagraphElement) {
        if (!rowComment) {
          rowCommentSection?.classList.add('d-hidden')
        } else {
          rowCommentSection?.classList.remove('d-hidden')
          rowCommentField.innerText = rowComment
        }
      }

      manageLabelsDialog.dataset.row = row
      openModal(manageLabelsDialog)
    }

    // close modal button
    if (visibleModal && event.target.getAttribute('rel') === 'prev') {
      closeModal(visibleModal)
    }
  })

  manageLabelsDialog.addEventListener('close', (event) => {
    handleClose(manageLabelsDialog)
    if (!event.currentTarget || !(event.currentTarget instanceof HTMLDialogElement)) return
    if (event.currentTarget.returnValue == 'cancel') {
      return
    }

    const form = manageLabelsDialog.getElementsByTagName('form')[0]
    const formData = new FormData(form)

    const comment = formData.get('comment')?.toString()
    const labels = Array.from(formData.getAll('labels[]'))
    const row = manageLabelsDialog.dataset.row
    const labelInput = document.getElementById(`${row}-labels`)
    const commentInput = document.getElementById(`${row}-comment`)

    if (!(labelInput instanceof HTMLInputElement) || !(commentInput instanceof HTMLInputElement)) {
      return
    }

    labelInput.value = labels.join(',')
    if (comment) {
      commentInput.value = comment
    } else {
      commentInput.value = ''
    }

    console.log(`Set ${row} to ${labelInput.value}`)
  })

  manageLabelsDialog.querySelector('#cancel')?.addEventListener('click', () => {
    if (visibleModal === manageLabelsDialog) {
      manageLabelsDialog.dataset.row = undefined
      closeModal(visibleModal)
    }
  })
})()
