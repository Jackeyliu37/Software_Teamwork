import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { ModelProfilesPage } from './model-profiles'

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  })
}

function modelProfile(overrides: Record<string, unknown> = {}) {
  return {
    apiKeyConfigured: true,
    baseUrl: 'https://llm.example.com/v1',
    createdAt: '2026-07-01T00:00:00.000Z',
    defaultParameters: { max_tokens: 2048 },
    dimensions: null,
    enabled: true,
    id: 'mp-chat',
    isDefault: false,
    model: 'gpt-4o-mini',
    name: 'Chat profile',
    provider: 'openai_compatible',
    purpose: 'chat',
    supportsStreaming: true,
    timeoutMs: 60000,
    topN: null,
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('ModelProfilesPage status controls', () => {
  it('updates enabled/default flags without sending a blank api key', async () => {
    let patchBody: unknown
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init)
      const url = new URL(request.url)

      if (request.method === 'PATCH' && url.pathname.endsWith('/admin/model-profiles/mp-chat')) {
        patchBody = await request.clone().json()
        return jsonResponse({
          data: modelProfile({ enabled: false, isDefault: true }),
          requestId: 'req-update',
        })
      }

      if (request.method === 'GET' && url.pathname.endsWith('/admin/model-profiles')) {
        return jsonResponse({
          data: [modelProfile()],
          requestId: 'req-list',
        })
      }

      return jsonResponse({ data: {}, requestId: 'req-default' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    renderWithProviders(<ModelProfilesPage />)

    expect(await screen.findByText('Chat profile')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '编辑 Chat profile' }))

    const enabledCheckbox = await screen.findByRole('checkbox', { name: /^启用$/ })
    const defaultCheckbox = screen.getByRole('checkbox', { name: /^设为默认模型$/ })
    const apiKeyInput = screen.getByLabelText(/^API Key$/)

    expect(enabledCheckbox).toBeChecked()
    expect(defaultCheckbox).not.toBeChecked()
    expect(apiKeyInput).toHaveValue('')

    await user.click(enabledCheckbox)
    await user.click(defaultCheckbox)
    await user.click(screen.getByRole('button', { name: /^保存$/ }))

    await waitFor(() => expect(patchBody).toBeDefined())
    expect(patchBody).toMatchObject({
      enabled: false,
      isDefault: true,
      name: 'Chat profile',
    })
    expect(patchBody).not.toHaveProperty('apiKey')
  })

  it('creates a profile with selected enabled/default flags', async () => {
    let postBody: unknown
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init)
      const url = new URL(request.url)

      if (request.method === 'POST' && url.pathname.endsWith('/admin/model-profiles')) {
        postBody = await request.clone().json()
        return jsonResponse({
          data: modelProfile({
            enabled: false,
            id: 'mp-created',
            isDefault: true,
            name: 'Created profile',
          }),
          requestId: 'req-create',
        })
      }

      if (request.method === 'GET' && url.pathname.endsWith('/admin/model-profiles')) {
        return jsonResponse({
          data: [modelProfile()],
          requestId: 'req-list',
        })
      }

      return jsonResponse({ data: {}, requestId: 'req-default' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    renderWithProviders(<ModelProfilesPage />)

    expect(await screen.findByText('Chat profile')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /^新建模型$/ }))

    await user.type(screen.getByLabelText(/^名称/), 'Created profile')
    await user.type(screen.getByLabelText(/^Base URL/), 'https://created.example.com/v1')
    await user.type(screen.getByLabelText(/^模型名称/), 'created-model')
    await user.type(screen.getByLabelText(/^API Key/), 'sk-created')

    const enabledCheckbox = screen.getByRole('checkbox', { name: /^启用$/ })
    const defaultCheckbox = screen.getByRole('checkbox', { name: /^设为默认模型$/ })
    expect(enabledCheckbox).toBeChecked()
    expect(defaultCheckbox).not.toBeChecked()

    await user.click(enabledCheckbox)
    await user.click(defaultCheckbox)
    await user.click(screen.getByRole('button', { name: /^创建$/ }))

    await waitFor(() => expect(postBody).toBeDefined())
    expect(postBody).toMatchObject({
      apiKey: 'sk-created',
      enabled: false,
      isDefault: true,
      model: 'created-model',
      name: 'Created profile',
    })
  })
})
