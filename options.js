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
  const gender = document.getElementById('gender').value
  const minAge = document.getElementById('minAge').value
  var maxAge = document.getElementById('maxAge').value;
  const avatarCount = document.getElementById('avatarCount').value
  if (avatarCount === '') return
  const url = []
  for (let k = 0; k < avatarCount; k++) {
    const imageUrl = await getImageUrl(gender, minAge, maxAge)
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
  const gender = document.getElementById('gender').value
  const minAge = document.getElementById('minAge').value
  const maxAge = document.getElementById('maxAge').value
  const avatarCount = document.getElementById('avatarCount').value
  if (avatarCount === '') return
  for (let i = 0; i < avatarCount; i++) {
    const imageUrl = await getImageUrl(gender, minAge, maxAge)
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

// 获取图片链接
async function getImageUrl (gender, minAge, maxAge) {
  const obj = { gender, minAge, maxAge }
  const response = await fetch(`https://script.google.com/macros/s/AKfycbxReprZ-S3HlGDxp-0t3hkphN7pKMRzb83RncbDmqN1sVwHMbq0DqmaonHjgfoiTCRw/exec?${new URLSearchParams(obj).toString()}`)
  const text = await response.text()
  return text
}