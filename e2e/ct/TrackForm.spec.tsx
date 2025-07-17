import { test, expect } from '@playwright/experimental-ct-react';
import TrackForm from '@/components/TrackForm';

test.describe('TrackForm', () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  test('Should render TrackForm', async ({ page, mount }) => {
    await page.route('**/api/**/genres', async (route) => {
      const genres = ['Genre 1', 'Genre 2'];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(genres),
      });
    });

    await page.route('**/app.genres.v1.GenreService/GetGenres', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          genres: ['Genre 1', 'Genre 2'],
        }),
      });
    });

    const component = await mount(<TrackForm onSubmit={() => {}} btnText={'Test'} />);

    const titleInput = component.getByTestId('input-title');
    const artistInput = component.getByTestId('input-artist');
    const albumInput = component.getByTestId('input-album');
    const coverImageInput = component.getByTestId('input-cover-image');
    const submitButton = component.getByTestId('submit-button');

    await titleInput.fill('Test');
    await artistInput.fill('Test');
    await albumInput.fill('Test');
    await coverImageInput.fill('https://example.com/cover.jpg');

    await component.getByRole('combobox').click();

    await page.getByRole('option', { name: 'Genre 1' }).click();

    expect(component.getByText('Genre 1')).toBeTruthy();

    await expect(submitButton).toBeEnabled();
  });
});
