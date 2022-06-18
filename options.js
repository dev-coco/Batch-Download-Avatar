/* global chrome, alert, fetch */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('start').addEventListener('click', start)
  document.getElementById('copy').addEventListener('click', copyResult)
  document.getElementById('download').addEventListener('click', download)
})

function copyResult () {
  chrome.storage.local.get(({
    saveArray
  }) => {
    copy(unique(saveArray).join(',').replace(/,/g, '\n'))
    alert(`已排除重复，复制结果: ${unique(saveArray).length}个`)
  })
}

function unique (data) {
  return Array.from(new Set(data))
}

async function start () {
  chrome.storage.local.clear()
  const getSelect = document.getElementById('gender')
  const index = getSelect.selectedIndex
  let genderStr, minAgeStr, maxAgeStr
  if (index === 0) {
    genderStr = ''
  } else if (index === 1) {
    genderStr = 'gender=male'
  } else if (index === 2) {
    genderStr = 'gender=female'
  }
  const minAge = document.getElementById('minAge').value
  if (minAge === '') {
    minAgeStr = ''
  } else {
    minAgeStr = '&minimum_age=' + minAge
  }
  var maxAge = document.getElementById('maxAge').value;
  if (maxAge === '') {
    maxAgeStr = ''
  } else {
    maxAgeStr = '&maximum_age=' + maxAge
  }
  const avatarCount = document.getElementById('avatarCount').value
  if (avatarCount === '') {
    return
  }
  const url = []
  for (let k = 0; k < avatarCount; k++) {
    const response = await fetch(`https://fakeface.rest/face/json?${genderStr}${minAgeStr}${maxAgeStr}`)
    const text = await response.text()
    const imageUrl = JSON.parse(text).image_url
    url.push(imageUrl)
    document.getElementById('count').innerText = k + 1
    chrome.storage.local.set({
      saveArray: url
    })
  }
  const speechInstance = new window.SpeechSynthesisUtterance('头像生成完成')
  window.speechSynthesis.speak(speechInstance)
}

function copy (str) {
  const input = document.createElement('textarea')
  document.body.appendChild(input)
  input.value = str
  input.focus()
  input.select()
  document.execCommand('copy')
  input.remove()
}

async function download () {
  const getSelect = document.getElementById('gender')
  const index = getSelect.selectedIndex
  let genderStr, minAgeStr, maxAgeStr
  if (index === 0) {
    genderStr = ''
  } else if (index === 1) {
    genderStr = 'gender=male'
  } else if (index === 2) {
    genderStr = 'gender=female'
  }
  const minAge = document.getElementById('minAge').value
  if (minAge === '') {
    minAgeStr = ''
  } else {
    minAgeStr = '&minimum_age=' + minAge
  }
  const maxAge = document.getElementById('maxAge').value
  if (maxAge === '') {
    maxAgeStr = ''
  } else {
    maxAgeStr = '&maximum_age=' + maxAge
  }
  const avatarCount = document.getElementById('avatarCount').value
  if (avatarCount === '') {
    return
  }
  for (let i = 0; i < avatarCount; i++) {
    const response = await fetch(`https://fakeface.rest/face/json?${genderStr}${minAgeStr}${maxAgeStr}`)
    const text = await response.text()
    const imageUrl = JSON.parse(text).image_url
    const elt = document.createElement('a')
    elt.setAttribute('href', imageUrl)
    elt.setAttribute('download', 'file.png')
    elt.style.display = 'none'
    document.body.appendChild(elt)
    elt.click()
    document.body.removeChild(elt)
  }
  const speechInstance = new window.SpeechSynthesisUtterance('头像下载完成')
  window.speechSynthesis.speak(speechInstance)
}
