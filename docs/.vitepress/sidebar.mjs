import fs from 'fs'
import path from 'path'

function getYearFolders(notesPath) {
  const years = []
  if (!fs.existsSync(notesPath)) return years

  const items = fs.readdirSync(notesPath, { withFileTypes: true })
  for (const item of items) {
    if (item.isDirectory() && /^\d{4}$/.test(item.name)) {
      years.push(item.name)
    }
  }
  return years.sort().reverse()
}

function getMarkdownFiles(yearPath) {
  const files = []
  if (!fs.existsSync(yearPath)) return files

  const items = fs.readdirSync(yearPath, { withFileTypes: true })
  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.md')) {
      files.push(item.name)
    }
  }
  return files.sort().reverse()
}

function parseDate(filename) {
  const match = filename.match(/^(\d{2})-(\d{2})\.md$/)
  if (match) {
    return {
      month: match[1],
      day: match[2]
    }
  }
  return null
}

export function generateSidebar() {
  const notesPath = path.resolve('docs/notes')
  const years = getYearFolders(notesPath)

  const sidebar = {
    '/notes/': []
  }

  for (const year of years) {
    const yearPath = path.join(notesPath, year)
    const files = getMarkdownFiles(yearPath)

    const items = files.map(file => {
      const date = parseDate(file)
      const text = date ? `${date.month}-${date.day}` : file.replace('.md', '')
      return {
        text: text,
        link: `/notes/${year}/${file.replace('.md', '')}`
      }
    })

    if (items.length > 0) {
      sidebar['/notes/'].push({
        text: `${year}年`,
        collapsed: year !== new Date().getFullYear().toString(),
        items: items
      })
    }
  }

  return sidebar['/notes/']
}
