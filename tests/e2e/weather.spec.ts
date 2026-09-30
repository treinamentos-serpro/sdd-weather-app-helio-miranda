import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const cityResult = {
  id: 3448439,
  name: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
  admin1: 'São Paulo',
  country: 'Brasil',
};

const forecastResponse = {
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-09-30T14:00',
    temperature_2m: 22.4,
    weather_code: 0,
    relative_humidity_2m: 50,
    wind_speed_10m: 10,
    precipitation: 0,
    surface_pressure: 1013,
  },
  daily: {
    time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
    weather_code: [0, 1, 2, 3, 61],
    temperature_2m_min: [10, 11, 12, 13, 14],
    temperature_2m_max: [20, 21, 22, 23, 24],
    precipitation_probability_max: [0, 10, 20, 30, 80],
  },
};

async function mockWeatherApis(page: Page, geocodingResponse: unknown) {
  let forecastRequests = 0;

  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(geocodingResponse),
    });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(forecastResponse),
    });
  });

  return () => forecastRequests;
}

test('busca uma cidade, mostra a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      json: {
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            admin1: 'São Paulo',
            country: 'Brasil',
          },
        ],
      },
    });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      json: {
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2026-09-30T14:00',
          temperature_2m: 0,
          weather_code: 0,
          relative_humidity_2m: 50,
          wind_speed_10m: 10,
          precipitation: 0,
          surface_pressure: 1013,
        },
        daily: {
          time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
          weather_code: [0, 1, 2, 3, 61],
          temperature_2m_min: [0, 1, 2, 3, 4],
          temperature_2m_max: [10, 11, 12, 13, 14],
          precipitation_probability_max: [0, 10, 20, 30, 80],
        },
      },
    });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Cidades encontradas' })).toBeFocused();
  const cityOption = page.getByRole('button', { name: /São Paulo/ });
  await page.keyboard.press('Tab');
  await expect(cityOption).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'São Paulo', exact: true })).toBeVisible();
  const forecast = page.getByRole('region', { name: 'Previsão de 5 dias' });
  await expect(forecast).toBeVisible();
  await expect(forecast.getByRole('article')).toHaveCount(5);
  await expect(page.getByRole('group', { name: 'Unidade de temperatura' })).toBeVisible();

  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  await expect(page.getByText('32.0°F', { exact: true })).toBeVisible();
});

test('mostra estado vazio quando o geocoding retorna um objeto sem results', async ({ page }) => {
  const getForecastRequestCount = await mockWeatherApis(page, {});

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Pesquisar cidade' })).toHaveValue(
    'Cidade inexistente',
  );
  expect(getForecastRequestCount()).toBe(0);
});

test('busca vazia e composta por espaços não inicia solicitações externas', async ({ page }) => {
  let geocodingRequests = 0;
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    geocodingRequests += 1;
    await route.fulfill({ json: { results: [] } });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    throw new Error(`Forecast inesperado: ${route.request().url()}`);
  });

  await page.goto('/');
  const searchbox = page.getByRole('searchbox', { name: 'Pesquisar cidade' });
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('alert')).toContainText('Informe o nome de uma cidade');
  await searchbox.fill('   ');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('alert')).toContainText('Informe o nome de uma cidade');

  expect(geocodingRequests).toBe(0);
  await expect(searchbox).toHaveValue('   ');
});

test('preserva caracteres especiais na busca e exige selecionar a cidade', async ({ page }) => {
  const query = "São João-d'Ávila";
  let receivedQuery: string | null = null;
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    receivedQuery = new URL(route.request().url()).searchParams.get('name');
    await route.fulfill({ json: { results: [{ ...cityResult, name: query }] } });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({ json: forecastResponse });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill(query);
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('heading', { name: 'Cidades encontradas' })).toBeFocused();
  expect(receivedQuery).toBe(query);
  const cityOption = page.getByRole('button', { name: new RegExp(query) });
  await expect(cityOption).toBeVisible();
  await expect(page.getByRole('region', { name: /Clima atual/ })).toHaveCount(0);
  await cityOption.click();
  await expect(page.getByRole('region', { name: `Clima atual em ${query}` })).toBeVisible();
});

test('omite dias sem dados e identifica forecast parcial', async ({ page }) => {
  const partialForecast = {
    ...forecastResponse,
    daily: {
      time: forecastResponse.daily.time,
      weather_code: [null, 1, null, 3, 61],
      temperature_2m_min: [null, 11, null, 13, 14],
      temperature_2m_max: [null, 21, null, 23, 24],
      precipitation_probability_max: [null, 20, null, 30, 80],
    },
  };
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({ json: { results: [cityResult] } });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({ json: partialForecast });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: /São Paulo/ }).click();

  const forecast = page.getByRole('region', { name: 'Previsão de 5 dias' });
  await expect(forecast.getByText('Previsão incompleta')).toBeVisible();
  await expect(forecast.getByRole('article')).toHaveCount(3);
  await expect(forecast.getByText('Amanhã')).toBeVisible();
});

test('permite tentar novamente após uma falha de rede', async ({ page }) => {
  let forecastRequests = 0;
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({ json: { results: [cityResult] } });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequests += 1;
    if (forecastRequests === 1) {
      await route.abort('internetdisconnected');
      return;
    }
    await route.fulfill({ json: forecastResponse });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: /São Paulo/ }).click();
  await expect(page.getByRole('alert')).toContainText('Verifique sua conexão');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();

  await expect(page.getByText('22,4°C', { exact: true })).toBeVisible();
  expect(forecastRequests).toBe(2);
});

test('busca e renderiza o clima na viewport mobile de 390x844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockWeatherApis(page, { results: [cityResult] });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: /São Paulo/ }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo', exact: true })).toBeVisible();
  await expect(page.getByText('22.4°C', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
  await page.getByRole('button', { name: 'Fahrenheit' }).click();
  await expect(page.getByText('72.3°F', { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('mantém o fluxo utilizável na viewport desktop de 1280x800', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockWeatherApis(page, { results: [cityResult] });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: /São Paulo/ }).click();
  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  await expect(page.getByText('72.3°F', { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
