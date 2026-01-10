const { expect, beforeEach } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)

  await page.getByRole('button', { name: 'create' }).click()

  const notiDiv = page.locator('.notification')
  await expect(notiDiv).toContainText(`${title} by ${author} added`)
  await expect(notiDiv).toHaveCSS('border-style', 'solid')
  await expect(notiDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
}

export { loginWith, createBlog }