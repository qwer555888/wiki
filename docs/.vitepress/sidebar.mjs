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

const NON_MD_EXTENSIONS = ['.pdf', '.html', '.docx', '.xlsx']

function getMarkdownFiles(datePath) {
  const files = []
  if (!fs.existsSync(datePath)) return files

  const items = fs.readdirSync(datePath, { withFileTypes: true })
  for (const item of items) {
    if (item.isFile() && item.name.toLowerCase().endsWith('.md')) {
      files.push(item.name)
    }
  }
  return files.sort()
}

function getPublicFiles(publicDatePath) {
  const files = []
  if (!fs.existsSync(publicDatePath)) return files

  const items = fs.readdirSync(publicDatePath, { withFileTypes: true })
  for (const item of items) {
    if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase()
      if (NON_MD_EXTENSIONS.includes(ext)) {
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
  const publicNotesPath = path.resolve('docs/public/notes')
  const years = getYearFolders(notesPath)

  const sidebar = {
    '/notes/': []
  }

  for (const year of years) {
    const yearPath = path.join(notesPath, year)
    const publicYearPath = path.join(publicNotesPath, year)
    const dateFolders = getDateFolders(yearPath)

    const dateItems = []
    for (const dateFolder of dateFolders) {
      const datePath = path.join(yearPath, dateFolder)
      const publicDatePath = path.join(publicYearPath, dateFolder)

      // Get .md files from docs/notes/
      const mdFiles = getMarkdownFiles(datePath)
      // Get non-md files from docs/public/notes/
      const publicFiles = getPublicFiles(publicDatePath)

      const fileItems = []

      // Process .md files
      for (const file of mdFiles) {
        const title = extractTitle(file)
        const icon = getFileIcon(file)
        const filePath = `/notes/${year}/${dateFolder}/${file}`
        fileItems.push({
          text: `${icon}${title}`,
          link: filePath.replace('.md', '')
        })
      }

      // Process non-md files from public directory
      for (const file of publicFiles) {
        const title = extractTitle(file)
        const icon = getFileIcon(file)
        // Links to public files - VitePress base path /wiki is prepended automatically
        const filePath = `/notes/${year}/${dateFolder}/${file}`
        fileItems.push({
          text: `${icon}${title}`,
          link: filePath,
          target: '_blank'
        })
      }

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
