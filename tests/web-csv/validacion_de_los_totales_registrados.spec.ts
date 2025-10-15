import { test, expect } from "@playwright/test";

test("validacion de los totales registrados", async ({ page }) => {
  await page.goto("http://localhost:3000/carga_masiva");
  await page.getByRole("button", { name: "Choose File" }).click();
  await page
    .getByRole("button", { name: "Choose File" })
    .setInputFiles("./tests/ejemplos-csv/ejemplo.csv");
  await page.getByRole("button", { name: "Procesar Archivo" }).click();
  await expect(page.getByText("Total de Registros: 2")).toBeVisible();
});
