import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'gestion-tareas-tasks'

const seedTasks = async (page, tasks = []) => {
  await page.addInitScript(({ key, initialTasks }) => {
    localStorage.setItem(key, JSON.stringify(initialTasks))
  }, { key: STORAGE_KEY, initialTasks: tasks })
}

test.describe('Gestión de tareas (E2E)', () => {
  test('persiste y carga tareas existentes', async ({ page }) => {
    const seededTasks = [
      { id: 'e2e-1', title: 'Persistencia E2E', description: 'Dato almacenado', completed: false },
    ]
    await seedTasks(page, seededTasks)

    await page.goto('/')

    await expect(page.getByText('Persistencia E2E')).toBeVisible()
    await expect(page.getByText('Dato almacenado')).toBeVisible()
  })

  test('crea y almacena una nueva tarea', async ({ page }) => {
    await seedTasks(page, [])
    await page.goto('/')

    await page.getByRole('button', { name: /agregar tarea/i }).click()
    const modal = page.getByRole('dialog')
    await modal.getByLabel('Título').fill('Tarea E2E creada')
    await modal.getByLabel('Descripción').fill('Persistida en localStorage')
    await modal.getByRole('button', { name: /guardar/i }).click()

    await expect(page.getByText('Tarea E2E creada')).toBeVisible()
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '[]'), STORAGE_KEY)
    expect(stored.some((task) => task.title === 'Tarea E2E creada')).toBeTruthy()
  })

  test('edita una tarea existente', async ({ page }) => {
    const seededTasks = [
      { id: 'e2e-edit', title: 'Editar E2E', description: 'Original', completed: false },
    ]
    await seedTasks(page, seededTasks)
    await page.goto('/')

    await page.getByRole('button', { name: /editar/i }).click()
    const modal = page.getByRole('dialog')
    await modal.getByLabel('Título').fill('Editar E2E final')
    await modal.getByRole('button', { name: /guardar/i }).click()

    await expect(page.getByText('Editar E2E final')).toBeVisible()
  })

  test('marca una tarea como completada', async ({ page }) => {
    const seededTasks = [
      { id: 'e2e-complete', title: 'Completar E2E', description: '', completed: false },
    ]
    await seedTasks(page, seededTasks)
    await page.goto('/')

    const checkbox = page.getByRole('checkbox', { name: /marcar/i })
    await checkbox.check()

    await expect(checkbox).toBeChecked()
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '[]'), STORAGE_KEY)
    expect(stored[0].completed).toBeTruthy()
  })

  test('elimina una tarea y confirma el diálogo', async ({ page }) => {
    const seededTasks = [
      { id: 'e2e-delete', title: 'Eliminar E2E', description: '', completed: false },
    ]
    await seedTasks(page, seededTasks)
    await page.goto('/')

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: /eliminar/i }).click()

    await expect(page.getByText('Eliminar E2E')).not.toBeVisible()
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '[]'), STORAGE_KEY)
    expect(stored).toHaveLength(0)
  })
})
