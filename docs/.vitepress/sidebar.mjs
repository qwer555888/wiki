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

function getDateFolders(yearPath) {
  const dates = []
  if (!fs.existsSync(yearPath)) return dates

  const items = fs.readdirSync(yearPath, { withFileTypes: true })
  for (const item of items) {
    if (item.isDirectory() && /^\d{2}-\d{2}$/.test(item.name)) {
      dates.push(item.name)
    }
  }
  return dates.sort().reverse()
}

// Supported file types and their icons
const FILE_TYPE_CONFIG = {
  '.md': { icon: '' },
  '.pdf': { icon: '📄 ' },
  '.html': { icon: '🌐 ' },
  '.docx': { icon: '📝 ' },
  '.xlsx': { icon: '📊 ' }
}

const SUPPORTED_EXTENSIONS = Object.keys(FILE_TYPE_CONFIG)

function getFiles(datePath) {
  const files = []
  if (!fs.existsSync(datePath)) return files

  const items = fs.readdirSync(datePath, { withFileTypes: true })
  for (const item of items) {
    if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase()
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        files.push(item.name)
      }
    }
  }
  return files.sort()
}

function getFileIcon(filename) {
  const ext = path.extname(filename).toLowerCase()
  return FILE_TYPE_CONFIG[ext]?.icon || ''
}

function isMarkdownFile(filename) {
  return filename.toLowerCase().endsWith('.md')
}

function parseDate(folderName) {
  const match = folderName.match(/^(\d{2})-(\d{2})$/)
  if (match) {
    return {
      month: match[1],
      day: match[2]
    }
  }
  return null
}

function extractTitle(filename) {
  // Remove extension and number prefix (e.g., "01-标题.md" -> "标题", "01-文档.pdf" -> "文档")
  const ext = path.extname(filename)
  const withoutExt = filename.slice(0, -ext.length)
  const match = withoutExt.match(/^\d+-(.+)$/)
  return match ? match[1] : withoutExt
}

export function generateSidebar() {
  const notesPath = path.resolve('docs/notes')
  const years = getYearFolders(notesPath)

  const sidebar = {
    '/notes/': []
  }

  for (const year of years) {
    const yearPath = path.join(notesPath, year)
    const dateFolders = getDateFolders(yearPath)

    const dateItems = []
    for (const dateFolder of dateFolders) {
      const datePath = path.join(yearPath, dateFolder)
      const files = getFiles(datePath)

      const fileItems = files.map(file => {
        const title = extractTitle(file)
        const icon = getFileIcon(file)
        const filePath = `/notes/${year}/${dateFolder}/${file}`

        if (isMarkdownFile(file)) {
          // Markdown files use VitePress routing (without .md extension)
          return {
            text: `${icon}${title}`,
            link: filePath.replace('.md', '')
          }
        } else {
          // Other file types: direct link to file with target=_blank
          return {
            text: `${icon}${title}`,
            link: filePath,
            target: '_blank'
          }
        }
      })

      if (fileItems.length > 0) {
        const date = parseDate(dateFolder)
        const dateText = date ? `${date.month}-${date.day}` : dateFolder
        dateItems.push({
          text: dateText,
          collapsed: false,
          items: fileItems
        })
      }
    }

    if (dateItems.length > 0) {
      sidebar['/notes/'].push({
        text: `${year}年`,
        collapsed: year !== new Date().getFullYear().toString(),
        items: dateItems
      })
    }
  }

  return sidebar['/notes/']
}
