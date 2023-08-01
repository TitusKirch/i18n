import { test, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, url, createPage } from './utils'
import { getText } from './helper'

await setup({
  rootDir: fileURLToPath(new URL(`./fixtures/basic_app_config`, import.meta.url)),
  browser: true,
  // prerender: true,
  // overrides
  nuxtConfig: {
    i18n: {
      locales: ['en', 'fr'],
      defaultLocale: 'en'
    }
  }
})

test('basic app config', async () => {
  const home = url('/')
  const page = await createPage()
  await page.goto(home)

  // vue-i18n using
  expect(await getText(page, '#vue-i18n-usage p')).toEqual('Welcome app config')

  // URL path localizing with `useLocalePath`
  expect(await page.locator('#locale-path-usages .name a').getAttribute('href')).toEqual('/')
  expect(await page.locator('#locale-path-usages .path a').getAttribute('href')).toEqual('/')
  expect(await page.locator('#locale-path-usages .named-with-locale a').getAttribute('href')).toEqual('/fr')

  // Language switching path localizing with `useSwitchLocalePath`
  expect(await page.locator('#switch-locale-path-usages .switch-to-en a').getAttribute('href')).toEqual('/')
  expect(await page.locator('#switch-locale-path-usages .switch-to-fr a').getAttribute('href')).toEqual('/fr')

  // URL path with Route object with `useLocaleRoute`
  const button = await page.locator('#locale-route-usages button')
  await button.click()
  await page.waitForTimeout(100)
  expect(await getText(page, '#profile-page')).toEqual('This is profile page')
  expect(await page.url()).include('/user/profile?foo=1')
})
