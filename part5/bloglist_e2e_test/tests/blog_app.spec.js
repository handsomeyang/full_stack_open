const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({page}) => {
    const locator = page.getByRole('button', { name: 'login' })
    await expect(locator).toBeVisible()

    await locator.click()
    await expect(await page.getByLabel('username')).toBeVisible()
    await expect(await page.getByLabel('password')).toBeVisible()
    await expect(await page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({page}) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const notiDiv = page.locator('.notification')
      await expect(notiDiv).toContainText('wrong credentials')
      await expect(notiDiv).toHaveCSS('border-style', 'solid')
      await expect(notiDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a new blog created by mluukkai', 'Matti Luukkainen', 'http://mluukkai.com')
    })

    describe('and a blog exists for the logged in user', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'first blog created by mluukkai', 'Matti Luukkainen', 'http://mluukkai.com')
      })

      test('the blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        const locator = page.getByRole('button', { name: 'like' })
        await expect(locator).toBeVisible()
        await expect(page.getByText('likes 0')).toBeVisible()

        await locator.click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('the blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.once('dialog', async dialog => {
          console.log(dialog.message())
          await dialog.accept()
        });

        const locator = page.getByRole('button', { name: 'remove' })
        await expect(locator).toBeVisible()
        await locator.click()

        const notiDiv = page.locator('.notification')
        await expect(notiDiv).toContainText('Blog first blog created by mluukkai by Matti Luukkainen removed')
        await expect(notiDiv).toHaveCSS('border-style', 'solid')
        await expect(notiDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      })

      describe('and a blog exists for another user', () => {
        beforeEach(async ({page, request}) => {
          await request.post('/api/users', {
            data: {
              name: 'Root',
              username: 'root',
              password: 'sekret'
            }
          })

          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'root', 'sekret')

          await createBlog(page, 'first blog created by root', 'Root', 'http://root.com')
        })

        test('this user can not see the other blog\'s delete button', async ({ page }) => {
          const otherBlogText = page.getByText('first blog created by mluukkai')
          const otherBlogElement = otherBlogText.locator('..')

          await otherBlogElement.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

        test('blogs are always sorted in descending order of the likes', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).first().click()
          await page.getByRole('button', { name: 'view' }).last().click()

          const firstLike = page.waitForResponse(response =>
            response.url().includes('/api/blogs/') && response.request().method() === 'PUT'
          )
          await page.getByRole('button', { name: 'like' }).last().click()
          await firstLike

          const likesStrings = await page.locator('.likesCount').allTextContents()
          const likesNumbers = likesStrings.map(s => parseInt(s.split(' ')[1]))
          const sortedLikes = [...likesNumbers].sort((a, b) => b - a)
          expect(likesNumbers).toEqual(sortedLikes)
        })
      })
    })
  })
})